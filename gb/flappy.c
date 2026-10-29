/* FLAPPY BROS - a 32KB Game Boy ROM. Build with build.sh (SDCC, no GBDK). */
#include "tiles.h"

typedef unsigned char u8;
typedef unsigned int u16;
typedef signed int s16;

#define REG(a) (*(volatile u8 *)(a))
#define P1 REG(0xFF00)
#define NR10 REG(0xFF10)
#define NR11 REG(0xFF11)
#define NR12 REG(0xFF12)
#define NR13 REG(0xFF13)
#define NR14 REG(0xFF14)
#define NR21 REG(0xFF16)
#define NR22 REG(0xFF17)
#define NR23 REG(0xFF18)
#define NR24 REG(0xFF19)
#define NR50 REG(0xFF24)
#define NR51 REG(0xFF25)
#define NR52 REG(0xFF26)
#define LCDC REG(0xFF40)
#define SCX REG(0xFF43)
#define LY REG(0xFF44)
#define BGP REG(0xFF47)
#define OBP0 REG(0xFF48)
#define WY REG(0xFF4A)
#define WX REG(0xFF4B)
#define BG ((volatile u8 *)0x9800)
#define WIN ((volatile u8 *)0x9C00)
#define VRAM ((volatile u8 *)0x8000)
#define OAM ((volatile u8 *)0xFE00)
#define SRAM ((volatile u8 *)0xA000)

#define BX 40
#define GROUND 128
#define LCD_PLAY 0xF3
#define LCD_MENU 0xD3

enum { ST_TITLE, ST_CARD, ST_PLAY, ST_DYING, ST_CLEAR, ST_OVER };

static u8 state, lives, coins, c10, level, started, total, gh, nextp, timer, frame;
static u8 gaps[16], got[16];
static u8 keys, prev, hud_dirty;
static u16 score, hi, sx16, filled, seed, flagcol;
static s16 y8, vy;
static const u16 *jp;
static u8 jdur, jtimer;

static const u16 J_CLEAR[] = {0x706, 0x739, 0x759, 0x783, 0x759, 0x783, 0x79D, 0x7AD, 0};
static const u16 J_DIE[] = {0x6B2, 0x673, 0x60C, 0x564, 0};
static const u16 J_UP[] = {0x739, 0x759, 0x79D, 0x783, 0x7AD, 0};

/* ---------- helpers ---------- */
static void vbl(void) { while (LY != 144); }

static u8 rnd(void) {
	seed = (seed << 7) ^ (seed >> 9) ^ (seed + 0x3D);
	return (u8)(seed >> 3);
}

static u8 ch(char c) {
	if (c >= '0' && c <= '9') return T_0 + (c - '0');
	if (c >= 'A' && c <= 'Z') return T_A + (c - 'A');
	if (c == '-') return T_DASH;
	if (c == 'x') return T_X;
	if (c == '!') return T_BANG;
	return 0;
}

static void text(u8 col, u8 row, const char *s) {
	volatile u8 *d = BG + ((u16)row << 5) + col;
	while (*s) *d++ = ch(*s++);
}

static void num(volatile u8 *d, u16 v, u8 digits) {
	static const u16 p[5] = {10000, 1000, 100, 10, 1};
	u8 i, n;
	for (i = 5 - digits; i < 5; i++) {
		n = 0;
		while (v >= p[i]) { v -= p[i]; n++; }
		*d++ = T_0 + n;
	}
}

static void clear_map(void) {
	u16 i;
	for (i = 0; i < 1024; i++) BG[i] = 0;
	for (i = 0; i < 32; i++) { BG[(16 << 5) + i] = T_GROUND; BG[(17 << 5) + i] = T_GROUND; }
}

static void hide_sprites(void) { u8 i; for (i = 0; i < 40; i++) OAM[i << 2] = 0; }

static void lcd_off(void) { if (LCDC & 0x80) vbl(); LCDC = 0; }

/* ---------- sound ---------- */
static void jingle(const u16 *p, u8 dur) { jp = p; jdur = dur; jtimer = 1; }

static void sfx_flap(void) {
	if (jp) return;
	NR10 = 0x14; NR11 = 0x80; NR12 = 0x82; NR13 = 0x00; NR14 = 0x86;
}
static void sfx_coin(void) { NR21 = 0x80; NR22 = 0xB2; NR23 = 0x9D; NR24 = 0x87; }
static void sfx_pipe(void) { NR21 = 0x40; NR22 = 0x61; NR23 = 0x00; NR24 = 0x86; }

static void sound_tick(void) {
	u16 f;
	if (!jp) return;
	if (--jtimer) return;
	f = *jp++;
	if (!f) { jp = 0; return; }
	NR10 = 0; NR11 = 0x80; NR12 = 0xA3; NR13 = (u8)f; NR14 = 0x80 | (u8)(f >> 8);
	jtimer = jdur;
}

/* ---------- level ---------- */
static u8 colbuf[16], pend, hudbuf[20], hudpend;

static void col_tiles(u16 c, u8 *out) {
	u8 r, t, n, part, g;
	u16 k;
	for (r = 0; r < 16; r++) {
		t = 0;
		if (c >= 20) {
			k = c - 20; n = (u8)(k >> 3); part = (u8)k & 7;
			if (k < ((u16)total << 3) && part < 2) {
				g = gaps[n];
				if (r < g) t = (r == g - 1) ? T_PIPE_CAPL + part : T_PIPE_BODYL + part;
				else if (r >= g + gh) t = (r == g + gh) ? T_PIPE_CAPL + part : T_PIPE_BODYL + part;
			}
		}
		if (c == flagcol) t = (r == 4) ? T_FLAGTOP : (r > 4) ? T_POLE : 0;
		if (!t && r == 2 && ((u8)c & 15) == 4) t = T_CLOUDL;
		if (!t && r == 2 && ((u8)c & 15) == 5) t = T_CLOUDR;
		if (!t && r == 6 && ((u8)c & 31) == 17) t = T_CLOUDL;
		if (!t && r == 6 && ((u8)c & 31) == 18) t = T_CLOUDR;
		out[r] = t;
	}
}

/* LCD must be off */
static void fill_col(u16 c) {
	u8 r, b[16], m = (u8)c & 31;
	col_tiles(c, b);
	for (r = 0; r < 16; r++) BG[((u16)r << 5) + m] = b[r];
}

static void set_theme(void) {
	switch (level & 3) {
	case 0: BGP = 0xE4; OBP0 = 0xE4; break;
	case 1: BGP = 0x1B; OBP0 = 0x1B; break;
	case 2: BGP = 0xE1; OBP0 = 0xE4; break;
	default: BGP = 0xC6; OBP0 = 0xE4; break;
	}
}

static void hud(void) {
	volatile u8 *w = hudbuf;
	u8 i;
	for (i = 0; i < 20; i++) w[i] = 0;
	w[0] = ch('S'); num(w + 1, score, 5);
	w[7] = ch('W'); w[8] = T_0 + (level >> 2) + 1; w[9] = T_DASH; w[10] = T_0 + (level & 3) + 1;
	w[12] = ch('C'); num(w + 13, coins, 2);
	w[16] = ch('L'); w[17] = T_0 + lives;
	hud_dirty = 0; hudpend = 1;
}

static void hud_flush(void) {
	u8 i;
	for (i = 0; i < 20; i++) WIN[i] = hudbuf[i];
	hudpend = 0;
}

static void start_level(void) {
	u8 i, d;
	s16 g = 6;
	seed = ((u16)level * 53) + 7;
	gh = level < 3 ? 6 : level < 6 ? 5 : 4;
	total = level < 7 ? 5 + level : 12;
	for (i = 0; i < total; i++) {
		d = rnd() & 7;
		g += (s16)d - 3;
		if (g < 2) g = 2;
		if (g > 15 - gh) g = 15 - gh;
		gaps[i] = (u8)g; got[i] = 0;
	}
	flagcol = 20 + ((u16)total << 3) + 4;
	lcd_off();
	clear_map();
	for (filled = 0; filled < 32; filled++) fill_col(filled);
	filled = 31;
	hide_sprites();
	set_theme();
	y8 = 64 << 8; vy = 0; sx16 = 0; nextp = 0; started = 0; SCX = 0;
	WY = 136; WX = 7;
	hud(); hud_flush(); pend = 0;
	LCDC = LCD_PLAY;
	state = ST_PLAY;
}

static void enter_card(void) {
	lcd_off();
	clear_map();
	hide_sprites();
	set_theme();
	SCX = 0;
	text(5, 5, "WORLD");
	BG[(5 << 5) + 11] = T_0 + (level >> 2) + 1;
	BG[(5 << 5) + 12] = T_DASH;
	BG[(5 << 5) + 13] = T_0 + (level & 3) + 1;
	text(8, 9, "x");
	BG[(9 << 5) + 10] = T_0 + lives;
	/* little bird next to the lives count */
	OAM[0] = 16 + 72 - 4; OAM[1] = 8 + 56; OAM[2] = T_BIRD0; OAM[3] = 0;
	switch (level & 3) {
	case 0: text(7, 12, "SKY"); break;
	case 1: text(7, 12, "CAVE"); break;
	case 2: text(7, 12, "NIGHT"); break;
	default: text(7, 12, "CASTLE"); break;
	}
	LCDC = LCD_MENU;
	state = ST_CARD; timer = 0;
}

static void enter_title(void) {
	lcd_off();
	clear_map();
	hide_sprites();
	level = 0; set_theme();
	SCX = 0;
	text(7, 3, "FLAPPY");
	text(8, 5, "BROS");
	text(4, 11, "PRESS START");
	text(4, 13, "BEST");
	num(BG + (13 << 5) + 9, hi, 5);
	OAM[0] = 16 + 76; OAM[1] = 8 + 76; OAM[2] = T_BIRD0; OAM[3] = 0;
	LCDC = LCD_MENU;
	state = ST_TITLE; timer = 0;
}

static void enter_over(void) {
	lcd_off();
	clear_map();
	hide_sprites();
	level = 0; set_theme();
	SCX = 0;
	if (score > hi) {
		hi = score;
		SRAM[0] = 0x5A; SRAM[1] = (u8)hi; SRAM[2] = (u8)(hi >> 8);
	}
	text(5, 4, "GAME OVER");
	text(4, 8, "SCORE");
	num(BG + (8 << 5) + 10, score, 5);
	text(4, 10, "BEST");
	num(BG + (10 << 5) + 10, hi, 5);
	LCDC = LCD_MENU;
	state = ST_OVER; timer = 0;
}

static void die(void) {
	state = ST_DYING; timer = 0; vy = -500;
	lives--; hud_dirty = 1;
	jingle(J_DIE, 9);
}

/* ---------- per-frame update ---------- */
static void update_play(void) {
	u8 n, sp, i;
	s16 py, wx, top, bot, cx, cy, dx, dy;
	u16 px;

	if (!started) {
		y8 = (64 << 8) + ((frame & 32) ? 256 : 0);
		if (keys & 1) { started = 1; vy = -600; sfx_flap(); }
		return;
	}
	if (keys & 1) { vy = -600; sfx_flap(); }
	vy += 36; if (vy > 900) vy = 900;
	y8 += vy;
	if (y8 < (4 << 8)) { y8 = 4 << 8; vy = 0; }
	sp = level < 8 ? 16 + (level << 1) : 32;
	sx16 += sp;
	py = y8 >> 8;
	wx = (s16)(sx16 >> 4) + BX;

	if (py + 4 >= GROUND) { die(); return; }
	for (n = 0; n < total; n++) {
		px = 160 + ((u16)n << 6);
		if (wx + 3 > (s16)px && wx - 3 < (s16)px + 16) {
			top = (s16)gaps[n] << 3; bot = top + ((s16)gh << 3);
			if (py - 3 < top || py + 3 > bot) { die(); return; }
		}
	}
	while (nextp < total && 160 + ((s16)nextp << 6) + 16 < wx - 3) {
		nextp++; score++; hud_dirty = 1; sfx_pipe();
	}
	if (nextp < total && !got[nextp]) {
		cx = 168 + ((s16)nextp << 6);
		cy = ((s16)gaps[nextp] << 3) + ((s16)gh << 2);
		dx = wx - cx; if (dx < 0) dx = -dx;
		dy = py - cy; if (dy < 0) dy = -dy;
		if (dx < 8 && dy < 9) {
			got[nextp] = 1; coins++; score += 5; hud_dirty = 1;
			if (++c10 == 10) { c10 = 0; if (lives < 9) lives++; jingle(J_UP, 4); }
			else sfx_coin();
		}
	}
	if (wx >= (s16)(flagcol << 3)) {
		state = ST_CLEAR; timer = 0;
		score += 10 + level; jingle(J_CLEAR, 6);
		lcd_off(); /* rewrite HUD row as banner */
		{
			volatile u8 *w = WIN; u8 i2;
			const char *s = "COURSE CLEAR!";
			for (i2 = 0; i2 < 20; i2++) w[i2] = 0;
			for (i2 = 0; s[i2]; i2++) w[i2 + 3] = ch(s[i2]);
		}
		LCDC = LCD_PLAY;
	}
	(void)i;
}

static void update(void) {
	frame++;
	if (hud_dirty && state == ST_PLAY) hud();
	if (!pend && filled < (sx16 >> 7) + 31 && state >= ST_PLAY && state <= ST_CLEAR) {
		col_tiles(filled + 1, colbuf); pend = 1;
	}
	switch (state) {
	case ST_TITLE:
		timer++;
		OAM[0] = 16 + 76 + ((frame & 32) ? 2 : 0);
		OAM[2] = (frame & 16) ? T_BIRD1 : T_BIRD0;
		if (!(frame & 31)) {
			u8 i;
			for (i = 0; i < 11; i++) BG[(11 << 5) + 4 + i] = (frame & 32) ? 0 : ch("PRESS START"[i]);
		}
		if ((keys & 3)) { lives = 3; score = 0; coins = 0; c10 = 0; level = 0; hud_dirty = 1; enter_card(); }
		break;
	case ST_CARD:
		timer++;
		if (timer > 100 || (timer > 20 && (keys & 3))) start_level();
		break;
	case ST_PLAY:
		update_play();
		break;
	case ST_DYING:
		timer++;
		vy += 36; if (vy > 900) vy = 900;
		y8 += vy;
		if (timer > 90) { if (lives == 0) enter_over(); else enter_card(); }
		break;
	case ST_CLEAR:
		timer++;
		sx16 += 24;
		y8 += ((64 << 8) - y8) >> 4;
		if (timer > 170) { level++; if (lives < 9 && (level & 3) == 0) lives++; enter_card(); }
		break;
	default:
		timer++;
		if (timer > 40 && (keys & 2)) enter_title();
		break;
	}
}

/* ---------- per-frame render (VBlank) ---------- */
static void render(void) {
	if (state == ST_PLAY || state == ST_DYING || state == ST_CLEAR) {
		u8 i, wasplay = 1;
		s16 py = y8 >> 8, sxp = (s16)(sx16 >> 4), n, x;
		SCX = (u8)sxp;
		OAM[0] = (u8)(py - 4 + 16);
		OAM[1] = BX - 4 + 8;
		OAM[2] = (state == ST_PLAY && vy < 0) || (frame & 8) ? T_BIRD1 : T_BIRD0;
		OAM[3] = state == ST_DYING ? 0x40 : 0;
		for (i = 0; i < 3; i++) {
			n = nextp + i; OAM[(i + 1) << 2] = 0;
			if (n >= total || got[n]) continue;
			x = 164 + (n << 6) - sxp;
			if (x < -8 || x > 167) continue;
			OAM[((i + 1) << 2)] = (u8)(((s16)gaps[n] << 3) + ((s16)gh << 2) - 4 + 16);
			OAM[((i + 1) << 2) + 1] = (u8)(x + 8);
			OAM[((i + 1) << 2) + 2] = (frame & 8) ? T_COIN1 : T_COIN0;
			OAM[((i + 1) << 2) + 3] = 0;
		}
		if (state != ST_CLEAR && hudpend) hud_flush();
		if (pend) {
			u8 m = (u8)(filled + 1) & 31;
			for (i = 0; i < 16; i++) BG[((u16)i << 5) + m] = colbuf[i];
			filled++; pend = 0;
		}
		(void)wasplay;
	}
}

static u8 read_keys(void) {
	u8 b, d, k = 0;
	P1 = 0x10; b = ~P1; b = ~P1;
	P1 = 0x20; d = ~P1; d = ~P1;
	P1 = 0x30;
	if ((b & 3) || (d & 4)) k |= 1;
	if (b & 8) k |= 2;
	return k;
}

void main(void) {
	u16 i;
	NR52 = 0x80; NR50 = 0x77; NR51 = 0xFF;
	lcd_off();
	for (i = 0; i < sizeof(tiledata); i++) VRAM[i] = tiledata[i];
	*(volatile u8 *)0x0000 = 0x0A; /* enable cart RAM (hi-score) */
	if (SRAM[0] == 0x5A) hi = SRAM[1] | ((u16)SRAM[2] << 8);
	seed = 1;
	enter_title();
	for (;;) {
		u8 k;
		vbl();
		render();
		k = read_keys();
		keys = k & ~prev; prev = k;
		sound_tick();
		update();
		while (LY == 144);
	}
}

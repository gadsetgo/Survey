	.module crt0
	.globl _main

	.area _HEADER (ABS)
	.org 0x40
	reti
	.org 0x48
	reti
	.org 0x50
	reti
	.org 0x58
	reti
	.org 0x60
	reti
	.org 0x100
	nop
	jp start

	.area _CODE
start:
	di
	ld sp,#0xE000
	ld hl,#0xC000
	ld bc,#0x2000
1$:
	xor a
	ld (hl),a
	inc hl
	dec bc
	ld a,b
	or c
	jr nz,1$
	call _main
2$:
	jr 2$

	.area _HOME
	.area _GSINIT
	.area _GSFINAL
	.area _DATA
	.area _INITIALIZED
	.area _INITIALIZER

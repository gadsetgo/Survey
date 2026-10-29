#!/usr/bin/env bash
# Builds flappy-bros.gb (needs: sdcc, python3).  apt-get install sdcc
set -e
cd "$(dirname "$0")"
python3 gen_tiles.py
sdasgb -plosgff crt0.s
sdcc -msm83 --no-std-crt0 --code-loc 0x150 --data-loc 0xC000 --opt-code-size -o flappy.ihx crt0.rel flappy.c
makebin -s 32768 flappy.ihx flappy-bros.gb
python3 - <<'EOF'
logo = bytes.fromhex("CEED6666CC0D000B03730083000C000D0008111F8889000EDCCC6EE6DDDDD999BBBB67636E0EECCCDDDC999FBBB9333E")
r = bytearray(open('flappy-bros.gb', 'rb').read())
r[0x104:0x134] = logo
t = b'FLAPPYBROS'
r[0x134:0x134 + len(t)] = t
r[0x143] = 0x00          # DMG
r[0x146] = 0x00
r[0x147] = 0x03          # MBC1+RAM+BATTERY (hi-score save)
r[0x148] = 0x00          # 32KB
r[0x149] = 0x02          # 8KB RAM
r[0x14A] = 0x01
r[0x14B] = 0x00
c = 0
for i in range(0x134, 0x14D):
    c = (c - r[i] - 1) & 0xFF
r[0x14D] = c
g = (sum(r) - r[0x14E] - r[0x14F]) & 0xFFFF
r[0x14E], r[0x14F] = g >> 8, g & 0xFF
open('flappy-bros.gb', 'wb').write(r)
print('flappy-bros.gb', len(r), 'bytes')
EOF
rm -f *.rel *.ihx *.lst *.sym *.map *.asm *.lk *.noi 2>/dev/null || true

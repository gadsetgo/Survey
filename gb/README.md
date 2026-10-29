# Flappy Bros (Game Boy ROM)

A 32 KB DMG Game Boy cartridge: flap through pipes, grab coins, clear the flag.

- Courses like Mario: W1-1 sky, W1-2 cave, W1-3 dusk, W1-4 castle, then faster and tighter worlds.
- Each course is a fixed layout (same every try), 3 lives, coins give 1UP every 10.
- Hi-score is saved on the cartridge (MBC1+RAM+battery).

**Controls:** A / B / Up = flap, Start = start.

**Play:** open `flappy-bros.gb` in any Game Boy emulator (mGBA, SameBoy, BGB, Emulicious,
or an online one such as binjgb / EmulatorJS) or flash it to a flash cart.

**Build** (needs `sdcc` and `python3`; no GBDK): `./build.sh`

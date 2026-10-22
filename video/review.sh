#!/bin/bash
# One still per shot -> contact sheet. Usage: ./review.sh Mids1 out/sheet.jpg
set -e
B=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
rm -rf out/mids && mkdir -p out/mids
npx remotion render src/index.ts "$1" out/mids --sequence --image-format=jpeg --scale=0.25 --browser-executable=$B --log=error
ffmpeg -v error -y -pattern_type glob -i 'out/mids/*.jpeg' -vf "tile=4x7:padding=4" -frames:v 1 -q:v 3 "$2"

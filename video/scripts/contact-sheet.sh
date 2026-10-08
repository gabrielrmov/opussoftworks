#!/usr/bin/env bash
# Renderiza os stills de revisão do OpusLaunch e monta um contact sheet.
# Uso: bash scripts/contact-sheet.sh [frames...]
set -euo pipefail
cd "$(dirname "$0")/.."
FRAMES=("${@:-0 15 90 150 200 250 320 420 580 720 850}")
read -r -a FRAMES <<< "${FRAMES[*]}"
mkdir -p out/stills
for f in "${FRAMES[@]}"; do
  npx remotion still OpusLaunch "out/stills/launch-$f.png" --frame="$f" --log=error
done
# Cada still reduzido a 360x640, com o número do frame; grade de 6 colunas.
inputs=()
filters=""
i=0
for f in "${FRAMES[@]}"; do
  inputs+=(-i "out/stills/launch-$f.png")
  filters+="[$i:v]scale=360:640,drawbox=x=0:y=0:w=360:h=44:color=black@0.75:t=fill,drawtext=text='frame $f':x=12:y=10:fontsize=26:fontcolor=white[v$i];"
  i=$((i + 1))
done
cols=6
rows=$(( (i + cols - 1) / cols ))
stack=""
for ((k = 0; k < i; k++)); do stack+="[v$k]"; done
# completa a grade com quadros vazios
for ((k = i; k < rows * cols; k++)); do
  filters+="color=c=white:s=360x640:d=1[e$k];"
  stack+="[e$k]"
done
layout=""
for ((k = 0; k < rows * cols; k++)); do
  x=$(( (k % cols) * 360 )); y=$(( (k / cols) * 640 ))
  layout+="${x}_${y}|"
done
ffmpeg -loglevel error -y "${inputs[@]}" -filter_complex "${filters}${stack}xstack=inputs=$((rows * cols)):layout=${layout%|}[out]" -map "[out]" -frames:v 1 out/contact-sheet.png
echo "out/contact-sheet.png"

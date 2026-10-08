import React from "react";
import { useCurrentFrame } from "remotion";
import { SCENES } from "../../timeline";
import { enter, rise } from "../anim";
import { Label, Line, METRICS } from "../text";
import { COLOR, MARGIN, SANS, SERIF, TEXT_W, W } from "../tokens";

/** Copy do site (components/landing/process.tsx). */
export const STEPS = [
  { name: ["Diagnóstico"], sub: ["Antes de propor,", "a gente entende."] },
  { name: ["Estratégia"], sub: ["Prioridade antes", "de execução."] },
  { name: ["Implementação"], sub: ["Estratégia que", "sai do papel."] },
  { name: ["Otimização", "contínua"], sub: ["O trabalho não termina", "no lançamento."] },
];
/** Fundo de cada corte: off-white / preto / off-white / coral. */
export const METHOD_BG = [COLOR.paper, COLOR.ink, COLOR.paper, COLOR.coral];
const FG = [COLOR.ink, COLOR.white, COLOR.ink, COLOR.white];
const ACCENT = [COLOR.coral, COLOR.coral, COLOR.coral, COLOR.ink];

/**
 * Tamanho do nome: 148 px; 116 px com 14+ caracteres (e quebra em duas
 * linhas). Se mesmo assim não couber em TEXT_W, reduz até caber.
 */
const nameSize = (name: string[]) => {
  const full = name.join(" ");
  const base = full.length >= 14 ? 116 : 148;
  const key = full === "Otimização contínua" ? "method.3a" : `method.${STEPS.findIndex((s) => s.name.join(" ") === full)}`;
  const m = METRICS[key];
  const widthAtBase = (m.width * base) / m.size;
  return widthAtBase > TEXT_W ? Math.floor((base * TEXT_W) / widthAtBase) : base;
};

const NUMERAL = METRICS["numeral"]; // "04" a 680 px
const NUMERAL_TOP = 960 - NUMERAL.baseline; // base do numeral em y 960

export const Method: React.FC<{ index: number }> = ({ index }) => {
  const f = useCurrentFrame();
  const scene = SCENES[`method${index}` as keyof typeof SCENES];
  const at = scene.from;
  const step = STEPS[index];
  const fg = FG[index];
  const size = nameSize(step.name);
  const nIn = enter(f, at, 8);
  const subIn = enter(f, at + 6, 10);
  const nameTop = 1010;
  const subTop = nameTop + size * step.name.length + 44;

  return (
    <>
      <Label color={ACCENT[index]} style={rise(f, at, 16)}>
        MÉTODO · 0{index + 1} / 04
      </Label>
      {/* Numeral gigante vazado, entrando da direita */}
      <Line
        top={NUMERAL_TOP}
        left={W - MARGIN - NUMERAL.width}
        font={SANS}
        size={680}
        weight={800}
        tracking={-0.06}
        color="transparent"
        style={{ WebkitTextStroke: `4px ${fg}`, transform: `translateX(${(1 - nIn) * 700}px)` }}
      >
        0{index + 1}
      </Line>
      {step.name.map((part, i) => (
        <Line key={part} top={nameTop + i * size} font={SANS} size={size} weight={800} tracking={-0.04} color={fg} style={rise(f, at + 2 + i * 3)}>
          {part}
        </Line>
      ))}
      {/* Subtítulo do site, revelado por máscara */}
      {step.sub.map((part, i) => (
        <Line
          key={part}
          top={subTop + i * 86}
          font={SERIF}
          size={76}
          italic
          color={fg}
          style={{ clipPath: `inset(-20% ${(1 - enter(f, at + 6 + i * 3, 10)) * 100}% -20% 0)`, opacity: subIn > 0 ? 1 : 0 }}
        >
          {part}
        </Line>
      ))}
    </>
  );
};

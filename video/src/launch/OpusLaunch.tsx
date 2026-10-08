import React from "react";
import { AbsoluteFill, getStaticFiles, Html5Audio, staticFile, useCurrentFrame } from "remotion";
import { FPS, MUSIC_FIRST_BEAT_MS, SCENES, SceneId } from "../timeline";
import { FilmFinish, Flash, Handheld } from "./fx";
import { Entrega } from "./scenes/Entrega";
import { Hook } from "./scenes/Hook";
import { Lead } from "./scenes/Lead";
import { Method, METHOD_BG } from "./scenes/Method";
import { Signature } from "./scenes/Signature";
import { Site } from "./scenes/Site";
import { Sistema } from "./scenes/Sistema";
import { Tool } from "./scenes/Tool";
import { COLOR } from "./tokens";

export { DURATION as LAUNCH_DURATION, FPS as LAUNCH_FPS } from "../timeline";

/** Slot da trilha: se public/music.mp3 existir, toca com o primeiro beat no frame 0. */
export const HAS_MUSIC = getStaticFiles().some((f) => f.name === "music.mp3");

const BG: Record<SceneId, string> = {
  hook: COLOR.paper,
  entrega: COLOR.coral,
  site: COLOR.paper,
  lead: COLOR.navy,
  method0: METHOD_BG[0],
  method1: METHOD_BG[1],
  method2: METHOD_BG[2],
  method3: METHOD_BG[3],
  tool: COLOR.paper,
  sistema: COLOR.coral,
  signature: COLOR.paper,
};

const CONTENT: Record<SceneId, React.ReactNode> = {
  hook: <Hook />,
  entrega: <Entrega />,
  site: <Site />,
  lead: <Lead />,
  method0: <Method index={0} />,
  method1: <Method index={1} />,
  method2: <Method index={2} />,
  method3: <Method index={3} />,
  tool: <Tool />,
  sistema: <Sistema />,
  signature: <Signature />,
};

/**
 * Cortes secos: em cada frame só a cena ativa é renderizada, com o fundo
 * inteiro trocado. As cenas leem o frame absoluto, então os tempos de
 * timeline.ts valem direto.
 */
export const OpusLaunch: React.FC = () => {
  const f = useCurrentFrame();
  const id = (Object.keys(SCENES) as SceneId[]).find((k) => f >= SCENES[k].from && f < SCENES[k].to) ?? "signature";
  return (
    <AbsoluteFill style={{ backgroundColor: BG[id] }}>
      <Handheld>{CONTENT[id]}</Handheld>
      <Flash />
      <FilmFinish />
      {HAS_MUSIC && <Html5Audio src={staticFile("music.mp3")} trimBefore={Math.round((MUSIC_FIRST_BEAT_MS / 1000) * FPS)} />}
    </AbsoluteFill>
  );
};

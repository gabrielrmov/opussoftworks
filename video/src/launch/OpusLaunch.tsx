import { AbsoluteFill, Easing, Html5Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { DotPaper } from "../components";
import { lineMask } from "./lineMask";
import { CropMarks } from "./shared";
import { Intro } from "./Intro";
import { Statement } from "./Statement";
import { Pillars } from "./Pillars";
import { Method } from "./Method";
import { Outcome } from "./Outcome";
import { CTA } from "./CTA";

export const LAUNCH_FPS = 30;

// Tempos do roteiro (em segundos). Cada transição de T frames fica centrada
// na virada de cena, então a primeira e a última cena ganham T/2 e as do meio T.
const T = 12;
const BEATS = [
  { id: "intro", Component: Intro, from: 0, to: 3 },
  { id: "statement", Component: Statement, from: 3, to: 7 },
  { id: "pillars", Component: Pillars, from: 7, to: 18 },
  { id: "method", Component: Method, from: 18, to: 24 },
  { id: "outcome", Component: Outcome, from: 24, to: 28 },
  { id: "cta", Component: CTA, from: 28, to: 30 },
];

const SCENES = BEATS.map((b, i) => ({
  ...b,
  duration: (b.to - b.from) * LAUNCH_FPS + (i > 0 ? T / 2 : 0) + (i < BEATS.length - 1 ? T / 2 : 0),
}));

export const LAUNCH_DURATION = 30 * LAUNCH_FPS; // 900

const timing = linearTiming({ durationInFrames: T, easing: Easing.inOut(Easing.cubic) });

export type OpusLaunchProps = {
  /** Toca public/audio/locucao.mp3 por cima e abaixa a trilha (ducking). */
  locucao: boolean;
};

export const OpusLaunch: React.FC<OpusLaunchProps> = ({ locucao }) => {
  const frame = useCurrentFrame();
  const marks = interpolate(frame, [0, 12], [0, 0.25], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <DotPaper />
      <CropMarks opacity={marks} />
      <TransitionSeries>
        {SCENES.flatMap(({ id, Component, duration }, i) => {
          const items = [
            <TransitionSeries.Sequence key={id} durationInFrames={duration}>
              <Component />
            </TransitionSeries.Sequence>,
          ];
          if (i < SCENES.length - 1) {
            items.push(<TransitionSeries.Transition key={`${id}-t`} presentation={lineMask()} timing={timing} />);
          }
          return items;
        })}
      </TransitionSeries>
      <Html5Audio src={staticFile("audio/trilha.mp3")} volume={locucao ? 0.35 : 1} />
      {locucao && <Html5Audio src={staticFile("audio/locucao.mp3")} />}
    </AbsoluteFill>
  );
};

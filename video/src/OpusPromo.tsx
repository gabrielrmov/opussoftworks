import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Background, Wordmark } from "./components";
import { s } from "./theme";
import { Hook } from "./scenes/Hook";
import { Problem } from "./scenes/Problem";
import { Traffic } from "./scenes/Traffic";
import { Management } from "./scenes/Management";
import { Website } from "./scenes/Website";
import { Process } from "./scenes/Process";
import { Outro } from "./scenes/Outro";

// Timeline (60fps). Cada transição sobrepõe as cenas vizinhas por T frames.
const T = 30;
const SCENES = [
  { id: "hook", Component: Hook, duration: s(4) },
  { id: "problem", Component: Problem, duration: s(4) },
  { id: "traffic", Component: Traffic, duration: s(4.5) },
  { id: "management", Component: Management, duration: s(4.5) },
  { id: "website", Component: Website, duration: s(4.5) },
  { id: "process", Component: Process, duration: s(5.5) },
  { id: "outro", Component: Outro, duration: s(6) },
];

export const PROMO_DURATION =
  SCENES.reduce((sum, scene) => sum + scene.duration, 0) - T * (SCENES.length - 1); // 1800 = 30s

const OUTRO_START = PROMO_DURATION - SCENES[SCENES.length - 1].duration;

const timing = linearTiming({ durationInFrames: T, easing: Easing.inOut(Easing.cubic) });
const transitionFor = (nextId: string) =>
  ["management", "website", "traffic"].includes(nextId)
    ? slide({ direction: "from-right" })
    : fade();

export const OpusPromo: React.FC = () => {
  const frame = useCurrentFrame();
  // Assinatura discreta no topo; some quando o outro (com o logo grande) entra.
  const headerOpacity =
    interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(frame, [OUTRO_START - 10, OUTRO_START + 15], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>
        {SCENES.flatMap(({ id, Component, duration }, i) => {
          const items = [
            <TransitionSeries.Sequence key={id} durationInFrames={duration}>
              <Component />
            </TransitionSeries.Sequence>,
          ];
          if (i < SCENES.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`${id}-t`}
                presentation={transitionFor(SCENES[i + 1].id)}
                timing={timing}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
      <div style={{ position: "absolute", top: 120, left: 80, opacity: headerOpacity }}>
        <Wordmark size={40} />
      </div>
    </AbsoluteFill>
  );
};

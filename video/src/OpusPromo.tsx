import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { NavPill } from "./components";
import { s } from "./theme";
import { Hero } from "./scenes/Hero";
import { Fronts } from "./scenes/Fronts";
import { Solutions } from "./scenes/Solutions";
import { Process } from "./scenes/Process";
import { Method } from "./scenes/Method";
import { Closing } from "./scenes/Closing";

// Timeline (60fps) seguindo a ordem do site. Cada transição sobrepõe as
// cenas vizinhas por T frames.
const T = 36;
const SCENES = [
  { id: "hero", Component: Hero, duration: s(4) },
  { id: "fronts", Component: Fronts, duration: s(4.5) },
  { id: "solutions", Component: Solutions, duration: s(8) },
  { id: "process", Component: Process, duration: s(5) },
  { id: "method", Component: Method, duration: s(5.5) },
  { id: "closing", Component: Closing, duration: s(6) },
];

export const PROMO_DURATION =
  SCENES.reduce((sum, scene) => sum + scene.duration, 0) - T * (SCENES.length - 1); // 1800 = 30s

const startOf = (index: number) =>
  SCENES.slice(0, index).reduce((sum, scene) => sum + scene.duration - T, 0);
const METHOD_START = startOf(SCENES.findIndex((sc) => sc.id === "method"));

const timing = linearTiming({ durationInFrames: T, easing: Easing.inOut(Easing.cubic) });

export const OpusPromo: React.FC = () => {
  const frame = useCurrentFrame();
  // A pílula de navegação acompanha as seções claras e sai antes do zoom.
  const navOpacity = interpolate(frame, [METHOD_START + 60, METHOD_START + 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {SCENES.flatMap(({ id, Component, duration }, i) => {
          const items = [
            <TransitionSeries.Sequence key={id} durationInFrames={duration}>
              <Component />
            </TransitionSeries.Sequence>,
          ];
          const next = SCENES[i + 1];
          if (next) {
            items.push(
              <TransitionSeries.Transition
                key={`${id}-t`}
                presentation={next.id === "solutions" ? slide({ direction: "from-bottom" }) : fade()}
                timing={timing}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
      {navOpacity > 0 && (
        <AbsoluteFill style={{ opacity: navOpacity }}>
          <NavPill />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

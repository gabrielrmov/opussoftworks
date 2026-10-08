import {interpolate, spring} from 'remotion';
import {CLAMP, EASE_SINE, SPRING_SUBTLE} from '../lib/anim';
import type {ProblemCardKind} from '../components/ProblemCard';

// Os quatro cards soltos do board 02 (centros lidos do storyboard).
export const PROBLEM_CARDS: {
  cx: number;
  cy: number;
  kind: ProblemCardKind;
  from: 'left' | 'top' | 'right' | 'bottom';
  delay: number;
  rot: number;
  drift: [number, number];
}[] = [
  {cx: 262, cy: 605, kind: 'solid', from: 'left', delay: 6, rot: -3, drift: [-16, -10]},
  {cx: 659, cy: 498, kind: 'lines', from: 'top', delay: 14, rot: 2.5, drift: [14, -14]},
  {cx: 422, cy: 1073, kind: 'solid', from: 'right', delay: 22, rot: 2, drift: [-12, 12]},
  {cx: 819, cy: 1180, kind: 'lines', from: 'bottom', delay: 30, rot: -2.5, drift: [16, 14]},
];

export const PROBLEM_END = 150; // frame local em que a cena 02 entrega os cards à cena 03

const ENTRY = {left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1]} as const;

/** Pose de cada card na cena 02: entrada com spring + deriva lenta e divergente. */
export const problemCardPose = (i: number, frame: number, fps: number) => {
  const c = PROBLEM_CARDS[i];
  const s = spring({frame: frame - c.delay, fps, config: SPRING_SUBTLE});
  const [dx, dy] = ENTRY[c.from];
  const drift = interpolate(frame, [48, PROBLEM_END], [0, 1], {...CLAMP, easing: EASE_SINE});
  return {
    x: c.cx + dx * 340 * (1 - s) + c.drift[0] * drift,
    y: c.cy + dy * 340 * (1 - s) + c.drift[1] * drift,
    rot: c.rot * drift + c.rot * 1.5 * (1 - s),
    opacity: interpolate(s, [0, 0.45], [0, 1], CLAMP),
  };
};

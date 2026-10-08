import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Spring de entrada (0 → 1) que começa em `delay` frames. */
export const useEnter = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

/** Interpolação com clamp e ease-out por padrão. */
export const ramp = (
  frame: number,
  from: number,
  to: number,
  out: [number, number] = [0, 1],
  easing: (t: number) => number = Easing.out(Easing.cubic),
) => interpolate(frame, [from, to], out, { ...clamp, easing });

/** Fade + subida + desfoque — o "blur-in" que o site usa nos títulos. */
export const blurIn = (p: number, distance = 30, blur = 14): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * distance}px)`,
  filter: `blur(${(1 - p) * blur}px)`,
});

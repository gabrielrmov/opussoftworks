import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Spring de entrada (0 → 1) que começa em `delay` frames. */
export const useEnter = (delay = 0, damping = 200, durationInFrames?: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping }, durationInFrames });
};

/** Interpolação com clamp e ease-out por padrão. */
export const ramp = (
  frame: number,
  from: number,
  to: number,
  out: [number, number] = [0, 1],
  easing: (t: number) => number = Easing.out(Easing.cubic),
) => interpolate(frame, [from, to], out, { ...clamp, easing });

/** Fade + subida padrão pra blocos de texto. */
export const rise = (progress: number, distance = 40) => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * distance}px)`,
});

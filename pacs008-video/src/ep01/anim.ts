import { Easing, interpolate } from "remotion";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.5, 0, 0.9, 0.6);
export const POP = Easing.spring({ damping: 10, stiffness: 170 });

/** 0 → 1 between `start` and `start + duration` frames. */
export const prog = (
  frame: number,
  start: number,
  duration: number,
  easing = EASE_OUT,
) =>
  interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing });

/** Springy 0 → 1 (with overshoot) for pop-ins. */
export const pop = (frame: number, start: number, duration = 12) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: POP,
  });

/** Opacity for something visible between two frames, with short fades. */
export const visible = (frame: number, start: number, end: number, fade = 8) =>
  interpolate(
    frame,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0],
    clamp,
  );

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type Pt = { x: number; y: number };

export const qbez = (p0: Pt, p1: Pt, p2: Pt, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
};

/** Soft pulsing glow intensity (0..1), used for the UETR tag. */
export const glow = (frame: number) => 0.55 + 0.45 * Math.sin(frame / 7);

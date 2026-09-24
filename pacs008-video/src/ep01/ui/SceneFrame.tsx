import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../anim";

/** Scene wrapper: quick fade in/out so scenes cut cleanly over the shared background. */
export const SceneFrame: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  fadeIn?: number;
  fadeOut?: number;
}> = ({ children, durationInFrames, fadeIn = 6, fadeOut = 6 }) => {
  const frame = useCurrentFrame();
  const fadeInOpacity = fadeIn
    ? interpolate(frame, [0, fadeIn], [0, 1], clamp)
    : 1;
  const fadeOutOpacity = fadeOut
    ? interpolate(
        frame,
        [durationInFrames - fadeOut, durationInFrames],
        [1, 0],
        clamp,
      )
    : 1;
  const opacity = fadeInOpacity * fadeOutOpacity;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

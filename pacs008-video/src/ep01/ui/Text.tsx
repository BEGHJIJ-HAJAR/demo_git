import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, EASE_OUT } from "../anim";
import { C, sans } from "../theme";
import { StepBadge } from "../art/Icons";

/**
 * On-screen text in the top zone. Appears at `from`, leaves at `to` (scene-local frames).
 */
export const TopText: React.FC<{
  from?: number;
  to?: number;
  top?: number;
  size?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ from = 0, to = Infinity, top = 110, size = 58, children, style }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [from, from + 10], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  const outP = Number.isFinite(to)
    ? interpolate(frame, [to - 8, to], [1, 0], clamp)
    : 1;
  if (frame < from || frame > to) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 70,
        textAlign: "center",
        fontFamily: sans,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: -1,
        color: C.white,
        opacity: inP * outP,
        translate: `0px ${(1 - inP) * 24}px`,
        textShadow: "0 4px 20px rgba(0,0,0,0.35)",
        zIndex: 5,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Numbered step chip, e.g. "② pacs.008: Casa Bank → Paris Bank". */
export const StepChip: React.FC<{
  n: number;
  from?: number;
  to?: number;
  top?: number;
  color?: string;
  align?: "center" | "right";
  size?: number;
  children: React.ReactNode;
}> = ({
  n,
  size = 38,
  from = 0,
  to = Infinity,
  top = 110,
  color = C.blue,
  align = "center",
  children,
}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [from, from + 10], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  const outP = Number.isFinite(to)
    ? interpolate(frame, [to - 8, to], [1, 0], clamp)
    : 1;
  if (frame < from || frame > to) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: align === "right" ? 60 : 0,
        display: "flex",
        justifyContent: align === "right" ? "flex-end" : "center",
        zIndex: 5,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "12px 28px 12px 14px",
          borderRadius: 40,
          backgroundColor: "white",
          color: C.ink,
          fontFamily: sans,
          fontWeight: 800,
          fontSize: size,
          opacity: inP * outP,
          scale: 0.9 + 0.1 * inP,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
        }}
      >
        <StepBadge n={n} color={color} size={size * 1.37} />
        {children}
      </div>
    </div>
  );
};

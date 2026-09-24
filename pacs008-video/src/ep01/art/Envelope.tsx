import React from "react";
import { useCurrentFrame } from "remotion";
import { glow } from "../anim";
import { C, LETTER, mono, sans } from "../theme";
import { ArrowRight, Check } from "./Icons";

const ENV_W = 440;
const ENV_H = 280;

/** The UETR tag: glows softly every time it appears. */
export const UetrTag: React.FC<{ size?: number }> = ({ size = 20 }) => {
  const frame = useCurrentFrame();
  const g = glow(frame);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.4,
        padding: `${size * 0.25}px ${size * 0.6}px`,
        borderRadius: size * 0.5,
        backgroundColor: C.uetr,
        color: "white",
        fontFamily: mono,
        fontWeight: 700,
        fontSize: size,
        boxShadow: `0 0 ${6 + 16 * g}px ${2 + 4 * g}px ${C.uetrGlow}`,
        whiteSpace: "nowrap",
      }}
    >
      <svg width={size * 0.7} height={size * 0.9} viewBox="0 0 14 18">
        <path d="M1 1 H13 V17 L7 12 L1 17 Z" fill="white" />
      </svg>
      {LETTER.uetr}
    </span>
  );
};

/** The letter (never changes): the customer's payment. Native 380×240. */
export const Letter: React.FC<{
  width?: number;
  style?: React.CSSProperties;
}> = ({ width = 380, style }) => (
  <div style={{ width, height: (width * 240) / 380, ...style }}>
    <div
      style={{
        width: 380,
        height: 240,
        scale: width / 380,
        transformOrigin: "0 0",
        backgroundColor: "white",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        padding: "18px 24px",
        boxSizing: "border-box",
        fontFamily: sans,
        color: C.ink,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        backgroundImage:
          "repeating-linear-gradient(180deg, transparent 0 33px, #EEF2F7 33px 35px)",
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>
        {LETTER.line1}
      </div>
      <div
        style={{
          fontSize: 40,
          fontWeight: 800,
          color: C.greenDark,
          letterSpacing: -1,
        }}
      >
        {LETTER.amount}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: C.inkMuted }}>
        {LETTER.invoice}
      </div>
      <div style={{ marginTop: 6 }}>
        <UetrTag size={21} />
      </div>
    </div>
  </div>
);

/**
 * Blue pacs.008 envelope with the letter inside. Drawn at 440×280 and scaled to `width`.
 * `open` (0..1) lifts the flap, `letterOut` (0..1) slides the letter out of the envelope.
 */
export const Envelope: React.FC<{
  width?: number;
  from?: string;
  to?: string;
  open?: number;
  letterOut?: number;
  showLetter?: boolean;
  compact?: boolean;
  stamp?: boolean;
  style?: React.CSSProperties;
}> = ({
  width = 440,
  from,
  to,
  open = 0,
  letterOut = 0,
  showLetter = true,
  compact = false,
  stamp = true,
  style,
}) => {
  const apex = 170 * (1 - 2 * open);
  const flapOpen = apex < 0;
  const flap = (
    <svg
      width={ENV_W}
      height={ENV_H}
      viewBox={`0 0 ${ENV_W} ${ENV_H}`}
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
      <polygon
        points={`4,4 ${ENV_W - 4},4 ${ENV_W / 2},${apex}`}
        fill={flapOpen ? "#9DB9FF" : C.blueLight}
        stroke={C.blueDark}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div
      style={{
        width,
        height: (width * ENV_H) / ENV_W,
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: ENV_W,
          height: ENV_H,
          scale: width / ENV_W,
          transformOrigin: "0 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            backgroundColor: C.blueDark,
            boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
          }}
        />
        {flapOpen ? flap : null}
        {showLetter && (open > 0.3 || letterOut > 0) ? (
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 22,
              translate: `0px ${-letterOut * 250}px`,
            }}
          >
            <Letter width={380} />
          </div>
        ) : null}
        <svg
          width={ENV_W}
          height={ENV_H}
          viewBox={`0 0 ${ENV_W} ${ENV_H}`}
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d={`M0 96 L${ENV_W / 2} 196 L${ENV_W} 96 V${ENV_H - 22} Q${ENV_W} ${ENV_H} ${ENV_W - 22} ${ENV_H} H22 Q0 ${ENV_H} 0 ${ENV_H - 22} Z`}
            fill={C.blue}
          />
          <path
            d={`M6 ${ENV_H - 8} L${ENV_W / 2 - 30} 180 M${ENV_W - 6} ${ENV_H - 8} L${ENV_W / 2 + 30} 180`}
            stroke={C.blueDark}
            strokeWidth={4}
            opacity={0.5}
          />
        </svg>
        {flapOpen ? null : flap}
        {stamp ? (
          <div
            style={{
              position: "absolute",
              ...(flapOpen
                ? { right: 22, top: 150, rotate: "-6deg" }
                : {
                    left: "50%",
                    top: compact ? 14 : 26,
                    translate: "-50% 0",
                    rotate: "-4deg",
                  }),
              padding: compact ? "6px 14px" : "4px 12px",
              border: "3px solid white",
              borderRadius: 8,
              color: "white",
              fontFamily: mono,
              fontWeight: 700,
              fontSize: compact ? 34 : 24,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          >
            pacs.008
          </div>
        ) : null}
        {from && to ? (
          <div
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              bottom: 16,
              height: compact ? 70 : 52,
              borderRadius: 12,
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontFamily: sans,
              fontWeight: 700,
              fontSize: compact ? 38 : 22,
              color: C.ink,
              whiteSpace: "nowrap",
            }}
          >
            {compact ? null : (
              <span style={{ color: C.inkMuted, fontWeight: 600 }}>From:</span>
            )}
            {from}
            <ArrowRight size={compact ? 44 : 30} color={C.blue} />
            {compact ? null : (
              <span style={{ color: C.inkMuted, fontWeight: 600 }}>To:</span>
            )}
            {to}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** Grey dashed pacs.002 receipt (visual only). Drawn at 130×160. */
export const Receipt: React.FC<{
  width?: number;
  bubble?: string;
  style?: React.CSSProperties;
}> = ({ width = 130, bubble, style }) => (
  <div
    style={{
      width,
      height: (width * 160) / 130,
      position: "relative",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 130,
        height: 160,
        scale: width / 130,
        transformOrigin: "0 0",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 10,
          backgroundColor: C.grey,
          border: `4px dashed ${C.greyLine}`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 14,
          gap: 8,
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 22,
            color: "#5E6978",
          }}
        >
          pacs.002
        </div>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: C.greyLine,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={34} />
        </div>
        <div
          style={{
            width: 80,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#C3CAD4",
          }}
        />
        <div
          style={{
            width: 60,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#C3CAD4",
          }}
        />
      </div>
    </div>
    {bubble ? (
      <div
        style={{
          position: "absolute",
          left: width / 2,
          bottom: (width * 160) / 130 + 12,
          translate: "-50% 0",
          padding: "10px 18px",
          borderRadius: 16,
          backgroundColor: "white",
          color: C.ink,
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 24,
          whiteSpace: "nowrap",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        }}
      >
        {bubble}
      </div>
    ) : null}
  </div>
);

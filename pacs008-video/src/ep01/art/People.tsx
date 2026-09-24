import React from "react";
import { C } from "../theme";

const Face: React.FC<{
  cx: number;
  cy: number;
  smile: number;
  ink: string;
}> = ({ cx, cy, smile, ink }) => (
  <g>
    <ellipse cx={cx - 15} cy={cy - 4} rx={4.5} ry={5.5} fill={ink} />
    <ellipse cx={cx + 15} cy={cy - 4} rx={4.5} ry={5.5} fill={ink} />
    <circle cx={cx - 24} cy={cy + 10} r={7} fill="#F27E7E" opacity={0.35} />
    <circle cx={cx + 24} cy={cy + 10} r={7} fill="#F27E7E" opacity={0.35} />
    {smile > 0.5 ? (
      <path
        d={`M${cx - 13} ${cy + 12} Q${cx} ${cy + 30} ${cx + 13} ${cy + 12} Z`}
        fill="#7A2E2E"
        stroke={ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    ) : (
      <path
        d={`M${cx - 11} ${cy + 14} Q${cx} ${cy + 22} ${cx + 11} ${cy + 14}`}
        fill="none"
        stroke={ink}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
    )}
  </g>
);

/** Amina, the baker in Casablanca (Debtor). Warm orange tones, apron. 200×260 grid. */
export const Amina: React.FC<{
  width?: number;
  smile?: number;
  style?: React.CSSProperties;
}> = ({ width = 200, smile = 0, style }) => (
  <svg
    width={width}
    height={(width * 260) / 200}
    viewBox="0 0 200 260"
    style={{ overflow: "visible", ...style }}
  >
    <path
      d="M22 260 C22 196 50 168 100 168 C150 168 178 196 178 260 Z"
      fill={C.warm}
    />
    <path
      d="M62 178 L70 260 H130 L138 178 C126 174 112 172 100 172 C88 172 74 174 62 178 Z"
      fill="#FFF3DF"
    />
    <rect
      x={80}
      y={214}
      width={40}
      height={26}
      rx={6}
      fill="none"
      stroke="#E6CFA8"
      strokeWidth={3}
    />
    <path
      d="M70 178 L86 150 M130 178 L114 150"
      stroke="#FFF3DF"
      strokeWidth={7}
      strokeLinecap="round"
    />
    <rect x={88} y={134} width={24} height={30} rx={8} fill="#B87A50" />
    <circle cx={100} cy={96} r={46} fill="#C68A5E" />
    <path
      d="M54 96 C52 56 76 40 100 40 C126 40 150 56 146 96 C140 74 124 62 100 62 C78 62 60 74 54 96 Z"
      fill="#2B1A12"
    />
    <circle cx={100} cy={34} r={16} fill="#2B1A12" />
    <path
      d="M56 78 C70 60 130 60 144 78"
      fill="none"
      stroke={C.warmDark}
      strokeWidth={8}
      strokeLinecap="round"
    />
    <Face cx={100} cy={100} smile={smile} ink="#2B1A12" />
  </svg>
);

/** Lukas, the oven supplier in Munich (Creditor). Cool blue tones. 200×260 grid. */
export const Lukas: React.FC<{
  width?: number;
  smile?: number;
  style?: React.CSSProperties;
}> = ({ width = 200, smile = 0, style }) => (
  <svg
    width={width}
    height={(width * 260) / 200}
    viewBox="0 0 200 260"
    style={{ overflow: "visible", ...style }}
  >
    <path
      d="M22 260 C22 196 50 168 100 168 C150 168 178 196 178 260 Z"
      fill={C.cool}
    />
    <path d="M78 170 L100 200 L122 170 Z" fill="#E8F0FB" />
    <path d="M100 200 V260" stroke={C.coolDark} strokeWidth={3} />
    <rect
      x={126}
      y={206}
      width={34}
      height={20}
      rx={4}
      fill="white"
      opacity={0.9}
    />
    <rect x={88} y={134} width={24} height={30} rx={8} fill="#E0B18E" />
    <circle cx={100} cy={96} r={46} fill="#F1C7A3" />
    <path
      d="M56 90 C54 54 78 44 102 44 C130 44 150 58 146 90 C138 74 126 68 104 68 C84 68 66 72 56 90 Z"
      fill="#7A5230"
    />
    <path
      d="M66 118 C74 142 126 142 134 118 C128 138 112 146 100 146 C88 146 72 138 66 118 Z"
      fill="#A87B55"
      opacity={0.55}
    />
    <Face cx={100} cy={100} smile={smile} ink="#3A2A1E" />
  </svg>
);

/** Tiny round avatar used in tags and the recap. */
export const Avatar: React.FC<{
  who: "amina" | "lukas";
  size?: number;
  style?: React.CSSProperties;
}> = ({ who, size = 64, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: "hidden",
      backgroundColor: who === "amina" ? C.warmLight : C.coolLight,
      border: `${Math.max(2, size / 20)}px solid white`,
      boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
      flexShrink: 0,
      ...style,
    }}
  >
    {who === "amina" ? (
      <Amina
        width={size * 1.3}
        style={{ marginLeft: -size * 0.15, marginTop: -size * 0.12 }}
      />
    ) : (
      <Lukas
        width={size * 1.3}
        style={{ marginLeft: -size * 0.15, marginTop: -size * 0.12 }}
      />
    )}
  </div>
);

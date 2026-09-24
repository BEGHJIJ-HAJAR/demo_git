import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { sans } from "../scene1/theme";

// LinkedIn profile background: 1584×396. The profile photo covers the
// bottom-left on desktop (and the left side on mobile), so the message sits right.
const W = 1584;
const H = 396;

export const bannerSchema = z.object({
  kicker: z.string(),
  headline: z.string(),
  accent: z.string(),
  sub: z.string(),
});
export type BannerProps = z.infer<typeof bannerSchema>;

// Abstract network (no real places).
const CITIES = [
  { x: 300, y: 140 },
  { x: 430, y: 80 },
  { x: 520, y: 180 },
  { x: 650, y: 110 },
  { x: 470, y: 290 },
  { x: 760, y: 230 },
  { x: 860, y: 320 },
  { x: 880, y: 120 },
  { x: 620, y: 330 },
];
const ROUTES: Array<[number, number, boolean]> = [
  [4, 2, true],
  [2, 3, true],
  [3, 7, true],
  [0, 1, false],
  [1, 3, false],
  [3, 5, false],
  [5, 6, false],
  [0, 4, false],
  [4, 8, false],
  [8, 5, false],
  [1, 2, false],
  [7, 5, false],
];

const arc = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - Math.hypot(b.x - a.x, b.y - a.y) * 0.25;
  return `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`;
};

export const LinkedInBanner: React.FC<BannerProps> = ({
  kicker,
  headline,
  accent,
  sub,
}) => (
  <AbsoluteFill
    style={{
      width: W,
      height: H,
      background:
        "radial-gradient(90% 140% at 38% 40%, #17345A 0%, #0D1B2A 58%, #07101B 100%)",
      overflow: "hidden",
    }}
  >
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#8DB4FF" opacity="0.14" />
        </pattern>
        <radialGradient id="globeFade" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.6" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="globeMask">
          <ellipse cx={620} cy={200} rx={420} ry={260} fill="url(#globeFade)" />
        </mask>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      {/* dotted globe with meridians */}
      <rect width={W} height={H} fill="url(#dots)" mask="url(#globeMask)" />
      {[-2, -1, 0, 1, 2].map((k) => (
        <ellipse
          key={k}
          cx={620}
          cy={200}
          rx={Math.abs(k) * 110 + 20}
          ry={250}
          fill="none"
          stroke="#8DB4FF"
          strokeOpacity={0.07}
          strokeWidth={1.5}
        />
      ))}
      {[80, 140, 200, 260, 320].map((y) => (
        <line
          key={y}
          x1={220}
          x2={1020}
          y1={y}
          y2={y}
          stroke="#8DB4FF"
          strokeOpacity={0.05}
        />
      ))}

      {ROUTES.map(([a, b, gold], i) => (
        <g key={i}>
          {gold ? (
            <path
              d={arc(CITIES[a], CITIES[b])}
              fill="none"
              stroke="#FFC94D"
              strokeWidth={9}
              opacity={0.3}
              filter="url(#glow)"
            />
          ) : null}
          <path
            d={arc(CITIES[a], CITIES[b])}
            fill="none"
            stroke={gold ? "#FFC94D" : "#5C8DFF"}
            strokeWidth={gold ? 3 : 2}
            strokeDasharray={gold ? "none" : "3 9"}
            strokeLinecap="round"
            opacity={gold ? 0.95 : 0.6}
          />
        </g>
      ))}
      {CITIES.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={16} fill="#5C8DFF" opacity={0.14} />
          <circle
            cx={c.x}
            cy={c.y}
            r={6}
            fill={
              i === 2 || i === 3 || i === 4 || i === 7 ? "#FFC94D" : "#8DB4FF"
            }
          />
        </g>
      ))}
    </svg>

    <div
      style={{
        position: "absolute",
        right: 80,
        top: 0,
        bottom: 0,
        width: 560,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontFamily: sans,
        color: "white",
      }}
    >
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: 4,
          color: "#FFC94D",
          marginBottom: 14,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.06,
          letterSpacing: -1.5,
        }}
      >
        {headline} <span style={{ color: "#8DB4FF" }}>{accent}</span>
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#A9BBCE",
          marginTop: 16,
        }}
      >
        {sub}
      </div>
    </div>
  </AbsoluteFill>
);

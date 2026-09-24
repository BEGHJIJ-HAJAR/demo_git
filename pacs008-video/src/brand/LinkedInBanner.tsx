import React from "react";
import { AbsoluteFill } from "remotion";
import { mono, sans } from "../scene1/theme";

// LinkedIn profile background: 1584×396. The profile photo covers the
// bottom-left on desktop (and the left side on mobile), so the message sits right.
const W = 1584;
const H = 396;

const NODES = [
  { x: 470, y: 260, r: 7 },
  { x: 560, y: 150, r: 6 },
  { x: 700, y: 110, r: 8 },
  { x: 800, y: 210, r: 5 },
  { x: 850, y: 80, r: 5 },
  { x: 640, y: 310, r: 5 },
  { x: 380, y: 120, r: 5 },
];
const LINKS: Array<[number, number]> = [
  [0, 2],
  [0, 1],
  [1, 2],
  [2, 3],
  [2, 4],
  [5, 3],
  [6, 1],
  [0, 5],
];
const TAGS = [
  { t: "<pacs.008>", x: 540, y: 215, o: 0.55 },
  { t: "<pacs.009>", x: 760, y: 60, o: 0.35 },
  { t: "<camt.053>", x: 690, y: 350, o: 0.3 },
  { t: "<pacs.002>", x: 330, y: 80, o: 0.3 },
  { t: "<UETR>", x: 730, y: 265, o: 0.45 },
];

const arc = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - Math.hypot(b.x - a.x, b.y - a.y) * 0.22;
  return `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`;
};

export const LinkedInBanner: React.FC = () => (
  <AbsoluteFill
    style={{
      width: W,
      height: H,
      background:
        "radial-gradient(90% 140% at 40% 40%, #16304D 0%, #0D1B2A 60%, #08121E 100%)",
      overflow: "hidden",
    }}
  >
    {/* dotted world texture */}
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.3" fill="#8DB4FF" opacity="0.13" />
        </pattern>
        <linearGradient id="fade" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="m">
          <rect width={W} height={H} fill="url(#fade)" />
        </mask>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#dots)" mask="url(#m)" />

      {LINKS.map(([a, b], i) => (
        <path
          key={i}
          d={arc(NODES[a], NODES[b])}
          fill="none"
          stroke={i === 0 ? "#FFC94D" : "#5C8DFF"}
          strokeWidth={i === 0 ? 3 : 2}
          strokeDasharray={i === 0 ? "none" : "3 9"}
          strokeLinecap="round"
          opacity={i === 0 ? 0.9 : 0.55}
        />
      ))}
      {/* highlighted route glow */}
      <path
        d={arc(NODES[0], NODES[2])}
        fill="none"
        stroke="#FFC94D"
        strokeWidth={8}
        opacity={0.35}
        filter="url(#glow)"
      />
      {NODES.map((n, i) => (
        <g key={i}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r * 2.6}
            fill="#5C8DFF"
            opacity={0.15}
          />
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={i === 0 || i === 2 ? "#FFC94D" : "#8DB4FF"}
          />
        </g>
      ))}
      {/* a message in flight on the gold route */}
      <g transform="translate(572 132) rotate(-18)">
        <rect x={-22} y={-14} width={44} height={28} rx={5} fill="#2F6BFF" />
        <path
          d="M-20 -12 L0 3 L20 -12"
          fill="none"
          stroke="white"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </g>
      {TAGS.map((t) => (
        <text
          key={t.t}
          x={t.x}
          y={t.y}
          fontFamily={mono}
          fontWeight={700}
          fontSize={17}
          fill="#8DB4FF"
          opacity={t.o}
        >
          {t.t}
        </text>
      ))}
    </svg>

    {/* message (right side, clear of the profile photo) */}
    <div
      style={{
        position: "absolute",
        right: 90,
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
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 4,
          color: "#FFC94D",
          marginBottom: 14,
        }}
      >
        PAYMENTS · ISO 20022 · CBPR+
      </div>
      <div
        style={{
          fontSize: 50,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -1.5,
        }}
      >
        Making cross-border
        <br />
        payments <span style={{ color: "#8DB4FF" }}>simple.</span>
      </div>
      <div
        style={{
          fontSize: 21,
          fontWeight: 600,
          color: "#A9BBCE",
          marginTop: 16,
        }}
      >
        One message at a time.
      </div>
    </div>
  </AbsoluteFill>
);

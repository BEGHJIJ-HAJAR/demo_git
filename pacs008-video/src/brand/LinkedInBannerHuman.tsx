import React from "react";
import { AbsoluteFill } from "remotion";
import { sans } from "../scene1/theme";

// LinkedIn profile background, 1584×396. Personal, illustrated:
// - Casablanca at sunset over the Atlantic (minaret, twin towers, corniche)
// - the sky moves from free brush strokes (creative) to a precise grid (analytical)
// - one building is a stack of books (reading), a runner on the corniche (sport)
// - short arcs inside the city and long arcs over the ocean (domestic and international payments)
// The profile photo covers the bottom-left, so nothing important sits there.
const W = 1584;
const H = 396;
const HORIZON = 300;
const INK = "#0F2236";

const Brush: React.FC<{ d: string; w: number; o: number; c?: string }> = ({
  d,
  w,
  o,
  c = "#FFE3CF",
}) => (
  <path
    d={d}
    fill="none"
    stroke={c}
    strokeWidth={w}
    strokeLinecap="round"
    opacity={o}
  />
);

const arc = (x1: number, y1: number, x2: number, y2: number, lift: number) =>
  `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - lift} ${x2} ${y2}`;

const BOOKS = [
  { w: 64, h: 15, c: "#C45A3B" },
  { w: 58, h: 12, c: "#2F5F8A" },
  { w: 66, h: 16, c: "#D9A441" },
  { w: 54, h: 11, c: "#5E7C4F" },
  { w: 60, h: 14, c: "#8A4F7D" },
  { w: 52, h: 12, c: "#2F5F8A" },
  { w: 58, h: 15, c: "#C45A3B" },
];

export const LinkedInBannerHuman: React.FC = () => {
  let bookY = HORIZON;
  return (
    <AbsoluteFill style={{ width: W, height: H, overflow: "hidden" }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="sky" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#F7B47A" />
            <stop offset="0.28" stopColor="#E9876A" />
            <stop offset="0.5" stopColor="#8E5E8C" />
            <stop offset="0.7" stopColor="#2B3F6B" />
            <stop offset="1" stopColor="#0F1C2E" />
          </linearGradient>
          <linearGradient id="skyTop" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0D1B2A" stopOpacity="0.45" />
            <stop offset="1" stopColor="#0D1B2A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#274B74" />
            <stop offset="1" stopColor="#0E1F33" />
          </linearGradient>
          <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#FFF1D0" />
            <stop offset="0.35" stopColor="#FFD08A" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFB36B" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gridFade" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id="gridMask">
            <rect
              x={900}
              y={0}
              width={W - 900}
              height={HORIZON}
              fill="url(#gridFade)"
            />
          </mask>
          <filter id="soft">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* sky */}
        <rect width={W} height={HORIZON} fill="url(#sky)" />
        <rect width={W} height={HORIZON} fill="url(#skyTop)" />

        {/* creative side: loose brush strokes */}
        <g filter="url(#soft)">
          <Brush
            d="M40 70 C160 40 260 95 380 62 S560 40 640 70"
            w={26}
            o={0.35}
          />
          <Brush
            d="M-20 130 C120 110 220 150 330 125 S470 105 540 128"
            w={18}
            o={0.28}
          />
          <Brush
            d="M120 190 C220 175 300 205 420 185"
            w={14}
            o={0.25}
            c="#FFD2B8"
          />
          <Brush d="M520 30 C600 20 700 45 780 28" w={12} o={0.2} c="#F3C6E0" />
        </g>
        <circle cx={430} cy={262} r={95} fill="url(#sun)" />

        {/* analytical side: precise grid, data points and a rising line */}
        <g mask="url(#gridMask)">
          {Array.from({ length: 28 }, (_, i) => 900 + i * 26).map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              x2={x}
              y1={0}
              y2={HORIZON}
              stroke="#9DB9FF"
              strokeOpacity={0.12}
            />
          ))}
          {Array.from({ length: 12 }, (_, i) => i * 26).map((y) => (
            <line
              key={`h${y}`}
              x1={900}
              x2={W}
              y1={y}
              y2={y}
              stroke="#9DB9FF"
              strokeOpacity={0.12}
            />
          ))}
          <polyline
            points="980,250 1040,236 1100,244 1160,212 1220,220 1280,186 1340,196 1400,160 1460,168 1520,130"
            fill="none"
            stroke="#8DB4FF"
            strokeWidth={2.5}
            opacity={0.55}
          />
          {[
            [1040, 236],
            [1160, 212],
            [1280, 186],
            [1400, 160],
            [1520, 130],
          ].map(([x, y]) => (
            <circle
              key={x}
              cx={x}
              cy={y}
              r={3.5}
              fill="#CFE0FF"
              opacity={0.7}
            />
          ))}
        </g>

        {/* international: long arcs leaving over the ocean */}
        {[
          { x1: 840, y1: 150, x2: 1600, y2: 258, lift: 5 },
          { x1: 615, y1: 110, x2: 1600, y2: 232, lift: 25 },
          { x1: 980, y1: 215, x2: 1600, y2: 282, lift: 0 },
        ].map((a, i) => (
          <g key={i}>
            <path
              d={arc(a.x1, a.y1, a.x2, a.y2, a.lift)}
              fill="none"
              stroke="#BFD3FF"
              strokeWidth={5}
              opacity={0.25}
              filter="url(#glow)"
            />
            <path
              d={arc(a.x1, a.y1, a.x2, a.y2, a.lift)}
              fill="none"
              stroke="#DCE8FF"
              strokeWidth={1.8}
              strokeDasharray="2 7"
              strokeLinecap="round"
              opacity={0.8}
            />
          </g>
        ))}

        {/* sea */}
        <rect y={HORIZON} width={W} height={H - HORIZON} fill="url(#sea)" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={400 - i * 6}
            y={HORIZON + 10 + i * 13}
            width={60 + i * 12}
            height={3}
            rx={1.5}
            fill="#FFC98A"
            opacity={0.5 - i * 0.07}
          />
        ))}
        {[330, 350, 372].map((y, i) => (
          <path
            key={y}
            d={`M${480 + i * 40} ${y} q12 -5 24 0 t24 0 M${760 - i * 30} ${y + 6} q12 -5 24 0 t24 0 M${1180 + i * 50} ${y - 4} q12 -5 24 0 t24 0`}
            fill="none"
            stroke="#9DB9FF"
            strokeOpacity={0.25}
            strokeWidth={2}
            strokeLinecap="round"
          />
        ))}

        {/* Casablanca skyline */}
        <g fill={INK}>
          {/* Hassan II Mosque on the water: hall and tall square minaret */}
          <rect x={520} y={262} width={170} height={38} />
          {[536, 566, 596, 626, 656].map((x) => (
            <path
              key={x}
              d={`M${x} 300 V282 a9 9 0 0 1 18 0 V300 Z`}
              fill="#3A2D3E"
              opacity={0.6}
            />
          ))}
          <rect x={600} y={112} width={30} height={152} />
          <rect x={606} y={96} width={18} height={18} />
          <rect x={613} y={80} width={4} height={16} />
          <circle cx={615} cy={78} r={3.5} />
          {[140, 175, 210].map((y) => (
            <rect
              key={y}
              x={609}
              y={y}
              width={12}
              height={18}
              rx={6}
              fill="#6F4B5A"
              opacity={0.5}
            />
          ))}
          {/* city blocks */}
          <rect x={700} y={236} width={46} height={64} />
          <rect x={750} y={214} width={34} height={86} />
          {/* twin towers */}
          <rect x={800} y={150} width={30} height={150} />
          <polygon points="800,150 815,132 830,150" />
          <rect x={842} y={150} width={30} height={150} />
          <polygon points="842,150 857,132 872,150" />
          <rect x={880} y={228} width={44} height={72} />
          <rect x={1000} y={244} width={52} height={56} />
          <rect x={1056} y={258} width={40} height={42} />
          <rect x={1100} y={270} width={70} height={30} />
        </g>
        {/* window lights, analytical rhythm */}
        {[0, 1, 2, 3, 4, 5, 6].map((r) =>
          [0, 1].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={806 + c * 42}
              y={164 + r * 18}
              width={6}
              height={8}
              fill="#FFD08A"
              opacity={(r + c) % 3 === 0 ? 0.85 : 0.25}
            />
          )),
        )}

        {/* the building made of books */}
        {BOOKS.map((b, i) => {
          bookY -= b.h;
          const x = 954 - b.w / 2 + (i % 2 ? 3 : -3);
          return (
            <g key={i}>
              <rect
                x={x}
                y={bookY}
                width={b.w}
                height={b.h}
                rx={2}
                fill={b.c}
              />
              <rect
                x={x + 6}
                y={bookY + 3}
                width={b.w - 12}
                height={1.6}
                fill="#FFFFFF"
                opacity={0.35}
              />
              <rect
                x={x}
                y={bookY}
                width={4}
                height={b.h}
                fill="#000"
                opacity={0.18}
              />
            </g>
          );
        })}

        {/* domestic: short gold arcs between buildings */}
        {[
          [615, 112, 723, 236, 30],
          [723, 236, 815, 150, 40],
          [857, 150, 954, bookY, 35],
          [954, bookY, 1026, 244, 30],
        ].map(([x1, y1, x2, y2, lift], i) => (
          <path
            key={i}
            d={arc(x1, y1, x2, y2, lift)}
            fill="none"
            stroke="#FFC94D"
            strokeWidth={2.2}
            opacity={0.85}
          />
        ))}
        {[
          [615, 112],
          [723, 236],
          [815, 150],
          [857, 150],
          [954, bookY],
          [1026, 244],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={3.5} fill="#FFE2A0" />
        ))}

        {/* corniche with running-track lanes and a runner */}
        <rect
          x={0}
          y={HORIZON}
          width={W}
          height={4}
          fill="#C98B5E"
          opacity={0.55}
        />
        <path
          d={`M440 ${HORIZON + 8} H${W}`}
          stroke="#F2D6BF"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray="14 10"
        />
        <g
          transform={`translate(1240 ${HORIZON - 30})`}
          stroke={INK}
          strokeWidth={4.5}
          strokeLinecap="round"
          fill="none"
        >
          <circle cx={10} cy={2} r={5} fill={INK} stroke="none" />
          <path d="M8 9 L4 20" />
          <path d="M4 20 L12 29 M4 20 L-5 27" />
          <path d="M7 12 L15 16 M7 12 L-1 9" />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          right: 70,
          top: 34,
          width: 400,
          fontFamily: sans,
          color: "white",
          textAlign: "right",
          textShadow: "0 2px 18px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -1,
          }}
        >
          Where curiosity
          <br />
          <span style={{ color: "#FFC94D" }}>meets precision.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

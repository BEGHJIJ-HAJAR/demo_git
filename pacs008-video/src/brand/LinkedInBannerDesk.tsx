import React from "react";
import { AbsoluteFill } from "remotion";

// LinkedIn profile background, 1584×396: a flat-lay of a desk seen from above.
// Book (reading), running shoes (sport), tablet with payment flows and a chart
// (work, analytical), sketchbook with watercolour (creative), mint tea on a
// zellige coaster (Casablanca). The bottom-left stays calm for the profile photo.
const W = 1584;
const H = 396;

const Shadow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <g filter="url(#shadow)">{children}</g>
);

const zelligeStar = (cx: number, cy: number, r: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const rad = i % 2 === 0 ? r : r * 0.62;
    const a = (i * Math.PI) / 8;
    pts.push(
      `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`,
    );
  }
  return pts.join(" ");
};

export const LinkedInBannerDesk: React.FC = () => (
  <AbsoluteFill style={{ width: W, height: H, overflow: "hidden" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="desk" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#F3ECE2" />
          <stop offset="1" stopColor="#E6DACB" />
        </linearGradient>
        <pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="none" />
          <circle cx="1" cy="1" r="0.6" fill="#B89F85" opacity="0.18" />
        </pattern>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="9"
            floodColor="#5A4632"
            floodOpacity="0.25"
          />
        </filter>
        <radialGradient id="light" cx="0.75" cy="0.1" r="0.9">
          <stop offset="0" stopColor="#FFF8EC" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFF8EC" stopOpacity="0" />
        </radialGradient>
        <clipPath id="screen">
          <rect x={700} y={78} width={330} height={226} rx={10} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill="url(#desk)" />
      <rect width={W} height={H} fill="url(#grain)" />
      <rect width={W} height={H} fill="url(#light)" />

      {/* leaf shadow in the corner (a plant just out of frame) */}
      <g opacity={0.12} fill="#4B5A3A">
        <ellipse
          cx={1540}
          cy={20}
          rx={70}
          ry={22}
          transform="rotate(35 1540 20)"
        />
        <ellipse
          cx={1480}
          cy={-5}
          rx={60}
          ry={18}
          transform="rotate(-10 1480 -5)"
        />
        <ellipse
          cx={1575}
          cy={80}
          rx={55}
          ry={16}
          transform="rotate(70 1575 80)"
        />
      </g>

      {/* open book */}
      <Shadow>
        <g transform="rotate(-7 520 200)">
          <path
            d="M395 110 Q455 98 518 112 V300 Q455 288 395 298 Z"
            fill="#FBF8F2"
          />
          <path
            d="M518 112 Q582 98 642 110 V298 Q582 288 518 300 Z"
            fill="#FFFDF8"
          />
          <path
            d="M392 112 V302 Q455 292 518 304 Q582 292 645 302 V112"
            fill="none"
            stroke="#D9CDBE"
            strokeWidth={2}
          />
          <line
            x1={518}
            y1={112}
            x2={518}
            y2={300}
            stroke="#CDBFAE"
            strokeWidth={2}
          />
          {Array.from({ length: 9 }, (_, i) => 138 + i * 17).map((y) => (
            <g key={y}>
              <rect
                x={412}
                y={y}
                width={i(y) ? 86 : 70}
                height={3}
                rx={1.5}
                fill="#C9BCAB"
              />
              <rect
                x={536}
                y={y}
                width={i(y) ? 72 : 88}
                height={3}
                rx={1.5}
                fill="#C9BCAB"
              />
            </g>
          ))}
          <path d="M600 100 V150 L608 142 L616 150 V100 Z" fill="#C45A3B" />
        </g>
      </Shadow>

      {/* tablet with payment flows and a chart */}
      <Shadow>
        <rect x={688} y={66} width={354} height={250} rx={20} fill="#1B2330" />
      </Shadow>
      <rect x={700} y={78} width={330} height={226} rx={10} fill="#0F1C2E" />
      <g clipPath="url(#screen)">
        {/* dotted map */}
        {Array.from({ length: 22 }, (_, cx) =>
          Array.from({ length: 9 }, (_, cy) => {
            const x = 712 + cx * 9;
            const y = 96 + cy * 9;
            const land =
              Math.sin(cx * 0.55) + Math.cos(cy * 0.9 + cx * 0.2) > 0.2;
            return land ? (
              <circle
                key={`${cx}-${cy}`}
                cx={x}
                cy={y}
                r={1.6}
                fill="#5C8DFF"
                opacity={0.5}
              />
            ) : null;
          }),
        )}
        {/* local (short, gold) and cross-border (long, blue) flows */}
        <path
          d="M770 160 Q790 140 812 158"
          fill="none"
          stroke="#FFC94D"
          strokeWidth={2.5}
        />
        <path
          d="M812 158 Q830 144 846 166"
          fill="none"
          stroke="#FFC94D"
          strokeWidth={2.5}
        />
        <path
          d="M770 160 Q840 90 900 118"
          fill="none"
          stroke="#8DB4FF"
          strokeWidth={2}
          strokeDasharray="3 4"
        />
        <path
          d="M812 158 Q880 120 902 170"
          fill="none"
          stroke="#8DB4FF"
          strokeWidth={2}
          strokeDasharray="3 4"
        />
        {[
          [770, 160],
          [812, 158],
          [846, 166],
          [900, 118],
          [902, 170],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={3.5} fill="#FFE2A0" />
        ))}
        {/* KPI tiles and bars */}
        <rect x={920} y={92} width={96} height={34} rx={6} fill="#16304D" />
        <rect
          x={928}
          y={100}
          width={40}
          height={5}
          rx={2.5}
          fill="#8DB4FF"
          opacity={0.7}
        />
        <rect
          x={928}
          y={111}
          width={62}
          height={8}
          rx={3}
          fill="#FFFFFF"
          opacity={0.85}
        />
        <rect x={920} y={134} width={96} height={34} rx={6} fill="#16304D" />
        <rect
          x={928}
          y={142}
          width={34}
          height={5}
          rx={2.5}
          fill="#8DB4FF"
          opacity={0.7}
        />
        <rect
          x={928}
          y={153}
          width={52}
          height={8}
          rx={3}
          fill="#22C55E"
          opacity={0.9}
        />
        {[26, 40, 34, 52, 46, 62, 58, 74, 70, 86].map((h, i) => (
          <rect
            key={i}
            x={716 + i * 30}
            y={292 - h}
            width={18}
            height={h}
            rx={3}
            fill={i === 9 ? "#FFC94D" : "#2F6BFF"}
            opacity={i === 9 ? 1 : 0.75}
          />
        ))}
        <polyline
          points="725,250 755,238 785,244 815,226 845,230 875,212 905,218 935,198 965,202 995,184"
          fill="none"
          stroke="#CFE0FF"
          strokeWidth={2}
        />
      </g>
      <circle cx={1036} cy={191} r={3} fill="#3A4556" />

      {/* mint tea on a zellige coaster */}
      <Shadow>
        <circle cx={1122} cy={130} r={62} fill="#1E5F74" />
      </Shadow>
      <polygon points={zelligeStar(1122, 130, 56)} fill="#F2E6D0" />
      <polygon points={zelligeStar(1122, 130, 40)} fill="#2E8B7A" />
      <circle cx={1122} cy={130} r={22} fill="#F2E6D0" />
      <circle
        cx={1122}
        cy={130}
        r={42}
        fill="#FFFFFF"
        opacity={0.25}
        stroke="#FFFFFF"
        strokeOpacity={0.7}
        strokeWidth={3}
      />
      <circle cx={1122} cy={130} r={33} fill="#B9772E" opacity={0.85} />
      {[
        [-8, -6, 30],
        [8, 4, -40],
        [0, 10, 80],
        [-10, 8, 150],
      ].map(([dx, dy, rot], i) => (
        <ellipse
          key={i}
          cx={1122 + dx}
          cy={130 + dy}
          rx={10}
          ry={5}
          fill="#5FA052"
          transform={`rotate(${rot} ${1122 + dx} ${130 + dy})`}
        />
      ))}
      <path
        d="M1100 108 Q1112 100 1126 104"
        stroke="#FFFFFF"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.7}
        fill="none"
      />

      {/* sketchbook with watercolour and a brush */}
      <Shadow>
        <g transform="rotate(6 1210 280)">
          <rect
            x={1130}
            y={214}
            width={210}
            height={150}
            rx={6}
            fill="#FFFDF7"
          />
          {Array.from({ length: 11 }, (_, i) => (
            <circle
              key={i}
              cx={1142 + i * 18}
              cy={214}
              r={4}
              fill="none"
              stroke="#8C8C8C"
              strokeWidth={2}
            />
          ))}
          <ellipse
            cx={1190}
            cy={272}
            rx={34}
            ry={22}
            fill="#F08A4B"
            opacity={0.55}
          />
          <ellipse
            cx={1228}
            cy={296}
            rx={30}
            ry={20}
            fill="#5C8DFF"
            opacity={0.5}
          />
          <ellipse
            cx={1266}
            cy={262}
            rx={26}
            ry={18}
            fill="#E9B949"
            opacity={0.55}
          />
          <path
            d="M1160 330 C1200 310 1250 340 1310 318"
            stroke="#8E5E8C"
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            opacity={0.5}
          />
        </g>
      </Shadow>
      <g transform="rotate(-28 1330 240)">
        <rect x={1260} y={236} width={120} height={8} rx={4} fill="#2B2B2B" />
        <rect x={1374} y={234} width={16} height={12} rx={2} fill="#C0C0C0" />
        <path d="M1390 236 Q1408 240 1390 244 Z" fill="#8E5E8C" />
      </g>

      {/* running shoes, top view */}
      {[
        { x: 1420, y: 150, r: -14 },
        { x: 1500, y: 175, r: 8 },
      ].map((s, i) => (
        <Shadow key={i}>
          <g transform={`rotate(${s.r} ${s.x} ${s.y})`}>
            <path
              d={`M${s.x - 26} ${s.y - 88} C${s.x - 40} ${s.y - 60} ${s.x - 38} ${s.y + 50} ${s.x - 24} ${s.y + 82} C${s.x - 10} ${s.y + 100} ${s.x + 14} ${s.y + 100} ${s.x + 26} ${s.y + 80} C${s.x + 40} ${s.y + 40} ${s.x + 40} ${s.y - 60} ${s.x + 24} ${s.y - 88} C${s.x + 12} ${s.y - 104} ${s.x - 14} ${s.y - 104} ${s.x - 26} ${s.y - 88} Z`}
              fill="#FFFFFF"
              stroke="#D8DEE6"
              strokeWidth={3}
            />
            <path
              d={`M${s.x - 22} ${s.y - 40} C${s.x - 30} ${s.y} ${s.x - 28} ${s.y + 40} ${s.x - 18} ${s.y + 70}`}
              stroke="#F08A4B"
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              cx={s.x}
              cy={s.y - 20}
              rx={14}
              ry={34}
              fill="#2F6BFF"
              opacity={0.85}
            />
            {[-44, -32, -20, -8].map((dy) => (
              <line
                key={dy}
                x1={s.x - 12}
                x2={s.x + 12}
                y1={s.y + dy}
                y2={s.y + dy}
                stroke="#FFFFFF"
                strokeWidth={3}
                strokeLinecap="round"
              />
            ))}
            <ellipse cx={s.x} cy={s.y + 50} rx={16} ry={20} fill="#EEF2F7" />
          </g>
        </Shadow>
      ))}

      {/* a pen next to the book */}
      <g transform="rotate(62 330 120)">
        <rect x={250} y={116} width={150} height={9} rx={4.5} fill="#16304D" />
        <path d="M400 116 L416 120.5 L400 125 Z" fill="#C9A227" />
        <rect x={262} y={112} width={30} height={3} rx={1.5} fill="#C9A227" />
      </g>
    </svg>
  </AbsoluteFill>
);

// Alternate line lengths so the "text" on the book pages looks natural.
function i(y: number) {
  return Math.floor(y / 17) % 3 !== 0;
}

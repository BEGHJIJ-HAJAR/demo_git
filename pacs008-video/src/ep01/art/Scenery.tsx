import React from "react";
import { C } from "../theme";

/** Casablanca skyline with the Hassan II Mosque silhouette. 480×260 grid. */
export const CasablancaSkyline: React.FC<{
  width?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ width = 480, color = "#C9612E", style }) => (
  <svg
    width={width}
    height={(width * 260) / 480}
    viewBox="0 0 480 260"
    style={style}
  >
    <circle cx={90} cy={70} r={34} fill="#FFD9A0" opacity={0.8} />
    {/* Hassan II Mosque: tall square minaret + long arched prayer hall */}
    <rect x={338} y={28} width={40} height={206} fill={color} />
    <rect x={346} y={8} width={24} height={22} fill={color} />
    <rect x={356} y={-10} width={4} height={20} fill={color} />
    <circle cx={358} cy={-12} r={4} fill={color} />
    {[60, 100, 140, 180].map((y) => (
      <rect
        key={y}
        x={350}
        y={y}
        width={16}
        height={22}
        rx={8}
        fill="#F6B27F"
        opacity={0.6}
      />
    ))}
    <rect x={210} y={178} width={270} height={56} fill={color} />
    {[226, 262, 298, 392, 428].map((x) => (
      <path
        key={x}
        d={`M${x} 234 V206 A12 12 0 0 1 ${x + 24} 206 V234 Z`}
        fill="#F6B27F"
        opacity={0.55}
      />
    ))}
    {/* City blocks and a palm */}
    <rect x={20} y={170} width={70} height={64} fill={color} opacity={0.75} />
    <rect x={96} y={150} width={56} height={84} fill={color} opacity={0.85} />
    <rect x={156} y={188} width={50} height={46} fill={color} opacity={0.7} />
    <path
      d="M186 234 C184 200 188 170 196 140"
      stroke={color}
      strokeWidth={6}
      fill="none"
    />
    {[-60, -20, 20, 60, 100].map((a) => (
      <ellipse
        key={a}
        cx={196}
        cy={140}
        rx={26}
        ry={7}
        fill={color}
        transform={`rotate(${a} 196 140) translate(18 0)`}
      />
    ))}
    <rect x={0} y={232} width={480} height={28} fill={color} />
  </svg>
);

/** Munich skyline with Frauenkirche-style twin towers. 480×260 grid. */
export const MunichSkyline: React.FC<{
  width?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ width = 480, color = "#2F5596", style }) => (
  <svg
    width={width}
    height={(width * 260) / 480}
    viewBox="0 0 480 260"
    style={style}
  >
    <path
      d="M0 200 L70 120 L120 170 L190 90 L260 180 L330 110 L400 170 L480 120 V260 H0 Z"
      fill="#DCE8F8"
      opacity={0.6}
    />
    {/* Frauenkirche: two towers with rounded domes, steep church roof */}
    <rect x={250} y={130} width={170} height={104} fill={color} />
    <polygon points="250,132 335,64 420,132" fill={color} />
    {[270, 350].map((x) => (
      <g key={x}>
        <rect x={x} y={52} width={46} height={182} fill={color} />
        <path
          d={`M${x - 2} 54 C${x - 2} 20 ${x + 48} 20 ${x + 48} 54 Z`}
          fill="#3E6BB5"
        />
        <rect x={x + 21} y={8} width={4} height={18} fill="#3E6BB5" />
        <rect
          x={x + 15}
          y={80}
          width={16}
          height={34}
          rx={8}
          fill="#8FB3E8"
          opacity={0.6}
        />
      </g>
    ))}
    {/* Gabled houses */}
    {[
      [20, 170, 60],
      [84, 150, 54],
      [142, 176, 50],
      [196, 160, 48],
      [430, 170, 46],
    ].map(([x, y, w]) => (
      <g key={x}>
        <rect
          x={x}
          y={y}
          width={w}
          height={234 - y}
          fill={color}
          opacity={0.8}
        />
        <polygon
          points={`${x},${y} ${x + w / 2},${y - 26} ${x + w},${y}`}
          fill={color}
          opacity={0.8}
        />
      </g>
    ))}
    <rect x={0} y={232} width={480} height={28} fill={color} />
  </svg>
);

/** Shiny professional oven. 220×240 grid. */
export const Oven: React.FC<{
  width?: number;
  glowAmount?: number;
  style?: React.CSSProperties;
}> = ({ width = 220, glowAmount = 1, style }) => (
  <svg
    width={width}
    height={(width * 240) / 220}
    viewBox="0 0 220 240"
    style={style}
  >
    <defs>
      <linearGradient id="steel" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#F4F7FB" />
        <stop offset="0.45" stopColor="#B9C4D2" />
        <stop offset="0.55" stopColor="#E8EDF3" />
        <stop offset="1" stopColor="#8E9BAD" />
      </linearGradient>
    </defs>
    <rect x={16} y={222} width={14} height={18} fill="#56606E" />
    <rect x={190} y={222} width={14} height={18} fill="#56606E" />
    <rect
      x={6}
      y={10}
      width={208}
      height={214}
      rx={14}
      fill="url(#steel)"
      stroke="#7C8899"
      strokeWidth={3}
    />
    <rect x={20} y={24} width={180} height={30} rx={6} fill="#2A3140" />
    {[50, 90, 130].map((x) => (
      <circle
        key={x}
        cx={x}
        cy={39}
        r={9}
        fill="#C9D2DE"
        stroke="#1B212B"
        strokeWidth={2}
      />
    ))}
    <rect
      x={150}
      y={31}
      width={38}
      height={16}
      rx={3}
      fill="#44E0A0"
      opacity={0.85}
    />
    <rect x={24} y={70} width={172} height={130} rx={10} fill="#1B212B" />
    <rect
      x={36}
      y={82}
      width={148}
      height={106}
      rx={8}
      fill="#FF8A3D"
      opacity={0.25 + 0.5 * glowAmount}
    />
    <path
      d="M44 90 L80 90 L52 180"
      stroke="white"
      strokeWidth={5}
      opacity={0.35}
      strokeLinecap="round"
    />
    <rect
      x={40}
      y={60}
      width={140}
      height={10}
      rx={5}
      fill="#AEB8C6"
      stroke="#6D7888"
      strokeWidth={2}
    />
  </svg>
);

/** Bakery counter with bread loaves and msemen. 420×120 grid. */
export const BakeryCounter: React.FC<{
  width?: number;
  style?: React.CSSProperties;
}> = ({ width = 420, style }) => (
  <svg
    width={width}
    height={(width * 120) / 420}
    viewBox="0 0 420 120"
    style={style}
  >
    <rect x={0} y={60} width={420} height={60} rx={8} fill="#8C4A26" />
    <rect x={0} y={54} width={420} height={14} rx={6} fill="#B5663A" />
    {[40, 116].map((x) => (
      <g key={x}>
        <ellipse
          cx={x}
          cy={38}
          rx={36}
          ry={20}
          fill="#D9964F"
          stroke="#A5642C"
          strokeWidth={3}
        />
        <path
          d={`M${x - 20} 34 l10 -8 M${x - 4} 38 l10 -8 M${x + 12} 40 l10 -8`}
          stroke="#F2C58A"
          strokeWidth={4}
          strokeLinecap="round"
        />
      </g>
    ))}
    {/* Msemen: square, folded, golden flatbreads */}
    {[
      [200, 22],
      [262, 26],
      [324, 20],
    ].map(([x, y]) => (
      <g
        key={x}
        transform={`rotate(${x % 3 === 0 ? -6 : 5} ${x + 26} ${y + 20})`}
      >
        <rect
          x={x}
          y={y}
          width={52}
          height={40}
          rx={6}
          fill="#E8B062"
          stroke="#B97A2C"
          strokeWidth={3}
        />
        <path
          d={`M${x + 4} ${y + 4} L${x + 48} ${y + 36} M${x + 26} ${y} V${y + 40}`}
          stroke="#C98A3A"
          strokeWidth={2}
          opacity={0.7}
        />
        <circle cx={x + 16} cy={y + 26} r={3} fill="#B97A2C" opacity={0.6} />
        <circle cx={x + 36} cy={y + 14} r={3} fill="#B97A2C" opacity={0.6} />
      </g>
    ))}
  </svg>
);

/** Piggy bank (money = green). 240×180 grid. */
export const PiggyBank: React.FC<{
  width?: number;
  style?: React.CSSProperties;
}> = ({ width = 240, style }) => (
  <svg
    width={width}
    height={(width * 180) / 240}
    viewBox="0 0 240 180"
    style={{ overflow: "visible", ...style }}
  >
    <ellipse cx={120} cy={170} rx={90} ry={8} fill="rgba(0,0,0,0.2)" />
    <rect x={62} y={132} width={22} height={36} rx={8} fill={C.greenDark} />
    <rect x={150} y={132} width={22} height={36} rx={8} fill={C.greenDark} />
    <ellipse cx={120} cy={100} rx={92} ry={62} fill={C.green} />
    <path d="M68 48 L78 16 L100 44 Z" fill={C.greenDark} />
    <ellipse
      cx={206}
      cy={104}
      rx={22}
      ry={20}
      fill={C.greenLight}
      stroke={C.greenDark}
      strokeWidth={3}
    />
    <circle cx={200} cy={100} r={3.5} fill={C.greenDark} />
    <circle cx={212} cy={100} r={3.5} fill={C.greenDark} />
    <circle cx={172} cy={78} r={6} fill={C.ink} />
    <rect x={96} y={44} width={48} height={9} rx={4.5} fill={C.greenDark} />
    <path
      d="M28 96 C12 92 12 76 24 78"
      fill="none"
      stroke={C.greenDark}
      strokeWidth={5}
      strokeLinecap="round"
    />
  </svg>
);

/** Delivery truck carrying the oven. 260×150 grid. */
export const Truck: React.FC<{
  width?: number;
  style?: React.CSSProperties;
}> = ({ width = 260, style }) => (
  <svg
    width={width}
    height={(width * 150) / 260}
    viewBox="0 0 260 150"
    style={style}
  >
    <rect
      x={70}
      y={20}
      width={180}
      height={96}
      rx={8}
      fill="white"
      stroke="#C8D2DE"
      strokeWidth={3}
    />
    <rect
      x={140}
      y={40}
      width={56}
      height={60}
      rx={6}
      fill="#C9D2DE"
      stroke="#7C8899"
      strokeWidth={3}
    />
    <rect x={148} y={58} width={40} height={34} rx={4} fill="#1B212B" />
    <path d="M8 116 V74 L26 44 H72 V116 Z" fill={C.cool} />
    <path d="M20 74 L32 54 H62 V74 Z" fill="#CFE0F7" />
    <rect x={4} y={108} width={250} height={14} rx={6} fill="#3A4556" />
    {[46, 200].map((x) => (
      <g key={x}>
        <circle cx={x} cy={124} r={20} fill="#1B212B" />
        <circle cx={x} cy={124} r={8} fill="#9AA5B4" />
      </g>
    ))}
  </svg>
);

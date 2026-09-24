import React from "react";
import { C, sans } from "../theme";
import { Country, FlagArt } from "./Flags";

/**
 * Gold bank building with a letter badge and a country flag pin.
 * `width` is the rendered width; the art is drawn on a 200×200 grid.
 */
export const Bank: React.FC<{
  letter: string;
  country: Country;
  width?: number;
  large?: boolean;
  style?: React.CSSProperties;
}> = ({ letter, country, width = 200, large = false, style }) => {
  const columns = large ? [34, 62, 90, 118, 146] : [44, 78, 112, 146];
  const colWidth = large ? 16 : 18;
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 200 200"
      style={{ overflow: "visible", ...style }}
    >
      <ellipse cx={100} cy={190} rx={92} ry={8} fill="rgba(0,0,0,0.18)" />
      <rect x={30} y={96} width={140} height={66} fill={C.goldLight} />
      {columns.map((x) => (
        <g key={x}>
          <rect
            x={x - 2}
            y={92}
            width={colWidth + 4}
            height={6}
            fill={C.goldDark}
          />
          <rect x={x} y={96} width={colWidth} height={66} fill={C.gold} />
          <rect
            x={x + colWidth - 5}
            y={96}
            width={5}
            height={66}
            fill={C.goldDark}
            opacity={0.5}
          />
        </g>
      ))}
      <rect x={22} y={80} width={156} height={14} fill={C.gold} />
      <polygon
        points="14,82 100,30 186,82"
        fill={C.gold}
        stroke={C.goldDark}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <rect x={20} y={160} width={160} height={12} fill={C.gold} />
      <rect x={10} y={172} width={180} height={14} rx={3} fill={C.goldDark} />
      <circle
        cx={100}
        cy={64}
        r={19}
        fill={C.ink}
        stroke="white"
        strokeWidth={3}
      />
      <text
        x={100}
        y={72}
        textAnchor="middle"
        fontFamily={sans}
        fontWeight={800}
        fontSize={24}
        fill="white"
      >
        {letter}
      </text>
      <line
        x1={174}
        y1={6}
        x2={174}
        y2={60}
        stroke="#6B5B3E"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <g transform="translate(175 8) scale(1.1)">
        <FlagArt country={country} />
      </g>
    </svg>
  );
};

/** Dark teal T2 building (Eurosystem settlement), 300×230 grid, with the "formerly TARGET2" sticker. */
export const T2Building: React.FC<{
  width?: number;
  sticker?: boolean;
  style?: React.CSSProperties;
}> = ({ width = 300, sticker = true, style }) => (
  <svg
    width={width}
    height={(width * 230) / 300}
    viewBox="0 0 300 230"
    style={{ overflow: "visible", ...style }}
  >
    <ellipse cx={150} cy={220} rx={140} ry={9} fill="rgba(0,0,0,0.2)" />
    <rect
      x={30}
      y={100}
      width={240}
      height={86}
      fill={C.tealLight}
      opacity={0.35}
    />
    <rect x={30} y={100} width={240} height={86} fill={C.teal} opacity={0.55} />
    {[44, 82, 120, 158, 196, 234].map((x) => (
      <g key={x}>
        <rect x={x - 3} y={94} width={28} height={7} fill={C.tealDark} />
        <rect x={x} y={100} width={22} height={86} fill={C.teal} />
        <rect
          x={x + 15}
          y={100}
          width={7}
          height={86}
          fill={C.tealDark}
          opacity={0.6}
        />
      </g>
    ))}
    <rect x={18} y={78} width={264} height={18} fill={C.teal} />
    <polygon
      points="8,80 150,18 292,80"
      fill={C.teal}
      stroke={C.tealDark}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <text
      x={150}
      y={70}
      textAnchor="middle"
      fontFamily={sans}
      fontWeight={800}
      fontSize={34}
      fill="white"
    >
      T2
    </text>
    <rect x={20} y={184} width={260} height={14} fill={C.teal} />
    <rect x={6} y={197} width={288} height={16} rx={3} fill={C.tealDark} />
    {sticker ? (
      <g transform="translate(176 110) rotate(-8)">
        <rect
          x={0}
          y={0}
          width={124}
          height={50}
          rx={8}
          fill="#FFE27A"
          stroke="#C9A227"
          strokeWidth={2}
        />
        <g transform="translate(8 15) scale(0.8)">
          <FlagArt country="EU" />
        </g>
        <text
          x={38}
          y={22}
          fontFamily={sans}
          fontWeight={700}
          fontSize={13}
          fill={C.ink}
        >
          formerly
        </text>
        <text
          x={38}
          y={40}
          fontFamily={sans}
          fontWeight={800}
          fontSize={15}
          fill={C.ink}
        >
          TARGET2
        </text>
      </g>
    ) : null}
  </svg>
);

/** Name label under a building. */
export const BuildingLabel: React.FC<{
  name: string;
  sub?: string;
  color?: string;
  size?: number;
}> = ({ name, sub, color = "white", size = 30 }) => (
  <div
    style={{
      fontFamily: sans,
      textAlign: "center",
      color,
      lineHeight: 1.15,
      whiteSpace: "nowrap",
    }}
  >
    <div style={{ fontWeight: 800, fontSize: size }}>{name}</div>
    {sub ? (
      <div style={{ fontWeight: 600, fontSize: size * 0.62, opacity: 0.75 }}>
        {sub}
      </div>
    ) : null}
  </div>
);

import React from "react";

export type Country = "MA" | "FR" | "DE" | "EU";

const star = (cx: number, cy: number, r: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.42;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(
      `${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`,
    );
  }
  return pts.join(" ");
};

// Pentagram outline for Morocco (points visited in star order).
const pentagram = (cx: number, cy: number, r: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
    pts.push(
      `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`,
    );
  }
  return pts.join(" ");
};

/** Flag drawn in a 30×20 box. */
export const FlagArt: React.FC<{ country: Country }> = ({ country }) => {
  switch (country) {
    case "MA":
      return (
        <g>
          <rect width={30} height={20} fill="#C1272D" />
          <polygon
            points={pentagram(15, 10.6, 6)}
            fill="none"
            stroke="#006233"
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
        </g>
      );
    case "FR":
      return (
        <g>
          <rect width={10} height={20} fill="#0055A4" />
          <rect x={10} width={10} height={20} fill="#FFFFFF" />
          <rect x={20} width={10} height={20} fill="#EF4135" />
        </g>
      );
    case "DE":
      return (
        <g>
          <rect width={30} height={6.67} fill="#111111" />
          <rect y={6.67} width={30} height={6.67} fill="#DD0000" />
          <rect y={13.33} width={30} height={6.67} fill="#FFCE00" />
        </g>
      );
    case "EU":
      return (
        <g>
          <rect width={30} height={20} fill="#003399" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <polygon
                key={i}
                points={star(15 + 6 * Math.cos(a), 10 + 6 * Math.sin(a), 1.3)}
                fill="#FFCC00"
              />
            );
          })}
        </g>
      );
  }
};

export const Flag: React.FC<{
  country: Country;
  width?: number;
  style?: React.CSSProperties;
}> = ({ country, width = 45, style }) => (
  <svg
    width={width}
    height={(width * 2) / 3}
    viewBox="0 0 30 20"
    style={{
      borderRadius: width / 12,
      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      flexShrink: 0,
      ...style,
    }}
  >
    <FlagArt country={country} />
  </svg>
);

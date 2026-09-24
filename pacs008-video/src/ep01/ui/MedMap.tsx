import React from "react";
import { C, sans } from "../theme";
import { Flag } from "../art/Flags";
import { Waves } from "../art/Icons";

/** Map card bounds and landmarks, in composition coordinates. */
export const MAP = { x: 40, y: 240, width: 1000, height: 850 };
export const SEA_TOP = 600;
export const SEA_BOTTOM = 840;
export const CASA_BANK = { x: 270, y: 945 };
export const PARIS_BANK = { x: 280, y: 440 };

const coast = (y: number, amp: number, phase: number) => {
  const pts: string[] = [];
  for (let x = MAP.x; x <= MAP.x + MAP.width; x += 20) {
    pts.push(
      `${x} ${(y + amp * Math.sin(x / 90 + phase) + (amp / 2) * Math.sin(x / 37)).toFixed(1)}`,
    );
  }
  return pts;
};

/** Stylised map: Europe (top), the Mediterranean, Morocco (bottom). */
export const MedMap: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const north = coast(SEA_TOP, 16, 0);
  const south = coast(SEA_BOTTOM, 14, 2);
  const right = MAP.x + MAP.width;
  const bottom = MAP.y + MAP.height;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          left: MAP.x,
          top: MAP.y,
          width: MAP.width,
          height: MAP.height,
          borderRadius: 40,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        }}
      >
        <svg
          width={1080}
          height={1350}
          viewBox="0 0 1080 1350"
          style={{ position: "absolute", left: -MAP.x, top: -MAP.y }}
        >
          <rect
            x={MAP.x}
            y={MAP.y}
            width={MAP.width}
            height={MAP.height}
            fill={C.sea}
          />
          {[640, 700, 760, 810].map((y, i) => (
            <path
              key={y}
              d={`M${MAP.x + 60 + i * 70} ${y} q20 -10 40 0 t40 0 M${MAP.x + 520 - i * 50} ${y + 14} q20 -10 40 0 t40 0`}
              fill="none"
              stroke="white"
              strokeOpacity={0.35}
              strokeWidth={4}
              strokeLinecap="round"
            />
          ))}
          <path
            d={`M${MAP.x} ${MAP.y} H${right} V${north[north.length - 1].split(" ")[1]} L${[...north].reverse().join(" L ")} Z`}
            fill={C.landEurope}
          />
          <path
            d={`M${MAP.x} ${bottom} H${right} V${south[south.length - 1].split(" ")[1]} L${[...south].reverse().join(" L ")} Z`}
            fill={C.landMorocco}
          />
        </svg>
      </div>
      <Region label="EUROPE" country="EU" x={MAP.x + 36} y={MAP.y + 30} />
      <Region
        label="MOROCCO"
        country="MA"
        x={MAP.x + 36}
        y={MAP.y + MAP.height - 70}
      />
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 700,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: sans,
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 30,
          color: "white",
          opacity: 0.9,
        }}
      >
        <Waves size={44} color="white" />
        Mediterranean Sea
      </div>
      {children}
    </div>
  );
};

const Region: React.FC<{
  label: string;
  country: "EU" | "MA";
  x: number;
  y: number;
}> = ({ label, country, x, y }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: sans,
      fontWeight: 800,
      fontSize: 28,
      letterSpacing: 4,
      color: C.ink,
      opacity: 0.7,
    }}
  >
    <Flag country={country} width={42} />
    {label}
  </div>
);

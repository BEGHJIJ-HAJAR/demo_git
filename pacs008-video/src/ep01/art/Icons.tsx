import React from "react";
import { C, sans } from "../theme";

type IconProps = { size?: number; color?: string; style?: React.CSSProperties };

export const Check: React.FC<IconProps> = ({
  size = 40,
  color = "white",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    style={{ display: "inline-block", verticalAlign: "middle", ...style }}
  >
    <path
      d="M8 21 L17 30 L33 11"
      fill="none"
      stroke={color}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowRight: React.FC<IconProps> = ({
  size = 40,
  color = "white",
  style,
}) => (
  <svg
    width={size}
    height={size * 0.6}
    viewBox="0 0 40 24"
    style={{ display: "inline-block", verticalAlign: "middle", ...style }}
  >
    <path
      d="M3 12 H33 M24 3 L35 12 L24 21"
      fill="none"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowDown: React.FC<IconProps> = ({
  size = 40,
  color = "white",
  style,
}) => (
  <svg
    width={size * 0.6}
    height={size}
    viewBox="0 0 24 40"
    style={{ display: "inline-block", verticalAlign: "middle", ...style }}
  >
    <path
      d="M12 3 V33 M3 24 L12 35 L21 24"
      fill="none"
      stroke={color}
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ReturnArrow: React.FC<IconProps> = ({
  size = 40,
  color = "white",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    style={{ display: "inline-block", verticalAlign: "middle", ...style }}
  >
    <path
      d="M14 8 L5 17 L14 26 M6 17 H26 A9 9 0 0 1 26 35 H18"
      fill="none"
      stroke={color}
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Pin: React.FC<IconProps> = ({
  size = 40,
  color = C.red,
  style,
}) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 40 52"
    style={{ display: "inline-block", ...style }}
  >
    <path
      d="M20 50 C20 50 4 30 4 18 A16 16 0 0 1 36 18 C36 30 20 50 20 50 Z"
      fill={color}
      stroke="rgba(0,0,0,0.2)"
      strokeWidth={2}
    />
    <circle cx={20} cy={18} r={6.5} fill="white" />
  </svg>
);

export const NoEntry: React.FC<IconProps> = ({ size = 40, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    style={{ display: "inline-block", verticalAlign: "middle", ...style }}
  >
    <circle
      cx={20}
      cy={20}
      r={17}
      fill="white"
      stroke={C.red}
      strokeWidth={5}
    />
    <path d="M8 8 L32 32" stroke={C.red} strokeWidth={5} />
  </svg>
);

export const Waves: React.FC<IconProps> = ({
  size = 40,
  color = C.sea,
  style,
}) => (
  <svg
    width={size}
    height={size * 0.7}
    viewBox="0 0 40 28"
    style={{ display: "inline-block", ...style }}
  >
    {[6, 14, 22].map((y) => (
      <path
        key={y}
        d={`M2 ${y} q5 -5 9 0 t9 0 t9 0 t9 0`}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
    ))}
  </svg>
);

/** Small document icon (the letter). */
export const DocIcon: React.FC<IconProps> = ({ size = 40, style }) => (
  <svg
    width={size * 0.8}
    height={size}
    viewBox="0 0 32 40"
    style={{ display: "inline-block", verticalAlign: "middle", ...style }}
  >
    <rect
      x={2}
      y={2}
      width={28}
      height={36}
      rx={4}
      fill="white"
      stroke="#CBD2DC"
      strokeWidth={2}
    />
    {[11, 17, 23].map((y) => (
      <rect key={y} x={7} y={y} width={18} height={3} rx={1.5} fill="#AAB4C2" />
    ))}
    <rect x={7} y={29} width={12} height={4} rx={2} fill={C.uetr} />
  </svg>
);

/** Small blue envelope icon. */
export const EnvelopeIcon: React.FC<IconProps> = ({ size = 40, style }) => (
  <svg
    width={size * 1.4}
    height={size}
    viewBox="0 0 56 40"
    style={{ display: "inline-block", verticalAlign: "middle", ...style }}
  >
    <rect x={2} y={4} width={52} height={34} rx={5} fill={C.blue} />
    <path
      d="M3 6 L28 24 L53 6"
      fill="none"
      stroke="white"
      strokeWidth={3}
      strokeLinejoin="round"
    />
  </svg>
);

/** Numbered step badge (replaces ①②③… which the bundled font lacks). */
export const StepBadge: React.FC<{
  n: number;
  size?: number;
  color?: string;
}> = ({ n, size = 52, color = C.blue }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      color: "white",
      fontFamily: sans,
      fontWeight: 800,
      fontSize: size * 0.56,
      flexShrink: 0,
    }}
  >
    {n}
  </span>
);

export const Coin: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 60,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: `radial-gradient(circle at 35% 30%, ${C.greenLight} 0%, ${C.green} 55%, ${C.greenDark} 100%)`,
      boxShadow: `0 ${size / 10}px ${size / 5}px rgba(0,0,0,0.25), inset 0 0 0 ${Math.max(2, size / 16)}px ${C.greenDark}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: sans,
      fontWeight: 800,
      fontSize: size * 0.55,
      color: "white",
      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
      ...style,
    }}
  >
    €
  </div>
);

export const CurrencyExchange: React.FC<IconProps> = ({ size = 40, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    style={{ display: "inline-block", verticalAlign: "middle", ...style }}
  >
    <path
      d="M8 15 A13 13 0 0 1 32 12 M32 5 V12 H25"
      fill="none"
      stroke={C.green}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32 25 A13 13 0 0 1 8 28 M8 35 V28 H15"
      fill="none"
      stroke={C.green}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

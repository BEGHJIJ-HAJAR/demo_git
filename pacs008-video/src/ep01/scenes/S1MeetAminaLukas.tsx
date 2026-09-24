import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, EASE_IN_OUT, EASE_OUT, pop, prog, qbez } from "../anim";
import { C, mono, sans } from "../theme";
import { cue } from "../timing";
import { Flag } from "../art/Flags";
import { Amina, Lukas } from "../art/People";
import {
  BakeryCounter,
  CasablancaSkyline,
  MunichSkyline,
  Oven,
} from "../art/Scenery";
import { TopText } from "../ui/Text";

const LUKAS_IN = cue("s1", "oven") - 6;
export const INVOICE = cue("s1", "Twelve") - 4;
const DEFINITIONS = cue("s1", "ISO") - 6;
export const DEBTOR = cue("s1", "Debtor");
export const CREDITOR = cue("s1", "Creditor");

const PANEL_TOP = 290;
const PANEL_H = 790;

/** Scene 1 · Meet Amina (Casablanca, Debtor) and Lukas (Munich, Creditor). */
export const S1MeetAminaLukas: React.FC = () => {
  const frame = useCurrentFrame();
  const leftIn = prog(frame, 0, 16);
  const rightIn = prog(frame, LUKAS_IN, 16);

  return (
    <AbsoluteFill>
      <TopText from={0} to={DEFINITIONS} size={64}>
        Meet Amina <span style={{ color: C.textMuted }}>&</span> Lukas
      </TopText>
      <TopText from={DEFINITIONS} size={46} top={100}>
        <div>
          <span style={{ color: C.warmLight }}>Amina</span> ={" "}
          <span style={{ color: "#FFB27A" }}>Debtor</span>{" "}
          <span style={{ color: C.textMuted, fontWeight: 600 }}>(pays)</span>
        </div>
        <div>
          <span style={{ color: C.coolLight }}>Lukas</span> ={" "}
          <span style={{ color: "#8DB4FF" }}>Creditor</span>{" "}
          <span style={{ color: C.textMuted, fontWeight: 600 }}>
            (gets paid)
          </span>
        </div>
      </TopText>

      <Panel
        left={50}
        tone="warm"
        style={{ translate: `${(1 - leftIn) * -560}px 0px`, opacity: leftIn }}
      >
        <CasablancaSkyline
          width={480}
          style={{ position: "absolute", left: 0, top: 70 }}
        />
        <CityChip name="Casablanca" country="MA" />
        <Amina
          width={250}
          style={{ position: "absolute", left: 115, top: 300 }}
        />
        <BakeryCounter
          width={460}
          style={{ position: "absolute", left: 10, top: 560 }}
        />
        <RoleLabel at={DEBTOR} role="Debtor" note="pays" color={C.warmDark} />
      </Panel>

      <Panel
        left={550}
        tone="cool"
        style={{ translate: `${(1 - rightIn) * 560}px 0px`, opacity: rightIn }}
      >
        <MunichSkyline
          width={480}
          style={{ position: "absolute", left: 0, top: 70 }}
        />
        <CityChip name="Munich" country="DE" />
        <Lukas
          width={230}
          style={{ position: "absolute", left: 20, top: 360 }}
        />
        <div style={{ position: "absolute", left: 250, top: 420 }}>
          <Oven width={200} />
          <Shine frame={frame} />
        </div>
        <RoleLabel
          at={CREDITOR}
          role="Creditor"
          note="gets paid"
          color={C.coolDark}
        />
      </Panel>

      <Invoice frame={frame} />
    </AbsoluteFill>
  );
};

const Panel: React.FC<{
  left: number;
  tone: "warm" | "cool";
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ left, tone, style, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: PANEL_TOP,
      width: 480,
      height: PANEL_H,
      borderRadius: 36,
      overflow: "hidden",
      background:
        tone === "warm"
          ? "linear-gradient(180deg, #FFE3C4 0%, #FDBA84 55%, #F08A4B 100%)"
          : "linear-gradient(180deg, #EEF4FD 0%, #BFD5F5 55%, #7FA3E0 100%)",
      boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    {children}
  </div>
);

const CityChip: React.FC<{ name: string; country: "MA" | "DE" }> = ({
  name,
  country,
}) => (
  <div
    style={{
      position: "absolute",
      left: 24,
      top: 22,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 16px 8px 10px",
      borderRadius: 26,
      backgroundColor: "rgba(255,255,255,0.85)",
      fontFamily: sans,
      fontWeight: 800,
      fontSize: 28,
      color: C.ink,
    }}
  >
    <Flag country={country} width={40} />
    {name}
  </div>
);

const RoleLabel: React.FC<{
  at: number;
  role: string;
  note: string;
  color: string;
}> = ({ at, role, note, color }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 12);
  if (frame < at) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 34,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          padding: "12px 28px",
          borderRadius: 30,
          backgroundColor: color,
          color: "white",
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 44,
          scale: s,
          boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
        }}
      >
        {role}{" "}
        <span style={{ fontWeight: 600, fontSize: 30, opacity: 0.85 }}>
          ({note})
        </span>
      </div>
    </div>
  );
};

/** A diagonal shine sweeping across the oven. */
const Shine: React.FC<{ frame: number }> = ({ frame }) => {
  const x = interpolate((frame - LUKAS_IN) % 75, [10, 40], [-120, 260], clamp);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: 14,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          left: x,
          width: 40,
          height: 320,
          rotate: "20deg",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.8), rgba(255,255,255,0))",
        }}
      />
    </div>
  );
};

/** The invoice slides from Lukas to Amina. */
const Invoice: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < INVOICE) {
    return null;
  }
  const t = prog(frame, INVOICE, 22, EASE_IN_OUT);
  const p = qbez({ x: 790, y: 640 }, { x: 540, y: 380 }, { x: 290, y: 815 }, t);
  const settle = prog(frame, INVOICE + 22, 10, EASE_OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: p.x - 170,
        top: p.y - 105,
        width: 340,
        height: 210,
        rotate: `${interpolate(t, [0, 0.5, 1], [8, -10, -4])}deg`,
        scale:
          interpolate(t, [0, 0.15, 1], [0.4, 1, 0.8]) * (1 - 0.05 * settle),
        backgroundColor: "white",
        borderRadius: 14,
        boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        padding: "16px 22px",
        boxSizing: "border-box",
        fontFamily: sans,
        color: C.ink,
        zIndex: 4,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 4,
          color: C.inkMuted,
        }}
      >
        INVOICE
      </div>
      <div
        style={{
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 28,
          marginTop: 4,
        }}
      >
        INV-2026-114
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: 14,
          borderTop: "2px dashed #D5DBE3",
          paddingTop: 12,
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 600 }}>Oven</span>
        <span style={{ fontSize: 40, fontWeight: 800, color: C.greenDark }}>
          €12,000
        </span>
      </div>
    </div>
  );
};

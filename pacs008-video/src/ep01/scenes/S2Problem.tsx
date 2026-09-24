import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, EASE_IN_OUT, pop, prog, qbez, Pt } from "../anim";
import { C, mono, sans } from "../theme";
import { cue } from "../timing";
import { Amina } from "../art/People";
import { Phone } from "../art/Phone";
import { Bank, BuildingLabel } from "../art/Buildings";
import { ArrowRight, CurrencyExchange, NoEntry } from "../art/Icons";
import { Flag } from "../art/Flags";
import { MedMap, CASA_BANK, PARIS_BANK } from "../ui/MedMap";
import { StepChip } from "../ui/Text";

export const TAP = 8;
const ORDER_FLY = 14;
const FX = 38;
export const S2_MAP_IN = cue("s2", "can’t") - 14;
const ATTEMPT = cue("s2", "access");
export const S2_BARRIER = cue("s2", "directly");
const PARTNER = cue("s2", "partner") - 4;
const PARIS = cue("s2", "Paris");

/** Scene 2 · The problem: Casa Bank can't reach T2 directly, so it uses its partner Paris Bank. */
export const S2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const mapIn = prog(frame, S2_MAP_IN, 12);
  return (
    <AbsoluteFill>
      {mapIn < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - mapIn }}>
          <OrderToCasaBank frame={frame} />
        </AbsoluteFill>
      ) : null}
      {mapIn > 0 ? (
        <AbsoluteFill style={{ opacity: mapIn, scale: 1.08 - 0.08 * mapIn }}>
          <MedMap>
            <Highway frame={frame} />
            <AttemptLine frame={frame} />
            <PartnerLine frame={frame} />
            <div
              style={{
                position: "absolute",
                left: PARIS_BANK.x - 115,
                top: PARIS_BANK.y - 115,
                width: 230,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <PulseRing frame={frame} at={PARIS} />
              <Bank letter="B" country="FR" width={230} large />
              <BuildingLabel
                name="Paris Bank"
                sub="Agent B"
                color={C.ink}
                size={30}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: CASA_BANK.x - 85,
                top: CASA_BANK.y - 85,
                rotate: `${interpolate(frame, [PARTNER, PARTNER + 12], [0, -7], clamp)}deg`,
                transformOrigin: "50% 100%",
              }}
            >
              <Bank letter="A" country="MA" width={170} />
            </div>
            <div
              style={{
                position: "absolute",
                left: CASA_BANK.x + 95,
                top: CASA_BANK.y - 40,
              }}
            >
              <BuildingLabel
                name="Casa Bank"
                sub="Debtor Agent (A)"
                color={C.ink}
                size={30}
              />
            </div>
          </MedMap>
        </AbsoluteFill>
      ) : null}
      <StepChip n={1}>
        Amina <ArrowRight size={40} color={C.blue} /> Casa Bank{" "}
        <span style={{ color: C.inkMuted, fontWeight: 600 }}>
          (Debtor Agent)
        </span>
      </StepChip>
    </AbsoluteFill>
  );
};

const OrderToCasaBank: React.FC<{ frame: number }> = ({ frame }) => {
  const press = interpolate(frame, [TAP - 2, TAP, TAP + 5], [1, 0.9, 1], clamp);
  const t = prog(frame, ORDER_FLY, 22, EASE_IN_OUT);
  const p = qbez({ x: 420, y: 700 }, { x: 600, y: 380 }, { x: 840, y: 600 }, t);
  const fx = prog(frame, FX, 28, EASE_IN_OUT);
  const mad = Math.round(interpolate(fx, [0, 1], [0, 130800]) / 100) * 100;
  const eur = Math.round(interpolate(fx, [0, 1], [0, 12000]) / 10) * 10;
  return (
    <>
      <Amina width={250} style={{ position: "absolute", left: 60, top: 470 }} />
      <div
        style={{ position: "absolute", left: 300, top: 470, rotate: "6deg" }}
      >
        <Phone width={220}>
          <div
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              top: 90,
              textAlign: "center",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            €12,000
          </div>
          <div
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              top: 150,
              textAlign: "center",
              fontSize: 22,
              color: C.inkMuted,
            }}
          >
            to Lukas · Munich
          </div>
          <div
            style={{
              position: "absolute",
              left: 30,
              right: 30,
              top: 560,
              height: 90,
              borderRadius: 45,
              backgroundColor: C.blue,
              color: "white",
              fontSize: 38,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: press,
            }}
          >
            Pay
          </div>
        </Phone>
      </div>
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 440,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 280,
        }}
      >
        <Bank letter="A" country="MA" width={280} />
        <BuildingLabel name="Casa Bank" sub="Debtor Agent (A)" size={40} />
      </div>
      {frame >= ORDER_FLY && t < 1 ? (
        <div
          style={{
            position: "absolute",
            left: p.x - 80,
            top: p.y - 50,
            width: 160,
            padding: "12px 14px",
            borderRadius: 12,
            backgroundColor: "white",
            fontFamily: sans,
            color: C.ink,
            boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
            rotate: `${-8 + 16 * t}deg`,
            scale: 1 - 0.4 * t,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 2,
              color: C.inkMuted,
            }}
          >
            ORDER
          </div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Pay €12,000</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.inkMuted }}>
            to Lukas
          </div>
        </div>
      ) : null}
      {frame >= FX - 4 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 890,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "16px 30px",
              borderRadius: 40,
              backgroundColor: "white",
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 40,
              color: C.ink,
              scale: pop(frame, FX - 4, 10),
              boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
            }}
          >
            <CurrencyExchange size={52} style={{ rotate: `${fx * 360}deg` }} />
            <span>MAD {mad.toLocaleString("en-US")}</span>
            <ArrowRight size={44} color={C.green} />
            <span style={{ color: C.greenDark }}>
              EUR {eur.toLocaleString("en-US")}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
};

const ROAD_Y = 450;
const GATE_X = 650;

const Highway: React.FC<{ frame: number }> = ({ frame }) => {
  const drop = interpolate(
    frame,
    [S2_BARRIER, S2_BARRIER + 8, S2_BARRIER + 11, S2_BARRIER + 14],
    [-62, 3, -4, 0],
    clamp,
  );
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 470,
          top: ROAD_Y,
          width: 570,
          height: 72,
          backgroundColor: "#4A5566",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 33,
            height: 6,
            backgroundImage:
              "repeating-linear-gradient(90deg, white 0 34px, transparent 34px 60px)",
            backgroundPositionX: -frame * 3,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 690,
          top: 292,
          width: 330,
          padding: "10px 16px",
          borderRadius: 10,
          backgroundColor: "#0F7A43",
          border: "4px solid white",
          color: "white",
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 30,
          lineHeight: 1.1,
          boxShadow: "0 8px 18px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Flag country="EU" width={40} /> T2
        </div>
        <div style={{ fontSize: 24 }}>Euro Payment Highway</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: GATE_X - 12,
          top: ROAD_Y - 40,
          width: 24,
          height: 116,
          borderRadius: 6,
          backgroundColor: "#2A3342",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: GATE_X,
          top: ROAD_Y - 30,
          width: 210,
          height: 22,
          borderRadius: 11,
          transformOrigin: "0 50%",
          rotate: `${drop}deg`,
          backgroundImage: `repeating-linear-gradient(90deg, ${C.red} 0 30px, white 30px 60px)`,
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      />
      {frame >= S2_BARRIER + 6 ? (
        <div
          style={{
            position: "absolute",
            left: 610,
            top: ROAD_Y + 92,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 20px 10px 12px",
            borderRadius: 30,
            backgroundColor: "white",
            fontFamily: sans,
            fontWeight: 800,
            fontSize: 28,
            color: C.red,
            scale: pop(frame, S2_BARRIER + 6, 10),
            boxShadow: "0 8px 18px rgba(0,0,0,0.3)",
          }}
        >
          <NoEntry size={42} /> Direct participants only
        </div>
      ) : null}
    </>
  );
};

const pathPoints = (p0: Pt, p1: Pt, p2: Pt, upTo: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const q = qbez(p0, p1, p2, (i / 40) * upTo);
    pts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`);
  }
  return pts.join(" ");
};

/** Casa Bank tries to reach the highway directly and gets blocked. */
const AttemptLine: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < ATTEMPT) {
    return null;
  }
  const draw = prog(frame, ATTEMPT, S2_BARRIER - ATTEMPT + 4, EASE_IN_OUT);
  const blocked = frame >= S2_BARRIER + 4;
  const fade = interpolate(
    frame,
    [S2_BARRIER + 40, S2_BARRIER + 55],
    [1, 0.25],
    clamp,
  );
  const end = { x: GATE_X - 30, y: ROAD_Y + 50 };
  return (
    <>
      <svg
        width={1080}
        height={1350}
        style={{ position: "absolute", inset: 0, opacity: fade }}
      >
        <polyline
          points={pathPoints(
            { x: CASA_BANK.x + 40, y: CASA_BANK.y - 90 },
            { x: 600, y: 760 },
            end,
            draw,
          )}
          fill="none"
          stroke={blocked ? C.red : "white"}
          strokeWidth={6}
          strokeDasharray="4 14"
          strokeLinecap="round"
        />
      </svg>
      {blocked ? (
        <div
          style={{
            position: "absolute",
            left: end.x - 26,
            top: end.y - 26,
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: C.red,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: pop(frame, S2_BARRIER + 4, 10),
            opacity: fade,
          }}
        >
          <svg width={26} height={26} viewBox="0 0 26 26">
            <path
              d="M5 5 L21 21 M21 5 L5 21"
              stroke="white"
              strokeWidth={5}
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : null}
    </>
  );
};

/** Dotted "partner" line from Casa Bank to Paris Bank, across the sea. */
const PartnerLine: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < PARTNER) {
    return null;
  }
  const draw = prog(frame, PARTNER, 24, EASE_IN_OUT);
  return (
    <>
      <svg
        width={1080}
        height={1350}
        style={{ position: "absolute", inset: 0 }}
      >
        <polyline
          points={pathPoints(
            { x: CASA_BANK.x - 30, y: CASA_BANK.y - 90 },
            { x: 110, y: 720 },
            { x: PARIS_BANK.x - 40, y: PARIS_BANK.y + 150 },
            draw,
          )}
          fill="none"
          stroke={C.goldLight}
          strokeWidth={7}
          strokeDasharray="2 16"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 690,
          padding: "8px 20px",
          borderRadius: 24,
          backgroundColor: C.gold,
          color: C.ink,
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 30,
          scale: pop(frame, PARTNER + 16, 10),
          boxShadow: "0 8px 18px rgba(0,0,0,0.3)",
        }}
      >
        partner
      </div>
    </>
  );
};

const PulseRing: React.FC<{ frame: number; at: number }> = ({ frame, at }) => {
  if (frame < at) {
    return null;
  }
  const t = ((frame - at) % 30) / 30;
  return (
    <div
      style={{
        position: "absolute",
        left: 115 - 120,
        top: 115 - 120,
        width: 240,
        height: 240,
        borderRadius: 120,
        border: `6px solid ${C.gold}`,
        scale: 0.6 + 0.6 * t,
        opacity: 1 - t,
      }}
    />
  );
};

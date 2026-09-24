import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, EASE_IN_OUT, EASE_OUT, pop, prog, qbez } from "../anim";
import { C, mono, sans } from "../theme";
import { cue } from "../timing";
import { Bank, BuildingLabel } from "../art/Buildings";
import { Envelope, Receipt } from "../art/Envelope";
import { ArrowRight, Coin, Pin } from "../art/Icons";
import { Flag } from "../art/Flags";
import { PiggyBank } from "../art/Scenery";
import { CASA_BANK, MedMap, PARIS_BANK } from "../ui/MedMap";
import { StepChip, TopText } from "../ui/Text";

export const S4_FLY = cue("s4", "twist") - 6;
const FLY_LEN = 60;
const MONEY = cue("s4", "money") - 4;
const MESSAGE = cue("s4", "message");
export const S4_ZOOM = cue("s4", "already") - 10;
export const S4_DEBIT = cue("s4", "debits");
const RECEIPT = S4_DEBIT + 14;

const START = { x: CASA_BANK.x + 20, y: CASA_BANK.y - 110 };
const CONTROL = { x: 860, y: 760 };
const END = { x: PARIS_BANK.x + 60, y: PARIS_BANK.y + 60 };

/** Scene 4 · The twist: the message crosses the sea, the money stays. Paris Bank debits Casa Bank's euro account. */
export const S4Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = prog(frame, S4_ZOOM, 16, EASE_IN_OUT);
  const inside = prog(frame, S4_ZOOM + 8, 12);

  return (
    <AbsoluteFill>
      {zoom < 1 ? (
        <AbsoluteFill
          style={{
            scale: interpolate(zoom, [0, 1], [1, 3.2], {
              output: "perceptual-scale",
            }),
            transformOrigin: `${PARIS_BANK.x}px ${PARIS_BANK.y}px`,
            opacity: 1 - inside,
          }}
        >
          <MedMap>
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
            <Coins frame={frame} />
            <Flight frame={frame} />
          </MedMap>
        </AbsoluteFill>
      ) : null}
      <StepChip n={2} top={262} align="right" size={30} to={S4_ZOOM + 6}>
        pacs.008: Casa Bank <ArrowRight size={32} color={C.blue} /> Paris Bank
      </StepChip>
      {inside > 0 ? (
        <AbsoluteFill style={{ opacity: inside, scale: 0.92 + 0.08 * inside }}>
          <InsideParisBank frame={frame} />
        </AbsoluteFill>
      ) : null}
      <TopText from={MONEY} size={50} top={96}>
        <div>The money doesn’t cross the border.</div>
        <div style={{ color: "#8DB4FF", opacity: prog(frame, MESSAGE, 8) }}>
          The message does.
        </div>
      </TopText>
    </AbsoluteFill>
  );
};

/** The envelope crosses the Mediterranean with a glowing trail. */
const Flight: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < S4_FLY) {
    return null;
  }
  const t = prog(frame, S4_FLY, FLY_LEN, EASE_IN_OUT);
  const p = qbez(START, CONTROL, END, t);
  const trail: string[] = [];
  for (let i = 0; i <= 50; i++) {
    const q = qbez(START, CONTROL, END, (i / 50) * t);
    trail.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`);
  }
  const w = interpolate(t, [0, 0.5, 1], [150, 210, 170]);
  const landed = t >= 1;
  return (
    <>
      <svg
        width={1080}
        height={1350}
        style={{
          position: "absolute",
          inset: 0,
          filter: "drop-shadow(0 0 10px #8DB4FF)",
        }}
      >
        <polyline
          points={trail.join(" ")}
          fill="none"
          stroke="#BFD3FF"
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
        <polyline
          points={trail.join(" ")}
          fill="none"
          stroke="white"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: p.x - w / 2,
          top: p.y - (w * 280) / 440 / 2,
          rotate: `${landed ? 0 : interpolate(t, [0, 0.5, 1], [-10, 12, -4])}deg`,
          scale: pop(frame, S4_FLY, 10),
        }}
      >
        <Envelope width={w} from="A" to="B" compact />
      </div>
    </>
  );
};

/** Amina's money stays in Morocco. */
const Coins: React.FC<{ frame: number }> = ({ frame }) => {
  const hop = (i: number) =>
    interpolate(
      frame,
      [
        S4_FLY + i * 3,
        S4_FLY + 6 + i * 3,
        S4_FLY + 12 + i * 3,
        S4_FLY + 16 + i * 3,
      ],
      [0, -34, 0, -8],
      clamp,
    ) +
    interpolate(
      frame,
      [S4_FLY + 16 + i * 3, S4_FLY + 20 + i * 3],
      [-8, 0],
      clamp,
    );
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Coin
          key={i}
          size={56}
          style={{
            position: "absolute",
            left: 72 + i * 44,
            top: 920 + hop(i),
            zIndex: 3 - i,
          }}
        />
      ))}
      {frame >= S4_FLY + 18 ? (
        <>
          <Pin
            size={46}
            style={{
              position: "absolute",
              left: 116,
              top: 846,
              scale: pop(frame, S4_FLY + 18, 10),
              transformOrigin: "50% 100%",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 776,
              padding: "6px 16px",
              borderRadius: 20,
              backgroundColor: "white",
              color: C.ink,
              fontFamily: sans,
              fontWeight: 800,
              fontSize: 26,
              whiteSpace: "nowrap",
              scale: pop(frame, S4_FLY + 24, 10),
              transformOrigin: "0 100%",
              boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
            }}
          >
            Money stays in Morocco
          </div>
        </>
      ) : null}
    </>
  );
};

const InsideParisBank: React.FC<{ frame: number }> = ({ frame }) => {
  const debit = prog(frame, S4_DEBIT, 14, EASE_OUT);
  const balance = Math.round(interpolate(debit, [0, 1], [250000, 238000]));
  const receiptT = prog(frame, RECEIPT, 40, EASE_IN_OUT);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 250,
          width: 940,
          height: 830,
          borderRadius: 40,
          backgroundColor: "white",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "26px 36px",
            backgroundColor: "#FBF3DD",
          }}
        >
          <Bank letter="B" country="FR" width={96} large />
          <div
            style={{
              fontFamily: sans,
              fontWeight: 800,
              fontSize: 52,
              color: C.ink,
            }}
          >
            Paris Bank
          </div>
          <Flag country="FR" width={54} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 26px",
              borderRadius: 30,
              backgroundColor: C.gold,
              fontFamily: sans,
              fontWeight: 800,
              fontSize: 36,
              color: C.ink,
            }}
          >
            <Flag country="MA" width={44} /> Casa Bank’s euro account
          </div>
          <div style={{ position: "relative", marginTop: 34 }}>
            <PiggyBank width={360} />
            {frame >= S4_DEBIT
              ? [0, 1, 2].map((i) => {
                  const c = prog(frame, S4_DEBIT + i * 3, 22, EASE_OUT);
                  return (
                    <Coin
                      key={i}
                      size={54}
                      style={{
                        position: "absolute",
                        left: 152 + (i - 1) * 60 * c,
                        top: 40 - 170 * c,
                        opacity: 1 - c,
                      }}
                    />
                  );
                })
              : null}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 24,
              marginTop: 20,
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 68,
                color: C.ink,
              }}
            >
              €{balance.toLocaleString("en-US")}
            </div>
            {frame >= S4_DEBIT ? (
              <div
                style={{
                  fontFamily: sans,
                  fontWeight: 800,
                  fontSize: 52,
                  color: C.red,
                  scale: pop(frame, S4_DEBIT, 10),
                }}
              >
                −€12,000
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {frame >= RECEIPT ? (
        <div
          style={{
            position: "absolute",
            left: interpolate(receiptT, [0, 1], [860, 90]),
            top: interpolate(receiptT, [0, 1], [930, 950]),
            rotate: `${interpolate(receiptT, [0, 1], [8, -12])}deg`,
            opacity: interpolate(receiptT, [0, 0.1, 0.85, 1], [0, 1, 1, 0.6]),
          }}
        >
          <Receipt width={100} />
        </div>
      ) : null}
    </>
  );
};

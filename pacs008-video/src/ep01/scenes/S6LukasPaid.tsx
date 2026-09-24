import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, EASE_IN_OUT, EASE_OUT, pop, prog, qbez } from "../anim";
import { C, mono, sans } from "../theme";
import { cue } from "../timing";
import { Bank, BuildingLabel } from "../art/Buildings";
import { Envelope, Receipt } from "../art/Envelope";
import { ArrowRight, Check, Coin } from "../art/Icons";
import { Lukas } from "../art/People";
import { Phone } from "../art/Phone";
import { MunichSkyline } from "../art/Scenery";
import { StepChip } from "../ui/Text";

const FLY = 8;
const FLY_LEN = 38;
const RECEIPT = FLY + FLY_LEN;
const OPEN = FLY + FLY_LEN + 4;
export const S6_BUZZ = cue("s6", "paid") - 6;

/** Scene 6 · Frankfurt Bank → Munich Bank, and Lukas is paid. */
export const S6LukasPaid: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StepChip n={5} to={S6_BUZZ}>
        Frankfurt Bank <ArrowRight size={40} color={C.blue} /> Munich Bank
      </StepChip>
      <StepChip n={6} from={S6_BUZZ} color={C.green}>
        Lukas paid <Check size={40} color={C.green} />
      </StepChip>

      <div
        style={{
          position: "absolute",
          left: 50,
          top: 300,
          width: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Bank letter="C" country="DE" width={210} large />
        <BuildingLabel name="Frankfurt Bank" sub="Agent C" size={30} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 830,
          top: 330,
          width: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Bank letter="D" country="DE" width={180} />
        <BuildingLabel name="Munich Bank" sub="Creditor Agent (D)" size={30} />
      </div>

      <Message frame={frame} />
      {frame >= RECEIPT ? <ReceiptBack frame={frame} /> : null}

      <LukasPanel frame={frame} />
    </AbsoluteFill>
  );
};

const Message: React.FC<{ frame: number }> = ({ frame }) => {
  const t = prog(frame, FLY, FLY_LEN, EASE_IN_OUT);
  const p = qbez({ x: 270, y: 380 }, { x: 540, y: 200 }, { x: 640, y: 420 }, t);
  const open = prog(frame, OPEN, 10, EASE_IN_OUT);
  const letterOut = prog(frame, OPEN + 8, 16, EASE_IN_OUT);
  const w = interpolate(t, [0, 1], [170, 280]);
  return (
    <div
      style={{
        position: "absolute",
        left: p.x - w / 2,
        top: p.y - (w * 280) / 440 / 2 + 60 * letterOut,
        rotate: `${interpolate(t, [0, 0.5, 1], [-8, 8, 0])}deg`,
      }}
    >
      <Envelope
        width={w}
        from="C"
        to="D"
        compact
        open={open}
        letterOut={letterOut * 0.8}
      />
    </div>
  );
};

const ReceiptBack: React.FC<{ frame: number }> = ({ frame }) => {
  const t = prog(frame, RECEIPT + 10, 34, EASE_OUT);
  const p = qbez({ x: 880, y: 520 }, { x: 560, y: 660 }, { x: 200, y: 400 }, t);
  return (
    <div
      style={{
        position: "absolute",
        left: p.x - 45,
        top: p.y - 55,
        rotate: `${interpolate(t, [0, 1], [10, -8])}deg`,
        opacity: interpolate(t, [0, 0.1, 0.8, 1], [0, 1, 1, 0]),
      }}
    >
      <Receipt width={90} />
    </div>
  );
};

const LukasPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const buzz =
    frame >= S6_BUZZ && frame < S6_BUZZ + 16
      ? Math.sin((frame - S6_BUZZ) * 2.4) * 7
      : 0;
  const note = pop(frame, S6_BUZZ + 2, 12);
  const smile = frame >= S6_BUZZ + 8 ? 1 : 0;
  const hop = interpolate(
    frame,
    [S6_BUZZ + 8, S6_BUZZ + 14, S6_BUZZ + 22],
    [0, -16, 0],
    clamp,
  );
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 640,
          width: 980,
          height: 450,
          borderRadius: 36,
          overflow: "hidden",
          background:
            "linear-gradient(180deg, #EEF4FD 0%, #BFD5F5 60%, #7FA3E0 100%)",
          boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
        }}
      >
        <MunichSkyline
          width={980}
          style={{ position: "absolute", left: 0, top: 30, opacity: 0.45 }}
        />
      </div>
      <Lukas
        width={250}
        smile={smile}
        style={{ position: "absolute", left: 110, top: 760 + hop }}
      />
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 670,
          rotate: `${buzz}deg`,
          translate: `${buzz}px 0px`,
        }}
      >
        <Phone width={210}>
          {frame >= S6_BUZZ ? (
            <div
              style={{
                position: "absolute",
                left: 14,
                right: 14,
                top: 60,
                padding: 16,
                borderRadius: 20,
                backgroundColor: "white",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                fontSize: 28,
                fontWeight: 800,
                translate: `0px ${(1 - note) * -120}px`,
              }}
            >
              +€12,000
            </div>
          ) : null}
        </Phone>
      </div>
      {frame >= S6_BUZZ ? (
        <div
          style={{
            position: "absolute",
            left: 380,
            top: 700,
            width: 620,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "18px 24px",
            borderRadius: 26,
            backgroundColor: "white",
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            fontFamily: sans,
            color: C.ink,
            scale: note,
            transformOrigin: "80% 0%",
          }}
        >
          <Coin size={70} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 40, color: C.greenDark }}>
              +€12,000 from Amina
            </div>
            <div
              style={{
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 26,
                color: C.inkMuted,
              }}
            >
              INV-2026-114
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

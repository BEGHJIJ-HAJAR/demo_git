import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, EASE_IN_OUT, EASE_OUT, pop, prog } from "../anim";
import { C, mono, sans } from "../theme";
import { cue, sceneDuration } from "../timing";
import { Envelope } from "../art/Envelope";
import { Avatar } from "../art/People";
import { ArrowRight, Check, DocIcon, EnvelopeIcon } from "../art/Icons";
import { TopText } from "../ui/Text";

export const S3_STAMP = 6;
export const S3_OPEN = cue("s3", "Picture");
const LETTER_OUT = cue("s3", "letter") - 4;
export const S3_ARROW_FI = cue("s3", "envelope", 1);
export const S3_ARROW_CCT = cue("s3", "letter", 1);
const QUOTE_IN = cue("s3", "Amina");
const QUOTE_OUT = sceneDuration("s3") - 6;
export const S3_TAGS = cue("s3", "Customers");

const ENV_W = 600;
const K = ENV_W / 440;

/** Scene 3 · Meet pacs.008: the envelope (banks) and the letter (customers). */
export const S3MeetPacs008: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = pop(frame, 0, 14);
  const open = prog(frame, S3_OPEN, 12, EASE_IN_OUT);
  const lower = prog(frame, S3_OPEN, 18, EASE_IN_OUT);
  const letterOut = prog(frame, LETTER_OUT, 18, EASE_IN_OUT);
  const cy = interpolate(lower, [0, 1], [690, 860]);
  const envTop = cy - (ENV_W * 280) / 440 / 2;

  return (
    <AbsoluteFill>
      <TopText from={S3_ARROW_FI - 6} size={46} top={96}>
        <div>
          Banks on the envelope <EnvelopeIcon size={40} />
        </div>
        <div>
          Customers in the letter <DocIcon size={44} />
        </div>
      </TopText>

      <div
        style={{
          position: "absolute",
          left: 540 - ENV_W / 2,
          top: envTop,
          scale: enter,
        }}
      >
        <Envelope
          width={ENV_W}
          from="Casa Bank"
          to="Paris Bank"
          open={open}
          letterOut={letterOut}
          stamp={frame > S3_OPEN}
        />
      </div>

      <BigStamp frame={frame} top={envTop + 70} />

      {frame >= S3_ARROW_FI ? (
        <Callout
          frame={frame}
          at={S3_ARROW_FI}
          label="FI to FI"
          sub={
            <>
              bank <ArrowRight size={24} color={C.ink} /> bank
            </>
          }
          box={{ left: 40, top: 800, width: 230 }}
          from={{ x: 150, y: 905 }}
          to={{ x: 258, y: envTop + (280 - 42) * K }}
        />
      ) : null}
      {frame >= S3_ARROW_CCT ? (
        <Callout
          frame={frame}
          at={S3_ARROW_CCT}
          label={"Customer\nCredit\nTransfer"}
          sub={
            <>
              customer <ArrowRight size={24} color={C.ink} /> customer
            </>
          }
          box={{ left: 818, top: 330, width: 230 }}
          from={{ x: 870, y: 540 }}
          to={{ x: 790, y: 520 }}
        />
      ) : null}

      {frame >= S3_TAGS ? (
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 380,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <NotABank who="amina" name="Amina" delay={0} />
          <NotABank who="lukas" name="Lukas" delay={6} />
        </div>
      ) : null}

      {frame >= QUOTE_IN && frame <= QUOTE_OUT ? (
        <QuoteCard frame={frame} />
      ) : null}
    </AbsoluteFill>
  );
};

const BigStamp: React.FC<{ frame: number; top: number }> = ({ frame, top }) => {
  const s = interpolate(
    frame,
    [S3_STAMP, S3_STAMP + 5, S3_STAMP + 9],
    [2.2, 0.95, 1],
    { ...clamp, output: "perceptual-scale" },
  );
  const opacity = interpolate(
    frame,
    [S3_STAMP, S3_STAMP + 3, S3_OPEN - 4, S3_OPEN + 2],
    [0, 1, 1, 0],
    clamp,
  );
  if (opacity <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        display: "flex",
        justifyContent: "center",
        zIndex: 3,
      }}
    >
      <div
        style={{
          rotate: "-5deg",
          scale: s,
          opacity,
          padding: "14px 34px 18px",
          border: "8px solid white",
          borderRadius: 18,
          backgroundColor: "rgba(30, 79, 214, 0.92)",
          color: "white",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 1,
          }}
        >
          pacs.008
        </div>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 32,
            marginTop: 8,
          }}
        >
          FI to FI Customer Credit Transfer
        </div>
      </div>
    </div>
  );
};

const Callout: React.FC<{
  frame: number;
  at: number;
  label: string;
  sub: React.ReactNode;
  box: { left: number; top: number; width: number };
  from: { x: number; y: number };
  to: { x: number; y: number };
}> = ({ frame, at, label, sub, box, from, to }) => {
  const s = pop(frame, at, 12);
  const draw = prog(frame, at + 4, 12, EASE_OUT);
  const tip = {
    x: from.x + (to.x - from.x) * draw,
    y: from.y + (to.y - from.y) * draw,
  };
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  return (
    <>
      <svg
        width={1080}
        height={1350}
        style={{ position: "absolute", inset: 0, zIndex: 4 }}
      >
        <line
          x1={from.x}
          y1={from.y}
          x2={tip.x}
          y2={tip.y}
          stroke="#FFC94D"
          strokeWidth={8}
          strokeLinecap="round"
        />
        {draw > 0.9 ? (
          <polygon
            points={`0,-16 26,0 0,16`}
            fill="#FFC94D"
            transform={`translate(${to.x} ${to.y}) rotate(${(angle * 180) / Math.PI})`}
          />
        ) : null}
      </svg>
      <div
        style={{
          position: "absolute",
          ...box,
          scale: s,
          zIndex: 4,
          fontFamily: sans,
          color: C.ink,
          backgroundColor: "#FFC94D",
          borderRadius: 18,
          padding: "12px 16px",
          boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 36,
            lineHeight: 1.05,
            whiteSpace: "pre-line",
          }}
        >
          {label}
        </div>
        <div style={{ fontWeight: 600, fontSize: 22, marginTop: 6 }}>{sub}</div>
      </div>
    </>
  );
};

const NotABank: React.FC<{
  who: "amina" | "lukas";
  name: string;
  delay: number;
}> = ({ who, name, delay }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, S3_TAGS + delay, 12);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        scale: s,
        transformOrigin: "0 50%",
      }}
    >
      <Avatar who={who} size={72} />
      <div style={{ fontFamily: sans }}>
        <div style={{ fontWeight: 800, fontSize: 28, color: "white" }}>
          {name}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 12px 3px 8px",
            borderRadius: 16,
            backgroundColor: C.green,
            color: "white",
            fontWeight: 800,
            fontSize: 20,
            whiteSpace: "nowrap",
          }}
        >
          <Check size={22} /> not a bank
        </div>
      </div>
    </div>
  );
};

const QuoteCard: React.FC<{ frame: number }> = ({ frame }) => {
  const s = pop(frame, QUOTE_IN, 12);
  const out = interpolate(frame, [QUOTE_OUT - 8, QUOTE_OUT], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        right: 36,
        top: 880,
        width: 500,
        padding: "20px 26px",
        borderRadius: 20,
        backgroundColor: "white",
        borderLeft: `10px solid ${C.blue}`,
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        fontFamily: sans,
        color: C.ink,
        scale: s,
        opacity: out,
        transformOrigin: "100% 0",
        zIndex: 6,
      }}
    >
      <div style={{ fontSize: 27, fontWeight: 600, lineHeight: 1.3 }}>
        “Moves funds from a <b>Debtor</b> to a <b>Creditor</b>, where one or
        both are <b>non-financial institutions</b>.”
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: C.inkMuted,
          marginTop: 10,
        }}
      >
        ISO 20022 · pacs.008 definition
      </div>
    </div>
  );
};

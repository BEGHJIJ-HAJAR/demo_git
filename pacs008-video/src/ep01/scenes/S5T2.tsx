import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, EASE_IN_OUT, EASE_OUT, prog } from "../anim";
import { C, mono, sans } from "../theme";
import { cue } from "../timing";
import { Bank, BuildingLabel, T2Building } from "../art/Buildings";
import { Envelope, Receipt } from "../art/Envelope";
import { ArrowRight, Check, Coin } from "../art/Icons";
import { Flag } from "../art/Flags";
import { StepChip } from "../ui/Text";

const PACK = 4;
const CLOSE = 26;
const DRIVE = 38;
const DRIVE_LEN = 44;
const T2_PULSE = cue("s5", "T2");
const INSIDE = cue("s5", "where") - 4;
const COINS = cue("s5", "money");
export const S5_STAMP = cue("s5", "Frankfurt") + 4;
export const S5_RECEIPT = S5_STAMP + 8;
const RECEIPT_LEN = 30;

const ROAD_Y = 580;

/** Scene 5 · T2, formerly TARGET2: settlement in central bank money. */
export const S5T2: React.FC = () => {
  const frame = useCurrentFrame();
  const inside = prog(frame, INSIDE, 14);
  return (
    <AbsoluteFill>
      <StepChip n={3} to={S5_STAMP}>
        pacs.008: Paris Bank <ArrowRight size={40} color={C.blue} /> T2
      </StepChip>
      <StepChip n={4} from={S5_STAMP} color={C.green}>
        Settled <Check size={40} color={C.green} />
      </StepChip>

      {/* Road */}
      <div
        style={{
          position: "absolute",
          left: 250,
          top: ROAD_Y,
          width: 580,
          height: 60,
          backgroundColor: "#3A4556",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 27,
            height: 6,
            backgroundImage:
              "repeating-linear-gradient(90deg, white 0 30px, transparent 30px 56px)",
            backgroundPositionX: -frame * 3,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 50,
          top: 340,
          width: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Bank letter="B" country="FR" width={220} large />
        <BuildingLabel name="Paris Bank" size={30} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 770,
          top: 380,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            scale: interpolate(
              frame,
              [T2_PULSE, T2_PULSE + 5, T2_PULSE + 12],
              [1, 1.06, 1],
              clamp,
            ),
          }}
        >
          <T2Building width={270} />
        </div>
      </div>

      <Traveller frame={frame} />

      {inside > 0 ? <Inside frame={frame} inside={inside} /> : null}

      {frame >= S5_RECEIPT ? <SettlementReceipt frame={frame} /> : null}
    </AbsoluteFill>
  );
};

/** The same letter goes into a new envelope (Paris Bank → T2) and drives to T2. */
const Traveller: React.FC<{ frame: number }> = ({ frame }) => {
  const letterIn = prog(frame, PACK, 18, EASE_IN_OUT);
  const close = prog(frame, CLOSE, 10, EASE_IN_OUT);
  const drive = prog(frame, DRIVE, DRIVE_LEN, EASE_IN_OUT);
  if (drive >= 1) {
    return null;
  }
  const x = interpolate(drive, [0, 0.15, 1], [400, 380, 850]);
  const y = interpolate(drive, [0, 0.15, 1], [380, ROAD_Y - 40, ROAD_Y - 40]);
  const w = interpolate(drive, [0, 0.15, 1], [260, 170, 130]);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - (w * 280) / 440 / 2,
        opacity: interpolate(drive, [0.85, 1], [1, 0], clamp),
      }}
    >
      <Envelope
        width={w}
        from="B"
        to="T2"
        compact
        open={1 - close}
        letterOut={1 - letterIn}
      />
    </div>
  );
};

const Inside: React.FC<{ frame: number; inside: number }> = ({
  frame,
  inside,
}) => {
  const moved = [0, 1, 2, 3].map((i) =>
    prog(frame, COINS + i * 8, 22, EASE_IN_OUT),
  );
  const done = moved.reduce((a, b) => a + b, 0) / 4;
  const paris = Math.round(interpolate(done, [0, 1], [5000000, 4988000]));
  const frankfurt = Math.round(interpolate(done, [0, 1], [3000000, 3012000]));
  return (
    <>
      <svg
        width={1080}
        height={1350}
        style={{ position: "absolute", inset: 0, opacity: inside * 0.5 }}
      >
        <polygon
          points="790,650 1030,650 1020,700 60,700"
          fill={C.tealLight}
          opacity={0.35}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 700,
          width: 960,
          height: 390,
          borderRadius: 36,
          background: `linear-gradient(180deg, ${C.teal} 0%, ${C.tealDark} 100%)`,
          boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
          opacity: inside,
          scale: 0.94 + 0.06 * inside,
          fontFamily: sans,
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 24,
            fontSize: 30,
            fontWeight: 800,
            opacity: 0.9,
          }}
        >
          Inside T2 · central bank accounts
        </div>
        <AccountBox
          left={40}
          name="Paris Bank"
          letter="B"
          country="FR"
          amount={paris}
        />
        <AccountBox
          left={540}
          name="Frankfurt Bank"
          letter="C"
          country="DE"
          amount={frankfurt}
        />
        {moved.map((m, i) =>
          m > 0 && m < 1 ? (
            <Coin
              key={i}
              size={56}
              style={{
                position: "absolute",
                left: interpolate(m, [0, 1], [220, 720]),
                top: 190 - Math.sin(m * Math.PI) * 120,
              }}
            />
          ) : null,
        )}
        {frame >= S5_STAMP ? <SettledStamp frame={frame} /> : null}
      </div>
    </>
  );
};

const AccountBox: React.FC<{
  left: number;
  name: string;
  letter: string;
  country: "FR" | "DE";
  amount: number;
}> = ({ left, name, letter, country, amount }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: 90,
      width: 380,
      height: 260,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.1)",
      border: "3px solid rgba(255,255,255,0.35)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Bank letter={letter} country={country} width={70} large />
      <div style={{ fontSize: 32, fontWeight: 800 }}>{name}</div>
      <Flag country={country} width={36} />
    </div>
    <div
      style={{ fontFamily: mono, fontWeight: 700, fontSize: 40, marginTop: 8 }}
    >
      €{amount.toLocaleString("en-US")}
    </div>
  </div>
);

const SettledStamp: React.FC<{ frame: number }> = ({ frame }) => {
  const s = interpolate(
    frame,
    [S5_STAMP - 4, S5_STAMP, S5_STAMP + 4],
    [2.4, 0.94, 1],
    { ...clamp, output: "perceptual-scale" },
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: -64,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          rotate: "-8deg",
          scale: s,
          opacity: interpolate(
            frame,
            [S5_STAMP - 4, S5_STAMP - 2],
            [0, 1],
            clamp,
          ),
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 34px",
          border: `8px solid ${C.green}`,
          borderRadius: 18,
          backgroundColor: "white",
          color: C.greenDark,
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 76,
          letterSpacing: 4,
          boxShadow: "0 16px 36px rgba(0,0,0,0.4)",
        }}
      >
        SETTLED <Check size={70} color={C.green} />
      </div>
    </div>
  );
};

/** pacs.002 goes back from T2 to Paris Bank: "Settlement complete". */
const SettlementReceipt: React.FC<{ frame: number }> = ({ frame }) => {
  const t = prog(frame, S5_RECEIPT, RECEIPT_LEN, EASE_OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: interpolate(t, [0, 1], [860, 300]),
        top:
          interpolate(t, [0, 1], [ROAD_Y - 110, ROAD_Y - 150]) -
          Math.sin(t * Math.PI) * 40,
        rotate: `${interpolate(t, [0, 1], [10, -6])}deg`,
        zIndex: 6,
      }}
    >
      <Receipt width={100} bubble="Settlement complete" />
    </div>
  );
};

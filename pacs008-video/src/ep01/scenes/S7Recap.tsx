import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE_IN_OUT, EASE_OUT, pop, prog } from "../anim";
import { C, sans } from "../theme";
import { cue } from "../timing";
import { Bank, T2Building } from "../art/Buildings";
import { Envelope, UetrTag } from "../art/Envelope";
import { DocIcon, EnvelopeIcon, Waves } from "../art/Icons";
import { Avatar } from "../art/People";
import { BakeryCounter, Truck } from "../art/Scenery";
import { TopText } from "../ui/Text";

const FOUR = cue("s7", "Four");
const TRUCK = FOUR + 26;

type Node = { id: string; x: number; y: number; label: string };
const NODES: Node[] = [
  { id: "amina", x: 150, y: 380, label: "Casablanca" },
  { id: "A", x: 400, y: 380, label: "Casa Bank" },
  { id: "sea", x: 650, y: 380, label: "Mediterranean" },
  { id: "B", x: 910, y: 380, label: "Paris Bank" },
  { id: "T2", x: 910, y: 660, label: "T2" },
  { id: "C", x: 540, y: 660, label: "Frankfurt Bank" },
  { id: "D", x: 170, y: 660, label: "Munich Bank" },
  { id: "lukas", x: 170, y: 900, label: "Munich" },
];
const at = (id: string) => NODES.find((n) => n.id === id)!;

const EDGES: Array<[string, string]> = [
  ["amina", "A"],
  ["A", "sea"],
  ["sea", "B"],
  ["B", "T2"],
  ["T2", "C"],
  ["C", "D"],
  ["D", "lukas"],
];

const ENVELOPES: Array<{ from: string; to: string; x: number; y: number }> = [
  { from: "A", to: "B", x: 650, y: 262 },
  { from: "B", to: "T2", x: 910, y: 562 },
  { from: "T2", to: "C", x: 725, y: 660 },
  { from: "C", to: "D", x: 355, y: 660 },
];

/** Scene 7 · Recap: the whole chain, 4 envelopes, 1 letter. */
export const S7Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const pull = prog(frame, 0, 30, EASE_IN_OUT);
  return (
    <AbsoluteFill>
      <TopText from={0} size={44} top={96}>
        <span style={{ color: "#8DB4FF" }}>pacs.008</span> = a message between
        banks carrying a customer’s payment
      </TopText>
      <AbsoluteFill
        style={{
          scale: interpolate(pull, [0, 1], [1.35, 1], {
            output: "perceptual-scale",
          }),
          transformOrigin: "540px 640px",
        }}
      >
        <svg
          width={1080}
          height={1350}
          style={{ position: "absolute", inset: 0 }}
        >
          {EDGES.map(([a, b], i) => {
            const p = at(a);
            const q = at(b);
            const d = prog(frame, 8 + i * 4, 12, EASE_OUT);
            return (
              <line
                key={i}
                x1={p.x}
                y1={p.y}
                x2={p.x + (q.x - p.x) * d}
                y2={p.y + (q.y - p.y) * d}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth={6}
                strokeDasharray="4 12"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {NODES.map((n, i) => (
          <NodeView key={n.id} node={n} s={pop(frame, i * 4, 12)} />
        ))}
        {ENVELOPES.map((e, i) => {
          const s = pop(frame, 36 + i * 7, 12);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: e.x - 65,
                top: e.y - 40,
                scale: s,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Envelope
                width={130}
                from={e.from}
                to={e.to}
                compact
                open={1}
                letterOut={0.18}
              />
            </div>
          );
        })}
        {frame >= 60 ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 770,
              display: "flex",
              justifyContent: "center",
              opacity: prog(frame, 60, 10),
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 26,
                color: C.textMuted,
              }}
            >
              same letter in every envelope <UetrTag size={20} />
            </div>
          </div>
        ) : null}
        <Delivery frame={frame} />
      </AbsoluteFill>
      {frame >= FOUR ? <FourOne frame={frame} /> : null}
    </AbsoluteFill>
  );
};

const NodeView: React.FC<{ node: Node; s: number }> = ({ node, s }) => {
  const size = 130;
  let art: React.ReactNode;
  switch (node.id) {
    case "amina":
      art = <Avatar who="amina" size={104} />;
      break;
    case "lukas":
      art = <Avatar who="lukas" size={104} />;
      break;
    case "sea":
      art = (
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: C.sea,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Waves size={70} color="white" />
        </div>
      );
      break;
    case "T2":
      art = <T2Building width={150} sticker={false} />;
      break;
    default:
      art = (
        <Bank
          letter={node.id}
          country={node.id === "A" ? "MA" : node.id === "B" ? "FR" : "DE"}
          width={120}
          large={node.id === "B" || node.id === "C"}
        />
      );
  }
  return (
    <div
      style={{
        position: "absolute",
        left: node.x - size / 2,
        top: node.y - size / 2,
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale: s,
      }}
    >
      {art}
      <div
        style={{
          position: "absolute",
          top: size - 4,
          left: "50%",
          translate: "-50% 0",
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 24,
          color: "white",
          whiteSpace: "nowrap",
        }}
      >
        {node.label}
      </div>
    </div>
  );
};

/** Bonus beat: the oven is delivered to Amina's bakery. */
const Delivery: React.FC<{ frame: number }> = ({ frame }) => {
  const bakery = pop(frame, TRUCK - 10, 12);
  const t = prog(frame, TRUCK, 40, EASE_IN_OUT);
  return (
    <>
      {frame >= TRUCK - 10 ? (
        <div
          style={{
            position: "absolute",
            left: 800,
            top: 830,
            width: 230,
            scale: bakery,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar who="amina" size={70} style={{ marginBottom: -12 }} />
          <BakeryCounter width={200} />
          <div
            style={{
              fontFamily: sans,
              fontWeight: 800,
              fontSize: 22,
              color: "white",
              whiteSpace: "nowrap",
            }}
          >
            Amina’s bakery
          </div>
        </div>
      ) : null}
      {frame >= TRUCK ? (
        <div
          style={{
            position: "absolute",
            left: interpolate(t, [0, 1], [270, 610]),
            top: 860,
            translate: `0px ${Math.sin(frame / 2) * 1.5}px`,
          }}
        >
          <Truck width={190} />
        </div>
      ) : null}
    </>
  );
};

const FourOne: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 1030,
      display: "flex",
      justifyContent: "center",
      zIndex: 6,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 30px",
        borderRadius: 40,
        backgroundColor: "white",
        fontFamily: sans,
        fontWeight: 800,
        fontSize: 48,
        color: C.ink,
        scale: pop(frame, FOUR, 12),
        boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
      }}
    >
      <EnvelopeIcon size={40} /> 4 envelopes ·{" "}
      <span style={{ opacity: prog(frame, cue("s7", "one"), 8) }}>
        1 letter <DocIcon size={44} />
      </span>
    </div>
  </div>
);

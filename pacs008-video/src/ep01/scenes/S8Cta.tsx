import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { clamp, EASE_OUT, pop, prog } from "../anim";
import { C, mono, sans } from "../theme";
import { cue } from "../timing";
import { Envelope } from "../art/Envelope";
import { ReturnArrow } from "../art/Icons";
import type { EpisodeProps } from "../Episode01";

export const BOUNCE = 4;
const NEXT = cue("s8", "Next");
const FOLLOW = cue("s8", "Follow");

/** Scene 8 · Call to action and end card. */
export const S8Cta: React.FC<{ author?: EpisodeProps }> = ({ author }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [BOUNCE, BOUNCE + 16], [1300, 540], {
    ...clamp,
    easing: EASE_OUT,
  });
  const bounce = interpolate(
    frame,
    [BOUNCE + 12, BOUNCE + 18, BOUNCE + 24, BOUNCE + 30],
    [0, -40, 0, -10],
    clamp,
  );
  const settle = interpolate(
    frame,
    [BOUNCE + 30, BOUNCE + 34],
    [-10, 0],
    clamp,
  );
  return (
    <AbsoluteFill>
      <SeriesLogo s={pop(frame, 0, 14)} />

      <div
        style={{
          position: "absolute",
          left: x - 150,
          top: 400 + (frame < BOUNCE + 30 ? bounce : settle),
          rotate: `${interpolate(frame, [BOUNCE, BOUNCE + 16], [12, 0], clamp)}deg`,
        }}
      >
        <Envelope width={300} from="D" to="A" compact />
        <div
          style={{
            position: "absolute",
            left: -34,
            top: -30,
            width: 78,
            height: 78,
            borderRadius: 39,
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
            scale: pop(frame, BOUNCE + 14, 10),
          }}
        >
          <ReturnArrow size={50} color={C.blue} />
        </div>
      </div>

      {frame >= NEXT ? (
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 640,
            textAlign: "center",
            fontFamily: sans,
            color: "white",
            opacity: prog(frame, NEXT, 10),
            translate: `0px ${(1 - prog(frame, NEXT, 12)) * 20}px`,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 3,
              color: C.textMuted,
            }}
          >
            NEXT · EP.02
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 64,
              letterSpacing: -1.5,
              lineHeight: 1.1,
              marginTop: 6,
            }}
          >
            When the money comes back
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: 16,
              padding: "6px 22px",
              borderRadius: 14,
              border: `4px solid ${C.blueLight}`,
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 44,
              color: "white",
            }}
          >
            pacs.004
          </div>
        </div>
      ) : null}

      {frame >= FOLLOW - 10 ? (
        <AuthorCard frame={frame} author={author} />
      ) : null}
    </AbsoluteFill>
  );
};

const SeriesLogo: React.FC<{ s: number }> = ({ s }) => (
  <div
    style={{
      position: "absolute",
      top: 110,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      scale: s,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: 28,
          backgroundColor: C.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 30px rgba(47,107,255,0.45)",
        }}
      >
        <svg width={70} height={50} viewBox="0 0 56 40">
          <rect x={2} y={4} width={52} height={34} rx={5} fill="white" />
          <path
            d="M3 6 L28 24 L53 6"
            fill="none"
            stroke={C.blue}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{ fontFamily: sans, color: "white", lineHeight: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 64, letterSpacing: -1.5 }}>
          ISO 20022
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 40,
            color: "#FFC94D",
            marginTop: 6,
          }}
        >
          in Real Life
        </div>
      </div>
    </div>
  </div>
);

const AuthorCard: React.FC<{ frame: number; author?: EpisodeProps }> = ({
  frame,
  author,
}) => {
  const s = pop(frame, FOLLOW - 10, 12);
  const name = author?.authorName ?? "Your Name";
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 890,
        display: "flex",
        justifyContent: "center",
        scale: s,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "16px 20px 16px 16px",
          borderRadius: 60,
          backgroundColor: "white",
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          fontFamily: sans,
          color: C.ink,
        }}
      >
        {author?.authorPhoto ? (
          <Img
            src={staticFile(author.authorPhoto)}
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: C.blue,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 38,
            }}
          >
            {initials}
          </div>
        )}
        <div>
          <div style={{ fontWeight: 800, fontSize: 38 }}>{name}</div>
          <div style={{ fontWeight: 600, fontSize: 24, color: C.inkMuted }}>
            {author?.authorRole}
          </div>
        </div>
        <div
          style={{
            marginLeft: 10,
            padding: "16px 30px",
            borderRadius: 40,
            backgroundColor: C.blue,
            color: "white",
            fontWeight: 800,
            fontSize: 34,
            whiteSpace: "nowrap",
            scale: interpolate(
              frame,
              [FOLLOW, FOLLOW + 6, FOLLOW + 12],
              [1, 1.08, 1],
              clamp,
            ),
          }}
        >
          + Follow for the series
        </div>
      </div>
    </div>
  );
};

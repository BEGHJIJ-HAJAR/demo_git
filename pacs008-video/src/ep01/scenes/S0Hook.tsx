import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, EASE_IN, EASE_IN_OUT, EASE_OUT, pop, prog } from "../anim";
import { C, sans } from "../theme";
import { cue } from "../timing";
import { Phone, Thumb } from "../art/Phone";
import { Bank, T2Building } from "../art/Buildings";
import { Envelope } from "../art/Envelope";
import { ArrowDown, Check } from "../art/Icons";

export const PRESS = cue("s0", "Send");
export const SENT = PRESS + 5;
export const ZOOM = cue("s0", "trip") - 4;
const ZOOM_LEN = 14;

const PHONE_W = 440;
const PHONE_LEFT = 540 - PHONE_W / 2;
const PHONE_TOP = 450;
const K = PHONE_W / 380;
// Screen-local points (inside the 380×780 phone) mapped to the canvas.
const toCanvas = (x: number, y: number) => ({
  x: PHONE_LEFT + (14 + x) * K,
  y: PHONE_TOP + (14 + y) * K,
});
const BUTTON = { x: 26, y: 430, w: 300, h: 84 };
const BUTTON_CENTER = toCanvas(
  BUTTON.x + BUTTON.w / 2,
  BUTTON.y + BUTTON.h / 2,
);
const CHECK_CENTER = toCanvas(176, 250);
const VP = { x: 540, y: 800 };

/** Scene 0 · Hook: tap Send, "Payment sent", dive into the tunnel of banks. Also the thumbnail frame. */
export const S0Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = prog(frame, ZOOM, ZOOM_LEN, EASE_IN_OUT);
  const tunnel = interpolate(frame, [ZOOM + 6, ZOOM + ZOOM_LEN], [0, 1], clamp);

  return (
    <AbsoluteFill>
      {tunnel > 0 ? <Tunnel opacity={tunnel} /> : null}
      {zoom < 1 ? (
        <div
          style={{
            position: "absolute",
            left: PHONE_LEFT,
            top: PHONE_TOP,
            transformOrigin: `${CHECK_CENTER.x - PHONE_LEFT}px ${CHECK_CENTER.y - PHONE_TOP}px`,
            scale: interpolate(zoom, [0, 1], [1, 9], {
              output: "perceptual-scale",
            }),
            translate: `${(VP.x - CHECK_CENTER.x) * zoom}px ${(VP.y - CHECK_CENTER.y) * zoom}px`,
            opacity: interpolate(zoom, [0.6, 1], [1, 0], clamp),
          }}
        >
          <Phone width={PHONE_W}>
            {frame < SENT ? (
              <SendScreen frame={frame} />
            ) : (
              <SentScreen frame={frame - SENT} />
            )}
          </Phone>
        </div>
      ) : null}
      {frame < PRESS + 24 ? <TapThumb frame={frame} /> : null}
      {zoom > 0.75 ? <FallingEnvelope frame={frame} /> : null}
      <Headline />
    </AbsoluteFill>
  );
};

const SendScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const press = interpolate(
    frame,
    [PRESS - 2, PRESS, PRESS + 5],
    [1, 0.93, 1],
    clamp,
  );
  const ripple = prog(frame, PRESS, 14);
  return (
    <div style={{ position: "absolute", inset: 0, padding: "70px 26px 0" }}>
      <div style={{ fontSize: 30, fontWeight: 800 }}>Send money</div>
      <div
        style={{
          marginTop: 24,
          padding: 20,
          borderRadius: 22,
          backgroundColor: "white",
          boxShadow: "0 4px 14px rgba(13,27,42,0.06)",
        }}
      >
        <div style={{ fontSize: 15, color: C.inkMuted }}>To</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Lukas · Munich</div>
        <div style={{ fontSize: 16, color: C.inkMuted }}>
          Invoice INV-2026-114
        </div>
      </div>
      <div
        style={{
          marginTop: 50,
          textAlign: "center",
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: -1.5,
        }}
      >
        €12,000
      </div>
      <div
        style={{
          position: "absolute",
          left: BUTTON.x,
          top: BUTTON.y,
          width: BUTTON.w,
          height: BUTTON.h,
          borderRadius: 42,
          backgroundColor: C.blue,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
          fontWeight: 800,
          scale: press,
          overflow: "hidden",
          boxShadow: "0 12px 24px rgba(47,107,255,0.35)",
        }}
      >
        Send €12,000
        {frame >= PRESS ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 360,
              height: 360,
              marginLeft: -180,
              marginTop: -180,
              borderRadius: 180,
              backgroundColor: "white",
              scale: 0.05 + 0.95 * ripple,
              opacity: 0.45 * (1 - ripple),
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

const SentScreen: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 170,
    }}
  >
    <div
      style={{
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: C.green,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale: pop(frame, 0, 12),
      }}
    >
      <Check size={100} />
    </div>
    <div
      style={{
        marginTop: 30,
        fontSize: 36,
        fontWeight: 800,
        opacity: prog(frame, 3, 8),
      }}
    >
      Payment sent
    </div>
    <div
      style={{
        marginTop: 8,
        fontSize: 20,
        color: C.inkMuted,
        opacity: prog(frame, 6, 8),
      }}
    >
      €12,000 to Lukas
    </div>
  </div>
);

const TapThumb: React.FC<{ frame: number }> = ({ frame }) => {
  const B = BUTTON_CENTER;
  const kf = [0, PRESS - 2, PRESS + 5, PRESS + 22];
  const easing = [EASE_OUT, (t: number) => t, EASE_IN];
  const x = interpolate(frame, kf, [B.x + 200, B.x + 16, B.x + 16, B.x + 280], {
    ...clamp,
    easing,
  });
  const y = interpolate(frame, kf, [B.y + 230, B.y + 6, B.y + 6, B.y + 380], {
    ...clamp,
    easing,
  });
  return (
    <Thumb
      style={{
        left: x - 60,
        top: y - 30,
        scale: interpolate(
          frame,
          [PRESS - 2, PRESS, PRESS + 5],
          [1, 0.94, 1],
          clamp,
        ),
      }}
    />
  );
};

/** The ✓ becomes a blue envelope that falls into the tunnel. */
const FallingEnvelope: React.FC<{ frame: number }> = ({ frame }) => {
  const appear = pop(frame, ZOOM + 10, 10);
  const fall = interpolate(frame, [ZOOM + 16, 210], [0, 1], {
    ...clamp,
    easing: EASE_IN,
  });
  const w = 420 * appear * (1 - 0.72 * fall);
  return (
    <div
      style={{
        position: "absolute",
        left: VP.x - w / 2,
        top: VP.y - (w * 280) / 440 / 2 + 40 * fall,
        rotate: `${Math.sin(frame / 6) * 8 * fall}deg`,
        zIndex: 3,
      }}
    >
      <Envelope width={w} compact />
    </div>
  );
};

/** Rings rushing toward the camera, lined with bank buildings. */
const Tunnel: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const N = 7;
  const phase = Math.max(0, frame - ZOOM) * 0.012;
  const rings = Array.from({ length: N }, (_, i) => ({
    i,
    d: (i / N + phase) % 1,
  })).sort((a, b) => a.d - b.d);
  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `radial-gradient(circle at ${VP.x}px ${VP.y}px, #1B3B63 0%, ${C.bg} 60%)`,
      }}
    >
      {rings.map(({ i, d }) => {
        const s = 0.06 + 2.4 * Math.pow(d, 2.2);
        const alpha =
          Math.min(1, d * 4) * (1 - interpolate(d, [0.8, 1], [0, 1], clamp));
        const w = 820 * s;
        const h = 980 * s;
        const bankW = 190 * s;
        return (
          <div
            key={i}
            style={{ position: "absolute", inset: 0, opacity: alpha }}
          >
            <div
              style={{
                position: "absolute",
                left: VP.x - w / 2,
                top: VP.y - h / 2,
                width: w,
                height: h,
                borderRadius: 60 * s,
                border: `${Math.max(1, 6 * s)}px solid ${C.blueLight}`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: VP.x - w / 2 + 10 * s,
                top: VP.y + h / 2 - bankW - 20 * s,
              }}
            >
              {i % 3 === 2 ? (
                <T2Building width={bankW * 1.2} sticker={false} />
              ) : (
                <Bank
                  letter={"ABCD"[i % 4]}
                  country={i % 2 ? "DE" : "FR"}
                  width={bankW}
                />
              )}
            </div>
            <div
              style={{
                position: "absolute",
                left: VP.x + w / 2 - bankW - 10 * s,
                top: VP.y + h / 2 - bankW - 20 * s,
              }}
            >
              <Bank
                letter={"DCBA"[i % 4]}
                country={i % 2 ? "MA" : "DE"}
                width={bankW}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Headline: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 440,
      zIndex: 5,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${C.bg} 70%, rgba(13,27,42,0))`,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 96,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          padding: "8px 22px",
          borderRadius: 30,
          border: "2px solid rgba(255,255,255,0.35)",
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 1,
          color: C.textMuted,
        }}
      >
        ISO 20022 in Real Life · Ep.01 · pacs.008
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: 160,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: sans,
        fontWeight: 800,
        fontSize: 84,
        lineHeight: 1.02,
        letterSpacing: -2.5,
        color: "white",
      }}
    >
      Your money passed through{" "}
      <span style={{ color: "#FFC94D" }}>5 hands.</span>
      <div
        style={{
          fontSize: 58,
          marginTop: 14,
          color: C.blueLight,
          letterSpacing: -1,
        }}
      >
        Here’s the route <ArrowDown size={52} color={C.blueLight} />
      </div>
    </div>
  </div>
);

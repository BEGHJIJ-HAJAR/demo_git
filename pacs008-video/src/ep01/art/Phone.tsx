import React from "react";
import { C, sans } from "../theme";

/** Phone frame. Native 380×780, scaled to `width`; children render inside the screen (352×752). */
export const Phone: React.FC<{
  width?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width = 380, children, style }) => (
  <div
    style={{
      width,
      height: (width * 780) / 380,
      position: "relative",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 380,
        height: 780,
        scale: width / 380,
        transformOrigin: "0 0",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 56,
          backgroundColor: "#05080E",
          boxShadow: "0 40px 80px rgba(0,0,0,0.45), inset 0 0 0 2px #2A3342",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 14,
          borderRadius: 44,
          overflow: "hidden",
          backgroundColor: "#F5F7FB",
          fontFamily: sans,
          color: C.ink,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 32,
            fontSize: 17,
            fontWeight: 600,
          }}
        >
          9:41
        </div>
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 32,
            display: "flex",
            alignItems: "flex-end",
            gap: 3,
          }}
        >
          {[8, 11, 14, 17].map((h) => (
            <span
              key={h}
              style={{
                width: 4,
                height: h,
                borderRadius: 1,
                backgroundColor: C.ink,
              }}
            />
          ))}
        </div>
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          top: 24,
          left: "50%",
          translate: "-50% 0",
          width: 110,
          height: 30,
          borderRadius: 15,
          backgroundColor: "#05080E",
        }}
      />
    </div>
  </div>
);

/** Stylised thumb; the tip is at (60, 30) inside its 120×260 box. */
export const Thumb: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      position: "absolute",
      width: 120,
      height: 260,
      rotate: "-24deg",
      transformOrigin: "60px 30px",
      borderRadius: "60px 60px 50px 50px",
      background:
        "linear-gradient(180deg, #D9A07A 0%, #C68A5E 70%, #B87A50 100%)",
      boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 22,
        top: 14,
        width: 76,
        height: 78,
        borderRadius: "38px 38px 26px 26px",
        background: "linear-gradient(180deg, #F3D6C4 0%, #E6BFA8 100%)",
        opacity: 0.9,
      }}
    />
  </div>
);

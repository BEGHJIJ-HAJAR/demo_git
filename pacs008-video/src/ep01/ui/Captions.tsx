import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { TikTokPage } from "@remotion/captions";
import { VOICEOVER } from "../timing";
import { C, sans } from "../theme";

// Pages break at punctuation (pageBreakAfter); this caps long phrases.
const MAX_PAGE_MS = 1800;
const LINGER_MS = 350;

/** Burned-in captions for the whole episode, spoken word highlighted. */
export const Captions: React.FC = () => {
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: VOICEOVER,
        combineTokensWithinMilliseconds: MAX_PAGE_MS,
      }),
    [],
  );

  return (
    <AbsoluteFill style={{ zIndex: 20 }}>
      {pages.map((page, index) => {
        const next = pages[index + 1] ?? null;
        const last = page.tokens[page.tokens.length - 1];
        const endMs = Math.min(
          next ? next.startMs : Infinity,
          last.toMs + LINGER_MS,
        );
        const from = Math.round((page.startMs / 1000) * fps);
        const duration = Math.round((endMs / 1000) * fps) - from;
        if (duration <= 0) {
          return null;
        }
        return (
          <Sequence
            key={page.startMs}
            name={`Caption: ${page.text.trim()}`}
            from={from}
            durationInFrames={duration}
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = page.startMs + (frame / fps) * 1000;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 104,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          textAlign: "center",
          fontFamily: sans,
          fontSize: 50,
          fontWeight: 800,
          lineHeight: 1.2,
          whiteSpace: "pre-wrap",
          padding: "10px 28px 14px",
          borderRadius: 22,
          backgroundColor: "rgba(5, 12, 22, 0.88)",
          color: C.white,
        }}
      >
        {page.tokens.map((token, i) => {
          const active = token.fromMs <= now && token.toMs > now;
          return (
            <span
              key={`${token.fromMs}-${i}`}
              style={{ color: active ? "#FFC94D" : C.white }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

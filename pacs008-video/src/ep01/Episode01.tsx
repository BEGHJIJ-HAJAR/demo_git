import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { z } from "zod";
import { C } from "./theme";
import { SceneId, SCENES, sceneDuration, sceneFrom } from "./timing";
import { SceneFrame } from "./ui/SceneFrame";
import { Captions } from "./ui/Captions";
import { Soundtrack } from "./Soundtrack";
import { S0Hook } from "./scenes/S0Hook";
import { S1MeetAminaLukas } from "./scenes/S1MeetAminaLukas";
import { S2Problem } from "./scenes/S2Problem";
import { S3MeetPacs008 } from "./scenes/S3MeetPacs008";
import { S4Twist } from "./scenes/S4Twist";
import { S5T2 } from "./scenes/S5T2";
import { S6LukasPaid } from "./scenes/S6LukasPaid";
import { S7Recap } from "./scenes/S7Recap";
import { S8Cta } from "./scenes/S8Cta";

export const episodeSchema = z.object({
  /** Path inside public/ (e.g. "voiceover/ep01.mp3") or a URL. Leave empty until recorded. */
  voiceover: z.string(),
  captions: z.boolean(),
  authorName: z.string(),
  authorRole: z.string(),
  /** Optional headshot inside public/ (e.g. "author.jpg"). */
  authorPhoto: z.string(),
});

export type EpisodeProps = z.infer<typeof episodeSchema>;

export const defaultEpisodeProps: EpisodeProps = {
  voiceover: "voiceover/ep01.mp3",
  captions: true,
  authorName: "Your Name",
  authorRole: "Payments & ISO 20022",
  authorPhoto: "",
};

type SceneComponent = React.FC<{ author?: EpisodeProps }>;

export const SCENE_COMPONENTS: Record<SceneId, SceneComponent> = {
  s0: S0Hook,
  s1: S1MeetAminaLukas,
  s2: S2Problem,
  s3: S3MeetPacs008,
  s4: S4Twist,
  s5: S5T2,
  s6: S6LukasPaid,
  s7: S7Recap,
  s8: S8Cta,
};

/** The recording is fairly quiet; lift it slightly above the music and effects. */
const VOICEOVER_GAIN = 1.4;

export const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 80% at 50% 45%, ${C.bgGlow} 0%, ${C.bg} 70%)`,
    }}
  />
);

/** ISO 20022 in Real Life · Episode 01: pacs.008 (≈1:25). */
export const Episode01: React.FC<EpisodeProps> = (props) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Background />
    {(Object.keys(SCENES) as SceneId[]).map((id) => {
      const Scene = SCENE_COMPONENTS[id];
      const duration = sceneDuration(id);
      return (
        <Sequence
          key={id}
          name={SCENES[id].name}
          from={sceneFrom(id)}
          durationInFrames={duration}
          premountFor={30}
        >
          <SceneFrame
            durationInFrames={duration}
            fadeIn={id === "s0" ? 0 : 6}
            fadeOut={id === "s8" ? 0 : 6}
          >
            <Scene author={props} />
          </SceneFrame>
        </Sequence>
      );
    })}
    {props.captions ? <Captions /> : null}
    <Soundtrack />
    {props.voiceover ? (
      <Audio
        src={
          props.voiceover.startsWith("http")
            ? props.voiceover
            : staticFile(props.voiceover)
        }
        volume={() => VOICEOVER_GAIN}
      />
    ) : null}
  </AbsoluteFill>
);

/** A single scene on the shared background, for previewing scenes on their own in Studio. */
export const makeScenePreview = (id: SceneId): React.FC => {
  const Scene = SCENE_COMPONENTS[id];
  const Preview: React.FC = () => (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Background />
      <Scene author={defaultEpisodeProps} />
    </AbsoluteFill>
  );
  return Preview;
};

export const SCENE_PREVIEWS = Object.fromEntries(
  (Object.keys(SCENES) as SceneId[]).map((id) => [id, makeScenePreview(id)]),
) as Record<SceneId, React.FC>;

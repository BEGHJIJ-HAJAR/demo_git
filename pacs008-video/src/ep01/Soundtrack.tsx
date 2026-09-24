import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile } from "remotion";
import { FPS, SceneId, sceneFrom, TOTAL_FRAMES, VOICEOVER } from "./timing";
import { PRESS, SENT, ZOOM } from "./scenes/S0Hook";
import { CREDITOR, DEBTOR, INVOICE } from "./scenes/S1MeetAminaLukas";
import { S2_BARRIER, TAP } from "./scenes/S2Problem";
import {
  S3_ARROW_CCT,
  S3_ARROW_FI,
  S3_OPEN,
  S3_STAMP,
} from "./scenes/S3MeetPacs008";
import { S4_DEBIT, S4_FLY } from "./scenes/S4Twist";
import { S5_RECEIPT, S5_STAMP } from "./scenes/S5T2";
import { S6_BUZZ } from "./scenes/S6LukasPaid";
import { BOUNCE } from "./scenes/S8Cta";

type Cue = {
  scene: SceneId;
  at: number;
  file: string;
  volume: number;
  name: string;
};

/** Every sound effect, placed on the beat it belongs to (scene-local frames). */
const SFX: Cue[] = [
  { scene: "s0", at: PRESS, file: "click.wav", volume: 0.8, name: "Tap" },
  {
    scene: "s0",
    at: SENT,
    file: "pop.wav",
    volume: 0.45,
    name: "Payment sent",
  },
  {
    scene: "s0",
    at: ZOOM,
    file: "whoosh.wav",
    volume: 0.35,
    name: "Whoosh into the tunnel",
  },
  {
    scene: "s1",
    at: INVOICE,
    file: "swoosh.wav",
    volume: 0.6,
    name: "Invoice paper swoosh",
  },
  {
    scene: "s1",
    at: DEBTOR,
    file: "pop.wav",
    volume: 0.5,
    name: "Debtor label",
  },
  {
    scene: "s1",
    at: CREDITOR,
    file: "pop.wav",
    volume: 0.5,
    name: "Creditor label",
  },
  { scene: "s2", at: TAP, file: "click.wav", volume: 0.6, name: "Amina taps" },
  {
    scene: "s2",
    at: S2_BARRIER,
    file: "clack.wav",
    volume: 0.7,
    name: "Barrier clack",
  },
  {
    scene: "s3",
    at: S3_STAMP,
    file: "pop.wav",
    volume: 0.5,
    name: "pacs.008 stamp (no thud)",
  },
  {
    scene: "s3",
    at: S3_OPEN,
    file: "paper.wav",
    volume: 0.6,
    name: "Envelope opens",
  },
  {
    scene: "s3",
    at: S3_ARROW_FI,
    file: "pop.wav",
    volume: 0.5,
    name: "FI to FI arrow",
  },
  {
    scene: "s3",
    at: S3_ARROW_CCT,
    file: "pop.wav",
    volume: 0.5,
    name: "Customer Credit Transfer arrow",
  },
  {
    scene: "s4",
    at: S4_FLY,
    file: "whoosh.wav",
    volume: 0.3,
    name: "Envelope crosses the sea",
  },
  {
    scene: "s4",
    at: S4_DEBIT,
    file: "clink.wav",
    volume: 0.6,
    name: "Debit clink",
  },
  {
    scene: "s5",
    at: S5_STAMP - 1,
    file: "thunk.wav",
    volume: 0.6,
    name: "SETTLED stamp thunk",
  },
  {
    scene: "s5",
    at: S5_RECEIPT + 8,
    file: "ding.wav",
    volume: 0.3,
    name: "Settlement complete ding",
  },
  {
    scene: "s6",
    at: S6_BUZZ,
    file: "notify.wav",
    volume: 0.35,
    name: "Phone notification",
  },
  {
    scene: "s8",
    at: BOUNCE,
    file: "whoosh.wav",
    volume: 0.45,
    name: "Envelope bounces back",
  },
];

// Ducking: while a word is being spoken, sound effects drop by DUCK so they never
// cover the voice. Effects that land in pauses play at full volume.
const DUCK = 0.1; // -20 dB
const DUCK_PAD_MS = 60;
const speaking = (frame: number) => {
  const ms = (frame / FPS) * 1000;
  return VOICEOVER.some(
    (w) => ms >= w.startMs - DUCK_PAD_MS && ms <= w.endMs + DUCK_PAD_MS,
  );
};
const duck = (frame: number) => {
  // Soften the edges over ±2 frames so the gain change isn't a click.
  let sum = 0;
  for (let d = -2; d <= 2; d++) sum += speaking(frame + d) ? DUCK : 1;
  return sum / 5;
};

/** Music bed under the voiceover plus all sound effects. */
export const Soundtrack: React.FC = () => (
  <>
    <Sequence name="Music bed" layout="none">
      <Audio
        src={staticFile("audio/music.wav")}
        loop
        loopVolumeCurveBehavior="extend"
        volume={(f) =>
          interpolate(
            f,
            [0, 10, TOTAL_FRAMES - 45, TOTAL_FRAMES],
            [0.04, 0.05, 0.05, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
    </Sequence>
    {SFX.map((s) => (
      <Sequence
        key={s.name}
        name={s.name}
        from={sceneFrom(s.scene) + s.at}
        layout="none"
      >
        <Audio
          src={staticFile(`audio/${s.file}`)}
          volume={(f) => s.volume * duck(sceneFrom(s.scene) + s.at + f)}
        />
      </Sequence>
    ))}
  </>
);

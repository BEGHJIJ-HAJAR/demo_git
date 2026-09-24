import type { Caption } from "@remotion/captions";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1350;

/** Storyboard scene windows, in seconds. */
export const SCENES = {
  s0: { start: 0, end: 7, name: "Scene 0 · Hook" },
  s1: { start: 7, end: 21, name: "Scene 1 · Meet Amina and Lukas" },
  s2: { start: 21, end: 32, name: "Scene 2 · The problem" },
  s3: { start: 32, end: 47, name: "Scene 3 · Meet pacs.008" },
  s4: { start: 47, end: 59, name: "Scene 4 · The twist" },
  s5: { start: 59, end: 67, name: "Scene 5 · T2" },
  s6: { start: 67, end: 73, name: "Scene 6 · Lukas gets paid" },
  s7: { start: 73, end: 80, name: "Scene 7 · Recap" },
  s8: { start: 80, end: 85, name: "Scene 8 · Call to action" },
} as const;

export type SceneId = keyof typeof SCENES;

export const sceneFrom = (id: SceneId) => Math.round(SCENES[id].start * FPS);
export const sceneDuration = (id: SceneId) =>
  Math.round((SCENES[id].end - SCENES[id].start) * FPS);
export const TOTAL_FRAMES = Math.round(SCENES.s8.end * FPS);

/**
 * Voiceover script, one entry per sentence: [start s, end s, text].
 *
 * The voiceover is not recorded yet, so sentence times are estimates that
 * respect the storyboard. Word times are spread across each sentence by word
 * length. When the real recording exists, adjust the sentence start/end times
 * (or replace VOICEOVER with a Whisper transcription): the captions and every
 * animation beat keyed with cue() follow automatically.
 */
const SCRIPT: Record<SceneId, Array<[number, number, string]>> = {
  s0: [
    [0.35, 1.5, "You tap “Send”…"],
    [
      1.8,
      5.0,
      "and your money goes on a trip through four banks and a central bank.",
    ],
    [5.3, 6.5, "Let’s follow it."],
  ],
  s1: [
    [7.4, 8.3, "Meet Amina."],
    [
      8.6,
      14.0,
      "She runs a bakery in Casablanca, and she just bought a new oven from Lukas in Munich.",
    ],
    [14.3, 15.6, "Twelve thousand euros."],
    [
      16.0,
      20.6,
      "In ISO 20022, Amina is the Debtor, and Lukas is the Creditor.",
    ],
  ],
  s2: [
    [21.4, 23.6, "Her bank, Casa Bank, is in Morocco."],
    [24.0, 27.6, "It can’t access Europe’s euro payment system directly,"],
    [
      27.8,
      31.6,
      "so it sends the payment to its partner in Europe, Paris Bank…",
    ],
  ],
  s3: [
    [32.2, 35.3, "…using a pacs.008: an FI to FI Customer Credit Transfer."],
    [35.7, 37.8, "Picture an envelope with a letter inside."],
    [38.3, 40.3, "The envelope travels between banks."],
    [40.7, 43.6, "The letter is the customer’s payment: Amina pays Lukas."],
    [44.2, 45.9, "Customers, not banks."],
  ],
  s4: [
    [47.4, 49.0, "And here’s the twist:"],
    [49.3, 51.3, "the money doesn’t cross the border."],
    [51.6, 52.8, "The message does."],
    [53.0, 55.9, "Casa Bank already keeps euros in an account at Paris Bank,"],
    [56.1, 57.7, "so Paris Bank simply debits it."],
  ],
  s5: [
    [59.3, 61.8, "Paris Bank sends it on to T2, formerly TARGET2,"],
    [
      62.0,
      66.4,
      "where the money moves from Paris Bank’s account to Frankfurt Bank’s.",
    ],
  ],
  s6: [
    [67.4, 69.8, "Frankfurt Bank passes it to Munich Bank,"],
    [70.0, 71.6, "and Lukas is paid."],
  ],
  s7: [
    [
      73.4,
      77.0,
      "pacs.008: a message between banks carrying a customer’s payment.",
    ],
    [77.4, 79.4, "Four envelopes, one letter."],
  ],
  s8: [
    [80.4, 82.2, "Next: when the money comes back."],
    [82.5, 84.0, "Follow the series."],
  ],
};

const PAUSE_WEIGHT = 2.5;
const ENDS_PHRASE = /[.,:;!?…]["”’]?$/;

const timeSentence = (start: number, end: number, text: string): Caption[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const weights = words.map(
    (w) => w.length + 1.5 + (ENDS_PHRASE.test(w) ? PAUSE_WEIGHT : 0),
  );
  const total = weights.reduce((a, b) => a + b, 0);
  let t = start * 1000;
  const span = (end - start) * 1000;
  return words.map((word, i) => {
    const duration = (weights[i] / total) * span;
    const caption: Caption = {
      text: ` ${word}`,
      startMs: Math.round(t),
      endMs: Math.round(t + duration),
      timestampMs: Math.round(t),
      confidence: 1,
      pageBreakAfter: i === words.length - 1 || ENDS_PHRASE.test(word),
    };
    t += duration;
    return caption;
  });
};

const WORDS_BY_SCENE = Object.fromEntries(
  (Object.keys(SCRIPT) as SceneId[]).map((id) => [
    id,
    SCRIPT[id].flatMap(([s, e, text]) => timeSentence(s, e, text)),
  ]),
) as Record<SceneId, Caption[]>;

/** Every spoken word, in order: the burned-in captions. */
export const VOICEOVER: Caption[] = (Object.keys(SCRIPT) as SceneId[]).flatMap(
  (id) => WORDS_BY_SCENE[id],
);

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/^[^a-z0-9]+/, "")
    .replace(/[^a-z0-9]+$/, "");

/** Frame, relative to the scene start, at which `word` starts being spoken. */
export const cue = (scene: SceneId, word: string, nth = 0): number => {
  const matches = WORDS_BY_SCENE[scene].filter(
    (c) => normalize(c.text) === normalize(word),
  );
  const match = matches[nth];
  if (!match) {
    throw new Error(`Word "${word}" (#${nth}) not found in ${scene}`);
  }
  return Math.round((match.startMs / 1000) * FPS) - sceneFrom(scene);
};

/** Frame, relative to the scene start, for an absolute time in seconds. */
export const at = (scene: SceneId, seconds: number) =>
  Math.round(seconds * FPS) - sceneFrom(scene);

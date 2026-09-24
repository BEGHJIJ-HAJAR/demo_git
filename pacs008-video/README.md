# pacs.008 explainer: Scene 1 (Hook)

A 10-second LinkedIn hook (1080×1350, 4:5, 30 fps) built with [Remotion](https://www.remotion.dev),
following the Scene 1 storyboard: the tap, "Done?", and the message that crosses the border.

Rendered preview: [`renders/scene1-hook.mp4`](renders/scene1-hook.mp4)

## Commands

```console
npm i              # install
npm run dev        # open Remotion Studio (live preview, scrub the timeline)
npm run render     # render out/scene1-hook.mp4
npm run audio      # regenerate the synthesized SFX + music bed in public/audio
```

## How it is organised

| File | What it does |
| --- | --- |
| `src/scene1/voiceover.ts` | Word-level voiceover timings (also the burned-in captions) and the named `BEATS` every animation is keyed to |
| `src/scene1/Phone.tsx`, `Thumb.tsx` | Hook 1 + 2: Send button press, ripple, "Payment sent" ✓, "Done" button, dimming |
| `src/scene1/Headline.tsx` | Headline visible from frame 1; "Done?" slam and "Not quite." |
| `src/scene1/MapCard.tsx`, `geometry.ts` | Hook 3: zoom-out to the map card, € coin stopping dead at the border, orange ✕ |
| `src/scene1/Envelope.tsx` | Envelope pops out of Casablanca, flies over the border, pacs.008 chip lands, match-cut zoom into the Scene 2 envelope frame |
| `src/scene1/Captions.tsx` | Burned-in captions from 0:00 with the spoken word highlighted |
| `src/scene1/Soundtrack.tsx` | Music (hard cut on "Done?"), click, pop, bonk, whoosh, tick, rise |

## Adding the real voiceover

1. Put the recording in `public/`, e.g. `public/voiceover/scene1.mp3`.
2. Set the `voiceover` prop to `voiceover/scene1.mp3` (in Studio's props panel, or `defaultProps` in `src/Root.tsx`).
3. Re-time the words in `src/scene1/voiceover.ts` to the recording. Every beat (button press, ✕ pop,
   chip landing…) and every caption follows automatically. To get word timings automatically,
   transcribe with Whisper (see `.claude/skills/remotion-captions/transcribe-captions.md`).

## Sound design notes

- All sounds are synthesized by `scripts/generate-audio.mjs`: no downloads, no licensing questions.
- There is intentionally **no stamp thud** in Scene 1; it is reserved for Step 4 (settlement).
- "Done?" has no sound effect: the sudden music cut is the impact.

## Using it in Canva

Upload `renders/scene1-hook.mp4` to Canva (Uploads → Videos), drop it on a 1080×1350 video page,
and continue there with Scene 2. The last frame is the full-frame envelope, so Scene 2 can start
from the same envelope for a seamless match cut.

## Rendering in a sandbox without Chrome downloads

```console
npx remotion render Scene1Hook out/scene1-hook.mp4 --browser-executable=/path/to/chrome-headless-shell
```

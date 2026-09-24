---
name: pacs008-explainer
description: Build and edit the "ISO 20022 in Real Life" explainer videos (LinkedIn, Remotion) in pacs008-video/, e.g. Episode 01 (pacs.008) or a new episode like Ep.02 (pacs.004). Use when asked to add or change a scene, re-time the voiceover, change animations, or render for LinkedIn/Canva.
---

# ISO 20022 in Real Life (Remotion)

The project lives in `pacs008-video/`. Load the `remotion-best-practices` skill for general Remotion
rules; this skill holds the series conventions. Episode 01 is in `src/ep01/` and is the reference
implementation for new episodes.

## Format

- 1080×1350 (LinkedIn 4:5), 30 fps. Safe area: key text ≥80px from sides, ≥100px top/bottom.
- Top zone (y 96–240): on-screen text (`TopText`) or numbered step chips (`StepChip`).
- Bottom zone (from y ≈1130): burned-in captions, always on.
- Frame 0 of an episode is the thumbnail: big text, strong contrast.

## Colour code and recurring assets (`src/ep01/theme.ts`, `src/ep01/art/`)

| Element | Colour | Asset |
|---|---|---|
| pacs.008 | blue | `Envelope` (letter inside, re-addressed at every hop: From → To) |
| pacs.002 | grey, dashed | `Receipt` (visual only, no voiceover) |
| money / settlement | green | `Coin`, `PiggyBank` |
| banks | gold | `Bank` with letter badge + flag |
| T2 | dark teal | `T2Building` with "formerly TARGET2" sticker |
| UETR | purple, glowing | `UetrTag` (glows every time it appears) |

The letter never changes: "Amina pays Lukas · EUR 12,000 · Invoice INV-2026-114 · UETR 8a3f…c29e".

## Timing

- The recorded voiceover drives everything. `script.json` holds the spoken text per scene;
  `voiceover-words.json` holds each word's start/end in the recording (sherpa-onnx recognition +
  `scripts/align_voiceover.py`, see the README). Scene windows are derived from it in `timing.ts`.
- `cue(scene, word, nth)` returns the scene-local frame of a word. Never hard-code a beat frame that
  belongs to a word; add a `cue()`. Use `sceneDuration(scene)` for "near the end of the scene".
- Scenes are `<Sequence>`s at their derived times; each scene uses scene-local frames.

## Sound

- All SFX are synthesized in `scripts/generate-audio.mjs` (`npm run audio`); add new sounds there.
- The stamp **thunk** is reserved for settlement (step ④). Don't use it anywhere else.
- Music bed stays around 0.1–0.13 volume under the voiceover.

## Pitfalls

- No emoji or unusual glyphs in text: the bundled Inter subset lacks → ✓ ① etc. and headless Chrome
  has no emoji font. Use the SVG icons in `art/Icons.tsx` and `art/Flags.tsx`.
- Don't use `@remotion/google-fonts`; fonts are local in `public/fonts`.

## Checks before finishing

1. `npx tsc --noEmit && npx eslint src`
2. Stills of each changed scene: `npx remotion still Ep01-s3 --frame=N --scale=0.5` (scene
   compositions live in the `Episode01-Scenes` folder), and look at them.
3. `npm run render:ep01`, then copy to `renders/`.

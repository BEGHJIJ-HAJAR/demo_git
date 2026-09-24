---
name: pacs008-explainer
description: Build and edit scenes of the pacs.008 payment explainer video (LinkedIn, Remotion) in pacs008-video/. Use when asked to add a scene, re-time the voiceover, change animations, or render for LinkedIn/Canva.
---

# pacs.008 explainer video

The project lives in `pacs008-video/` and uses Remotion. Load the `remotion-best-practices`
skill for general Remotion rules; this skill holds the project-specific conventions.

## Format

- 1080×1350 (LinkedIn 4:5), 30 fps. Safe area: key text ≥80px from the sides, ≥100px from top/bottom.
- Burned-in captions on every scene, from the first frame, bottom-centred (`Captions.tsx`).
- The first frame of every scene must already carry its headline (muted autoplay).

## Visual language (see `src/scene1/theme.ts`)

- Navy background (`COLORS.background`), white cards, Inter for text, JetBrains Mono for message names.
- Recurring props: phone, map card (Casablanca → Hamburg), € coin (gold), envelope (white) with a blue
  mono chip naming the ISO 20022 message (`pacs.008`, later `pacs.002`…), orange ✕ for "blocked".
- Scene transitions are match cuts: the last frame of a scene is the first frame of the next.
  Scene 1 ends on the full-frame envelope centred at (540, 675), 880×600.

## Timing: everything keys off the voiceover

- Each scene has a `voiceover.ts` with word timings (`Caption[]`) and a `BEATS` map built with
  `cue('word')`. Never hard-code a beat frame; add a named beat instead.
- Storyboard lines like "on the word X" map to `cue('X')`.
- One-shot effects go in `<Sequence from={BEATS.x}>` with literal local keyframes inside, so they
  stay editable in Remotion Studio.

## Sound

- SFX are synthesized in `scripts/generate-audio.mjs` (run `npm run audio`). Add new sounds there.
- The **stamp thud is reserved for Step 4 (settlement)**. Do not use it in any other scene.
- Keep music under the voiceover (~0.2–0.3 volume); use hard cuts for emphasis.

## Checks before finishing

1. `npx tsc --noEmit && npx eslint src`
2. Render stills at the key beats: `npx remotion still <Comp> --frame=N --scale=0.5`, and look at them.
3. Render the scene: `npm run render` (add a script per scene) and copy it to `renders/`.

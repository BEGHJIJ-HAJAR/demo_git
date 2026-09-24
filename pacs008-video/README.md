# ISO 20022 in Real Life: a Remotion project

LinkedIn explainer videos (1080×1350, 4:5, 30 fps) built with [Remotion](https://www.remotion.dev)
and Remotion's official agent skills ([`remotion-dev/skills`](https://github.com/remotion-dev/skills),
installed in `../.claude/skills`).

| Composition | What | Rendered |
| --- | --- | --- |
| `Episode01` | **Ep.01: pacs.008**: Amina (Casablanca) pays Lukas (Munich), ≈1:25 | [`renders/ep01-pacs008.mp4`](renders/ep01-pacs008.mp4), thumbnail [`renders/ep01-thumbnail.png`](renders/ep01-thumbnail.png) |
| `Episode01-Scenes/*` | Each Ep.01 scene on its own, for previewing | |
| `Earlier/Scene1Hook` | The first 10-second hook prototype | [`renders/scene1-hook.mp4`](renders/scene1-hook.mp4) |

## Commands

```console
npm i
npm run dev            # Remotion Studio: preview and scrub
npm run render:ep01    # out/ep01-pacs008.mp4
npm run thumbnail:ep01 # out/ep01-thumbnail.png (frame 0 is designed as the thumbnail)
npm run audio          # regenerate the synthesized SFX + music in public/audio
```

## Episode 01 structure (`src/ep01/`)

| File | Role |
| --- | --- |
| `timing.ts` | Scene windows (storyboard times), the voiceover script sentence by sentence, word timings, `cue(scene, word)` |
| `theme.ts` | Colour code (pacs.008 blue, pacs.002 grey, money green, banks gold, T2 teal, UETR purple) and the letter text |
| `art/` | Reusable artwork: `Bank`, `T2Building`, `Envelope` + `Letter` + `UetrTag` + `Receipt`, `Amina`, `Lukas`, skylines, oven, piggy bank, truck, flags, icons, phone |
| `ui/` | Top text / step chips, burned-in captions, the Mediterranean map, scene fades |
| `scenes/S0…S8` | One file per storyboard scene |
| `Soundtrack.tsx` | Music bed + every sound effect, placed on its beat |
| `Episode01.tsx` | Assembles the scenes at their storyboard times, captions, soundtrack, optional voiceover |

## Before posting

1. **Your name and photo on the end card:** set the `authorName`, `authorRole` and `authorPhoto`
   props (Studio props panel, or `defaultEpisodeProps` in `src/ep01/Episode01.tsx`). Put the photo
   in `public/` (e.g. `public/author.jpg`) and set `authorPhoto` to `author.jpg`. Or pass them on the CLI:
   `npx remotion render Episode01 out/ep01.mp4 --props='{"voiceover":"","captions":true,"authorName":"…","authorRole":"…","authorPhoto":"author.jpg"}'`
2. **Voiceover:** record it, put it in `public/` (e.g. `public/voiceover/ep01.mp3`), set the
   `voiceover` prop. Then adjust the sentence start/end times in `src/ep01/timing.ts` so they match
   the recording. Every animation beat and caption is keyed to the words and follows automatically.
   (For exact word timings, transcribe with Whisper: see `.claude/skills/remotion-captions`.)
3. Re-render. Post the MP4 with the thumbnail PNG as the cover image.

## Notes

- All sounds are synthesized by `scripts/generate-audio.mjs` (no downloads, no licensing questions).
  The stamp **thunk** is used only for "SETTLED" in Scene 5 (step ④, settlement).
- Fonts (Inter, JetBrains Mono, OFL) are bundled in `public/fonts`, so renders work offline.
- Emoji and flags are drawn as SVG (headless Chrome has no emoji font), so the output looks the
  same on every machine.
- In a sandbox where Remotion can't download Chrome, add `--browser-executable=/path/to/chrome-headless-shell`.

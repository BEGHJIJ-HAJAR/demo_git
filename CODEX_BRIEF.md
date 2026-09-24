# Codex brief: pacs.008 explainer, Scene 1 "Hook" (10-second LinkedIn video)

> **How to use this file:** save it as `AGENTS.md` at the root of an empty folder (Codex reads that
> file automatically), then ask Codex: *"Build the video described in AGENTS.md and render it."*
> Everything needed is in this file. You have no other context, and none is needed.

---

## 1. What we are making and why

**Topic.** An explainer for LinkedIn about what really happens during an international bank transfer.
The core idea: when you send money abroad, **the money itself never crosses the border; a message does**.
That message is an ISO 20022 payment instruction called **pacs.008** (the "FI-to-FI customer credit
transfer"). Later scenes (not in scope here) walk through the steps; Step 4 is settlement.

**Story of Scene 1.** Yasmine, in Casablanca (Morocco), sends €10,000 to Lukas M. in Hamburg (Germany)
from her banking app. The app instantly says "Payment sent" / "Done". The video questions that:
"Done? Not quite." We zoom out to a map: a € coin slides toward the border and is **blocked**, while an
**envelope** (the message) flies over the border and gets a label: **pacs.008**.

**Voiceover (~24 words, 10 s):**
> "Yasmine taps Send. Ten thousand euros, Casablanca to Hamburg. Done? Not quite. Her money never
> crosses the border. A message does. It's called pacs.008."

**Deliverable:** `out/scene1-hook.mp4`: 1080×1350 (LinkedIn 4:5 portrait), 30 fps, exactly 300 frames
(10.0 s), H.264 + AAC, burned-in captions, music and sound effects. **No voiceover audio yet** (it
will be recorded later); animation is timed to the word timings in §4.

## 2. The storyboard (source of truth)

**0:00–0:02 · Hook 1: The tap**
- Open directly on the phone. No intro, no logo, thumb already moving at frame 0.
- Headline "What really happens when you tap Send?" is on screen from frame 0 (muted viewers get the hook).
- On "taps Send": the button presses in, a ripple appears, a soft click sounds.

**0:02–0:05 · Hook 2: Done?**
- On "Ten thousand euros": the screen switches to "Payment sent" and the checkmark pops.
- On "Done?": the music cuts suddenly and the word "Done?" slams in. On "Not quite.": a second line
  appears and the phone dims slightly.
- Built-in irony: the app's button says "Done" while the headline asks the question.

**0:05–0:10 · Hook 3: The message**
- Zoom out from the phone into the map card.
- The € coin slides along the dashed path and stops dead at the border. An orange ✕ pops with a soft "bonk".
- On "A message does": an envelope pops out of Casablanca and flies over the border with a whoosh.
  The "pacs.008" chip lands on it exactly on the word "pacs.008".

**Transition to Scene 2:** the envelope zooms toward the camera and becomes the big full-frame envelope
that opens Scene 2 (match cut: the two scenes should feel like one continuous shot).

**Rules:** burned-in captions from 0:00. **No stamp/thud sound anywhere in this scene.** It is
reserved for Step 4 (settlement) in a later scene.

## 3. Tech stack and setup

Use **Remotion** (React-based programmatic video). Pinned versions that are known to work:
`remotion`, `@remotion/cli`, `@remotion/media`, `@remotion/captions`, `@remotion/fonts` all **4.0.527**,
`react`/`react-dom` 19.2.3, `zod` 4.x, TypeScript 5.9, Node 22.

```bash
# Optional but recommended: Remotion's official agent skills (best-practice rules for agents)
npx skills add remotion-dev/skills --agent codex -y

npx create-video@latest --yes --blank --no-tailwind pacs008-video
cd pacs008-video
npm i
npx remotion add @remotion/media @remotion/captions @remotion/fonts
npm i zod
```

**Remotion rules you must follow** (things that break renders otherwise):
- Every animation is driven by `useCurrentFrame()` + `interpolate()` (with `extrapolateLeft/Right: 'clamp'`)
  and `Easing.bezier(...)` / `Easing.spring({damping, stiffness})`. **No CSS transitions/animations.**
- Use the CSS properties `scale`, `translate`, `rotate` rather than `transform` strings where possible.
  For scale animations pass `output: 'perceptual-scale'` to `interpolate`.
- One-shot effects go inside `<Sequence from={beatFrame} layout="none">` so their local frame starts at 0.
- Audio: `<Audio>` from `@remotion/media`, files from `public/` via `staticFile()`.
- Captions use the `Caption` type from `@remotion/captions` and `createTikTokStyleCaptions()`.

**Pitfalls we hit (avoid them):**
1. **Fonts:** do NOT use `@remotion/google-fonts`. Headless Chrome may not reach Google in a sandbox and the
   render hangs/fails. Bundle fonts locally: copy `inter-latin-{400,600,700,800}-normal.woff2` and
   `jetbrains-mono-latin-700-normal.woff2` (from the npm packages `@fontsource/inter` and
   `@fontsource/jetbrains-mono`, folder `files/`) into `public/fonts/`, and load them with
   `loadFont({family, url: staticFile(...), weight})` from `@remotion/fonts`. Include the OFL licence files.
2. The fontsource **latin subset has no "→" (U+2192)** and no "▮". Draw arrows/signal bars as SVG/divs.
3. **Sound effects:** `https://remotion.media/*.wav` may be blocked. Synthesize all audio locally with
   the script in §8 (deterministic, no licensing questions).
4. If Remotion cannot download Chrome Headless Shell, pass
   `--browser-executable=/path/to/chrome-headless-shell` to `remotion still` / `remotion render`.
5. Emoji flags don't render in headless Chrome. Use text labels ("MOROCCO", "GERMANY", "· DE", "· MA").

## 4. Timing: everything is keyed to the voiceover words

Create `src/scene1/voiceover.ts` exactly as below. The word list is **both** the caption data and the
clock for every animation (`cue('word')` → frame). When the real voiceover is recorded, only these
millisecond values change and the whole scene re-syncs.

```ts
import type {Caption} from '@remotion/captions';

export const FPS = 30;

/**
 * Word-level timing of the Scene 1 voiceover.
 *
 * Every animation beat in Scene 1 is keyed to a word in this list via `cue()`,
 * so once the real voiceover is recorded, re-timing these words (e.g. from a
 * Whisper transcription, see the remotion-captions skill) re-syncs the whole
 * scene. The same list is rendered as the burned-in captions.
 *
 * `pageBreakAfter` controls how captions are grouped on screen.
 */
export const VOICEOVER: Caption[] = [
	w('Yasmine', 150, 600),
	w('taps', 600, 850),
	w('Send.', 850, 1300, true),
	w('Ten', 1950, 2150),
	w('thousand', 2150, 2450),
	w('euros,', 2450, 2800, true),
	w('Casablanca', 2850, 3350),
	w('to', 3350, 3450),
	w('Hamburg.', 3450, 3850, true),
	w('Done?', 4000, 4450, true),
	w('Not', 4600, 4800),
	w('quite.', 4800, 5150, true),
	w('Her', 5450, 5600),
	w('money', 5600, 5900),
	w('never', 5900, 6200, true),
	w('crosses', 6200, 6600),
	w('the', 6600, 6700),
	w('border.', 6700, 7150, true),
	w('A', 7400, 7500),
	w('message', 7500, 7850),
	w('does.', 7850, 8250, true),
	w("It's", 8400, 8550),
	w('called', 8550, 8850),
	w('pacs.008.', 8900, 9750, true),
];

function w(
	text: string,
	startMs: number,
	endMs: number,
	pageBreakAfter = false,
): Caption {
	return {
		text: ` ${text}`,
		startMs,
		endMs,
		timestampMs: startMs,
		confidence: 1,
		pageBreakAfter,
	};
}

const normalize = (s: string) =>
	s
		.trim()
		.toLowerCase()
		.replace(/[.,?!]+$/, '');

/** Frame at which the given word starts being spoken. */
export const cue = (word: string, nth = 0): number => {
	const matches = VOICEOVER.filter((c) => normalize(c.text) === normalize(word));
	const match = matches[nth];
	if (!match) {
		throw new Error(`Word "${word}" (#${nth}) not found in the voiceover`);
	}
	return Math.round((match.startMs / 1000) * FPS);
};

/** Named beats from the storyboard. */
export const BEATS = {
	press: cue('Send'),
	paymentSent: cue('Ten'),
	doneSlam: cue('Done'),
	notQuite: cue('Not'),
	zoomOut: cue('quite') + 4,
	coinStart: cue('money'),
	coinHitsBorder: cue('border'),
	envelopePops: cue('A'),
	envelopeFlies: cue('message'),
	chipLands: cue('pacs.008'),
	matchCut: cue('pacs.008') + 11,
};

export const DURATION_IN_FRAMES = 10 * FPS;
```

Resulting beat frames at 30 fps (for reference/checking):

| Beat | Frame | Time | What happens |
|---|---|---|---|
| (start) | 0 | 0.00 s | Headline + phone visible, thumb already moving |
| `press` = "Send" | 26 | 0.85 s | Button press + ripple + click |
| `paymentSent` = "Ten" | 59 | 1.95 s | "Payment sent" screen, checkmark pop |
| `doneSlam` = "Done?" | 120 | 4.00 s | Music hard-cut, "Done?" slams in |
| `notQuite` = "Not" | 138 | 4.60 s | "Not quite." appears, phone dims |
| `zoomOut` = "quite"+4 | 148 | 4.93 s | Camera pulls back into the map card (16 frames) |
| `coinStart` = "money" | 168 | 5.60 s | € coin starts sliding |
| `coinHitsBorder` = "border" | 201 | 6.70 s | Coin stops dead, ✕ pops, bonk |
| `envelopePops` = "A" | 222 | 7.40 s | Envelope pops out of Casablanca |
| `envelopeFlies` = "message" | 225 | 7.50 s | Envelope flies over the border (22 frames), whoosh |
| `chipLands` = "pacs.008" | 267 | 8.90 s | pacs.008 chip lands on envelope, tick |
| `matchCut` = "pacs.008"+11 | 278 | 9.27 s | Envelope zooms to full frame (18 frames), ends at 296 |

## 5. Visual design

**Canvas:** 1080×1350. Safe area: key text ≥80 px from the sides, ≥100 px from top/bottom.
**Background:** `radial-gradient(120% 80% at 50% 45%, #16304D 0%, #0D1B2A 70%)`.

**Colours:**
| Token | Hex | Use |
|---|---|---|
| background / ink | `#0D1B2A` | page background, dark text on cards |
| backgroundGlow | `#16304D` | background gradient centre |
| inkMuted | `#6B7A8C` | secondary text on cards |
| blue | `#2F6BFF` | Send button, "Send?" in headline, pacs.008 chip |
| green | `#1FB57A` | checkmark circle |
| orange | `#FF6B2C` (text variant `#FF8A55`) | ✕ badge, "Not quite." |
| gold / goldDark | `#F5B83D` / `#C98A14` | € coin, highlighted caption word |
| morocco | `#F6E7D3` | left map region |
| germany | `#DCE6F6` | right map region, avatar bg |
| border line | `#8A97A8` | dotted border + "BORDER" label |

**Fonts:** Inter (400/600/700/800) for everything; JetBrains Mono 700 for "pacs.008" and "ISO".

### 5.1 Headline (frames 0 → 156)
Absolutely positioned `top: 104, left: 80, right: 80`, centred, Inter 800, 84 px, line-height 1.04,
letter-spacing −2, white. Text: `What really happens when you tap ` + `Send?` in blue. Wraps to 2 lines
("What really happens / when you tap Send?"). Fades out and moves up 30 px over frames zoomOut→zoomOut+8.

### 5.2 Phone (frames 0 → ~164)
- Outer body 380×780, centred at (540, 735), radius 56, `#05080E`, shadow `0 40px 80px rgba(0,0,0,.45)`,
  inner 2 px ring `#2A3342`. Screen inset 14 px, radius 44, background `#F5F7FB`. Dynamic-island pill
  110×30 at top.
- Status bar: "9:41" left, 4 ascending signal bars right (drawn divs), 17 px/600.
- **Send screen** (before "Ten"): padding 70/26 px. "Send money" 30 px/800. White recipient card
  (radius 22) with 56 px avatar circle "LM" (blue on `#DCE6F6`), "To" / **Lukas M.** / "Hamburg · DE".
  "Amount" label, **€10,000.00** at 50 px/800 (58 px clips; keep 50), "From Yasmine · Casablanca · MA".
- **Button** in screen coords x 26, y 630, 300×84, radius 42, Inter 32/700. Blue "Send" with blue glow
  before "Ten"; after "Ten" it becomes ink `#0D1B2A` and says **"Done"** (the irony).
  Press: scale 1 → 0.93 → 1 over frames press−2 → press → press+5.
  Ripple (Sequence at press, 18 frames): white 360 px circle centred in the button, scale 0.05→1
  (bezier 0.16,1,0.3,1, perceptual-scale) and opacity 0.45→0 over 16 frames, clipped by the button.
- **Payment sent screen** (Sequence at "Ten"): column centred, padding-top 150. Green 150 px circle,
  scale 0→1 over 12 frames with `Easing.spring({damping: 9, stiffness: 180})` (overshoot pop); white
  checkmark path `M18 44 L35 60 L66 26` (84×84 viewBox, stroke 11, round caps) drawn via
  strokeDashoffset 80→0 over frames 4→14. "Payment sent" 34/800 fades in 3→10 and rises 16 px;
  "€10,000.00 to Lukas M." 19 px muted fades in 6→13.
- **Dim:** black overlay on the screen, opacity 0 → 0.45 over notQuite → notQuite+8.
- **Zoom-out:** progress p = interpolate(zoomOut → zoomOut+16, bezier 0.65,0,0.35,1). Phone translates
  by p × (Casablanca − phone centre) = p × (−290, +185), scales 1 → 0.08 (perceptual-scale), opacity
  1→0 for p 0.6→1. The phone shrinks *into* the Casablanca pin.

### 5.3 Thumb (frames 0 → press+26)
A stylised thumb: 120×260 div, radius `60px 60px 50px 50px`, gradient `#E8B793 → #D59C77 → #C98D69`,
shadow, rotated −24°, with a lighter nail (76×78, `#F7DDD0 → #EDC6B3`). Its tip (offset 60,30 inside
the div) follows keyframes relative to the button centre B = (540, 1031):
frames [0, press−2, press+6, press+24] → x [B+230, B+18, B+18, B+300], y [B+260, B+6, B+6, B+420];
easings [bezier(.3,0,.2,1), linear, bezier(.5,0,.9,.6)]. It scales 1→0.94→1 with the press. Hidden after press+26.

### 5.4 "Done?" / "Not quite." overlay
Container at `top: 560`, full width, centred column, fades out with the headline (zoomOut→+8).
- **"Done?"** (Sequence at doneSlam): Inter 800, 230 px, letter-spacing −8, white, **text outline**
  `WebkitTextStroke: 14px #0D1B2A` + `paintOrder: 'stroke fill'` (needed for legibility over the light
  phone screen), shadow. Scale 2.4 → 0.94 → 1 over frames 0→4→7 (ease-in quad then bezier .16,1,.3,1,
  perceptual-scale), opacity 0→1 over 2 frames, then a 4-frame shake: translate
  `0 0 → -10px 4px → 8px -3px → -4px 2px → 0 0` over frames 4..8.
- **"Not quite."** (Sequence at notQuite): 88 px/700, `#FF8A55`, 10 px dark stroke, fades 0→6, rises 24 px over 0→8.

### 5.5 Map card (appears at zoomOut, fades out at matchCut)
Composition coordinates:
- Card rect x 60, y 190, 960×900, radius 40, white, big shadow.
- Header row inside the card (top + 34, left/right padding 44): **"€10,000"** 46/800 left; right side
  "Casablanca [SVG arrow] Hamburg" 30/600 muted, `white-space: nowrap`.
- Map area = card minus top 120 px (clip it with the card radius). A **border** splits it:
  `x(y) = 548 + 16·sin(y/55)`. Fill left of the border `#F6E7D3` (Morocco), right `#DCE6F6` (Germany).
  Draw the border from y = 340 to y = 1050 as a dotted stroke (`#8A97A8`, width 4, dasharray "2 12",
  round caps) and label "BORDER" (22/700, letter-spacing 3) just right of the line near the bottom.
- Region labels: "MOROCCO" at (104, 380), "GERMANY" right-aligned at (976, 1040); 26/800, letter-spacing 5, ink at 35 % opacity.
- **Cities:** Casablanca C = (250, 920), label below (+66); Hamburg H = (840, 420), label above (−44).
  Pin = 26 px halo (ink 12 %), 13 px ink dot, 5 px white centre; labels 34/700.
- **Route:** quadratic Bézier C → control (470, 400) → H, dashed (`16 14`, width 6, ink 55 %,
  round caps), dash offset marching `−frame × 1.2`.
- Derived points (compute numerically by bisection, don't hard-code): route crosses the border at
  t ≈ 0.576 → (553, 500). Coin stop = 48 px before that, t ≈ 0.512 → (515, 529). ✕ = 44 px after it,
  t ≈ 0.637 → (591, 477).
- **Camera move:** whole map layer opacity 0→1 and scale 2.4→1 (perceptual) with transform-origin at
  C, over zoomOut+2 → zoomOut+16 (bezier .65,0,.35,1). Combined with the shrinking phone this reads as
  one continuous pull-back.
- **€ coin:** 80 px circle, `radial-gradient(circle at 35% 30%, #FFE08A, #F5B83D 55%, #C98A14)`,
  inset 4 px ring `#C98A14`, "€" Inter 46/800 `#7A4E00`. Appears zoomOut+10→+20 (spring damping 12).
  Moves along the route t: 0 → 0.512 over coinStart → coinHitsBorder with **bezier(0.45, 0, 1, 1)**
  (accelerates, no ease-out: it "stops dead"). On impact: recoil back 0.018 in t over 3 frames then
  settle by +9; squash scaleX 1 → 0.82 → 1 over frames +0/+2/+8. **It stays there for the rest of the
  scene** (money never crosses).
- **Orange ✕** (Sequence at coinHitsBorder): 76 px circle `#FF6B2C` with glow, white ✕ (stroke 7), at the
  post-border point (591, 477); scale 0→1 over 10 frames with `Easing.spring({damping: 8, stiffness: 200})`.
- Map layer fades out over matchCut → matchCut+12.

### 5.6 Envelope + pacs.008 chip
Draw the envelope at its **final full-frame size 880×600** and scale it down on the map
(on-map scale = 200/880 ≈ 0.227) so it stays crisp during the zoom.
- Art (SVG 880×600): white rect radius 40; lower fold lines `M20 590 L380 300` and `M860 590 L500 300`
  (`#DCE3EC`, width 8); flap triangle `M14 20 L440 350 L866 20` filled `#F1F4F9` with same stroke;
  a dashed blue "stamp" rect at (690, 60) 120×140 with the text **"ISO"** (JetBrains Mono 40/700,
  blue). Don't put a € on the envelope: the whole point is that money isn't in it.
- Pop (from envelopePops): scale 0 → 1 × 0.227 over 9 frames, `Easing.spring({damping: 9, stiffness: 180})`.
- Flight (envelopeFlies → +22, bezier .45,0,.2,1): quadratic arc start (250, 820) → control (520, 330)
  → landing (800, 570), i.e. from just above Casablanca, arcing over the border, to just below
  Hamburg. Tilt −6° → −14° → 0° across the flight.
- **Chip** (Sequence at chipLands), in envelope coordinates: left 110, top 360, 660×170, radius 85,
  blue, white "pacs.008" JetBrains Mono 118/700, letter-spacing −2, blue glow. Drops from translateY
  −520 → 0 over 5 frames (ease-in quad), scale 1.5 → 1 → 1.06 → 1 over frames 0/5/7/11, opacity 0→1 in 2 frames.
- **Match cut** (matchCut → +18, bezier .7,0,.2,1): centre moves from its landing spot to (540, 675);
  scale 0.227 → 1 (perceptual); tilt → 0; drop shadow grows. Final frames: a big white envelope
  880×600 centred on navy, blue "pacs.008" chip on it. **This is the first frame of Scene 2.**

### 5.7 Captions (whole scene)
- Build pages with `createTikTokStyleCaptions({captions: VOICEOVER, combineTokensWithinMilliseconds: 3000})`;
  pages break where `pageBreakAfter: true` (see §4), giving: "Yasmine taps Send." / "Ten thousand euros," /
  "Casablanca to Hamburg." / "Done?" / "Not quite." / "Her money never" / "crosses the border." /
  "A message does." / "It's called pacs.008."
- Each page is a `<Sequence>` from its start until the next page starts or last word end + 400 ms.
- Bottom-centred, 110 px from the bottom, Inter 52/800, `white-space: pre`, dark pill
  `rgba(5,12,22,0.88)`, padding `12px 30px 16px`, radius 22. Current word is gold `#F5B83D`, others white.
- Must render above everything (z-index 10).

### 5.8 Layer order (back → front)
background → headline → map card (+ coin, ✕) → phone → "Done?" overlay → thumb → envelope → captions → audio.

## 6. Sound design

All files in `public/audio/`, generated by the script in §8 (`npm run audio`). Placement:

| Sound | File | At frame | Volume |
|---|---|---|---|
| Music bed, **hard cut** | music.wav | 0 → doneSlam (Sequence durationInFrames = 120) | 0.32 |
| Music returns quietly | music.wav, `trimBefore = 4.8 s` | from zoomOut; fade 0→0.2 over 15 f, back to 0 over the last 20 f | ≤0.2 |
| Soft click | click.wav | press (26) | 0.8 |
| Checkmark pop | pop.wav | paymentSent (59) | 0.5 |
| (nothing on "Done?"; the silence **is** the impact) | | | |
| Soft bonk | bonk.wav | coinHitsBorder (201) | 0.75 |
| Envelope pop | pop.wav | envelopePops (222) | 0.45 |
| Whoosh | whoosh.wav | envelopeFlies (225) | 0.7 |
| Chip tick | tick.wav | chipLands (267) | 0.6 |
| Rise into the match cut | rise.wav | matchCut − 4 (274) | 0.5 |

Expected loudness profile when checked: silence from 4.0 s to ~5.1 s; peaks at 0.85, 1.95, 6.7, 7.4,
7.5–8.2, 8.9 and 9.1–9.9 s.

**Voiceover:** make the composition accept a `voiceover` prop (zod schema, default `""`); when set,
play `<Audio src={staticFile(voiceover)}>`. Also a `captions: boolean` prop (default `true`).

## 7. File layout to produce

```
pacs008-video/
  package.json            scripts: dev=remotion studio, render=remotion render Scene1Hook out/scene1-hook.mp4, audio=node scripts/generate-audio.mjs
  scripts/generate-audio.mjs   (§8, verbatim)
  public/audio/*.wav      (generated)
  public/fonts/*.woff2 + licences
  src/index.ts, src/Root.tsx   Composition id "Scene1Hook", 1080×1350, 30 fps, 300 frames, schema + defaultProps
  src/scene1/voiceover.ts      (§4, verbatim)
  src/scene1/theme.ts          colours, fonts, phone/button constants
  src/scene1/geometry.ts       (§9, verbatim)
  src/scene1/Phone.tsx, Thumb.tsx, Headline.tsx (headline + Done overlay), MapCard.tsx, Envelope.tsx,
  src/scene1/Captions.tsx, Soundtrack.tsx, Scene1Hook.tsx
```

## 8. Audio generator (use verbatim)

```js
// Synthesizes the sound effects and music bed used in Scene 1 into public/audio/.
// Everything is generated locally so the project has no licensing or download dependencies.
// Run with: npm run audio
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SAMPLE_RATE = 44100;
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio');
mkdirSync(outDir, {recursive: true});

const writeWav = (name, samples) => {
	const data = Buffer.alloc(samples.length * 2);
	const peak = samples.reduce((m, s) => Math.max(m, Math.abs(s)), 1e-9);
	const gain = 0.9 / peak;
	samples.forEach((s, i) => {
		data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s * gain)) * 32767), i * 2);
	});
	const header = Buffer.alloc(44);
	header.write('RIFF', 0);
	header.writeUInt32LE(36 + data.length, 4);
	header.write('WAVE', 8);
	header.write('fmt ', 12);
	header.writeUInt32LE(16, 16);
	header.writeUInt16LE(1, 20);
	header.writeUInt16LE(1, 22);
	header.writeUInt32LE(SAMPLE_RATE, 24);
	header.writeUInt32LE(SAMPLE_RATE * 2, 28);
	header.writeUInt16LE(2, 32);
	header.writeUInt16LE(16, 34);
	header.write('data', 36);
	header.writeUInt32LE(data.length, 40);
	writeFileSync(join(outDir, name), Buffer.concat([header, data]));
	console.log(`wrote public/audio/${name}`);
};

// Deterministic noise so the files are identical on every run.
let seed = 1234567;
const noise = () => {
	seed = (seed * 1103515245 + 12345) % 2147483648;
	return (seed / 2147483648) * 2 - 1;
};

const render = (seconds, fn) => {
	const out = new Array(Math.round(seconds * SAMPLE_RATE));
	for (let i = 0; i < out.length; i++) out[i] = fn(i / SAMPLE_RATE, i);
	return out;
};

// Integrates a time-varying frequency so pitch sweeps stay click-free.
const sweep = (seconds, freqAt, ampAt, harmonics = [[1, 1]]) => {
	let phase = 0;
	return render(seconds, (t) => {
		phase += (2 * Math.PI * freqAt(t)) / SAMPLE_RATE;
		return ampAt(t) * harmonics.reduce((acc, [mult, amp]) => acc + amp * Math.sin(phase * mult), 0);
	});
};

// One-pole low-pass with a cutoff that can change over time.
const lowpass = (samples, cutoffAt) => {
	let y = 0;
	return samples.map((x, i) => {
		const fc = cutoffAt(i / SAMPLE_RATE);
		const a = 1 - Math.exp((-2 * Math.PI * fc) / SAMPLE_RATE);
		y += a * (x - y);
		return y;
	});
};

// Soft UI click for the Send button.
writeWav(
	'click.wav',
	render(0.06, (t) => {
		const env = Math.exp(-t * 180);
		return env * (0.5 * Math.sin(2 * Math.PI * 1900 * t) + 0.25 * noise());
	}),
);

// Checkmark pop: short upward blip.
writeWav(
	'pop.wav',
	sweep(
		0.14,
		(t) => 520 + 1400 * t * 7,
		(t) => Math.min(1, t * 400) * Math.exp(-t * 32),
		[
			[1, 1],
			[2, 0.2],
		],
	),
);

// Soft, rubbery "bonk" when the coin hits the border.
writeWav(
	'bonk.wav',
	lowpass(
		sweep(
			0.32,
			(t) => 105 + 150 * Math.exp(-t * 30),
			(t) => Math.min(1, t * 600) * Math.exp(-t * 14),
			[
				[1, 1],
				[2, 0.35],
				[3, 0.1],
			],
		),
		() => 1400,
	),
);

// Whoosh: band of noise whose brightness and loudness swell then fall.
writeWav(
	'whoosh.wav',
	lowpass(
		render(0.7, () => noise()),
		(t) => 300 + 2600 * Math.sin(Math.PI * Math.min(1, t / 0.7)),
	).map((s, i) => s * Math.pow(Math.sin((Math.PI * i) / (0.7 * SAMPLE_RATE)), 2) * 1.6),
);

// Crisp tick when the pacs.008 chip lands.
writeWav(
	'tick.wav',
	render(0.09, (t) => {
		const env = Math.min(1, t * 2000) * Math.exp(-t * 70);
		return env * (0.6 * Math.sin(2 * Math.PI * 1760 * t) + 0.3 * Math.sin(2 * Math.PI * 2640 * t));
	}),
);

// Rising swell into the match cut.
writeWav(
	'rise.wav',
	lowpass(
		render(0.75, () => noise()),
		(t) => 200 + 5000 * Math.pow(t / 0.75, 2),
	).map((s, i) => {
		const t = i / SAMPLE_RATE;
		const up = Math.pow(Math.min(1, t / 0.7), 2);
		const out = t > 0.7 ? Math.max(0, 1 - (t - 0.7) / 0.05) : 1;
		return s * up * out * 1.4;
	}),
);

// Music bed: warm pad plus a light plucked arpeggio, 100 BPM, 12 seconds.
const BPM = 100;
const beat = 60 / BPM;
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const chords = [
	[57, 60, 64], // Am
	[53, 57, 60], // F
	[48, 52, 55], // C
	[55, 59, 62], // G
];
const musicSeconds = 12;
const music = render(musicSeconds, (t) => {
	const bar = Math.floor(t / (beat * 4)) % chords.length;
	const chord = chords[bar];
	const barT = t % (beat * 4);
	const padEnv = Math.min(1, barT / 0.4) * (0.75 + 0.25 * Math.cos((2 * Math.PI * barT) / (beat * 4)));
	let pad = 0;
	for (const n of chord) {
		const f = midi(n);
		pad += Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2.003 * t);
	}
	pad *= 0.06 * padEnv;

	const step = Math.floor(t / (beat / 2));
	const stepT = t % (beat / 2);
	const note = chord[step % 3] + 12 + (step % 4 === 3 ? 12 : 0);
	const pluck = 0.12 * Math.exp(-stepT * 9) * Math.sin(2 * Math.PI * midi(note) * t);

	const kickT = t % beat;
	const kick = 0.22 * Math.exp(-kickT * 22) * Math.sin(2 * Math.PI * (48 + 60 * Math.exp(-kickT * 40)) * kickT);

	const fadeIn = Math.min(1, t / 0.05);
	return fadeIn * (pad + pluck + kick);
});
writeWav('music.wav', music);
```

## 9. Map geometry helper (use verbatim)

```ts
// Map geometry, in composition coordinates.

export type Point = {x: number; y: number};

export const MAP_CARD = {x: 60, y: 190, width: 960, height: 900};

export const CASABLANCA: Point = {x: 250, y: 920};
export const HAMBURG: Point = {x: 840, y: 420};
const CONTROL: Point = {x: 470, y: 400};

/** Dashed payment route: quadratic Bézier from Casablanca to Hamburg. */
export const routeAt = (t: number): Point => {
	const u = 1 - t;
	return {
		x: u * u * CASABLANCA.x + 2 * u * t * CONTROL.x + t * t * HAMBURG.x,
		y: u * u * CASABLANCA.y + 2 * u * t * CONTROL.y + t * t * HAMBURG.y,
	};
};

export const ROUTE_PATH = `M ${CASABLANCA.x} ${CASABLANCA.y} Q ${CONTROL.x} ${CONTROL.y} ${HAMBURG.x} ${HAMBURG.y}`;

/** The border is a gently wavy, mostly vertical line. */
const BORDER_X = 548;
export const borderXAt = (y: number) => BORDER_X + 16 * Math.sin(y / 55);

const BORDER_TOP = MAP_CARD.y + 150;
const BORDER_BOTTOM = MAP_CARD.y + MAP_CARD.height - 40;

export const BORDER_PATH = (() => {
	const points: string[] = [];
	for (let y = BORDER_TOP; y <= BORDER_BOTTOM; y += 10) {
		points.push(`${points.length === 0 ? 'M' : 'L'} ${borderXAt(y).toFixed(1)} ${y}`);
	}
	return points.join(' ');
})();

export const BORDER_BOUNDS = {top: BORDER_TOP, bottom: BORDER_BOTTOM};

/** Route parameter t where the route crosses the border (bisection). */
export const ROUTE_T_AT_BORDER = (() => {
	let lo = 0;
	let hi = 1;
	for (let i = 0; i < 40; i++) {
		const mid = (lo + hi) / 2;
		const p = routeAt(mid);
		if (p.x < borderXAt(p.y)) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
})();

export const BORDER_CROSSING = routeAt(ROUTE_T_AT_BORDER);

/**
 * Route parameter at which a point is `distance` px from the border crossing,
 * before it (negative distance) or after it (positive distance).
 */
export const routeTFromBorder = (distance: number) => {
	const step = distance < 0 ? -0.0005 : 0.0005;
	let t = ROUTE_T_AT_BORDER;
	while (t > 0 && t < 1) {
		const p = routeAt(t);
		if (Math.hypot(p.x - BORDER_CROSSING.x, p.y - BORDER_CROSSING.y) >= Math.abs(distance)) {
			return t;
		}
		t += step;
	}
	return Math.min(1, Math.max(0, t));
};
```

## 10. Acceptance checklist: render these stills and compare

`npx remotion still Scene1Hook out/fN.png --frame=N --scale=0.5`

| Frame | You should see |
|---|---|
| 5 | Headline (2 lines, "Send?" blue), phone with Send screen, €10,000.00 fully visible, thumb entering bottom-right, caption "Yasmine taps Send." with "Yasmine" gold |
| 27 | Thumb pressing the Send button, white ripple on the button |
| 70 | "Payment sent" with green ✓, dark "Done" button; caption "Ten thousand euros," |
| 125 | Huge outlined "Done?" over the phone; headline still on top; caption "Done?" |
| 150 | "Not quite." in orange below "Done?", phone screen dimmed |
| 158 | Mid pull-back: tiny phone collapsing into the Casablanca pin, map scaling down |
| 175 | Full map card: header "€10,000 | Casablanca → Hamburg" on one line, two tinted regions, dotted border, dashed route, coin leaving Casablanca |
| 203 | Coin stopped just before the border, orange ✕ just past it |
| 228 | Small envelope near Casablanca, tilted, starting its arc |
| 240 | Envelope already past the border, near Hamburg; coin still stuck |
| 275 | Envelope with blue "pacs.008" chip; caption "It's called pacs.008." with "pacs.008." gold |
| 285 | Envelope rushing toward the camera, map fading |
| 299 | Full-frame white envelope centred on navy, big "pacs.008" chip, "ISO" stamp |

Then `npm run render` and check: 1080×1350, 10.0 s, H.264 + AAC, `npx tsc --noEmit` and `npx eslint src` clean.

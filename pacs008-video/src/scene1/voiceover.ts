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

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

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

// ---- Episode 01 sounds ----

const highpass = (samples, cutoff) => {
	const low = lowpass(samples, () => cutoff);
	return samples.map((x, i) => x - low[i]);
};

// Paper swoosh: bright, short noise swell (invoice sliding).
writeWav(
	'swoosh.wav',
	highpass(render(0.4, () => noise()), 1800).map((s, i) => {
		const t = i / SAMPLE_RATE;
		return s * Math.pow(Math.sin(Math.PI * Math.min(1, t / 0.4)), 1.5);
	}),
);

// Barrier "clack": two hard, woody hits.
writeWav(
	'clack.wav',
	render(0.3, (t) => {
		const hit = (t0, gain) => {
			const d = t - t0;
			if (d < 0) return 0;
			return gain * Math.exp(-d * 60) * (0.6 * noise() + Math.sin(2 * Math.PI * 420 * d) + 0.5 * Math.sin(2 * Math.PI * 1150 * d));
		};
		return hit(0, 1) + hit(0.075, 0.7);
	}),
);

// Envelope opening: crinkly paper rustle.
writeWav(
	'paper.wav',
	highpass(
		render(0.55, (t) => {
			const grain = Math.sin(t * 173) * Math.sin(t * 61) > 0.2 ? 1 : 0.25;
			return noise() * grain * Math.sin(Math.PI * Math.min(1, t / 0.55));
		}),
		2500,
	),
);

// Stamp "thunk": low, heavy hit (reserved for settlement).
writeWav(
	'thunk.wav',
	(() => {
		const body = sweep(0.35, (t) => 55 + 90 * Math.exp(-t * 25), (t) => Math.min(1, t * 800) * Math.exp(-t * 11), [
			[1, 1],
			[2, 0.25],
		]);
		const click = lowpass(render(0.35, (t) => (t < 0.012 ? noise() : 0)), () => 900);
		return body.map((s, i) => s + 1.5 * click[i]);
	})(),
);

// Soft ding.
writeWav(
	'ding.wav',
	render(1.3, (t) => {
		const env = Math.min(1, t * 300) * Math.exp(-t * 3.2);
		return env * (Math.sin(2 * Math.PI * 1320 * t) + 0.35 * Math.sin(2 * Math.PI * 1320 * 2.76 * t) * Math.exp(-t * 6) + 0.15 * Math.sin(2 * Math.PI * 1320 * 5.4 * t) * Math.exp(-t * 9));
	}),
);

// Coin clink.
writeWav(
	'clink.wav',
	render(0.4, (t) => {
		const hit = (t0, g) => {
			const d = t - t0;
			if (d < 0) return 0;
			const env = Math.exp(-d * 22);
			return g * env * (Math.sin(2 * Math.PI * 3150 * d) + 0.7 * Math.sin(2 * Math.PI * 4720 * d) + 0.4 * Math.sin(2 * Math.PI * 6180 * d));
		};
		return hit(0, 1) + hit(0.07, 0.6);
	}),
);

// Phone notification: vibration buzz + two-tone chime.
writeWav(
	'notify.wav',
	render(0.8, (t) => {
		const buzz = t < 0.35 ? 0.35 * Math.sign(Math.sin(2 * Math.PI * 165 * t)) * (0.5 + 0.5 * Math.sin(2 * Math.PI * 28 * t)) : 0;
		const tone = (t0, f) => {
			const d = t - t0;
			if (d < 0) return 0;
			return Math.min(1, d * 400) * Math.exp(-d * 7) * (Math.sin(2 * Math.PI * f * d) + 0.3 * Math.sin(2 * Math.PI * f * 2 * d));
		};
		return buzz * 0.6 + tone(0.3, 988) + tone(0.45, 1480);
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

import React from 'react';
import {Easing, Interactive, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {BEATS} from './voiceover';
import {COLORS, HEIGHT, WIDTH, mono} from './theme';
import {CASABLANCA, HAMBURG} from './geometry';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// The envelope is drawn at its final, full-frame size and scaled down on the map,
// so it stays crisp when it zooms toward the camera for the match cut.
const ENVELOPE = {width: 880, height: 600};
const ON_MAP_SCALE = 200 / ENVELOPE.width;

const START = {x: CASABLANCA.x, y: CASABLANCA.y - 100};
const CONTROL = {x: 520, y: 330};
const LANDING = {x: HAMBURG.x - 40, y: HAMBURG.y + 150};
const FINAL = {x: WIDTH / 2, y: HEIGHT / 2};

const arc = (t: number) => {
	const u = 1 - t;
	return {
		x: u * u * START.x + 2 * u * t * CONTROL.x + t * t * LANDING.x,
		y: u * u * START.y + 2 * u * t * CONTROL.y + t * t * LANDING.y,
	};
};

/**
 * "A message does": the envelope pops out of Casablanca, flies over the border,
 * gets its pacs.008 chip on the word, then rushes toward the camera and becomes
 * the full-frame envelope that opens Scene 2 (match cut).
 */
export const Envelope: React.FC = () => {
	const frame = useCurrentFrame();

	if (frame < BEATS.envelopePops) {
		return null;
	}

	const popScale = interpolate(frame, [BEATS.envelopePops, BEATS.envelopePops + 9], [0, 1], {
		...clamp,
		easing: Easing.spring({damping: 9, stiffness: 180}),
	});
	const flight = interpolate(frame, [BEATS.envelopeFlies, BEATS.envelopeFlies + 22], [0, 1], {
		...clamp,
		easing: Easing.bezier(0.45, 0, 0.2, 1),
	});
	const zoom = interpolate(frame, [BEATS.matchCut, BEATS.matchCut + 18], [0, 1], {
		...clamp,
		easing: Easing.bezier(0.7, 0, 0.2, 1),
	});

	const onMap = arc(flight);
	const x = interpolate(zoom, [0, 1], [onMap.x, FINAL.x]);
	const y = interpolate(zoom, [0, 1], [onMap.y, FINAL.y]);
	const scale = interpolate(zoom, [0, 1], [ON_MAP_SCALE * popScale, 1], {output: 'perceptual-scale'});
	const tilt = interpolate(flight, [0, 0.5, 1], [-6, -14, 0]) * (1 - zoom);

	return (
		<div
			style={{
				position: 'absolute',
				left: x - ENVELOPE.width / 2,
				top: y - ENVELOPE.height / 2,
				width: ENVELOPE.width,
				height: ENVELOPE.height,
				scale,
				rotate: `${tilt}deg`,
				filter: `drop-shadow(0 ${30 + 20 * zoom}px ${50 + 30 * zoom}px rgba(0,0,0,0.35))`,
			}}
		>
			<EnvelopeArt />
			<Sequence name="pacs.008 chip" from={BEATS.chipLands} layout="none">
				<Chip />
			</Sequence>
		</div>
	);
};

const EnvelopeArt: React.FC = () => (
	<svg
		width={ENVELOPE.width}
		height={ENVELOPE.height}
		viewBox={`0 0 ${ENVELOPE.width} ${ENVELOPE.height}`}
		style={{position: 'absolute', inset: 0}}
	>
		<rect x={0} y={0} width={880} height={600} rx={40} fill="#FFFFFF" />
		<path d="M 20 590 L 380 300 M 860 590 L 500 300" stroke="#DCE3EC" strokeWidth={8} strokeLinecap="round" />
		<path d="M 14 20 L 440 350 L 866 20" fill="#F1F4F9" stroke="#DCE3EC" strokeWidth={8} strokeLinejoin="round" />
		<rect x={690} y={60} width={120} height={140} rx={10} fill="none" stroke={COLORS.blue} strokeWidth={6} strokeDasharray="14 10" />
		<text x={750} y={146} textAnchor="middle" fontFamily={mono} fontSize={40} fontWeight={700} fill={COLORS.blue}>
			ISO
		</text>
	</svg>
);

const Chip: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Interactive.Div
			name="Chip"
			style={{
				position: 'absolute',
				left: 110,
				top: 360,
				width: 660,
				height: 170,
				borderRadius: 85,
				backgroundColor: '#2F6BFF',
				color: 'white',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: mono,
				fontSize: 118,
				fontWeight: 700,
				letterSpacing: -2,
				boxShadow: '0 20px 40px rgba(47,107,255,0.45)',
				translate: interpolate(frame, [0, 5], ['0px -520px', '0px 0px'], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.in(Easing.quad),
				}),
				scale: interpolate(frame, [0, 5, 7, 11], [1.5, 1, 1.06, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					output: 'perceptual-scale',
				}),
				opacity: interpolate(frame, [0, 2], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
			}}
		>
			pacs.008
		</Interactive.Div>
	);
};

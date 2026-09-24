import React from 'react';
import {Easing, Interactive, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {BEATS} from './voiceover';
import {COLORS, sans} from './theme';

/** On screen from frame 1 so muted viewers get the hook too. */
export const Headline: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<div
			style={{
				position: 'absolute',
				top: 104,
				left: 80,
				right: 80,
				textAlign: 'center',
				fontFamily: sans,
				fontWeight: 800,
				fontSize: 84,
				lineHeight: 1.04,
				letterSpacing: -2,
				color: COLORS.text,
				opacity: interpolate(frame, [BEATS.zoomOut, BEATS.zoomOut + 8], [1, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
				translate: `0px ${interpolate(frame, [BEATS.zoomOut, BEATS.zoomOut + 8], [0, -30], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})}px`,
				zIndex: 2,
			}}
		>
			What really happens when you tap <span style={{color: COLORS.blue}}>Send?</span>
		</div>
	);
};

/** "Done?" slams in on the music cut; "Not quite." follows as the phone dims. */
export const DoneOverlay: React.FC = () => {
	const frame = useCurrentFrame();
	const exit = interpolate(frame, [BEATS.zoomOut, BEATS.zoomOut + 8], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 560,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				fontFamily: sans,
				opacity: exit,
				zIndex: 3,
			}}
		>
			<Sequence name="Done? slam" from={BEATS.doneSlam} layout="none">
				<DoneWord />
			</Sequence>
			<Sequence name="Not quite." from={BEATS.notQuite} layout="none">
				<NotQuite />
			</Sequence>
		</div>
	);
};

const DoneWord: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Interactive.Div
			name="Done?"
			style={{
				fontSize: 230,
				fontWeight: 800,
				letterSpacing: -8,
				lineHeight: 1,
				color: 'white',
				WebkitTextStroke: '14px #0D1B2A',
				paintOrder: 'stroke fill',
				textShadow: '0 16px 50px rgba(0,0,0,0.55)',
				scale: interpolate(frame, [0, 4, 7], [2.4, 0.94, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: [Easing.in(Easing.quad), Easing.bezier(0.16, 1, 0.3, 1)],
					output: 'perceptual-scale',
				}),
				opacity: interpolate(frame, [0, 2], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
				translate: interpolate(frame, [4, 5, 6, 7, 8], ['0px 0px', '-10px 4px', '8px -3px', '-4px 2px', '0px 0px'], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
			}}
		>
			Done?
		</Interactive.Div>
	);
};

const NotQuite: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Interactive.Div
			name="Not quite"
			style={{
				marginTop: 10,
				fontSize: 88,
				fontWeight: 700,
				color: '#FF8A55',
				WebkitTextStroke: '10px #0D1B2A',
				paintOrder: 'stroke fill',
				textShadow: '0 10px 30px rgba(0,0,0,0.6)',
				opacity: interpolate(frame, [0, 6], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
				translate: interpolate(frame, [0, 8], ['0px 24px', '0px 0px'], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.16, 1, 0.3, 1),
				}),
			}}
		>
			Not quite.
		</Interactive.Div>
	);
};

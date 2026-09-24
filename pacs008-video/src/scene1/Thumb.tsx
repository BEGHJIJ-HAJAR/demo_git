import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {BEATS} from './voiceover';
import {buttonCenterOnCanvas} from './theme';

/** The thumb is already moving at frame 0, lands on Send, then pulls away. */
export const Thumb: React.FC = () => {
	const frame = useCurrentFrame();
	const target = buttonCenterOnCanvas();
	const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

	const x = interpolate(
		frame,
		[0, BEATS.press - 2, BEATS.press + 6, BEATS.press + 24],
		[target.x + 230, target.x + 18, target.x + 18, target.x + 300],
		{...clamp, easing: [Easing.bezier(0.3, 0, 0.2, 1), Easing.linear, Easing.bezier(0.5, 0, 0.9, 0.6)]},
	);
	const y = interpolate(
		frame,
		[0, BEATS.press - 2, BEATS.press + 6, BEATS.press + 24],
		[target.y + 260, target.y + 6, target.y + 6, target.y + 420],
		{...clamp, easing: [Easing.bezier(0.3, 0, 0.2, 1), Easing.linear, Easing.bezier(0.5, 0, 0.9, 0.6)]},
	);
	const pressScale = interpolate(frame, [BEATS.press - 2, BEATS.press, BEATS.press + 5], [1, 0.94, 1], clamp);

	if (frame > BEATS.press + 26) {
		return null;
	}

	return (
		<div
			style={{
				position: 'absolute',
				left: x - 60,
				top: y - 30,
				width: 120,
				height: 260,
				rotate: '-24deg',
				transformOrigin: '60px 30px',
				scale: pressScale,
				borderRadius: '60px 60px 50px 50px',
				background: 'linear-gradient(180deg, #E8B793 0%, #D59C77 70%, #C98D69 100%)',
				boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: 22,
					top: 14,
					width: 76,
					height: 78,
					borderRadius: '38px 38px 26px 26px',
					background: 'linear-gradient(180deg, #F7DDD0 0%, #EDC6B3 100%)',
					opacity: 0.9,
				}}
			/>
		</div>
	);
};

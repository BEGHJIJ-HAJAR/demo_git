import React from 'react';
import {Easing, Interactive, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {BEATS} from './voiceover';
import {BUTTON, COLORS, PHONE, sans} from './theme';
import {CASABLANCA} from './geometry';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * The banking app. Hook 1 (the tap) and Hook 2 (Payment sent / Done?),
 * then shrinks into Casablanca as the camera pulls back to the map card.
 */
export const Phone: React.FC = () => {
	const frame = useCurrentFrame();

	const zoomProgress = interpolate(frame, [BEATS.zoomOut, BEATS.zoomOut + 16], [0, 1], {
		...clamp,
		easing: Easing.bezier(0.65, 0, 0.35, 1),
	});
	const dim = interpolate(frame, [BEATS.notQuite, BEATS.notQuite + 8], [0, 0.45], clamp);
	const buttonPress = interpolate(
		frame,
		[BEATS.press - 2, BEATS.press, BEATS.press + 5],
		[1, 0.93, 1],
		clamp,
	);
	const sent = frame >= BEATS.paymentSent;

	return (
		<div
			style={{
				position: 'absolute',
				left: PHONE.centerX - PHONE.width / 2,
				top: PHONE.centerY - PHONE.height / 2,
				width: PHONE.width,
				height: PHONE.height,
				translate: `${(CASABLANCA.x - PHONE.centerX) * zoomProgress}px ${(CASABLANCA.y - PHONE.centerY) * zoomProgress}px`,
				scale: interpolate(zoomProgress, [0, 1], [1, 0.08], {output: 'perceptual-scale'}),
				opacity: interpolate(zoomProgress, [0.6, 1], [1, 0], clamp),
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 56,
					backgroundColor: '#05080E',
					boxShadow: '0 40px 80px rgba(0,0,0,0.45), inset 0 0 0 2px #2A3342',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: PHONE.bezel,
					borderRadius: 44,
					overflow: 'hidden',
					backgroundColor: '#F5F7FB',
					fontFamily: sans,
					color: COLORS.ink,
				}}
			>
				<StatusBar />
				{sent ? null : <SendScreen />}
				<Sequence name="Payment sent" from={BEATS.paymentSent} layout="none">
					<SentScreen />
				</Sequence>
				<div
					style={{
						position: 'absolute',
						left: BUTTON.x,
						top: BUTTON.y,
						width: BUTTON.width,
						height: BUTTON.height,
						borderRadius: 42,
						backgroundColor: sent ? COLORS.ink : COLORS.blue,
						color: 'white',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 32,
						fontWeight: 700,
						scale: buttonPress,
						overflow: 'hidden',
						boxShadow: sent ? 'none' : '0 12px 24px rgba(47,107,255,0.35)',
					}}
				>
					{sent ? 'Done' : 'Send'}
					<Sequence name="Ripple" from={BEATS.press} durationInFrames={18} layout="none">
						<Ripple />
					</Sequence>
				</div>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						backgroundColor: 'black',
						opacity: dim,
					}}
				/>
			</div>
			<div
				style={{
					position: 'absolute',
					top: PHONE.bezel + 10,
					left: '50%',
					translate: '-50% 0',
					width: 110,
					height: 30,
					borderRadius: 15,
					backgroundColor: '#05080E',
				}}
			/>
		</div>
	);
};

const StatusBar: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			top: 16,
			left: 32,
			right: 32,
			display: 'flex',
			justifyContent: 'space-between',
			fontSize: 17,
			fontWeight: 600,
		}}
	>
		<span>9:41</span>
		<span style={{display: 'flex', alignItems: 'flex-end', gap: 3}}>
			{[8, 11, 14, 17].map((h) => (
				<span key={h} style={{width: 4, height: h, borderRadius: 1, backgroundColor: COLORS.ink}} />
			))}
		</span>
	</div>
);

const SendScreen: React.FC = () => (
	<div style={{position: 'absolute', inset: 0, padding: '70px 26px 0'}}>
		<div style={{fontSize: 30, fontWeight: 800}}>Send money</div>
		<div
			style={{
				marginTop: 26,
				padding: 20,
				borderRadius: 22,
				backgroundColor: 'white',
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				boxShadow: '0 4px 14px rgba(13,27,42,0.06)',
			}}
		>
			<div
				style={{
					width: 56,
					height: 56,
					borderRadius: 28,
					backgroundColor: COLORS.germany,
					color: COLORS.blue,
					fontWeight: 800,
					fontSize: 20,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				LM
			</div>
			<div>
				<div style={{fontSize: 15, color: COLORS.inkMuted}}>To</div>
				<div style={{fontSize: 23, fontWeight: 700}}>Lukas M.</div>
				<div style={{fontSize: 16, color: COLORS.inkMuted}}>Hamburg · DE</div>
			</div>
		</div>
		<div style={{marginTop: 58, textAlign: 'center', fontSize: 15, color: COLORS.inkMuted}}>
			Amount
		</div>
		<div
			style={{
				textAlign: 'center',
				fontSize: 50,
				fontWeight: 800,
				letterSpacing: -1.5,
				marginTop: 4,
			}}
		>
			€10,000.00
		</div>
		<div style={{textAlign: 'center', fontSize: 16, color: COLORS.inkMuted, marginTop: 10}}>
			From Yasmine · Casablanca · MA
		</div>
	</div>
);

const SentScreen: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				paddingTop: 150,
			}}
		>
			<Interactive.Div
				name="Checkmark"
				style={{
					width: 150,
					height: 150,
					borderRadius: 75,
					backgroundColor: COLORS.green,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					scale: interpolate(frame, [0, 12], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 9, stiffness: 180}),
						output: 'perceptual-scale',
					}),
				}}
			>
				<svg width="84" height="84" viewBox="0 0 84 84">
					<path
						d="M18 44 L35 60 L66 26"
						fill="none"
						stroke="white"
						strokeWidth="11"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeDasharray="80"
						strokeDashoffset={interpolate(frame, [4, 14], [80, 0], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.16, 1, 0.3, 1),
						})}
					/>
				</svg>
			</Interactive.Div>
			<Interactive.Div
				name="Payment sent title"
				style={{
					marginTop: 34,
					fontSize: 34,
					fontWeight: 800,
					opacity: interpolate(frame, [3, 10], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
					translate: interpolate(frame, [3, 12], ['0px 16px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.bezier(0.16, 1, 0.3, 1),
					}),
				}}
			>
				Payment sent
			</Interactive.Div>
			<Interactive.Div
				name="Payment sent detail"
				style={{
					marginTop: 10,
					fontSize: 19,
					color: '#6B7A8C',
					opacity: interpolate(frame, [6, 13], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				€10,000.00 to Lukas M.
			</Interactive.Div>
		</div>
	);
};

const Ripple: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Interactive.Div
			name="Ripple circle"
			style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				width: 360,
				height: 360,
				marginLeft: -180,
				marginTop: -180,
				borderRadius: 180,
				backgroundColor: 'white',
				scale: interpolate(frame, [0, 16], [0.05, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.16, 1, 0.3, 1),
					output: 'perceptual-scale',
				}),
				opacity: interpolate(frame, [0, 16], [0.45, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
			}}
		/>
	);
};

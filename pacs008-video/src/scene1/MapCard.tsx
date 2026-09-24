import React from 'react';
import {Easing, Interactive, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {BEATS} from './voiceover';
import {COLORS, HEIGHT, WIDTH, sans} from './theme';
import {
	BORDER_BOUNDS,
		BORDER_PATH,
	CASABLANCA,
	HAMBURG,
	MAP_CARD,
	ROUTE_PATH,
	borderXAt,
	routeAt,
	routeTFromBorder,
} from './geometry';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const COIN_RADIUS = 40;
const COIN_STOP_T = routeTFromBorder(-(COIN_RADIUS + 8));
const CROSS_POSITION = routeAt(routeTFromBorder(44));

/**
 * Hook 3: the map card the camera pulls back to.
 * The € coin slides along the route and stops dead at the border.
 */
export const MapCard: React.FC = () => {
	const frame = useCurrentFrame();

	const appear = interpolate(frame, [BEATS.zoomOut + 2, BEATS.zoomOut + 16], [0, 1], {
		...clamp,
		easing: Easing.bezier(0.65, 0, 0.35, 1),
	});
	// Fades back as the envelope rushes toward the camera for the match cut.
	const exit = interpolate(frame, [BEATS.matchCut, BEATS.matchCut + 12], [1, 0], clamp);

	if (frame < BEATS.zoomOut) {
		return null;
	}

	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				opacity: appear * exit,
				scale: interpolate(appear, [0, 1], [2.4, 1], {output: 'perceptual-scale'}),
				transformOrigin: `${CASABLANCA.x}px ${CASABLANCA.y}px`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: MAP_CARD.x,
					top: MAP_CARD.y,
					width: MAP_CARD.width,
					height: MAP_CARD.height,
					borderRadius: 40,
					backgroundColor: COLORS.card,
					boxShadow: '0 40px 90px rgba(0,0,0,0.4)',
					overflow: 'hidden',
				}}
			/>
			<svg
				width={WIDTH}
				height={HEIGHT}
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
				style={{position: 'absolute', inset: 0}}
			>
				<defs>
					<clipPath id="card">
						<rect
							x={MAP_CARD.x}
							y={MAP_CARD.y + 120}
							width={MAP_CARD.width}
							height={MAP_CARD.height - 120}
							rx={40}
						/>
					</clipPath>
				</defs>
				<g clipPath="url(#card)">
					<path d={regionPath('left')} fill={COLORS.morocco} />
					<path d={regionPath('right')} fill={COLORS.germany} />
				</g>
				<path
					d={BORDER_PATH}
					fill="none"
					stroke={COLORS.border}
					strokeWidth={4}
					strokeDasharray="2 12"
					strokeLinecap="round"
				/>
				<text
					x={borderXAt(BORDER_BOUNDS.bottom - 30) + 18}
					y={BORDER_BOUNDS.bottom - 30}
					fontFamily={sans}
					fontSize={22}
					fontWeight={700}
					letterSpacing={3}
					fill={COLORS.border}
				>
					BORDER
				</text>
				<path
					d={ROUTE_PATH}
					fill="none"
					stroke={COLORS.ink}
					strokeOpacity={0.55}
					strokeWidth={6}
					strokeDasharray="16 14"
					strokeLinecap="round"
					strokeDashoffset={-frame * 1.2}
				/>
				<CountryLabel x={MAP_CARD.x + 44} y={MAP_CARD.y + 190} label="MOROCCO" />
				<CountryLabel x={MAP_CARD.x + MAP_CARD.width - 44} y={MAP_CARD.y + MAP_CARD.height - 50} label="GERMANY" anchor="end" />
				<CityPin x={CASABLANCA.x} y={CASABLANCA.y} name="Casablanca" labelBelow />
				<CityPin x={HAMBURG.x} y={HAMBURG.y} name="Hamburg" />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: MAP_CARD.x + 44,
					top: MAP_CARD.y + 34,
					right: WIDTH - MAP_CARD.x - MAP_CARD.width + 44,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'baseline',
					fontFamily: sans,
					color: COLORS.ink,
				}}
			>
				<div style={{fontSize: 46, fontWeight: 800, letterSpacing: -1}}>€10,000</div>
				<div style={{fontSize: 30, fontWeight: 600, color: COLORS.inkMuted, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>
					Casablanca{' '}
					<svg width="34" height="22" viewBox="0 0 34 22" style={{margin: '0 6px'}}>
						<path d="M2 11 H28 M20 3 L30 11 L20 19" fill="none" stroke={COLORS.inkMuted} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>{' '}
					Hamburg
				</div>
			</div>
			<Coin />
			<Sequence name="Border ✕" from={BEATS.coinHitsBorder} layout="none">
				<BorderCross />
			</Sequence>
		</div>
	);
};

const regionPath = (side: 'left' | 'right') => {
	const points: string[] = [];
	for (let y = MAP_CARD.y; y <= MAP_CARD.y + MAP_CARD.height; y += 10) {
		points.push(`${borderXAt(y).toFixed(1)} ${y}`);
	}
	const edgeX = side === 'left' ? MAP_CARD.x : MAP_CARD.x + MAP_CARD.width;
	return `M ${edgeX} ${MAP_CARD.y} L ${points.join(' L ')} L ${edgeX} ${MAP_CARD.y + MAP_CARD.height} Z`;
};

const CountryLabel: React.FC<{x: number; y: number; label: string; anchor?: 'start' | 'end'}> = ({
	x,
	y,
	label,
	anchor = 'start',
}) => (
	<text
		x={x}
		y={y}
		textAnchor={anchor}
		fontFamily={sans}
		fontSize={26}
		fontWeight={800}
		letterSpacing={5}
		fill={COLORS.ink}
		fillOpacity={0.35}
	>
		{label}
	</text>
);

const CityPin: React.FC<{x: number; y: number; name: string; labelBelow?: boolean}> = ({
	x,
	y,
	name,
	labelBelow,
}) => (
	<g>
		<circle cx={x} cy={y} r={26} fill={COLORS.ink} fillOpacity={0.12} />
		<circle cx={x} cy={y} r={13} fill={COLORS.ink} />
		<circle cx={x} cy={y} r={5} fill="white" />
		<text
			x={x}
			y={labelBelow ? y + 66 : y - 44}
			textAnchor="middle"
			fontFamily={sans}
			fontSize={34}
			fontWeight={700}
			fill={COLORS.ink}
		>
			{name}
		</text>
	</g>
);

const Coin: React.FC = () => {
	const frame = useCurrentFrame();

	const t = interpolate(frame, [BEATS.coinStart, BEATS.coinHitsBorder], [0, COIN_STOP_T], {
		...clamp,
		// Accelerates into the border and stops dead: no ease-out.
		easing: Easing.bezier(0.45, 0, 1, 1),
	});
	const recoil = interpolate(
		frame,
		[BEATS.coinHitsBorder, BEATS.coinHitsBorder + 3, BEATS.coinHitsBorder + 9],
		[0, 0.018, 0],
		{...clamp, easing: [Easing.out(Easing.quad), Easing.bezier(0.16, 1, 0.3, 1)]},
	);
	const squash = interpolate(
		frame,
		[BEATS.coinHitsBorder, BEATS.coinHitsBorder + 2, BEATS.coinHitsBorder + 8],
		[1, 0.82, 1],
		clamp,
	);
	const appear = interpolate(frame, [BEATS.zoomOut + 10, BEATS.zoomOut + 20], [0, 1], {
		...clamp,
		easing: Easing.spring({damping: 12}),
	});
	const p = routeAt(Math.max(0, t - recoil));

	return (
		<div
			style={{
				position: 'absolute',
				left: p.x - COIN_RADIUS,
				top: p.y - COIN_RADIUS,
				width: COIN_RADIUS * 2,
				height: COIN_RADIUS * 2,
				borderRadius: COIN_RADIUS,
				background: `radial-gradient(circle at 35% 30%, #FFE08A 0%, ${COLORS.gold} 55%, ${COLORS.goldDark} 100%)`,
				boxShadow: `0 10px 20px rgba(0,0,0,0.25), inset 0 0 0 4px ${COLORS.goldDark}`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: sans,
				fontSize: 46,
				fontWeight: 800,
				color: '#7A4E00',
				scale: `${appear * squash} ${appear}`,
			}}
		>
			€
		</div>
	);
};

const BorderCross: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<Interactive.Div
			name="Orange cross"
			style={{
				position: 'absolute',
				left: CROSS_POSITION.x - 38,
				top: CROSS_POSITION.y - 38,
				width: 76,
				height: 76,
				borderRadius: 38,
				backgroundColor: '#FF6B2C',
				boxShadow: '0 10px 24px rgba(255,107,44,0.45)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				scale: interpolate(frame, [0, 10], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.spring({damping: 8, stiffness: 200}),
					output: 'perceptual-scale',
				}),
			}}
		>
			<svg width="40" height="40" viewBox="0 0 40 40">
				<path d="M9 9 L31 31 M31 9 L9 31" stroke="white" strokeWidth="7" strokeLinecap="round" />
			</svg>
		</Interactive.Div>
	);
};

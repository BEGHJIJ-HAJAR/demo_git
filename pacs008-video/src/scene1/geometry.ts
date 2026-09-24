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

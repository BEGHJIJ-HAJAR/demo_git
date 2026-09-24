import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts are bundled in public/fonts (OFL licensed) so renders work offline.
export const sans = 'Inter';
export const mono = 'JetBrains Mono';

for (const weight of ['400', '600', '700', '800']) {
	loadFont({family: sans, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight});
}
loadFont({family: mono, url: staticFile('fonts/jetbrains-mono-latin-700-normal.woff2'), weight: '700'});

export const COLORS = {
	background: '#0D1B2A',
	backgroundGlow: '#16304D',
	text: '#FFFFFF',
	textMuted: '#9FB3C8',
	blue: '#2F6BFF',
	green: '#1FB57A',
	orange: '#FF6B2C',
	gold: '#F5B83D',
	goldDark: '#C98A14',
	card: '#FFFFFF',
	ink: '#0D1B2A',
	inkMuted: '#6B7A8C',
	morocco: '#F6E7D3',
	germany: '#DCE6F6',
	border: '#8A97A8',
};

// Composition: 1080 x 1350 (LinkedIn 4:5 portrait feed video).
export const WIDTH = 1080;
export const HEIGHT = 1350;

// Phone placement in composition coordinates.
export const PHONE = {
	width: 380,
	height: 780,
	centerX: WIDTH / 2,
	centerY: 735,
	bezel: 14,
};

// Send / Done button, in phone-screen coordinates.
export const BUTTON = {
	x: 26,
	y: 630,
	width: 300,
	height: 84,
};

export const buttonCenterOnCanvas = () => ({
	x: PHONE.centerX - PHONE.width / 2 + PHONE.bezel + BUTTON.x + BUTTON.width / 2,
	y: PHONE.centerY - PHONE.height / 2 + PHONE.bezel + BUTTON.y + BUTTON.height / 2,
});

import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {z} from 'zod';
import {COLORS} from './theme';
import {Headline, DoneOverlay} from './Headline';
import {Phone} from './Phone';
import {Thumb} from './Thumb';
import {MapCard} from './MapCard';
import {Envelope} from './Envelope';
import {Captions} from './Captions';
import {Soundtrack} from './Soundtrack';

export const scene1Schema = z.object({
	/** Path inside public/ (e.g. "voiceover/scene1.mp3") or a URL. Leave empty until recorded. */
	voiceover: z.string(),
	captions: z.boolean(),
});

export type Scene1Props = z.infer<typeof scene1Schema>;

export const Scene1Hook: React.FC<Scene1Props> = ({voiceover, captions}) => {
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(120% 80% at 50% 45%, ${COLORS.backgroundGlow} 0%, ${COLORS.background} 70%)`,
				overflow: 'hidden',
			}}
		>
			<Headline />
			<MapCard />
			<Phone />
			<DoneOverlay />
			<Thumb />
			<Envelope />
			{captions ? <Captions /> : null}
			<Soundtrack />
			{voiceover ? (
				<Audio src={voiceover.startsWith('http') ? voiceover : staticFile(voiceover)} />
			) : null}
		</AbsoluteFill>
	);
};

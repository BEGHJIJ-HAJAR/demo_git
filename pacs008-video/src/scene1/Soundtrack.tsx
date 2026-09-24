import React from 'react';
import {Audio} from '@remotion/media';
import {Sequence, interpolate, staticFile} from 'remotion';
import {BEATS, DURATION_IN_FRAMES, FPS} from './voiceover';

const Sfx: React.FC<{name: string; at: number; file: string; volume?: number}> = ({
	name,
	at,
	file,
	volume = 1,
}) => (
	<Sequence name={name} from={at} layout="none">
		<Audio src={staticFile(`audio/${file}`)} volume={volume} />
	</Sequence>
);

/**
 * Music and sound design for Scene 1. The stamp thud is deliberately absent:
 * it is reserved for Step 4 (settlement).
 */
export const Soundtrack: React.FC = () => {
	return (
		<>
			{/* Music bed, hard-cut on "Done?" */}
			<Sequence name="Music (until Done?)"  durationInFrames={BEATS.doneSlam} layout="none">
				<Audio src={staticFile('audio/music.wav')} volume={0.32} />
			</Sequence>
			{/* Comes back quietly under the map, fading out into the match cut. */}
			<Sequence name="Music (map)" from={BEATS.zoomOut} layout="none">
				<Audio
					src={staticFile('audio/music.wav')}
					trimBefore={Math.round(4.8 * FPS)}
					volume={(f) =>
						interpolate(
							f,
							[0, 15, DURATION_IN_FRAMES - BEATS.zoomOut - 20, DURATION_IN_FRAMES - BEATS.zoomOut],
							[0, 0.2, 0.2, 0],
							{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
						)
					}
				/>
			</Sequence>

			<Sfx name="Click (tap Send)" at={BEATS.press} file="click.wav" volume={0.8} />
			<Sfx name="Pop (checkmark)" at={BEATS.paymentSent} file="pop.wav" volume={0.5} />
			<Sfx name="Bonk (coin at border)" at={BEATS.coinHitsBorder} file="bonk.wav" volume={0.75} />
			<Sfx name="Pop (envelope)" at={BEATS.envelopePops} file="pop.wav" volume={0.45} />
			<Sfx name="Whoosh (over the border)" at={BEATS.envelopeFlies} file="whoosh.wav" volume={0.7} />
			<Sfx name="Tick (chip lands)" at={BEATS.chipLands} file="tick.wav" volume={0.6} />
			<Sfx name="Rise (match cut)" at={BEATS.matchCut - 4} file="rise.wav" volume={0.5} />
		</>
	);
};

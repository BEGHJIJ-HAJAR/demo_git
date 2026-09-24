import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {createTikTokStyleCaptions} from '@remotion/captions';
import type {TikTokPage} from '@remotion/captions';
import {VOICEOVER} from './voiceover';
import {COLORS, sans} from './theme';

// Pages are split by `pageBreakAfter` in the voiceover; this is only an upper bound.
const MAX_PAGE_MS = 3000;
const LINGER_MS = 400;

/** Burned-in captions, on from 0:00, with the spoken word highlighted. */
export const Captions: React.FC = () => {
	const {fps} = useVideoConfig();
	const {pages} = useMemo(
		() =>
			createTikTokStyleCaptions({
				captions: VOICEOVER,
				combineTokensWithinMilliseconds: MAX_PAGE_MS,
			}),
		[],
	);

	return (
		<AbsoluteFill style={{zIndex: 10}}>
			{pages.map((page, index) => {
				const nextPage = pages[index + 1] ?? null;
				const lastToken = page.tokens[page.tokens.length - 1];
				const endMs = Math.min(
					nextPage ? nextPage.startMs : Infinity,
					lastToken.toMs + LINGER_MS,
				);
				const startFrame = Math.round((page.startMs / 1000) * fps);
				const durationInFrames = Math.round((endMs / 1000) * fps) - startFrame;
				if (durationInFrames <= 0) {
					return null;
				}
				return (
					<Sequence
						key={page.startMs}
						name={`Caption: ${page.text.trim()}`}
						from={startFrame}
						durationInFrames={durationInFrames}
					>
						<CaptionPage page={page} />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};

const CaptionPage: React.FC<{page: TikTokPage}> = ({page}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const absoluteTimeMs = page.startMs + (frame / fps) * 1000;

	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 110}}>
			<div
				style={{
					fontFamily: sans,
					fontSize: 52,
					fontWeight: 800,
					whiteSpace: 'pre',
					padding: '12px 30px 16px',
					borderRadius: 22,
					backgroundColor: 'rgba(5, 12, 22, 0.88)',
					color: COLORS.text,
				}}
			>
				{page.tokens.map((token, i) => {
					const isActive = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
					return (
						<span key={`${token.fromMs}-${i}`} style={{color: isActive ? COLORS.gold : COLORS.text}}>
							{token.text}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

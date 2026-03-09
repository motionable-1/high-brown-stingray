import React from "react";
import {
  AbsoluteFill,
  Artifact,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Audio,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { GridBackground } from "../library/components/effects/GridBackground";
import { blurDissolve } from "../library/components/layout/transitions/presentations/blurDissolve";
import { IntroScene } from "./scenes/IntroScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { StatsScene } from "./scenes/StatsScene";
import { CTAScene } from "./scenes/CTAScene";

// Audio assets
const BG_MUSIC =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/music/1773053118274_quuv5rjjntl_music_Modern_corporate_tec.mp3";
const SFX_WHOOSH =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1773053100992_niyouuc1puj_sfx_Subtle_modern_tech_UI_whoosh_t.mp3";
const SFX_CHIME =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1773053104881_hcboopbpj9q_sfx_Soft_futuristic_success_chime_.mp3";

/*
 * Timeline (30 fps):
 *   Intro:    0–120 (4s)
 *   Trans 1:  15 frames overlap
 *   Features: 120–270 (5s)
 *   Trans 2:  15 frames overlap
 *   Stats:    270–420 (5s)
 *   Trans 3:  15 frames overlap
 *   CTA:      420–570 (5s)
 *   Buffer:   +30 frames
 *
 *   Total = 120 + 150 + 150 + 150 - 15*3 + 30 = 555
 */

const TRANSITION_DURATION = 20;

/** Subtle ambient gradient that shifts over time */
const AmbientGradient: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const hueShift = Math.sin(t * 0.3) * 8;
  const x1 = 30 + Math.sin(t * 0.2) * 15;
  const y1 = 20 + Math.cos(t * 0.25) * 12;
  const x2 = 70 + Math.cos(t * 0.18) * 15;
  const y2 = 60 + Math.sin(t * 0.22) * 12;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(circle at ${x1}% ${y1}%, rgba(97,95,255,${0.08 + Math.sin(t * 0.4) * 0.03}), transparent 50%),
          radial-gradient(circle at ${x2}% ${y2}%, rgba(79,57,246,${0.06 + Math.cos(t * 0.5) * 0.02}), transparent 55%)
        `,
        filter: `hue-rotate(${hueShift}deg)`,
      }}
    />
  );
};

/** Floating decorative dots */
const FloatingDots: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const dots = [
    { x: 5, y: 10, size: 6, speed: 1.1, phase: 0 },
    { x: 92, y: 85, size: 5, speed: 0.9, phase: 1 },
    { x: 95, y: 8, size: 4, speed: 1.3, phase: 2.2 },
    { x: 3, y: 90, size: 5, speed: 0.7, phase: 3.1 },
    { x: 50, y: 5, size: 3, speed: 1.5, phase: 0.8 },
    { x: 48, y: 92, size: 4, speed: 1.0, phase: 1.7 },
  ];

  return (
    <>
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            borderRadius: "50%",
            background: "#615FFF",
            opacity: 0.15 + Math.sin(t * dot.speed + dot.phase) * 0.08,
            transform: `translateY(${Math.sin(t * dot.speed + dot.phase) * 8}px)`,
          }}
        />
      ))}
    </>
  );
};

export const Main: React.FC = () => {
  const { fontFamily: headingFont } = loadSpaceGrotesk();
  const { fontFamily: bodyFont } = loadInter();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Global fade in / fade out
  const globalFadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globalFadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* Thumbnail */}
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}

      <AbsoluteFill
        style={{
          fontFamily: `${headingFont}, ${bodyFont}, sans-serif`,
          opacity: globalFadeIn * globalFadeOut,
        }}
      >
        {/* Base background */}
        <AbsoluteFill style={{ backgroundColor: "#FAFAF9" }} />

        {/* Animated grid */}
        <GridBackground
          cellSize={48}
          color="rgba(97, 95, 255, 0.04)"
          style="dots"
          lineWidth={1.5}
          animate
          velocity={12}
          direction="up"
          fadeEdges
        />

        {/* Ambient gradient */}
        <AmbientGradient />

        {/* Floating dots */}
        <FloatingDots />

        {/* Scene transitions */}
        <TransitionSeries>
          {/* Intro Scene - 120 frames (4s) */}
          <TransitionSeries.Sequence durationInFrames={120}>
            <AbsoluteFill style={{ fontFamily: `${headingFont}, ${bodyFont}, sans-serif` }}>
              <IntroScene />
            </AbsoluteFill>
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={blurDissolve()}
            timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
          />

          {/* Features Scene - 150 frames (5s) */}
          <TransitionSeries.Sequence durationInFrames={150}>
            <AbsoluteFill style={{ fontFamily: `${headingFont}, ${bodyFont}, sans-serif` }}>
              <FeaturesScene />
            </AbsoluteFill>
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={blurDissolve()}
            timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
          />

          {/* Stats Scene - 150 frames (5s) */}
          <TransitionSeries.Sequence durationInFrames={150}>
            <AbsoluteFill style={{ fontFamily: `${headingFont}, ${bodyFont}, sans-serif` }}>
              <StatsScene />
            </AbsoluteFill>
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={blurDissolve()}
            timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
          />

          {/* CTA Scene - 150 frames (5s) + buffer */}
          <TransitionSeries.Sequence durationInFrames={180}>
            <AbsoluteFill style={{ fontFamily: `${headingFont}, ${bodyFont}, sans-serif` }}>
              <CTAScene />
            </AbsoluteFill>
          </TransitionSeries.Sequence>
        </TransitionSeries>

        {/* Background music */}
        <Audio
          src={BG_MUSIC}
          volume={(f) =>
            interpolate(
              f,
              [0, 30, durationInFrames - 60, durationInFrames],
              [0, 0.3, 0.3, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          }
        />

        {/* SFX: Intro whoosh */}
        <Sequence from={0}>
          <Audio src={SFX_WHOOSH} volume={0.25} />
        </Sequence>

        {/* SFX: Transition whooshes */}
        <Sequence from={112}>
          <Audio src={SFX_WHOOSH} volume={0.2} />
        </Sequence>
        <Sequence from={247}>
          <Audio src={SFX_WHOOSH} volume={0.2} />
        </Sequence>
        <Sequence from={382}>
          <Audio src={SFX_WHOOSH} volume={0.2} />
        </Sequence>

        {/* SFX: Stats chime */}
        <Sequence from={290}>
          <Audio src={SFX_CHIME} volume={0.2} />
        </Sequence>
      </AbsoluteFill>
    </>
  );
};

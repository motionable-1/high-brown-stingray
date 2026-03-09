import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img } from "remotion";
import { FadeInWords } from "../../library/components/text/TextAnimation";

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  accentColor?: string;
  index?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  accentColor = "#615FFF",
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardDelay = index * 4;
  const cardScale = spring({ frame, fps, delay: cardDelay, config: { damping: 14, stiffness: 120 } });
  const cardY = interpolate(cardScale, [0, 1], [60, 0]);

  const iconScale = spring({ frame, fps, delay: cardDelay + 8, config: { damping: 10 } });
  const iconRotate = interpolate(iconScale, [0, 1], [-20, 0]);

  const shimmer = interpolate(frame, [20, 60], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: interpolate(cardScale, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        width: 320,
        padding: 36,
        borderRadius: 24,
        background: "white",
        boxShadow: `0 4px 30px ${accentColor}15, 0 1px 3px rgba(0,0,0,0.06)`,
        border: `1px solid ${accentColor}20`,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "flex-start",
        gap: 16,
        position: "relative" as const,
        overflow: "hidden",
      }}
    >
      {/* Shimmer effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: shimmer,
          width: 60,
          height: "100%",
          background: `linear-gradient(90deg, transparent, ${accentColor}08, transparent)`,
          transform: "skewX(-15deg)",
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: `${accentColor}12`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${iconScale}) rotate(${iconRotate}deg)`,
        }}
      >
        <Img src={icon} width={32} height={32} />
      </div>

      {/* Title */}
      <FadeInWords
        startFrom={cardDelay + 12}
        stagger={0.06}
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#292524",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </FadeInWords>

      {/* Description */}
      <div
        style={{
          fontSize: 15,
          fontWeight: 400,
          color: "#78716c",
          lineHeight: 1.5,
          opacity: interpolate(frame, [cardDelay + 18, cardDelay + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(frame, [cardDelay + 18, cardDelay + 30], [10, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px)`,
        }}
      >
        {description}
      </div>
    </div>
  );
};

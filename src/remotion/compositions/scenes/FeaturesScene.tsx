import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FadeInWords } from "../../library/components/text/TextAnimation";
import { FeatureCard } from "./FeatureCard";

const CODE_ICON = "https://api.iconify.design/lucide/code-2.svg?color=%23615FFF&width=64";
const MAIL_ICON = "https://api.iconify.design/lucide/mail.svg?color=%23615FFF&width=64";
const SHIELD_ICON = "https://api.iconify.design/lucide/shield-check.svg?color=%23615FFF&width=64";

const features = [
  {
    icon: CODE_ICON,
    title: "Developer-First",
    description: "Clean APIs and SDKs that integrate in minutes, not days.",
  },
  {
    icon: MAIL_ICON,
    title: "Marketing Power",
    description: "Beautiful templates, A/B testing, and smart segmentation.",
  },
  {
    icon: SHIELD_ICON,
    title: "Proven Reliability",
    description: "Enterprise-grade infrastructure with 99.9% uptime SLA.",
  },
];

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingProgress = spring({ frame, fps, config: { damping: 200 } });
  const headingY = interpolate(headingProgress, [0, 1], [40, 0]);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48 }}>
      {/* Section heading */}
      <div
        style={{
          transform: `translateY(${headingY}px)`,
          opacity: interpolate(headingProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#615FFF",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
          }}
        >
          Why AutoSend
        </div>
        <FadeInWords
          startFrom={6}
          stagger={0.08}
          style={{
            fontSize: 46,
            fontWeight: 800,
            color: "#292524",
            letterSpacing: "-0.02em",
            textAlign: "center",
            textWrap: "balance",
          }}
        >
          Built for every team
        </FadeInWords>
      </div>

      {/* Feature cards */}
      <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} index={i} />
        ))}
      </div>
    </div>
  );
};

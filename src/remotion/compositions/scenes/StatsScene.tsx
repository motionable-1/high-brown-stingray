import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img } from "remotion";
import { FadeInWords } from "../../library/components/text/TextAnimation";
import { Counter } from "../../library/components/text/Counter";

const ZAP_ICON = "https://api.iconify.design/lucide/zap.svg?color=%23615FFF&width=64";
const CHART_ICON = "https://api.iconify.design/lucide/bar-chart-3.svg?color=%23615FFF&width=64";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  icon: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, suffix, label, delay, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, delay, config: { damping: 14, stiffness: 100 } });
  const slideY = interpolate(scale, [0, 1], [50, 0]);

  const pulse = Math.sin(((frame - delay) / fps) * 2.5) * 0.03 + 1;

  return (
    <div
      style={{
        transform: `translateY(${slideY}px) scale(${scale})`,
        opacity: interpolate(scale, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        minWidth: 260,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: "#615FFF12",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${pulse})`,
        }}
      >
        <Img src={icon} width={28} height={28} />
      </div>

      {/* Number */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          color: "#292524",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <Counter
          from={0}
          to={value}
          duration={1.8}
          delay={delay / fps}
          separator=","
          suffix={suffix}
          ease="easeOut"
        />
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "#78716c",
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingProgress = spring({ frame, fps, config: { damping: 200 } });

  // Animated bar chart visual
  const bars = [0.4, 0.7, 0.55, 0.85, 0.65, 0.92, 0.78, 0.95];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56 }}>
      {/* Section label */}
      <div
        style={{
          opacity: interpolate(headingProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(headingProgress, [0, 1], [30, 0])}px)`,
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
          Trusted at Scale
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
          }}
        >
          Numbers that speak
        </FadeInWords>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
        <StatItem value={358800} suffix="+" label="Emails sent weekly" delay={10} icon={CHART_ICON} />

        {/* Mini bar chart */}
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 100 }}>
          {bars.map((h, i) => {
            const barScale = spring({
              frame,
              fps,
              delay: 15 + i * 3,
              config: { damping: 12, stiffness: 100 },
            });
            return (
              <div
                key={i}
                style={{
                  width: 14,
                  height: h * 100 * barScale,
                  borderRadius: 4,
                  background: `linear-gradient(to top, #615FFF, #4F39F6${i % 2 === 0 ? "cc" : ""})`,
                  opacity: 0.7 + barScale * 0.3,
                }}
              />
            );
          })}
        </div>

        <StatItem value={99.9} suffix="%" label="Uptime guarantee" delay={18} icon={ZAP_ICON} />
      </div>
    </div>
  );
};

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
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120 }}>
          {bars.map((h, i) => {
            const barDelay = 12 + i * 4;
            const barSpring = spring({
              frame,
              fps,
              delay: barDelay,
              config: { damping: 10, stiffness: 80 },
            });
            const barHeight = h * 120 * barSpring;
            const pulse = Math.sin(((frame - barDelay) / fps) * 2 + i * 0.5) * 2;
            return (
              <div
                key={i}
                style={{
                  width: 16,
                  height: Math.max(0, barHeight + (barSpring > 0.9 ? pulse : 0)),
                  borderRadius: 5,
                  background: `linear-gradient(to top, #615FFF, ${i % 2 === 0 ? "#4F39F6" : "#7C7AFF"})`,
                  opacity: 0.75 + barSpring * 0.25,
                  boxShadow: barSpring > 0.5 ? `0 4px 12px rgba(97,95,255,${0.2 * barSpring})` : "none",
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

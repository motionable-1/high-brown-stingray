import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img } from "remotion";
import { FadeInChars, FadeInWords } from "../../library/components/text/TextAnimation";

const ARROW_ICON = "https://api.iconify.design/lucide/arrow-right.svg?color=%23ffffff&width=48";
const SEND_ICON = "https://api.iconify.design/lucide/send.svg?color=%23ffffff&width=64";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const titleY = interpolate(titleScale, [0, 1], [60, 0]);

  const btnScale = spring({ frame, fps, delay: 20, config: { damping: 12 } });
  const btnY = interpolate(btnScale, [0, 1], [40, 0]);

  const arrowX = interpolate(frame, [30, 50, 70, 90], [0, 6, 0, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "extend",
  });

  // Floating email envelopes
  const envelopes = [
    { x: 12, y: 25, delay: 0.4, size: 36 },
    { x: 82, y: 18, delay: 0.8, size: 28 },
    { x: 88, y: 68, delay: 1.2, size: 32 },
    { x: 8, y: 72, delay: 1.6, size: 24 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
      {/* Floating envelopes */}
      {envelopes.map((e, i) => {
        const t = frame / fps;
        const floatY = Math.sin((t + e.delay) * 1.5) * 10;
        const envScale = spring({ frame, fps, delay: e.delay * fps, config: { damping: 200 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${e.x}%`,
              top: `${e.y}%`,
              transform: `translateY(${floatY}px) scale(${envScale})`,
              opacity: 0.15,
            }}
          >
            <Img
              src={`https://api.iconify.design/lucide/mail.svg?color=%23615FFF&width=${e.size}`}
              width={e.size}
              height={e.size}
            />
          </div>
        );
      })}

      {/* Logo mark */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: "linear-gradient(135deg, #615FFF, #4F39F6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${titleScale})`,
          boxShadow: "0 16px 48px rgba(97, 95, 255, 0.3)",
        }}
      >
        <Img src={SEND_ICON} width={34} height={34} />
      </div>

      {/* Main CTA text */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <FadeInChars
          startFrom={6}
          stagger={0.025}
          style={{
            fontSize: 54,
            fontWeight: 800,
            color: "#292524",
            letterSpacing: "-0.03em",
            textAlign: "center",
            textWrap: "balance",
          }}
        >
          Start sending today
        </FadeInChars>

        <FadeInWords
          startFrom={18}
          stagger={0.06}
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "#78716c",
            textAlign: "center",
            maxWidth: 480,
            textWrap: "balance",
          }}
        >
          Free tier available · No credit card required
        </FadeInWords>
      </div>

      {/* CTA Button */}
      <div
        style={{
          transform: `translateY(${btnY}px) scale(${btnScale})`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "18px 40px",
          borderRadius: 16,
          background: "linear-gradient(135deg, #615FFF, #4F39F6)",
          boxShadow: "0 12px 40px rgba(97, 95, 255, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>
          Get Started Free
        </span>
        <div style={{ transform: `translateX(${arrowX}px)` }}>
          <Img src={ARROW_ICON} width={24} height={24} />
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: "#a8a29e",
          opacity: interpolate(frame, [35, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          letterSpacing: "0.02em",
        }}
      >
        autosend.dev
      </div>
    </div>
  );
};

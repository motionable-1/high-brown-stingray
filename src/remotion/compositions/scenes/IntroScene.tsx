import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img } from "remotion";
import { FadeInWords } from "../../library/components/text/TextAnimation";

const SEND_ICON = "https://api.iconify.design/lucide/send.svg?color=%23615FFF&width=64";

const FloatingOrb: React.FC<{ x: number; y: number; size: number; delay: number; color: string }> = ({
  x, y, size, delay, color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const floatY = Math.sin((t + delay) * 1.2) * 12;
  const floatX = Math.cos((t + delay) * 0.8) * 8;
  const scale = spring({ frame, fps, config: { damping: 200 }, delay: delay * fps });
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}40, ${color}10)`,
        transform: `translate(${floatX}px, ${floatY}px) scale(${scale})`,
        filter: `blur(${size * 0.15}px)`,
      }}
    />
  );
};

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const logoRotate = interpolate(logoScale, [0, 1], [-15, 0]);
  const taglineOpacity = interpolate(frame, [25, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineY = spring({ frame, fps, delay: 20, config: { damping: 200 } });
  const taglineSlide = interpolate(taglineY, [0, 1], [30, 0]);

  const lineWidth = spring({ frame, fps, delay: 35, config: { damping: 200 } });

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Floating orbs */}
      <FloatingOrb x={15} y={20} size={180} delay={0} color="#615FFF" />
      <FloatingOrb x={75} y={65} size={140} delay={1.2} color="#4F39F6" />
      <FloatingOrb x={80} y={15} size={100} delay={0.6} color="#615FFF" />
      <FloatingOrb x={10} y={70} size={120} delay={1.8} color="#4F39F6" />

      {/* Center content */}
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {/* Logo icon */}
        <div
          style={{
            transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #615FFF, #4F39F6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 60px rgba(97, 95, 255, 0.35)",
          }}
        >
          <Img src={SEND_ICON.replace("%23615FFF", "%23ffffff")} width={42} height={42} />
        </div>

        {/* Brand name */}
        <FadeInWords
          startFrom={8}
          stagger={0.08}
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#292524",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          AutoSend
        </FadeInWords>

        {/* Decorative line */}
        <div
          style={{
            width: interpolate(lineWidth, [0, 1], [0, 120]),
            height: 3,
            background: "linear-gradient(90deg, transparent, #615FFF, transparent)",
            borderRadius: 2,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineSlide}px)`,
            fontSize: 26,
            fontWeight: 500,
            color: "#57534e",
            textAlign: "center",
            maxWidth: 600,
            textWrap: "balance",
          }}
        >
          Email delivery that just works.
        </div>
      </div>
    </div>
  );
};

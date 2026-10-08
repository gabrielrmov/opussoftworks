import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_DISPLAY, FONT_UI } from "./theme";

/** Fundo contínuo (fica fora das transições pra não piscar entre cenas). */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const g1x = 30 + Math.sin(t * 0.35) * 18;
  const g1y = 22 + Math.cos(t * 0.28) * 10;
  const g2x = 72 + Math.cos(t * 0.3) * 16;
  const g2y = 78 + Math.sin(t * 0.25) * 10;
  return (
    <AbsoluteFill style={{ backgroundColor: C.canvas }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at ${g1x}% ${g1y}%, rgba(82,102,235,0.22), transparent 70%),
            radial-gradient(800px 800px at ${g2x}% ${g2y}%, rgba(82,102,235,0.14), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${(frame * 0.4) % 90}px`,
          opacity: 0.35,
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 75%)",
        }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)" }}
      />
    </AbsoluteFill>
  );
};

/** Wordmark tipográfico da Opus Softworks. */
export const Wordmark: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 40,
  style,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      gap: size * 0.28,
      fontFamily: FONT_DISPLAY,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: "-0.02em",
      lineHeight: 1,
      color: C.ivory,
      ...style,
    }}
  >
    <span>
      opus<span style={{ color: C.cobalt }}>.</span>
    </span>
    <span style={{ fontWeight: 500, color: C.ash, letterSpacing: "0.01em" }}>softworks</span>
  </div>
);

export const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_UI,
      fontWeight: 500,
      fontSize: 28,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: C.ash,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      backgroundColor: C.card,
      border: `1px solid ${C.line}`,
      borderRadius: 36,
      boxShadow: "0 40px 80px rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    {children}
  </div>
);

type IconName = "traffic" | "grid" | "site" | "check" | "whatsapp" | "arrowUp" | "arrowDown";

const ICONS: Record<IconName, React.ReactNode> = {
  traffic: <path d="M3 17 L9.5 10.5 L13.5 14.5 L21 6 M15 6 L21 6 L21 12" />,
  grid: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.2" />
    </>
  ),
  site: (
    <>
      <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
      <path d="M3 8.5 L21 8.5 M9 21 L15 21 M12 16.5 L12 21" />
    </>
  ),
  check: <path d="M4 12.5 L9.5 18 L20 6" />,
  whatsapp: (
    <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.5-4.3A8.5 8.5 0 1 1 20.5 11.6Z M9 8.5c0 3.5 3 6.5 6.5 6.5l1.2-1.6-2-1-1 .8c-1.1-.5-2-1.4-2.5-2.5l.8-1-1-2Z" />
  ),
  arrowUp: <path d="M12 19 L12 5 M6 11 L12 5 L18 11" />,
  arrowDown: <path d="M12 5 L12 19 M6 13 L12 19 L18 13" />,
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ name, size = 32, color = C.ivory, strokeWidth = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {ICONS[name]}
  </svg>
);

export const IconTile: React.FC<{ name: IconName; size?: number; accent?: boolean }> = ({
  name,
  size = 72,
  accent = false,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      backgroundColor: accent ? C.cobalt : C.button,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Icon name={name} size={size * 0.48} color={C.white} />
  </div>
);

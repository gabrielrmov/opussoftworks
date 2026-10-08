import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useEnter } from "./anim";
import { C, SANS } from "./theme";

/** Fundo claro pontilhado do hero do site. */
export const DotPaper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${C.dot} 2px, transparent 2px)`,
          backgroundSize: "30px 30px",
          backgroundPosition: `0px ${-frame * 0.3}px`,
          maskImage: "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/** "OpusSoftWorks" — Opus em laranja, SoftWorks no tom do fundo. */
export const Wordmark: React.FC<{ size?: number; dark?: boolean; style?: React.CSSProperties }> = ({
  size = 44,
  dark = false,
  style,
}) => (
  <span
    style={{
      fontFamily: SANS,
      fontSize: size,
      letterSpacing: "-0.03em",
      lineHeight: 1,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <span style={{ fontWeight: 700, color: C.orange }}>Opus</span>
    <span style={{ fontWeight: 400, color: dark ? C.white : C.text }}>SoftWorks</span>
  </span>
);

export const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 28,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: C.orange,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Arrow: React.FC<{ size?: number; color?: string }> = ({ size = 26, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <path d="M7 17 L17 7 M9 7 L17 7 L17 15" />
  </svg>
);

/** Pílula de navegação flutuante, como o header do site. */
export const NavPill: React.FC = () => {
  const p = useEnter(10);
  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 60,
        right: 60,
        height: 112,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.92)",
        border: `1px solid ${C.border}`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px 0 44px",
        opacity: p,
        transform: `translateY(${(1 - p) * -30}px)`,
      }}
    >
      <Wordmark size={44} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "20px 30px",
          borderRadius: 999,
          backgroundColor: C.orange,
          color: C.white,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 27,
        }}
      >
        Entrar em contato <Arrow size={22} />
      </div>
    </div>
  );
};

import React from "react";
import { useEnter } from "../anim";
import { C } from "../theme";

/** Texto que sobe de trás de uma máscara (overflow hidden), com leve blur. */
export const MaskRise: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  damping?: number;
}> = ({ delay, children, style, damping = 200 }) => {
  const p = useEnter(delay, damping);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.08em", ...style }}>
      <span
        style={{
          display: "inline-block",
          transform: `translateY(${(1 - p) * 105}%)`,
          filter: `blur(${(1 - p) * 8}px)`,
        }}
      >
        {children}
      </span>
    </span>
  );
};

type IconName = "traffic" | "grid" | "site";
const PATHS: Record<IconName, React.ReactNode> = {
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
};

export const PillarIcon: React.FC<{ name: IconName; size?: number }> = ({ name, size = 84 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      backgroundColor: C.ink,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name]}
    </svg>
  </div>
);

/** Marcas de registro nos cantos — o "enquadramento de precisão". */
export const CropMarks: React.FC<{ inset?: number; size?: number; color?: string; opacity?: number }> = ({
  inset = 56,
  size = 36,
  color = C.ink,
  opacity = 0.25,
}) => {
  const b = 3;
  const base: React.CSSProperties = { position: "absolute", width: size, height: size, borderColor: color, borderStyle: "solid", borderWidth: 0, opacity };
  return (
    <>
      <div style={{ ...base, top: inset, left: inset, borderTopWidth: b, borderLeftWidth: b }} />
      <div style={{ ...base, top: inset, right: inset, borderTopWidth: b, borderRightWidth: b }} />
      <div style={{ ...base, bottom: inset, left: inset, borderBottomWidth: b, borderLeftWidth: b }} />
      <div style={{ ...base, bottom: inset, right: inset, borderBottomWidth: b, borderRightWidth: b }} />
    </>
  );
};

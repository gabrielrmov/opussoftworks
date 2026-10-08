import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rise, useEnter } from "../anim";
import { Eyebrow } from "../components";
import { C, FONT_DISPLAY, FONT_UI } from "../theme";

/** Layout comum das três cenas de serviço: número + tag, headline, visual, legenda. */
export const ServiceScene: React.FC<{
  index: string;
  tag: string;
  title: string;
  caption: string;
  children: React.ReactNode;
}> = ({ index, tag, title, caption, children }) => {
  const frame = useCurrentFrame();
  const head = useEnter(4);
  const titleIn = useEnter(12);
  const visual = useEnter(26, 18);
  const cap = useEnter(150);

  return (
    <AbsoluteFill style={{ padding: "250px 80px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, ...rise(head, 20) }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 34, color: C.cobalt }}>{index}</span>
        <span style={{ width: 48, height: 2, backgroundColor: C.slate }} />
        <Eyebrow>{tag}</Eyebrow>
      </div>

      <div
        style={{
          marginTop: 34,
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          fontSize: 82,
          lineHeight: 1.06,
          letterSpacing: "-0.035em",
          color: C.ivory,
          maxWidth: 920,
          ...rise(titleIn, 50),
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 70,
          opacity: visual,
          transform: `translateY(${(1 - visual) * 90}px) translateY(${Math.sin(frame / 40) * 6}px)`,
        }}
      >
        {children}
      </div>

      <div
        style={{
          marginTop: 56,
          fontFamily: FONT_UI,
          fontSize: 36,
          lineHeight: 1.4,
          color: C.ash,
          ...rise(cap, 30),
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
};

"use client";

import GlyphPortal from "@/components/ui/glyph-portal";

export default function GlyphPortalSection() {
  return (
    <GlyphPortal
      word="OPUS SOFTWORKS"
      scrollLength={2.2}
      interactive={true}
      annotations={false}
      fontFamily="var(--font-intertight), Arial, sans-serif"
      fontWeight={700}
      enterLabel="Ver a estratégia"
      background={
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "scale(var(--gp-field-scale,1))",
            background:
              "radial-gradient(circle at 18% 8%, rgba(255,96,56,.45), transparent 34%), radial-gradient(circle at 82% 20%, rgba(244,246,255,.10), transparent 28%), radial-gradient(circle at 48% 78%, rgba(9,15,45,.55), transparent 44%), linear-gradient(135deg,#0b1530 0%,#132049 48%,#080d24 100%)",
          }}
        />
      }
      style={{
        "--gp-paper": "#fafafa",
        "--gp-ink": "#171717",
        "--gp-field": "#0b1530",
        "--gp-foreground": "#f4f6ff",
      }}
      front={
        <div
          style={{
            position: "absolute",
            inset: "clamp(24px,4.5cqw,48px) clamp(24px,5cqw,64px) auto",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-intertight)",
              fontSize: 13,
              letterSpacing: "0.02em",
              color: "#585858",
            }}
          >
            Role para entrar na estratégia
          </p>
        </div>
      }
    >
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-instrument)",
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Um método, resultado visível.
        </h2>
        <p
          style={{
            marginTop: 20,
            fontFamily: "var(--font-intertight)",
            fontSize: 16,
            lineHeight: 1.6,
            color: "rgba(244,246,255,0.85)",
          }}
        >
          Tráfego, sistemas e presença digital trabalhando juntos, sob uma
          mesma estratégia, com dados que qualquer pessoa do time consegue
          olhar e entender.
        </p>
      </div>
    </GlyphPortal>
  );
}

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SANS } from "./font";
import { COLOR, PILLARS_L } from "./layout";
import { appear, ease, enter, IN_OUT } from "./motion";
import { Mask } from "./reveal";
import { PILLAR_AT, SISTEMAS, SITES, TRAFEGO } from "./timeline";
import { eyebrow, sans } from "./type";

const TITLES = ["Tráfego", "Sistemas", "Sites"];
const { ui } = PILLARS_L;

/** Superfície de interface: borda fina + sombra em camadas, como no site. */
const surface: React.CSSProperties = {
  position: "absolute",
  backgroundColor: COLOR.white,
  borderRadius: 40,
  border: `2px solid ${COLOR.line}`,
  boxShadow: "0 2px 4px rgba(23,23,23,0.04), 0 28px 56px -20px rgba(23,23,23,0.16)",
  fontFamily: SANS,
  color: COLOR.ink,
  overflow: "hidden",
};

/** O bloco de interface sobe 60 px e acende (expo-out, 20 frames). */
const rise = (frame: number, at: number): React.CSSProperties => {
  const p = enter(frame, at, 20);
  return { opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 60}px)` };
};

const Check: React.FC<{ color?: string; size?: number; draw?: number }> = ({ color = COLOR.white, size = 30, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4.5 12.5 L9.5 17.5 L19.5 6.5" pathLength={1} strokeDasharray={`${draw} 1`} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Pillars: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < PILLAR_AT[0] - 30 || frame > 380) return null;
  return (
    <>
      {PILLARS_L.cx.map((cx, i) => {
        const left = cx - ui.w / 2;
        const at = PILLAR_AT[i];
        return (
          <React.Fragment key={TITLES[i]}>
            <div
              style={{
                position: "absolute",
                left,
                top: PILLARS_L.titleY - PILLARS_L.titleSize / 2,
                display: "flex",
                alignItems: "flex-start",
                gap: 22,
                whiteSpace: "nowrap",
              }}
            >
              <div style={{ ...sans(700, "-0.05em"), fontSize: PILLARS_L.titleSize, lineHeight: 1 }}>
                <Mask at={at - 8} dur={18}>
                  {TITLES[i]}
                </Mask>
              </div>
              <div style={{ ...eyebrow, fontSize: 40, lineHeight: 1, color: COLOR.coral, marginTop: 22 }}>
                <Mask at={at - 2}>0{i + 1}</Mask>
              </div>
            </div>
            <div style={{ position: "absolute", left, top: ui.top, width: ui.w, height: ui.h }}>
              {i === 0 && <TrafficUI />}
              {i === 1 && <SystemsUI />}
              {i === 2 && <SitesUI />}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

/* ---------- Tráfego: o anúncio da Opus → clique → contatos chegando ---------- */
const LEADS = ["Instagram", "Google", "WhatsApp"];

const Cursor: React.FC<{ x: number; y: number; pressed: boolean; opacity: number }> = ({ x, y, pressed, opacity }) => (
  <svg width={72} height={72} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, opacity, transform: `scale(${pressed ? 0.88 : 1})`, transformOrigin: "20% 15%" }}>
    <path d="M5 3.2 L5 19.5 L9.3 15.5 L12.2 21.4 L14.9 20.2 L12.1 14.4 L18.2 14.2 Z" fill={COLOR.ink} stroke={COLOR.white} strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

const TrafficUI: React.FC = () => {
  const frame = useCurrentFrame();
  const at = PILLAR_AT[0];
  const move = ease(frame, TRAFEGO.cursorFrom, TRAFEGO.click - 2, IN_OUT);
  const pressed = frame >= TRAFEGO.click && frame < TRAFEGO.click + 4;
  const cursorOn = enter(frame, TRAFEGO.cursorFrom - 4, 8) * (1 - ease(frame, TRAFEGO.click + 12, TRAFEGO.click + 20));
  return (
    <>
      <div style={{ ...surface, left: 0, top: 0, width: ui.w, height: 540, padding: 36, ...rise(frame, at - 6) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: COLOR.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: COLOR.coral, letterSpacing: "-0.04em" }}>O</span>
          </div>
          <div>
            <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Opus SoftWorks</div>
            <div style={{ fontSize: 32, color: COLOR.muted, lineHeight: 1.2 }}>Patrocinado</div>
          </div>
        </div>
        <div
          style={{
            marginTop: 26,
            height: 250,
            borderRadius: 24,
            backgroundColor: COLOR.ink,
            padding: "0 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.04,
          }}
        >
          <span style={{ color: COLOR.white }}>Resultado não é sorte.</span>
          <span style={{ color: COLOR.coral }}>É entrega.</span>
        </div>
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 32, color: COLOR.muted }}>opussoftworks.com.br</span>
          <div
            style={{
              padding: "18px 34px",
              borderRadius: 999,
              backgroundColor: frame >= TRAFEGO.click ? COLOR.coral : COLOR.ink,
              color: COLOR.white,
              fontSize: 36,
              fontWeight: 600,
              transform: `scale(${pressed ? 0.95 : 1})`,
            }}
          >
            Saiba mais
          </div>
        </div>
      </div>

      {/* Depois do clique, os contatos chegam (um embaixo do outro). */}
      {LEADS.map((source, i) => (
        <div
          key={source}
          style={{
            ...surface,
            left: 0,
            top: 566 + i * 94,
            width: ui.w,
            height: 82,
            borderRadius: 22,
            padding: "0 30px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            ...appear(frame, TRAFEGO.leadsFrom + i * 5),
          }}
        >
          <span style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: COLOR.coral, flexShrink: 0 }} />
          <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em" }}>Novo contato</span>
          <span style={{ fontSize: 32, color: COLOR.muted }}>via {source}</span>
          <span style={{ marginLeft: "auto", fontSize: 32, color: COLOR.muted }}>agora</span>
        </div>
      ))}

      <Cursor x={interpolate(move, [0, 1], [760, 690])} y={interpolate(move, [0, 1], [700, 452])} pressed={pressed} opacity={cursorOn} />
    </>
  );
};

/* ---------- Sistemas: o painel da operação se organizando ---------- */
const MODULES = [
  { name: "Vendas", status: "Atualizado" },
  { name: "Estoque", status: "Em dia" },
  { name: "Financeiro", status: "Conciliado" },
  { name: "Contratos", status: "Assinados" },
];
const BARS = [0.42, 0.6, 0.5, 0.74, 0.66, 0.92];

const SystemsUI: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...surface, left: 0, top: 0, width: ui.w, height: ui.h, padding: 36, ...rise(frame, PILLAR_AT[1] - 6) }}>
      <span style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.03em" }}>Painel da operação</span>
      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
        {MODULES.map((m, i) => {
          const at = SISTEMAS.rowsFrom + i * 3;
          const p = enter(frame, at, 14);
          const done = ease(frame, at + 8, at + 18, IN_OUT);
          return (
            <div
              key={m.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                height: 104,
                padding: "0 24px",
                borderRadius: 22,
                backgroundColor: COLOR.fill,
                opacity: p,
                transform: `translateX(${(1 - p) * -40}px)`,
              }}
            >
              <span style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.03em" }}>{m.name}</span>
              <span style={{ marginLeft: "auto", fontSize: 32, fontWeight: 500, color: COLOR.muted, opacity: done }}>{m.status}</span>
              <span
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  border: `3px solid ${done > 0 ? COLOR.ink : COLOR.line}`,
                  backgroundColor: done > 0 ? COLOR.ink : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check draw={done} />
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 24, fontSize: 34, fontWeight: 600 }}>Visão da semana</div>
      <div style={{ marginTop: 14, height: 150, display: "flex", alignItems: "flex-end", gap: 20 }}>
        {BARS.map((h, i) => {
          const g = ease(frame, SISTEMAS.barsFrom + i * 2, SISTEMAS.barsFrom + i * 2 + 18, IN_OUT);
          const last = i === BARS.length - 1;
          return <div key={i} style={{ flex: 1, height: `${Math.max(4, h * 100 * g)}%`, borderRadius: "12px 12px 4px 4px", backgroundColor: last ? COLOR.coral : COLOR.ink }} />;
        })}
      </div>
    </div>
  );
};

/* ---------- Sites: o celular carrega a página e o botão é tocado ---------- */
const FEATURES = ["Resposta rápida", "Atendimento no WhatsApp"];

const SitesUI: React.FC = () => {
  const frame = useCurrentFrame();
  const loading = ease(frame, SITES.loadFrom, SITES.loaded, IN_OUT);
  const loaded = frame >= SITES.loaded;
  const touch = ease(frame, SITES.tap - 2, SITES.tap + 10);
  const pressed = frame >= SITES.tap && frame < SITES.tap + 4;
  const tapped = frame >= SITES.tap;
  const PW = 780;
  return (
    <div
      style={{
        position: "absolute",
        left: (ui.w - PW) / 2,
        top: 0,
        width: PW,
        height: ui.h,
        borderRadius: 84,
        backgroundColor: COLOR.ink,
        padding: 16,
        boxShadow: "0 2px 4px rgba(23,23,23,0.06), 0 40px 80px -24px rgba(23,23,23,0.28)",
        ...rise(frame, PILLAR_AT[2] - 6),
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 68, backgroundColor: COLOR.white, overflow: "hidden", fontFamily: SANS, color: COLOR.ink }}>
        <div style={{ position: "absolute", top: 28, left: 40, right: 40, height: 64, borderRadius: 32, backgroundColor: COLOR.fill, display: "flex", alignItems: "center", padding: "0 28px", fontSize: 32, color: COLOR.muted }}>
          suaempresa.com.br
        </div>
        {!loaded && <div style={{ position: "absolute", top: 100, left: 40, height: 5, width: loading * (PW - 112), borderRadius: 3, backgroundColor: COLOR.coral }} />}
        <div style={{ position: "absolute", top: 136, left: 48, right: 48 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
            <Mask at={SITES.loaded - 2}>Sua empresa</Mask>
            <Mask at={SITES.loaded + 1}>vendendo 24h</Mask>
          </div>
          <div style={{ marginTop: 22, fontSize: 34, lineHeight: 1.3, color: COLOR.muted, ...appear(frame, SITES.loaded + 4) }}>
            Seu cliente encontra, entende e chama — a qualquer hora.
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 34,
              height: 112,
              borderRadius: 56,
              backgroundColor: tapped ? COLOR.coral : COLOR.ink,
              color: COLOR.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 600,
              ...appear(frame, SITES.loaded + 7),
              ...(pressed ? { transform: "scale(0.96)" } : {}),
            }}
          >
            {tapped ? "Pedido enviado" : "Pedir orçamento"}
          </div>
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14, ...appear(frame, SITES.loaded + 10) }}>
            {FEATURES.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 500 }}>
                <Check color={COLOR.coral} size={34} />
                {f}
              </div>
            ))}
          </div>
        </div>
        {/* Toque: um círculo discreto que aparece e se dissolve. */}
        {touch > 0 && touch < 1 && (
          <div
            style={{
              position: "absolute",
              left: 374 - 44,
              top: 488 - 44,
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: COLOR.ink,
              opacity: 0.18 * (1 - touch),
              transform: `scale(${0.7 + 0.5 * touch})`,
            }}
          />
        )}
      </div>
    </div>
  );
};

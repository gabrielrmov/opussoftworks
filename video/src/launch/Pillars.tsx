import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { useCam } from "./Camera";
import { FONT } from "./font";
import { PILLARS_L } from "./layout";
import { beatPulse, ease, pop, popStyle } from "./motion";
import { PILLAR_AT, SISTEMAS, SITES, TRAFEGO } from "./timeline";

const TITLES = ["Tráfego", "Sistemas", "Sites"];
const { ui } = PILLARS_L;
const MUTED = "#4a4a4a"; // texto secundário com contraste alto

const card: React.CSSProperties = {
  position: "absolute",
  backgroundColor: C.white,
  borderRadius: 40,
  border: `2px solid ${C.border}`,
  boxShadow: "0 30px 70px rgba(0,0,0,0.08)",
  fontFamily: FONT,
  color: C.ink,
};

type IconName = "traffic" | "grid" | "site";
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
      <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
      <path d="M10 18.5 L14 18.5" />
    </>
  ),
};
const ICON_OF: IconName[] = ["traffic", "grid", "site"];

export const Pillars: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = useCam();
  // Quando a câmera abre, o mockup vira um ícone grande (o texto dele ficaria ilegível).
  const toIcon = interpolate(cam.s, [0.45, 0.8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      {PILLARS_L.cx.map((cx, i) => {
        const p = pop(frame, PILLAR_AT[i] - 6, 15);
        const node = pop(frame, PILLAR_AT[i] + 10, 12);
        const left = cx - ui.w / 2;
        return (
          <div key={TITLES[i]}>
            <div
              style={{
                position: "absolute",
                left,
                top: PILLARS_L.titleY,
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "baseline",
                gap: 26,
                fontFamily: FONT,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontSize: PILLARS_L.titleSize,
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  color: C.ink,
                  transformOrigin: "left bottom",
                  ...popStyle(p, 1.15, 50),
                }}
              >
                {TITLES[i]}
              </span>
              <span style={{ fontSize: 56, fontWeight: 600, color: C.orange, ...popStyle(pop(frame, PILLAR_AT[i] - 2), 1.2, 20) }}>
                0{i + 1}
              </span>
            </div>
            <div style={{ position: "absolute", left, top: ui.top, width: ui.w, height: ui.h }}>
              <div style={{ position: "absolute", inset: 0, opacity: 1 - toIcon }}>
                {i === 0 && <TrafficUI />}
                {i === 1 && <SystemsUI />}
                {i === 2 && <SitesUI />}
              </div>
              {toIcon > 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 120,
                    backgroundColor: C.ink,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: toIcon,
                    transform: `scale(${0.85 + 0.15 * toIcon})`,
                  }}
                >
                  <svg width={480} height={480} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[ICON_OF[i]]}
                  </svg>
                </div>
              )}
            </div>
            {/* Nó do pilar na linha coral */}
            <div
              style={{
                position: "absolute",
                left: cx - 26,
                top: PILLARS_L.lineY - 26,
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: C.paper,
                border: `10px solid ${C.orange}`,
                transform: `scale(${node * (1 + 0.15 * beatPulse(frame)) * (1 + 2 * toIcon)})`,
              }}
            />
          </div>
        );
      })}
    </>
  );
};

/* ---------- Tráfego: anúncio da Opus → clique → contatos chegando (sem números) ---------- */
const LEADS = ["Instagram", "Google", "WhatsApp"];

const TrafficUI: React.FC = () => {
  const frame = useCurrentFrame();
  const adIn = pop(frame, PILLAR_AT[0] - 12, 16);
  const move = ease(frame, TRAFEGO.cursorFrom, TRAFEGO.click - 1);
  const pressed = frame >= TRAFEGO.click && frame < TRAFEGO.click + 5;
  const ripple = ease(frame, TRAFEGO.click, TRAFEGO.click + 14);

  return (
    <>
      <div style={{ ...card, left: 0, top: 0, width: ui.w, height: 540, padding: 36, ...popStyle(adIn, 1.06, 60) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: C.ink,
              color: C.orange,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            O
          </div>
          <div>
            <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Opus SoftWorks</div>
            <div style={{ fontSize: 32, color: MUTED, lineHeight: 1.15 }}>Patrocinado</div>
          </div>
        </div>
        {/* Criativo do anúncio: a headline do site */}
        <div
          style={{
            marginTop: 26,
            height: 250,
            borderRadius: 28,
            backgroundColor: C.ink,
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
          <span style={{ color: C.white }}>Resultado não é sorte.</span>
          <span style={{ color: C.orange }}>É entrega.</span>
        </div>
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 32, color: MUTED }}>opussoftworks.com.br</span>
          <div
            style={{
              position: "relative",
              padding: "18px 34px",
              borderRadius: 999,
              backgroundColor: C.ink,
              color: C.white,
              fontSize: 36,
              fontWeight: 600,
              transform: `scale(${pressed ? 0.92 : 1})`,
            }}
          >
            Saiba mais
            {ripple > 0 && ripple < 1 && (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 999,
                  border: `5px solid ${C.ink}`,
                  transform: `scale(${1 + ripple * 0.4})`,
                  opacity: 1 - ripple,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Contatos chegando depois do clique */}
      {LEADS.map((source, i) => {
        const p = pop(frame, TRAFEGO.leadsFrom + i * 4, 15);
        return (
          <div
            key={source}
            style={{
              ...card,
              left: 0,
              top: 566 + i * 94,
              width: ui.w,
              height: 82,
              borderRadius: 24,
              padding: "0 30px",
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: Math.min(1, p * 2),
              transform: `translateY(${(1 - Math.min(1, p)) * 40}px)`,
            }}
          >
            <span style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.orange, flexShrink: 0 }} />
            <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em" }}>Novo contato</span>
            <span style={{ fontSize: 32, color: MUTED }}>via {source}</span>
            <span style={{ marginLeft: "auto", fontSize: 32, color: MUTED }}>agora</span>
          </div>
        );
      })}

      {/* Cursor */}
      <svg
        width={86}
        height={86}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: interpolate(move, [0, 1], [780, 686]),
          top: interpolate(move, [0, 1], [660, 439]),
          opacity: ease(frame, TRAFEGO.cursorFrom - 6, TRAFEGO.cursorFrom + 2) * (1 - ease(frame, TRAFEGO.click + 10, TRAFEGO.click + 18)),
          transform: `scale(${pressed ? 0.85 : 1})`,
          filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.3))",
        }}
      >
        <path d="M4 3 L4 19 L8.5 14.8 L11.5 21 L14.2 19.8 L11.3 13.7 L17.5 13.5 Z" fill={C.ink} stroke={C.white} strokeWidth={1.3} />
      </svg>
    </>
  );
};

/* ---------- Sistemas: painel com os módulos, linhas entrando e barras crescendo ---------- */
const MODULES = [
  { name: "Vendas", status: "Atualizado" },
  { name: "Estoque", status: "Em dia" },
  { name: "Financeiro", status: "Conciliado" },
  { name: "Contratos", status: "Assinados" },
];
const BARS = [0.42, 0.6, 0.5, 0.74, 0.66, 0.92];

const SystemsUI: React.FC = () => {
  const frame = useCurrentFrame();
  const boxIn = pop(frame, PILLAR_AT[1] - 12, 16);
  return (
    <div style={{ ...card, left: 0, top: 0, width: ui.w, height: ui.h, padding: 36, ...popStyle(boxIn, 1.05, 60) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.03em" }}>Painel da operação</span>
      </div>
      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
        {MODULES.map((m, i) => {
          const p = pop(frame, SISTEMAS.rowsFrom + i * 4, 15);
          const check = pop(frame, SISTEMAS.rowsFrom + 8 + i * 4, 12);
          return (
            <div
              key={m.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                height: 104,
                padding: "0 24px",
                borderRadius: 24,
                backgroundColor: "#f3f3f3",
                opacity: Math.min(1, p * 2),
                transform: `translateX(${(1 - Math.min(1, p)) * 160}px)`,
              }}
            >
              <span style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.03em" }}>{m.name}</span>
              <span style={{ marginLeft: "auto", fontSize: 32, fontWeight: 500, color: MUTED }}>{m.status}</span>
              <span
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: C.ink,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${check})`,
                }}
              >
                <svg width={32} height={32} viewBox="0 0 24 24">
                  <path d="M4 12.5 L9.5 18 L20 6" stroke={C.white} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 24, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontSize: 34, fontWeight: 600 }}>Visão da semana</span>
      </div>
      <div style={{ marginTop: 14, height: 150, display: "flex", alignItems: "flex-end", gap: 20 }}>
        {BARS.map((h, i) => {
          const g = pop(frame, SISTEMAS.barsFrom + i * 3, 13);
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h * 100 * g}%`,
                borderRadius: "14px 14px 6px 6px",
                backgroundColor: i === BARS.length - 1 ? C.orange : C.ink,
                opacity: i === BARS.length - 1 ? 1 : 0.85,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Sites: celular carregando a página e o botão sendo tocado ---------- */
const FEATURES = ["Resposta rápida", "Atendimento no WhatsApp"];

const SitesUI: React.FC = () => {
  const frame = useCurrentFrame();
  const phoneIn = pop(frame, PILLAR_AT[2] - 12, 16);
  const loading = ease(frame, SITES.loadFrom, SITES.loaded);
  const parts = [0, 1, 2, 3].map((i) => pop(frame, SITES.loaded - 6 + i * 4, 15));
  const finger = ease(frame, SITES.tap - 10, SITES.tap);
  const pressed = frame >= SITES.tap && frame < SITES.tap + 5;
  const tapped = frame >= SITES.tap;
  const ripple = ease(frame, SITES.tap, SITES.tap + 16);
  const toast = pop(frame, SITES.sent, 14);
  const PW = 780;
  const appear = (p: number): React.CSSProperties => ({ opacity: Math.min(1, p * 2), transform: `translateY(${(1 - Math.min(1, p)) * 30}px)` });

  return (
    <div
      style={{
        position: "absolute",
        left: (ui.w - PW) / 2,
        top: 0,
        width: PW,
        height: ui.h,
        borderRadius: 80,
        backgroundColor: C.ink,
        padding: 18,
        boxShadow: "0 40px 90px rgba(0,0,0,0.18)",
        ...popStyle(phoneIn, 1.06, 80),
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 64, backgroundColor: C.white, overflow: "hidden", fontFamily: FONT, color: C.ink }}>
        {/* Barra do navegador */}
        <div style={{ position: "absolute", top: 26, left: 40, right: 40, height: 64, borderRadius: 32, backgroundColor: "#f1f1f1", display: "flex", alignItems: "center", padding: "0 28px", fontSize: 32, color: MUTED }}>
          suaempresa.com.br
        </div>
        <div style={{ position: "absolute", top: 98, left: 40, height: 6, width: `${loading * (PW - 116)}px`, borderRadius: 3, backgroundColor: C.orange, opacity: 1 - parts[0] }} />
        <div style={{ position: "absolute", top: 130, left: 48, right: 48 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1.0, ...appear(parts[0]) }}>
            Sua empresa
            <br />
            vendendo 24h
          </div>
          <div style={{ marginTop: 22, fontSize: 34, lineHeight: 1.3, color: MUTED, ...appear(parts[1]) }}>
            Seu cliente encontra, entende e chama — a qualquer hora.
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 34,
              height: 112,
              borderRadius: 56,
              backgroundColor: tapped ? C.orange : C.ink,
              color: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 600,
              ...appear(parts[2]),
              transform: `${appear(parts[2]).transform} scale(${pressed ? 0.94 : 1})`,
            }}
          >
            Pedir orçamento
            {ripple > 0 && ripple < 1 && (
              <span style={{ position: "absolute", inset: 0, borderRadius: 56, border: `5px solid ${C.orange}`, transform: `scale(${1 + ripple * 0.25})`, opacity: 1 - ripple }} />
            )}
          </div>
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14, ...appear(parts[3]) }}>
            {FEATURES.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 500 }}>
                <svg width={34} height={34} viewBox="0 0 24 24">
                  <path d="M4 12.5 L9.5 18 L20 6" stroke={C.orange} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>
        {/* Dedo tocando o botão */}
        <div
          style={{
            position: "absolute",
            left: 324,
            top: interpolate(finger, [0, 1], [700, 434]),
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: "rgba(23,23,23,0.28)",
            border: "4px solid rgba(23,23,23,0.5)",
            opacity: finger * (1 - ease(frame, SITES.tap + 10, SITES.tap + 18)),
            transform: `scale(${pressed ? 0.8 : 1})`,
          }}
        />
        {/* Confirmação */}
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            bottom: 34,
            height: 96,
            borderRadius: 30,
            backgroundColor: C.ink,
            color: C.white,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "0 30px",
            fontSize: 36,
            fontWeight: 600,
            ...popStyle(toast, 1.08, 40),
          }}
        >
          <svg width={40} height={40} viewBox="0 0 24 24">
            <path d="M4 12.5 L9.5 18 L20 6" stroke={C.orange} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Pedido enviado
        </div>
      </div>
    </div>
  );
};

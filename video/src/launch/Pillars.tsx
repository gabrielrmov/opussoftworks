import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { useCam } from "./Camera";
import { FONT } from "./font";
import { PILLARS_L } from "./layout";
import { beatPulse, ease, pop, popStyle } from "./motion";
import { PILLAR_AT, SISTEMAS, SITES, TRAFEGO } from "./timeline";

const TITLES = ["Tráfego", "Sistemas", "Sites"];
const { ui } = PILLARS_L;

const card: React.CSSProperties = {
  position: "absolute",
  backgroundColor: C.white,
  borderRadius: 40,
  border: `2px solid ${C.border}`,
  boxShadow: "0 30px 70px rgba(0,0,0,0.08)",
  fontFamily: FONT,
  color: C.ink,
};

export const Pillars: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = useCam();
  // Quando a câmera abre, os micro-UIs viram silhueta (o texto deles ficaria < 44 px).
  const uiOpacity = interpolate(cam.s, [0.4, 0.75], [0.14, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      {PILLARS_L.cx.map((cx, i) => {
        const p = pop(frame, PILLAR_AT[i], 15);
        const node = pop(frame, PILLAR_AT[i] + 10, 12);
        return (
          <div key={TITLES[i]}>
            <div
              style={{
                position: "absolute",
                left: cx - ui.w / 2,
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
              <span style={{ fontSize: 56, fontWeight: 600, color: C.orange, ...popStyle(pop(frame, PILLAR_AT[i] + 4), 1.2, 20) }}>
                0{i + 1}
              </span>
            </div>
            <div style={{ position: "absolute", left: cx - ui.w / 2, top: ui.top, width: ui.w, height: ui.h, opacity: uiOpacity }}>
              {i === 0 && <TrafficUI />}
              {i === 1 && <SystemsUI />}
              {i === 2 && <SitesUI />}
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
                transform: `scale(${node * (1 + 0.15 * beatPulse(frame))})`,
              }}
            />
          </div>
        );
      })}
    </>
  );
};

/* ---------------- Tráfego: anúncio → clique → leads subindo ---------------- */
const TrafficUI: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = PILLAR_AT[0];
  const adIn = pop(frame, t0 - 12, 16);
  const move = ease(frame, TRAFEGO.cursorFrom, TRAFEGO.click - 1);
  const pressed = frame >= TRAFEGO.click && frame < TRAFEGO.click + 5;
  const ripple = ease(frame, TRAFEGO.click, TRAFEGO.click + 14);
  const counterIn = pop(frame, TRAFEGO.click, 14);
  const count = Math.round(interpolate(ease(frame, TRAFEGO.countFrom, TRAFEGO.countTo), [0, 1], [0, 48]));
  const bump = frame > TRAFEGO.countFrom && frame < TRAFEGO.countTo ? beatPulse(frame * 3) : 0;

  return (
    <>
      <div style={{ ...card, left: 0, top: 0, width: ui.w, height: 470, padding: 40, ...popStyle(adIn, 1.08, 60) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: C.ink }} />
          <div>
            <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>Sua marca</div>
            <div style={{ fontSize: 44, color: "#3d3d3d", lineHeight: 1.1 }}>Patrocinado</div>
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            height: 150,
            borderRadius: 24,
            background: "linear-gradient(120deg, #e9e9e9, #dcdcdc)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 40, top: 40, width: 220, height: 22, borderRadius: 11, backgroundColor: "#c9c9c9" }} />
          <div style={{ position: "absolute", left: 40, top: 80, width: 340, height: 22, borderRadius: 11, backgroundColor: "#c9c9c9" }} />
          <div style={{ position: "absolute", right: 40, top: 30, width: 90, height: 90, borderRadius: 20, backgroundColor: "#c9c9c9" }} />
        </div>
        <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              position: "relative",
              padding: "22px 44px",
              borderRadius: 999,
              backgroundColor: C.ink,
              color: C.white,
              fontSize: 46,
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

      <div
        style={{
          ...card,
          left: 0,
          top: 510,
          width: ui.w,
          height: 300,
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          ...popStyle(counterIn, 1.1, 60),
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-0.03em" }}>Leads</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width={70} height={70} viewBox="0 0 24 24" style={{ transform: `translateY(${-bump * 8}px)` }}>
            <path d="M12 20 L12 5 M5 11 L12 4 L19 11" stroke={C.orange} strokeWidth={3} fill="none" strokeLinecap="round" />
          </svg>
          <div
            style={{
              fontSize: 170,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              transform: `scale(${1 + bump * 0.06})`,
            }}
          >
            {count}
          </div>
        </div>
      </div>

      {/* Cursor */}
      <svg
        width={86}
        height={86}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: interpolate(move, [0, 1], [820, 660]),
          top: interpolate(move, [0, 1], [700, 384]),
          opacity: ease(frame, TRAFEGO.cursorFrom - 6, TRAFEGO.cursorFrom + 2) * (1 - ease(frame, TRAFEGO.click + 12, TRAFEGO.click + 20)),
          transform: `scale(${pressed ? 0.85 : 1})`,
          filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.3))",
        }}
      >
        <path d="M4 3 L4 19 L8.5 14.8 L11.5 21 L14.2 19.8 L11.3 13.7 L17.5 13.5 Z" fill={C.ink} stroke={C.white} strokeWidth={1.3} />
      </svg>
    </>
  );
};

/* ---------------- Sistemas: linhas de tabela entrando + barras crescendo ---------------- */
const ROWS = ["Vendas", "Estoque", "Financeiro"];
const BARS = [0.42, 0.6, 0.5, 0.74, 0.66, 0.92];

const SystemsUI: React.FC = () => {
  const frame = useCurrentFrame();
  const boxIn = pop(frame, PILLAR_AT[1] - 12, 16);
  return (
    <div style={{ ...card, left: 0, top: 0, width: ui.w, height: ui.h, padding: 44, ...popStyle(boxIn, 1.06, 60) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.03em" }}>Painel</span>
        <span style={{ display: "flex", gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: C.ink, opacity: 0.25 }} />
          ))}
        </span>
      </div>
      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 16 }}>
        {ROWS.map((label, i) => {
          const p = pop(frame, SISTEMAS.rowsFrom + i * 4, 15);
          const check = pop(frame, SISTEMAS.rowsFrom + 10 + i * 4, 12);
          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 26px",
                borderRadius: 24,
                backgroundColor: "#f2f2f2",
                opacity: Math.min(1, p * 2),
                transform: `translateX(${(1 - p) * 160}px)`,
              }}
            >
              <span style={{ fontSize: 52, fontWeight: 600, letterSpacing: "-0.03em" }}>{label}</span>
              <span
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: C.ink,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${check})`,
                }}
              >
                <svg width={34} height={34} viewBox="0 0 24 24">
                  <path d="M4 12.5 L9.5 18 L20 6" stroke={C.white} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 30, height: 250, display: "flex", alignItems: "flex-end", gap: 22 }}>
        {BARS.map((h, i) => {
          const g = pop(frame, SISTEMAS.barsFrom + i * 3, 13);
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h * 100 * g}%`,
                borderRadius: "16px 16px 6px 6px",
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

/* ---------------- Sites: celular carregando + botão tocado ---------------- */
const SitesUI: React.FC = () => {
  const frame = useCurrentFrame();
  const phoneIn = pop(frame, PILLAR_AT[2] - 12, 16);
  const loading = ease(frame, SITES.loadFrom, SITES.loaded);
  const loaded = pop(frame, SITES.loaded, 15);
  const shimmer = ((frame - SITES.loadFrom) / 14) % 1;
  const finger = ease(frame, SITES.tap - 10, SITES.tap);
  const pressed = frame >= SITES.tap && frame < SITES.tap + 5;
  const tapped = frame >= SITES.tap;
  const ripple = ease(frame, SITES.tap, SITES.tap + 16);
  const PW = 540;

  const skeleton = (w: string, h: number, mt: number) => (
    <div style={{ marginTop: mt, width: w, height: h, borderRadius: h / 2, backgroundColor: "#e6e6e6", overflow: "hidden", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
          transform: `translateX(${(shimmer * 2 - 1) * 120}%)`,
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: (ui.w - PW) / 2,
        top: 0,
        width: PW,
        height: ui.h,
        borderRadius: 76,
        backgroundColor: C.ink,
        padding: 20,
        boxShadow: "0 40px 90px rgba(0,0,0,0.18)",
        ...popStyle(phoneIn, 1.08, 80),
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 58, backgroundColor: C.white, overflow: "hidden", fontFamily: FONT }}>
        <div style={{ position: "absolute", top: 18, left: "50%", marginLeft: -60, width: 120, height: 30, borderRadius: 15, backgroundColor: C.ink }} />
        {/* Barra de carregamento */}
        <div style={{ position: "absolute", top: 70, left: 0, height: 8, width: `${loading * 100}%`, backgroundColor: C.orange, opacity: 1 - loaded }} />
        <div style={{ padding: "100px 40px 0" }}>
          {loaded < 0.5 ? (
            <>
              {skeleton("70%", 56, 0)}
              {skeleton("100%", 24, 30)}
              {skeleton("85%", 24, 16)}
              {skeleton("100%", 200, 30)}
            </>
          ) : (
            <div style={{ ...popStyle(loaded, 1.05, 30) }}>
              <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.02, color: C.ink }}>
                Sua
                <br />
                empresa
              </div>
              <div style={{ marginTop: 24, height: 22, width: "100%", borderRadius: 11, backgroundColor: "#e6e6e6" }} />
              <div style={{ marginTop: 14, height: 22, width: "80%", borderRadius: 11, backgroundColor: "#e6e6e6" }} />
              <div style={{ marginTop: 30, height: 150, borderRadius: 26, background: "linear-gradient(120deg, #ececec, #dedede)" }} />
            </div>
          )}
          <div
            style={{
              position: "relative",
              marginTop: 40,
              height: 110,
              borderRadius: 55,
              backgroundColor: tapped ? C.orange : C.ink,
              color: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 46,
              fontWeight: 600,
              opacity: loaded,
              transform: `scale(${pressed ? 0.93 : 1})`,
            }}
          >
            Orçamento
            {ripple > 0 && ripple < 1 && (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 55,
                  border: `5px solid ${C.orange}`,
                  transform: `scale(${1 + ripple * 0.3})`,
                  opacity: 1 - ripple,
                }}
              />
            )}
          </div>
        </div>
        {/* Dedo tocando */}
        <div
          style={{
            position: "absolute",
            left: 202,
            top: interpolate(finger, [0, 1], [760, 532]),
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: "rgba(23,23,23,0.28)",
            border: "4px solid rgba(23,23,23,0.5)",
            opacity: finger * (1 - ease(frame, SITES.tap + 10, SITES.tap + 20)),
            transform: `scale(${pressed ? 0.8 : 1})`,
          }}
        />
      </div>
    </div>
  );
};

import { Easing, interpolate, useCurrentFrame } from "remotion";
import { ramp, rise, useEnter } from "../anim";
import { Card, Icon } from "../components";
import { C, FONT_DISPLAY, FONT_UI } from "../theme";
import { ServiceScene } from "./ServiceScene";

const CLICK_AT = 168;

export const Website: React.FC = () => {
  const frame = useCurrentFrame();
  const b1 = useEnter(40);
  const b2 = useEnter(52);
  const b3 = useEnter(64);
  const btn = useEnter(84, 14);

  // Cursor vai até o botão e clica.
  const move = ramp(frame, 110, CLICK_AT - 6, [0, 1], Easing.inOut(Easing.cubic));
  const cx = interpolate(move, [0, 1], [760, 300]);
  const cy = interpolate(move, [0, 1], [780, 470]);
  const press = frame >= CLICK_AT && frame < CLICK_AT + 8 ? 0.94 : 1;
  const ripple = ramp(frame, CLICK_AT, CLICK_AT + 30);
  const toast = useEnter(CLICK_AT + 14, 14);

  return (
    <ServiceScene
      index="03"
      tag="Sites para empresas"
      title="Um site que converte visita em cliente."
      caption="Rápido, responsivo e pensado pra levar quem chega até o seu WhatsApp."
    >
      <div style={{ position: "relative" }}>
        <Card style={{ overflow: "hidden" }}>
          {/* Barra do navegador */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "24px 30px",
              borderBottom: `1px solid ${C.line}`,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.15)" }} />
            ))}
            <div
              style={{
                marginLeft: 20,
                flex: 1,
                height: 44,
                borderRadius: 22,
                backgroundColor: C.button,
                display: "flex",
                alignItems: "center",
                padding: "0 22px",
                fontFamily: FONT_UI,
                fontSize: 22,
                color: C.ash,
              }}
            >
              suaempresa.com.br
            </div>
          </div>

          {/* Página */}
          <div style={{ padding: "48px 50px 60px", height: 600 }}>
            <div style={{ ...rise(b1, 24), height: 30, width: "42%", borderRadius: 15, backgroundColor: "rgba(255,255,255,0.12)" }} />
            <div
              style={{
                ...rise(b2, 24),
                marginTop: 26,
                fontFamily: FONT_DISPLAY,
                fontWeight: 600,
                fontSize: 56,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: C.ivory,
              }}
            >
              O melhor serviço
              <br />
              da sua cidade.
            </div>
            <div style={{ ...rise(b3, 24), marginTop: 26 }}>
              <div style={{ height: 18, width: "88%", borderRadius: 9, backgroundColor: "rgba(255,255,255,0.08)" }} />
              <div style={{ marginTop: 14, height: 18, width: "64%", borderRadius: 9, backgroundColor: "rgba(255,255,255,0.08)" }} />
            </div>

            <div
              style={{
                position: "relative",
                marginTop: 48,
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                padding: "26px 40px",
                borderRadius: 999,
                backgroundColor: C.cobalt,
                fontFamily: FONT_UI,
                fontWeight: 600,
                fontSize: 30,
                color: C.white,
                opacity: btn,
                transform: `scale(${(0.8 + btn * 0.2) * press})`,
                transformOrigin: "left center",
                boxShadow: `0 0 ${40 + ripple * 40}px rgba(82,102,235,${0.5 * (1 - ripple) + 0.2})`,
              }}
            >
              <Icon name="whatsapp" size={36} color={C.white} />
              Falar no WhatsApp
              {ripple > 0 && ripple < 1 && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 999,
                    border: `3px solid ${C.cobaltSoft}`,
                    transform: `scale(${1 + ripple * 0.35})`,
                    opacity: 1 - ripple,
                  }}
                />
              )}
            </div>
          </div>
        </Card>

        {/* Cursor */}
        <svg
          width={56}
          height={56}
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            opacity: ramp(frame, 100, 112),
            transform: `scale(${press})`,
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.5))",
          }}
        >
          <path d="M4 3 L4 19 L8.5 14.8 L11.5 21 L14.2 19.8 L11.3 13.7 L17.5 13.5 Z" fill={C.white} stroke={C.canvas} strokeWidth={1.2} />
        </svg>

        {/* Notificação de lead */}
        <div
          style={{
            position: "absolute",
            right: -10,
            top: -60,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "22px 30px",
            borderRadius: 26,
            backgroundColor: C.ivory,
            boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
            opacity: toast,
            transform: `translateY(${(1 - toast) * -40}px) scale(${0.9 + toast * 0.1})`,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: C.cobalt,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="check" size={28} color={C.white} strokeWidth={3} />
          </div>
          <div style={{ fontFamily: FONT_UI }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: C.canvas }}>Novo lead recebido</div>
            <div style={{ fontSize: 22, color: C.slate }}>agora · via site</div>
          </div>
        </div>
      </div>
    </ServiceScene>
  );
};

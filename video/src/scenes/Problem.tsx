import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ramp, rise, useEnter } from "../anim";
import { Card, IconTile } from "../components";
import { C, FONT_DISPLAY, FONT_UI } from "../theme";

const VENDORS = [
  { label: "Agência de tráfego", icon: "traffic", x: -190, y: -230, r: -7 },
  { label: "Dev do sistema", icon: "grid", x: 170, y: -10, r: 6 },
  { label: "Designer do site", icon: "site", x: -140, y: 220, r: -4 },
] as const;

const MERGE_AT = 118;

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const merge = useEnter(MERGE_AT, 18);
  const titleA = ramp(frame, MERGE_AT - 10, MERGE_AT + 8, [1, 0]);
  const unified = useEnter(MERGE_AT + 14, 16);
  const titleB = useEnter(MERGE_AT + 26);

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {/* Títulos (A: problema → B: solução) */}
      <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center" }}>
        <div style={{ opacity: titleA, position: "absolute", width: "100%" }}>
          <Headline delay={0}>Três fornecedores.</Headline>
          <Headline delay={14} muted>
            Nenhum conversa.
          </Headline>
        </div>
        <div style={{ ...rise(titleB, 40), position: "absolute", width: "100%" }}>
          <Headline delay={0}>Uma operação só.</Headline>
          <Headline delay={0} muted>
            Um time responsável.
          </Headline>
        </div>
      </div>

      {/* Fornecedores soltos, que se juntam no MERGE_AT */}
      <div style={{ position: "absolute", top: 1080, left: "50%" }}>
        {/* Conexões quebradas */}
        <svg
          width={800}
          height={800}
          viewBox="-400 -400 800 800"
          style={{ position: "absolute", left: -400, top: -400, opacity: (1 - merge) * 0.8 }}
        >
          {VENDORS.map((v, i) => {
            const n = VENDORS[(i + 1) % VENDORS.length];
            const flicker = 0.35 + 0.35 * Math.abs(Math.sin((frame + i * 20) / 9));
            return (
              <line
                key={i}
                x1={v.x}
                y1={v.y}
                x2={n.x}
                y2={n.y}
                stroke={C.slate}
                strokeWidth={4}
                strokeDasharray="10 18"
                strokeDashoffset={-frame}
                opacity={flicker}
              />
            );
          })}
        </svg>

        {VENDORS.map((v, i) => {
          const enter = useEnterSafe(20 + i * 10);
          const jitter = Math.sin((frame + i * 37) / 11) * 6 * (1 - merge);
          const x = interpolate(merge, [0, 1], [v.x, 0]);
          const y = interpolate(merge, [0, 1], [v.y, 0]) + jitter;
          const r = interpolate(merge, [0, 1], [v.r, 0]);
          return (
            <div
              key={v.label}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${r}deg) scale(${
                  (0.85 + enter * 0.15) * (1 - merge * 0.2)
                })`,
                opacity: enter * (1 - unified),
              }}
            >
              <Card style={{ display: "flex", alignItems: "center", gap: 26, padding: "30px 40px", borderRadius: 30 }}>
                <IconTile name={v.icon} size={76} />
                <span style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 38, color: C.ivory, whiteSpace: "nowrap" }}>
                  {v.label}
                </span>
              </Card>
            </div>
          );
        })}

        {/* Card unificado */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(-50%, -50%) scale(${0.8 + unified * 0.2})`,
            opacity: unified,
          }}
        >
          <Card
            style={{
              padding: "52px 56px",
              border: `2px solid ${C.cobalt}`,
              boxShadow: `0 0 120px rgba(82,102,235,0.35), 0 40px 80px rgba(0,0,0,0.4)`,
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            {(["traffic", "grid", "site"] as const).map((icon, i) => (
              <div key={icon} style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <IconTile name={icon} size={110} accent={i === 1} />
                {i < 2 && (
                  <div
                    style={{
                      width: 90 * ramp(frame, MERGE_AT + 30 + i * 10, MERGE_AT + 50 + i * 10),
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: C.cobalt,
                    }}
                  />
                )}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Hook chamado em loop com contagem fixa de itens — ordem estável entre renders.
const useEnterSafe = (delay: number) => useEnter(delay, 14);

const Headline: React.FC<{ delay: number; muted?: boolean; children: React.ReactNode }> = ({
  delay,
  muted,
  children,
}) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        ...rise(p, 40),
        fontFamily: FONT_DISPLAY,
        fontWeight: muted ? 500 : 600,
        fontSize: 96,
        lineHeight: 1.08,
        letterSpacing: "-0.035em",
        color: muted ? C.slate : C.ivory,
      }}
    >
      {children}
    </div>
  );
};

import { Easing, interpolate, useCurrentFrame } from "remotion";
import { ramp, rise, useEnter } from "../anim";
import { Card, Icon, IconTile } from "../components";
import { C, FONT_UI } from "../theme";
import { ServiceScene } from "./ServiceScene";

const BARS = [32, 44, 40, 58, 54, 72, 88];
const CHART_W = 760;
const CHART_H = 380;

const METRICS = [
  { label: "Lead qualificado", dir: "arrowUp" },
  { label: "Custo por lead", dir: "arrowDown" },
  { label: "ROAS", dir: "arrowUp" },
] as const;

export const Traffic: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = ramp(frame, 60, 130, [0, 1], Easing.inOut(Easing.cubic));
  const step = CHART_W / BARS.length;
  const points = BARS.map((h, i) => [i * step + step / 2, CHART_H - (h / 100) * CHART_H - 26] as const);
  const path = points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const pathLen = 1100;
  const along = draw * (BARS.length - 1);
  const i0 = Math.min(BARS.length - 2, Math.floor(along));
  const frac = along - i0;
  const tip = [
    points[i0][0] + (points[i0 + 1][0] - points[i0][0]) * frac,
    points[i0][1] + (points[i0 + 1][1] - points[i0][1]) * frac,
  ];

  return (
    <ServiceScene
      index="01"
      tag="Tráfego pago"
      title="Campanhas que trazem gente pronta pra comprar."
      caption="Google Ads e Meta Ads focados em lead qualificado — não em clique barato."
    >
      <Card style={{ padding: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 34 }}>
          <IconTile name="traffic" size={64} accent />
          <span style={{ fontFamily: FONT_UI, fontSize: 30, fontWeight: 500, color: C.ivory }}>Desempenho semanal</span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: FONT_UI,
              fontSize: 22,
              letterSpacing: "0.12em",
              color: C.ash,
              border: `1px solid ${C.line}`,
              borderRadius: 999,
              padding: "8px 18px",
            }}
          >
            AO VIVO
          </span>
        </div>

        <div style={{ position: "relative", width: CHART_W, height: CHART_H, margin: "0 auto" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", gap: 22 }}>
            {BARS.map((h, i) => {
              const grow = ramp(frame, 34 + i * 6, 74 + i * 6, [0, 1], Easing.out(Easing.back(1.4)));
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h * grow}%`,
                    borderRadius: "14px 14px 4px 4px",
                    backgroundColor: i === BARS.length - 1 ? C.cobalt : "rgba(195,195,204,0.18)",
                  }}
                />
              );
            })}
          </div>
          <svg width={CHART_W} height={CHART_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d={path}
              fill="none"
              stroke={C.cobaltSoft}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pathLen}
              strokeDashoffset={pathLen * (1 - draw)}
            />
            {draw > 0 && <circle cx={tip[0]} cy={tip[1]} r={12} fill={C.white} stroke={C.cobalt} strokeWidth={6} />}
          </svg>
        </div>
      </Card>

      <div style={{ display: "flex", gap: 18, marginTop: 28 }}>
        {METRICS.map((m, i) => (
          <MetricChip key={m.label} delay={110 + i * 10} label={m.label} dir={m.dir} />
        ))}
      </div>
    </ServiceScene>
  );
};

const MetricChip: React.FC<{ delay: number; label: string; dir: "arrowUp" | "arrowDown" }> = ({
  delay,
  label,
  dir,
}) => {
  const p = useEnter(delay, 14);
  const frame = useCurrentFrame();
  const bob = interpolate(Math.sin((frame - delay) / 10), [-1, 1], [-3, 3]);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "22px 20px",
        borderRadius: 24,
        backgroundColor: C.button,
        border: `1px solid ${C.line}`,
        ...rise(p, 30),
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: "rgba(82,102,235,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${bob}px)`,
        }}
      >
        <Icon name={dir} size={26} color={C.cobaltSoft} strokeWidth={2.6} />
      </div>
      <span style={{ fontFamily: FONT_UI, fontSize: 25, fontWeight: 500, color: C.ivory, lineHeight: 1.15 }}>{label}</span>
    </div>
  );
};

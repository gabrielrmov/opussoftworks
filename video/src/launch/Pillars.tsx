import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { blurIn, ramp, useEnter } from "../anim";
import { C, SANS } from "../theme";
import { PillarIcon } from "./shared";

/**
 * 7–18s. Fase A: três blocos surgem e se conectam por linhas com dados
 * correndo entre eles. Fase B (13s): os blocos se alinham numa estrutura só.
 */
const PILLARS = [
  { name: "Tráfego", sub: "Atenção que vira lead", icon: "traffic", from: { x: 290, y: 800 }, to: { x: 540, y: 860 } },
  { name: "Sistemas", sub: "Operação sob controle", icon: "grid", from: { x: 790, y: 1070 }, to: { x: 540, y: 1090 } },
  { name: "Sites", sub: "Visita que vira venda", icon: "site", from: { x: 290, y: 1340 }, to: { x: 540, y: 1320 } },
] as const;

const APPEAR = [8, 26, 44];
const LINK_FROM = 56;
const ALIGN_AT = 192; // 13,2s no vídeo
const SIZE_A = { w: 460, h: 250 };
const SIZE_B = { w: 900, h: 200 };

export const Pillars: React.FC = () => {
  const frame = useCurrentFrame();
  const align = ramp(frame, ALIGN_AT, ALIGN_AT + 34, [0, 1], Easing.inOut(Easing.cubic));
  const frameDraw = ramp(frame, ALIGN_AT + 30, ALIGN_AT + 70, [0, 1], Easing.inOut(Easing.cubic));
  const titleB = useEnter(ALIGN_AT + 16);
  const titleBLine2 = useEnter(ALIGN_AT + 28);

  const pos = PILLARS.map((p) => ({
    x: interpolate(align, [0, 1], [p.from.x, p.to.x]),
    y: interpolate(align, [0, 1], [p.from.y, p.to.y]),
  }));
  const w = interpolate(align, [0, 1], [SIZE_A.w, SIZE_B.w]);
  const h = interpolate(align, [0, 1], [SIZE_A.h, SIZE_B.h]);

  const links: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 0],
  ];

  // Estrutura que envolve os três blocos no fim.
  const box = { x: 540 - SIZE_B.w / 2 - 30, y: 860 - SIZE_B.h / 2 - 30, w: SIZE_B.w + 60, h: 1320 - 860 + SIZE_B.h + 60 };
  const boxPerimeter = 2 * (box.w + box.h);

  return (
    <AbsoluteFill>
      {/* Título A: "Tráfego. Sistemas. Sites." — cada palavra acende com o seu bloco */}
      <div
        style={{
          position: "absolute",
          top: 330,
          width: "100%",
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 84,
          letterSpacing: "-0.05em",
          color: C.ink,
          opacity: 1 - align,
          filter: `blur(${align * 12}px)`,
        }}
      >
        {PILLARS.map((p, i) => (
          <TitleWord key={p.name} delay={APPEAR[i]} accent={i === 2}>
            {p.name}.
          </TitleWord>
        ))}
      </div>

      {/* Título B */}
      <div
        style={{
          position: "absolute",
          top: 290,
          width: "100%",
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 96,
          lineHeight: 1.04,
          letterSpacing: "-0.055em",
          color: C.ink,
        }}
      >
        <div style={blurIn(titleB, 30, 14)}>Três frentes.</div>
        <div style={{ ...blurIn(titleBLine2, 30, 14), color: C.orange }}>Uma estratégia.</div>
      </div>

      {/* Linhas e dados */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {links.map(([a, b], i) => {
          const draw = ramp(frame, LINK_FROM + i * 10, LINK_FROM + i * 10 + 26, [0, 1], Easing.inOut(Easing.cubic));
          const A = pos[a];
          const B = pos[b];
          const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
          // Dado viajando em loop pela linha
          const travel = ((frame - LINK_FROM - 30 - i * 9) / 34) % 1;
          const showDot = frame > LINK_FROM + 30 + i * 9 && draw >= 1;
          return (
            <g key={i}>
              <line
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={C.ink}
                strokeOpacity={0.35}
                strokeWidth={3}
                strokeDasharray={`${len * draw} ${len}`}
              />
              {showDot && (
                <circle cx={A.x + (B.x - A.x) * travel} cy={A.y + (B.y - A.y) * travel} r={9} fill={C.orange} />
              )}
            </g>
          );
        })}
        {frameDraw > 0 && (
          <rect
            x={box.x}
            y={box.y}
            width={box.w}
            height={box.h}
            rx={56}
            fill="none"
            stroke={C.orange}
            strokeWidth={4}
            strokeDasharray={`${boxPerimeter * frameDraw} ${boxPerimeter}`}
          />
        )}
      </svg>

      {/* Blocos */}
      {PILLARS.map((p, i) => (
        <Block key={p.name} pillar={p} delay={APPEAR[i]} x={pos[i].x} y={pos[i].y} w={w} h={h} align={align} />
      ))}
    </AbsoluteFill>
  );
};

const TitleWord: React.FC<{ delay: number; accent?: boolean; children: React.ReactNode }> = ({ delay, accent, children }) => {
  const p = useEnter(delay);
  return (
    <span style={{ display: "inline-block", margin: "0 0.12em", color: accent ? C.orange : C.ink, ...blurIn(p, 30, 12) }}>
      {children}
    </span>
  );
};

const Block: React.FC<{
  pillar: (typeof PILLARS)[number];
  delay: number;
  x: number;
  y: number;
  w: number;
  h: number;
  align: number;
}> = ({ pillar, delay, x, y, w, h, align }) => {
  const p = useEnter(delay, 14);
  // Dois layouts (coluna → linha) em camadas, trocados por crossfade durante o alinhamento.
  const a = Math.max(0, 1 - align * 2);
  const b = Math.max(0, align * 2 - 1);
  const layer: React.CSSProperties = { position: "absolute", inset: 0, display: "flex", padding: "0 44px" };
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        borderRadius: 40,
        backgroundColor: C.white,
        border: `2px solid ${C.border}`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
        fontFamily: SANS,
        opacity: p,
        transform: `scale(${0.7 + p * 0.3})`,
        filter: `blur(${(1 - p) * 10}px)`,
      }}
    >
      <div style={{ ...layer, opacity: a, flexDirection: "column", justifyContent: "center", gap: 22 }}>
        <PillarIcon name={pillar.icon} size={76} />
        <Label pillar={pillar} />
      </div>
      <div style={{ ...layer, opacity: b, alignItems: "center", gap: 32 }}>
        <PillarIcon name={pillar.icon} size={96} />
        <Label pillar={pillar} />
      </div>
    </div>
  );
};

const Label: React.FC<{ pillar: (typeof PILLARS)[number] }> = ({ pillar }) => (
  <div>
    <div style={{ fontSize: 50, fontWeight: 600, letterSpacing: "-0.04em", color: C.ink, lineHeight: 1 }}>{pillar.name}</div>
    <div style={{ marginTop: 10, fontSize: 28, color: C.muted, whiteSpace: "nowrap" }}>{pillar.sub}</div>
  </div>
);

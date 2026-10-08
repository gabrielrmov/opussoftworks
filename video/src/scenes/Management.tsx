import { Easing, useCurrentFrame } from "remotion";
import { ramp, useEnter } from "../anim";
import { Card, Icon, IconTile } from "../components";
import { C, FONT_DISPLAY, FONT_UI } from "../theme";
import { ServiceScene } from "./ServiceScene";

const MODULES = ["Vendas", "Estoque", "Financeiro", "Contratos"];

export const Management: React.FC = () => {
  const frame = useCurrentFrame();
  const total = ramp(frame, 50, 50 + MODULES.length * 22 + 10, [0, MODULES.length], Easing.linear);
  const done = Math.min(MODULES.length, Math.floor(total + 0.15));

  return (
    <ServiceScene
      index="02"
      tag="Sistemas de gestão"
      title="Sua operação organizada em um só lugar."
      caption="Feito pro seu processo real — não uma planilha genérica adaptada."
    >
      <Card style={{ padding: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 30 }}>
          <IconTile name="grid" size={64} accent />
          <span style={{ fontFamily: FONT_UI, fontSize: 30, fontWeight: 500, color: C.ivory }}>Painel da operação</span>
          <span style={{ marginLeft: "auto", fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 600, color: C.ivory }}>
            {done}/{MODULES.length}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {MODULES.map((m, i) => (
            <ModuleRow key={m} label={m} start={50 + i * 22} />
          ))}
        </div>
      </Card>
    </ServiceScene>
  );
};

const ModuleRow: React.FC<{ label: string; start: number }> = ({ label, start }) => {
  const frame = useCurrentFrame();
  const appear = useEnter(start - 18, 16);
  const fill = ramp(frame, start, start + 26, [0, 1], Easing.inOut(Easing.cubic));
  const check = useEnter(start + 22, 10);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "24px 28px",
        borderRadius: 24,
        backgroundColor: C.button,
        opacity: appear,
        transform: `translateX(${(1 - appear) * 60}px)`,
      }}
    >
      <span style={{ width: 200, fontFamily: FONT_UI, fontSize: 32, fontWeight: 500, color: C.ivory }}>{label}</span>
      <div style={{ flex: 1, height: 12, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 6, backgroundColor: C.cobalt }} />
      </div>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          border: `2px solid ${check > 0.05 ? C.cobalt : C.slate}`,
          backgroundColor: `rgba(82,102,235,${check})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ transform: `scale(${check})` }}>
          <Icon name="check" size={30} color={C.white} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

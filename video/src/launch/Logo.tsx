import { interpolate, useCurrentFrame } from "remotion";
import { CTA_L, LOGO_L, toWorld } from "./layout";
import { ease, pop } from "./motion";
import { CTA_AT, LOGO } from "./timeline";
import { Wordmark } from "./Wordmark";

/**
 * O wordmark do site nasce quando a linha fecha a pílula (impacto) e
 * depois encolhe pro topo do CTA — é o mesmo elemento até o fim.
 */
export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const a = pop(frame, LOGO.closed, 13);
  const b = pop(frame, LOGO.closed + 4, 13);
  // No CTA ele fica a 96 px na tela (escala da câmera 0.8): 120 no mundo.
  const target = toWorld(500, CTA_L.wordmarkSy);
  const m = ease(frame, LOGO.hold, CTA_AT);
  const cy = interpolate(m, [0, 1], [LOGO_L.cy, target.y]);
  if (frame < LOGO.closed - 1) return null;
  const st = (p: number): React.CSSProperties => ({
    opacity: Math.min(1, p * 2),
    transform: `scale(${1.3 - 0.3 * p})`,
    filter: `blur(${Math.max(0, 1 - p * 1.6) * 12}px)`,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: LOGO_L.cx,
        top: cy,
        transform: "translate(-50%, -50%)",
      }}
    >
      <Wordmark size={LOGO_L.size} opusStyle={st(a)} restStyle={st(b)} />
    </div>
  );
};

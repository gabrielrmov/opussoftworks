import { getLength, getPointAtLength } from "@remotion/paths";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { useCam } from "./Camera";
import { CTA_CAM, CTA_L, CURVE_END, LINE_LENGTH, LINE_PATH, LOGO_L, pillPath, toWorld, WAYPOINTS } from "./layout";
import { beatPulse, ease, EASE } from "./motion";
import { CTA_AT, LINE_PROGRESS, LOGO, SYSTEM, SYSTEM_ZOOM } from "./timeline";

/** Quanto da linha principal está desenhado neste frame. */
export const drawnLength = (frame: number) => {
  const pts = LINE_PROGRESS.map((k) => ({ f: k.f, len: WAYPOINTS[k.at] }));
  if (frame <= pts[0].f) return pts[0].len;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (frame <= b.f) {
      const t = EASE(interpolate(frame, [a.f, b.f], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return a.len + (b.len - a.len) * t;
    }
  }
  return pts[pts.length - 1].len;
};

/** Retângulo da pílula: envolve o logo e depois vira o contorno do botão do CTA. */
export const pillRect = (frame: number) => {
  const btn = toWorld(500, CTA_L.button.sy);
  const pad = 22 / CTA_CAM.s;
  const m = ease(frame, LOGO.hold, CTA_AT);
  return {
    cx: LOGO_L.cx + (btn.x - LOGO_L.cx) * m,
    cy: LOGO_L.cy + (btn.y - LOGO_L.cy) * m,
    w: LOGO_L.pill.w + ((CTA_L.button.w / CTA_CAM.s + pad * 2) - LOGO_L.pill.w) * m,
    h: LOGO_L.pill.h + ((CTA_L.button.h / CTA_CAM.s + pad * 2) - LOGO_L.pill.h) * m,
  };
};

export const CoralLine: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = useCam();
  const pulse = beatPulse(frame);
  // Espessura compensada pelo zoom, pra linha nunca sumir quando a câmera abre.
  const k = 1 / Math.pow(cam.s, 0.6);
  const width = 10 * k * (1 + 0.18 * pulse);

  const drawn = drawnLength(frame);
  const showHead = drawn > 0 && frame < LOGO.connectFrom;
  const head = showHead ? getPointAtLength(LINE_PATH, Math.max(0.01, drawn)) : null;

  // Pílula + trecho que liga o fim da curva até ela; os dois acompanham a
  // pílula quando ela desce e vira o contorno do botão do CTA.
  const rect = pillRect(frame);
  const pd = pillPath(rect.cx, rect.cy, rect.w, rect.h);
  const pillLen = getLength(pd);
  const ps = { x: rect.cx - rect.w / 2 + rect.h / 2, y: rect.cy + rect.h / 2 };
  const cd = `M ${CURVE_END.x} ${CURVE_END.y} C ${CURVE_END.x + 160} ${CURVE_END.y - 120} ${ps.x - 220} ${ps.y} ${ps.x} ${ps.y}`;
  const connLen = getLength(cd);
  const connDraw = ease(frame, LOGO.connectFrom, LOGO.closeFrom);
  const pillDraw = ease(frame, LOGO.closeFrom, LOGO.closed);
  const connHead = connDraw > 0 && pillDraw === 0 ? getPointAtLength(cd, connLen * connDraw) : null;
  const pillHead = pillDraw > 0 && pillDraw < 1 ? getPointAtLength(pd, pillLen * pillDraw) : null;
  // Pulso sutil do contorno no CTA.
  const ctaPulse = frame >= CTA_AT ? 0.5 - 0.5 * Math.cos((2 * Math.PI * (frame - CTA_AT)) / 30) : 0;

  // Dados correndo pela linha entre os pilares quando o sistema aparece.
  const dataOn = interpolate(frame, [SYSTEM_ZOOM.to - 10, SYSTEM_ZOOM.to, SYSTEM.out, SYSTEM.out + 15], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dataFrom = WAYPOINTS.p1Start;
  const dataTo = WAYPOINTS.p3End;

  return (
    <svg
      width={7400}
      height={4400}
      viewBox="0 0 7400 4400"
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
    >
      <path
        d={LINE_PATH}
        fill="none"
        stroke={C.orange}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${drawn} ${LINE_LENGTH + 10}`}
      />
      {dataOn > 0 &&
        [0, 1, 2, 3, 4].map((i) => {
          const t = ((frame - SYSTEM_ZOOM.to) / 70 + i / 5) % 1;
          const p = getPointAtLength(LINE_PATH, dataFrom + (dataTo - dataFrom) * ((t + 1) % 1));
          return p ? <circle key={i} cx={p.x} cy={p.y} r={26 * k} fill={C.orange} opacity={dataOn} /> : null;
        })}
      {connDraw > 0 && (
        <path
          d={cd}
          fill="none"
          stroke={C.orange}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={`${connLen * connDraw} ${connLen + 10}`}
        />
      )}
      {pillDraw > 0 && (
        <path
          d={pd}
          fill="none"
          stroke={C.orange}
          strokeWidth={width * (1 + ctaPulse * 0.25)}
          strokeLinecap="round"
          strokeDasharray={`${pillLen * pillDraw} ${pillLen + 10}`}
        />
      )}
      {[head, connHead, pillHead].map(
        (h, i) =>
          h && (
            <g key={i}>
              <circle cx={h.x} cy={h.y} r={width * (2.4 + pulse * 1.6)} fill={C.orange} opacity={0.18} />
              <circle cx={h.x} cy={h.y} r={width * 1.1} fill={C.orange} />
            </g>
          ),
      )}
    </svg>
  );
};

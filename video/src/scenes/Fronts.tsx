import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { blurIn, ramp, useEnter } from "../anim";
import { DotPaper, Eyebrow } from "../components";
import { C, SANS } from "../theme";

const WORDS = ["Tráfego", "Sistemas", "Sites"];
// Frame em que cada palavra recebe o foco.
const FOCUS_AT = [26, 92, 158];
const FOCUS_LEN = 18;

export const Fronts: React.FC = () => {
  const frame = useCurrentFrame();
  const eyebrow = useEnter(4);
  const words = useEnter(10);
  const head = useEnter(70);
  const body = useEnter(100);

  return (
    <DotPaper>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "120px 70px 0", textAlign: "center" }}>
        <Eyebrow style={blurIn(eyebrow, 16, 6)}>Onde a Opus SoftWorks entra</Eyebrow>

        <div style={{ marginTop: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, ...blurIn(words, 30, 0) }}>
          {WORDS.map((w, i) => {
            const on = ramp(frame, FOCUS_AT[i], FOCUS_AT[i] + FOCUS_LEN);
            const off = i < WORDS.length - 1 ? ramp(frame, FOCUS_AT[i + 1], FOCUS_AT[i + 1] + FOCUS_LEN) : 0;
            const focus = on * (1 - off);
            return <FocusWord key={w} word={w} focus={focus} />;
          })}
        </div>

        <h2
          style={{
            margin: "70px 0 0",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 68,
            lineHeight: 1.08,
            letterSpacing: "-0.045em",
            color: C.ink,
            ...blurIn(head, 30, 12),
          }}
        >
          Três frentes,
          <br />
          uma mesma estratégia.
        </h2>
        <p
          style={{
            margin: "36px 0 0",
            maxWidth: 880,
            fontFamily: SANS,
            fontSize: 34,
            lineHeight: 1.45,
            color: C.muted,
            ...blurIn(body, 20, 8),
          }}
        >
          Raramente o problema é só um. Quase sempre é aquisição, operação e presença digital puxando para lados
          diferentes.
        </p>
      </AbsoluteFill>
    </DotPaper>
  );
};

const FocusWord: React.FC<{ word: string; focus: number }> = ({ word, focus }) => {
  const corner = 34;
  const pad = interpolate(focus, [0, 1], [46, 22]);
  const cornerStyle = (pos: React.CSSProperties, borders: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: corner,
    height: corner,
    borderColor: C.orange,
    borderStyle: "solid",
    borderWidth: 0,
    ...pos,
    ...borders,
  });
  const b = 5;
  return (
    <div style={{ position: "relative", padding: "0 30px" }}>
      <span
        style={{
          display: "block",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 150,
          lineHeight: 1.08,
          letterSpacing: "-0.055em",
          color: C.ink,
          opacity: 0.3 + focus * 0.7,
          filter: `blur(${(1 - focus) * 9}px)`,
          transform: `scale(${0.94 + focus * 0.06})`,
        }}
      >
        {word}
      </span>
      <div style={{ position: "absolute", inset: -pad + 18, opacity: focus }}>
        <div style={cornerStyle({ top: 0, left: 0 }, { borderTopWidth: b, borderLeftWidth: b })} />
        <div style={cornerStyle({ top: 0, right: 0 }, { borderTopWidth: b, borderRightWidth: b })} />
        <div style={cornerStyle({ bottom: 0, left: 0 }, { borderBottomWidth: b, borderLeftWidth: b })} />
        <div style={cornerStyle({ bottom: 0, right: 0 }, { borderBottomWidth: b, borderRightWidth: b })} />
      </div>
    </div>
  );
};

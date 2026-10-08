import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { ramp, rise, useEnter } from "../anim";
import { Eyebrow } from "../components";
import { C, FONT_DISPLAY } from "../theme";

const LINE_1 = "Resultado não é sorte.".split(" ");
const LINE_2 = "É entrega.";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const eyebrow = useEnter(6);
  const underline = ramp(frame, 130, 165, [0, 1], Easing.inOut(Easing.cubic));
  // Leve zoom contínuo pra cena não ficar estática.
  const drift = 1 + frame * 0.00025;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        transform: `scale(${drift})`,
      }}
    >
      <Eyebrow style={{ ...rise(eyebrow, 20), marginBottom: 56 }}>Tráfego · Gestão · Sites</Eyebrow>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 22px",
          fontFamily: FONT_DISPLAY,
          fontWeight: 500,
          fontSize: 84,
          letterSpacing: "-0.03em",
          color: C.ash,
          lineHeight: 1.1,
        }}
      >
        {LINE_1.map((word, i) => (
          <Word key={i} delay={18 + i * 7}>
            {word}
          </Word>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          marginTop: 28,
          display: "flex",
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          fontSize: 196,
          letterSpacing: "-0.045em",
          lineHeight: 1,
          color: C.ivory,
        }}
      >
        {LINE_2.split("").map((ch, i) => (
          <Letter key={i} delay={78 + i * 3}>
            {ch === " " ? " " : ch}
          </Letter>
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: -26,
            height: 14,
            borderRadius: 7,
            width: `${underline * 100}%`,
            backgroundColor: C.cobalt,
            boxShadow: `0 0 40px ${C.cobalt}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Word: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const p = useEnter(delay);
  return <span style={{ display: "inline-block", ...rise(p, 50) }}>{children}</span>;
};

const Letter: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const p = useEnter(delay, 14);
  return (
    <span
      style={{
        display: "inline-block",
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 120}px) rotate(${(1 - p) * 8}deg)`,
      }}
    >
      {children}
    </span>
  );
};

import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { blurIn, ramp, useEnter } from "../anim";
import { Arrow, Wordmark } from "../components";
import { C, SANS } from "../theme";

const LINE_1 = ["Vamos", "elevar", "o"];
const LINE_2 = ["próximo", "passo?"];

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useEnter(8);
  const btn = useEnter(92, 16);
  const fill = ramp(frame, 150, 185, [0, 1], Easing.inOut(Easing.cubic));
  const url = useEnter(176);
  const giant = ramp(frame, 0, 360, [0, 1], Easing.linear);

  return (
    <AbsoluteFill style={{ backgroundColor: C.night }}>
      {/* Grade sutil */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.nightLine} 1px, transparent 1px), linear-gradient(90deg, ${C.nightLine} 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
        }}
      />
      {/* "SOFTWORKS" gigante no rodapé, como no footer do site */}
      <div
        style={{
          position: "absolute",
          bottom: -120,
          left: 0,
          whiteSpace: "nowrap",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 560,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          color: C.nightGlyph,
          transform: `translateX(${-80 - giant * 900}px)`,
        }}
      >
        SOFTWORKS
      </div>
      <AbsoluteFill
        style={{ background: `linear-gradient(180deg, ${C.night} 0%, transparent 30%, transparent 70%, rgba(15,14,19,0.6) 100%)` }}
      />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 60px 160px", textAlign: "center" }}>
        <div style={blurIn(logo, 20, 10)}>
          <Wordmark size={76} dark />
        </div>

        <h2
          style={{
            margin: "120px 0 0",
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 136,
            lineHeight: 0.98,
            letterSpacing: "-0.065em",
            color: C.white,
          }}
        >
          <Words words={LINE_1} start={26} />
          <Words words={LINE_2} start={50} />
        </h2>

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            marginTop: 90,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "34px 56px",
            borderRadius: 999,
            border: `2px solid ${fill > 0.5 ? C.orange : "rgba(255,255,255,0.14)"}`,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 38,
            color: C.white,
            ...blurIn(btn, 30, 8),
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: C.orange,
              transformOrigin: "left",
              transform: `scaleX(${fill})`,
            }}
          />
          <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
            Falar com um especialista <Arrow size={32} />
          </span>
        </div>

        <div
          style={{
            marginTop: 54,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 40,
            letterSpacing: "-0.01em",
            color: "rgba(255,255,255,0.7)",
            ...blurIn(url, 20, 8),
          }}
        >
          opussoftworks.com.br
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Words: React.FC<{ words: string[]; start: number }> = ({ words, start }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: "0 0.22em" }}>
    {words.map((w, i) => (
      <Word key={i} delay={start + i * 8}>
        {w}
      </Word>
    ))}
  </div>
);

const Word: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const p = useEnter(delay);
  return <span style={{ display: "inline-block", ...blurIn(p, 50, 18) }}>{children}</span>;
};

import { AbsoluteFill } from "remotion";
import { blurIn, useEnter } from "../anim";
import { Arrow, DotPaper } from "../components";
import { C, SANS } from "../theme";

const LINE_1A = ["Resultado", "não"];
const LINE_1B = ["é", "sorte."];
const LINE_2 = ["É", "entrega."];

export const Hero: React.FC = () => {
  const sub = useEnter(96);
  const btn1 = useEnter(122, 16);
  const btn2 = useEnter(132, 16);

  return (
    <DotPaper>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "120px 70px 0", textAlign: "center" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 128,
            lineHeight: 1.02,
            letterSpacing: "-0.055em",
            color: C.ink,
          }}
        >
          <Words words={LINE_1A} start={14} />
          <Words words={LINE_1B} start={30} />
          <div style={{ color: C.orange, marginTop: 10 }}>
            <Words words={LINE_2} start={62} />
          </div>
        </h1>

        <p
          style={{
            margin: "56px 0 0",
            maxWidth: 860,
            fontFamily: SANS,
            fontSize: 40,
            lineHeight: 1.35,
            letterSpacing: "-0.02em",
            color: C.muted,
            ...blurIn(sub, 20, 10),
          }}
        >
          Estratégia, tecnologia e IA para empresas que querem vender mais, operar melhor e crescer com clareza.
        </p>

        <div style={{ display: "flex", gap: 20, marginTop: 64, fontFamily: SANS, fontSize: 32, fontWeight: 500 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "30px 44px",
              borderRadius: 999,
              backgroundColor: C.ink,
              color: C.white,
              ...blurIn(btn1, 30, 8),
            }}
          >
            Falar com um especialista <Arrow size={26} />
          </div>
          <div
            style={{
              padding: "30px 40px",
              borderRadius: 999,
              backgroundColor: C.card,
              color: C.ink,
              ...blurIn(btn2, 30, 8),
            }}
          >
            Conhecer soluções
          </div>
        </div>
      </AbsoluteFill>
    </DotPaper>
  );
};

const Words: React.FC<{ words: string[]; start: number }> = ({ words, start }) => (
  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.24em" }}>
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

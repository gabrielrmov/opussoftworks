import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { blurIn, ramp, useEnter } from "../anim";
import { DotPaper } from "../components";
import { C, SANS, SERIF } from "../theme";

const ZOOM_FROM = 96;
const ZOOM_TO = 150;

export const NavyGlow: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const frame = useCurrentFrame();
  const gx = 8 + Math.sin(frame / 90) * 6;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1100px 1000px at ${gx}% 0%, rgba(255,96,57,0.42), transparent 62%),
          linear-gradient(180deg, ${C.navy} 0%, ${C.navyDeep} 100%)`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Method: React.FC = () => {
  const frame = useCurrentFrame();
  const l1 = useEnter(8, 18);
  const l2 = useEnter(18, 18);
  const hint = useEnter(40);
  const zoom = ramp(frame, ZOOM_FROM, ZOOM_TO, [0, 1], Easing.in(Easing.cubic));
  const navy = ramp(frame, ZOOM_FROM + 26, ZOOM_TO + 4, [0, 1], Easing.inOut(Easing.quad));
  const h1 = useEnter(ZOOM_TO + 6, 20);
  const h2 = useEnter(ZOOM_TO + 16, 20);
  const body = useEnter(ZOOM_TO + 44);

  const big: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 800,
    fontSize: 152,
    lineHeight: 0.92,
    letterSpacing: "-0.05em",
    backgroundImage: `linear-gradient(90deg, ${C.plum} 0%, #26244a 45%, ${C.navy} 100%)`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <AbsoluteFill>
      {navy < 1 && (
        <DotPaper>
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${1 + zoom * 22})`,
              filter: `blur(${zoom * 6}px)`,
            }}
          >
            <div style={{ ...big, ...blurIn(l1, 80, 20) }}>OPUS</div>
            <div style={{ ...big, ...blurIn(l2, 80, 20) }}>SOFTWORKS</div>
          </AbsoluteFill>
          <div
            style={{
              position: "absolute",
              bottom: 330,
              width: "100%",
              textAlign: "center",
              fontFamily: SANS,
              fontSize: 28,
              color: C.muted,
              opacity: hint * (1 - zoom),
            }}
          >
            Role para entrar na estratégia
            <div
              style={{
                margin: "22px auto 0",
                width: 4,
                height: 50,
                borderRadius: 2,
                backgroundColor: C.orange,
                transformOrigin: "top",
                transform: `scaleY(${0.3 + 0.7 * Math.abs(Math.sin(frame / 14))})`,
              }}
            />
          </div>
        </DotPaper>
      )}

      <NavyGlow style={{ opacity: navy }}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 80px", textAlign: "center" }}>
          <div style={{ fontFamily: SERIF, fontSize: 142, lineHeight: 1, letterSpacing: "-0.02em", color: C.white }}>
            <div style={blurIn(h1, 40, 14)}>Um método,</div>
            <div style={blurIn(h2, 40, 14)}>resultado visível.</div>
          </div>
          <p
            style={{
              margin: "56px 0 0",
              maxWidth: 860,
              fontFamily: SANS,
              fontSize: 36,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.78)",
              ...blurIn(body, 20, 8),
            }}
          >
            Tráfego, sistemas e presença digital trabalhando juntos, sob uma mesma estratégia, com dados que qualquer
            pessoa do time consegue olhar e entender.
          </p>
        </AbsoluteFill>
      </NavyGlow>
    </AbsoluteFill>
  );
};

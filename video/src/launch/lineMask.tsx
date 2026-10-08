import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { C } from "../theme";

type LineMaskProps = Record<string, never>;

/**
 * Transição por máscara + blur + linha: a cena nova sobe por trás de uma
 * linha coral que varre a tela de baixo pra cima, enquanto a cena que sai
 * perde o foco. As cenas são transparentes (o fundo pontilhado é contínuo).
 */
const LineMaskPresentation: React.FC<TransitionPresentationComponentProps<LineMaskProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const edge = (1 - p) * 100; // posição da linha, em % do topo
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          clipPath: `inset(0 0 ${100 - edge}% 0)`,
          filter: `blur(${p * 14}px)`,
          opacity: 1 - p * 0.6,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(${edge}% 0 0 0)` }}>{children}</AbsoluteFill>
      {p > 0 && p < 1 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${edge}%`,
            height: 4,
            marginTop: -2,
            backgroundColor: C.orange,
            boxShadow: `0 0 24px ${C.orange}`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export const lineMask = (): TransitionPresentation<LineMaskProps> => ({
  component: LineMaskPresentation,
  props: {},
});

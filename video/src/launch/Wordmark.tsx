import { C } from "../theme";
import { FONT } from "./font";

/** O wordmark do site — único em todo o vídeo: "Opus" coral em negrito + "SoftWorks" em preto. */
export const Wordmark: React.FC<{ size: number; opusStyle?: React.CSSProperties; restStyle?: React.CSSProperties }> = ({
  size,
  opusStyle,
  restStyle,
}) => (
  <span style={{ fontFamily: FONT, fontSize: size, letterSpacing: "-0.035em", lineHeight: 1, whiteSpace: "nowrap" }}>
    <span style={{ display: "inline-block", fontWeight: 700, color: C.orange, ...opusStyle }}>Opus</span>
    <span style={{ display: "inline-block", fontWeight: 400, color: C.ink, ...restStyle }}>SoftWorks</span>
  </span>
);

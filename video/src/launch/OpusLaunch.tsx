import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { Camera, camAt, CamProvider, camSpeed } from "./Camera";
import { CoralLine } from "./CoralLine";
import { CTA } from "./CTA";
import { Hook } from "./Hook";
import { Logo } from "./Logo";
import { Method } from "./Method";
import { Outcome } from "./Outcome";
import { Pillars } from "./Pillars";
import { SystemTitle } from "./System";
import { SFX } from "./timeline";

export { DURATION as LAUNCH_DURATION, FPS as LAUNCH_FPS } from "./timeline";

/** Tudo que está "no mundo": um canvas grande que a câmera percorre. */
const Canvas: React.FC = () => (
  <div style={{ position: "relative", width: 7400, height: 4400 }}>
    <Hook />
    <Pillars />
    <Method />
    <Outcome />
    <CTA />
    <Logo />
    <CoralLine />
  </div>
);

/** Um frame da cena (fundo + câmera + sobreposições). Opaco, por causa do motion blur. */
const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camAt(frame);
  return (
    <CamProvider value={cam}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Background />
        <Camera cam={cam}>
          <Canvas />
        </Camera>
        <SystemTitle />
      </AbsoluteFill>
    </CamProvider>
  );
};

// O motion blur renderiza a cena várias vezes; só liga quando a câmera anda.
const BLUR_SPEED = 3;

export const OpusLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const moving = camSpeed(frame) > BLUR_SPEED;
  return (
    <AbsoluteFill>
      {moving ? (
        <CameraMotionBlur shutterAngle={200} samples={7}>
          <Scene />
        </CameraMotionBlur>
      ) : (
        <Scene />
      )}

      {/* Áudio fica fora do blur (senão tocaria uma vez por amostra). */}
      <Html5Audio src={staticFile("music.mp3")} volume={0.9} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={45} layout="none">
          <Html5Audio src={staticFile(`sfx/${s.file}`)} volume={s.volume ?? 0.85} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

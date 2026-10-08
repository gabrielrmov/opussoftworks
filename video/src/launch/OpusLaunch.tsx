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

// Ducking: a música abaixa por alguns frames em cada impacto, pra o efeito
// aparecer sem estourar o pico.
const IMPACTS = SFX.filter((s) => s.file === "impact.wav").map((s) => s.f);
const musicVolume = (f: number) => {
  const duck = Math.max(0, ...IMPACTS.map((i) => (f >= i - 1 ? Math.exp(-(f - i + 1) / 9) : 0)));
  return MUSIC_VOLUME * (1 - 0.65 * duck);
};
// Ajustados pra mixagem final ficar em ~-14 LUFS com pico real abaixo de -1 dBFS.
const MUSIC_VOLUME = 0.92;
const SFX_VOLUME: Record<string, number> = { "tick.wav": 0.32, "click.wav": 0.45, "whoosh.wav": 0.4, "glitch.wav": 0.45, "impact.wav": 0.45 };

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
      <Html5Audio src={staticFile("music.mp3")} volume={musicVolume} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={45} layout="none">
          <Html5Audio src={staticFile(`sfx/${s.file}`)} volume={s.volume ?? SFX_VOLUME[s.file] ?? 0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

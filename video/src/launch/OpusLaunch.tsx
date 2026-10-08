import React from "react";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { Camera, camAt, CamProvider, camSpeed } from "./Camera";
import { CoralLine } from "./CoralLine";
import { CTA_Block } from "./CTA";
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
  <div style={{ position: "relative", width: 7800, height: 4600 }}>
    <Hook />
    <Pillars />
    <Method />
    <Outcome />
    <CTA_Block />
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

// Ducking: a música abaixa um pouco em cada efeito (mais e por mais tempo
// nos impactos), pra o efeito aparecer sem estourar o pico.
// Calibrado pra saída final ficar com pico real abaixo de -1 dBFS.
const MUSIC_VOLUME = 0.95;
const SFX_VOLUME: Record<string, number> = { "tick.wav": 0.3, "click.wav": 0.42, "whoosh.wav": 0.45, "glitch.wav": 0.42, "impact.wav": 0.4 };
const DUCK: Record<string, { amount: number; tau: number }> = {
  "impact.wav": { amount: 0.65, tau: 22 },
  "tick.wav": { amount: 0.35, tau: 3 },
  "click.wav": { amount: 0.35, tau: 3 },
  "glitch.wav": { amount: 0.35, tau: 3 },
};
const musicVolume = (f: number) => {
  let duck = 0;
  for (const s of SFX) {
    const d = DUCK[s.file];
    if (d && f >= s.f - 1) duck = Math.max(duck, d.amount * Math.exp(-(f - s.f + 1) / d.tau));
  }
  return MUSIC_VOLUME * (1 - duck);
};

// O motion blur renderiza a cena várias vezes; só liga quando a câmera anda.
const BLUR_SPEED = 3;

export const OpusLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const speed = camSpeed(frame);
  const moving = speed.total > BLUR_SPEED;
  // Em zoom forte o blur radial apagaria o texto: obturador mais fechado.
  const shutter = speed.zoomDominant ? 45 : 90;
  return (
    <AbsoluteFill>
      {moving ? (
        <CameraMotionBlur shutterAngle={shutter} samples={5}>
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

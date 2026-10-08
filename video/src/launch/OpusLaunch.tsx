import React, { useEffect, useState } from "react";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, continueRender, delayRender, getStaticFiles, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, camAt, CamProvider, camSpeed } from "./Camera";
import { CoralLine } from "./CoralLine";
import { Background } from "./Background";
import { CTA_Block } from "./CTA";
import { fontsLoaded } from "./font";
import { Hook } from "./Hook";
import { Logo } from "./Logo";
import { Method } from "./Method";
import { Outcome } from "./Outcome";
import { Pillars } from "./Pillars";
import { SystemTitle } from "./System";
import { MUSIC_FIRST_BEAT_MS, SFX } from "./timeline";

export { DURATION as LAUNCH_DURATION, FPS as LAUNCH_FPS } from "./timeline";

/** Tudo que está "no mundo": um canvas grande que a câmera percorre. */
const Canvas: React.FC = () => (
  <div style={{ position: "relative", width: 1, height: 1 }}>
    <Hook />
    <Pillars />
    <Method />
    <Outcome />
    <CTA_Block />
    <Logo />
    <CoralLine />
  </div>
);

/** Um frame da cena (fundo + câmera + título da visão geral). Opaco, por causa do motion blur. */
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

/**
 * Trilha: slot em public/music.mp3. Sem o arquivo, o vídeo sai só com os
 * efeitos. Nada de música sintética aqui.
 */
const HAS_MUSIC = getStaticFiles().some((f) => f.name === "music.mp3");
const MUSIC_VOLUME = 0.9;
const SFX_VOLUME: Record<string, number> = { "tick.wav": 0.25, "click.wav": 0.4, "whoosh.wav": 0.4, "impact.wav": 0.42 };
// Com trilha, ela abaixa um pouco em cada efeito (mais e por mais tempo nos impactos).
const DUCK: Record<string, { amount: number; tau: number }> = {
  "impact.wav": { amount: 0.6, tau: 22 },
  "tick.wav": { amount: 0.3, tau: 3 },
  "click.wav": { amount: 0.3, tau: 3 },
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
// Obturador de 180° com 12 amostras: rastro contínuo, sem "cópias" visíveis.
const BLUR_SPEED = 3;

export const OpusLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  // Portão das fontes: fitText/measureText só medem certo com elas carregadas.
  const [handle] = useState(() => delayRender("Carregando fontes do site"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    fontsLoaded.then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, [handle]);

  const speed = camSpeed(frame);
  const moving = speed.total > BLUR_SPEED;
  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAFA" }}>
      {ready &&
        (moving ? (
          <CameraMotionBlur shutterAngle={speed.zoomDominant ? 90 : 180} samples={12}>
            <Scene />
          </CameraMotionBlur>
        ) : (
          <Scene />
        ))}

      {/* Áudio fica fora do blur (senão tocaria uma vez por amostra). */}
      {HAS_MUSIC && <Html5Audio src={staticFile("music.mp3")} volume={musicVolume} trimBefore={Math.round((MUSIC_FIRST_BEAT_MS / 1000) * 30)} />}
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} durationInFrames={45} layout="none">
          <Html5Audio src={staticFile(`sfx/${s.file}`)} volume={s.volume ?? SFX_VOLUME[s.file] ?? 0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

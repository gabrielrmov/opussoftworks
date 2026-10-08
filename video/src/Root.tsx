import { Composition } from "remotion";
import { OpusPromo, PROMO_DURATION } from "./OpusPromo";
import { LAUNCH_DURATION, LAUNCH_FPS, OpusLaunch } from "./launch/OpusLaunch";
import { FPS, HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Lançamento: roteiro de 6 cenas, 30fps, com trilha */}
      <Composition
        id="OpusLaunch"
        component={OpusLaunch}
        durationInFrames={LAUNCH_DURATION}
        fps={LAUNCH_FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ locucao: false }}
      />
      {/* Promo institucional: percorre as seções do site, 60fps */}
      <Composition
        id="OpusPromo"
        component={OpusPromo}
        durationInFrames={PROMO_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};

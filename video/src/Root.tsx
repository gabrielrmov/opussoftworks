import { Composition } from "remotion";
import { OpusPromo, PROMO_DURATION } from "./OpusPromo";
import { FPS, HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OpusPromo"
      component={OpusPromo}
      durationInFrames={PROMO_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};

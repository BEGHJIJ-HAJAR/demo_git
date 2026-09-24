import "./index.css";
import { Composition } from "remotion";
import { Scene1Hook, scene1Schema } from "./scene1/Scene1Hook";
import { DURATION_IN_FRAMES, FPS } from "./scene1/voiceover";
import { HEIGHT, WIDTH } from "./scene1/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Scene1Hook"
        component={Scene1Hook}
        schema={scene1Schema}
        defaultProps={{ voiceover: "", captions: true }}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};

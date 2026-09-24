import "./index.css";
import { Composition, Folder } from "remotion";
import { Scene1Hook, scene1Schema } from "./scene1/Scene1Hook";
import { DURATION_IN_FRAMES, FPS } from "./scene1/voiceover";
import { HEIGHT, WIDTH } from "./scene1/theme";
import { Gallery } from "./ep01/Gallery";
import { LinkedInBanner, bannerSchema } from "./brand/LinkedInBanner";
import {
  Episode01,
  defaultEpisodeProps,
  episodeSchema,
  SCENE_PREVIEWS,
} from "./ep01/Episode01";
import { SCENES, SceneId, TOTAL_FRAMES, sceneDuration } from "./ep01/timing";

const sceneIds = Object.keys(SCENES) as SceneId[];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Episode01"
        component={Episode01}
        schema={episodeSchema}
        defaultProps={defaultEpisodeProps}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1350}
      />
      <Folder name="Episode01-Scenes">
        {sceneIds.map((id) => (
          <Composition
            key={id}
            id={`Ep01-${id}`}
            component={SCENE_PREVIEWS[id]}
            durationInFrames={sceneDuration(id)}
            fps={30}
            width={1080}
            height={1350}
          />
        ))}
        <Composition
          id="Ep01Gallery"
          component={Gallery}
          durationInFrames={120}
          fps={30}
          width={1080}
          height={1350}
        />
      </Folder>
      <Folder name="Brand">
        <Composition
          id="LinkedInBanner"
          component={LinkedInBanner}
          schema={bannerSchema}
          defaultProps={{
            kicker: "PAYMENTS · ISO 20022 · CROSS-BORDER",
            headline: "Shaping the future of",
            accent: "global payments.",
            sub: "From message standards to market infrastructures.",
          }}
          durationInFrames={1}
          fps={30}
          width={1584}
          height={396}
        />
      </Folder>
      <Folder name="Earlier">
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
      </Folder>
    </>
  );
};

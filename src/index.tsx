import {AbsoluteFill, Composition, Sequence, registerRoot} from 'remotion';
import '@fontsource-variable/manrope';
import {IntroScene, Day1Scene, Day2Scene, Day3Scene, Day4Scene, Day5Scene, Day6Scene, Day7Scene, FinalScene} from './scenes';
import {sceneNames, starts} from './timeline';
import {SoundDesign} from './sound';

const scenes=[IntroScene,Day1Scene,Day2Scene,Day3Scene,Day4Scene,Day5Scene,Day6Scene,Day7Scene,FinalScene];
function SunWeek() {
  return <AbsoluteFill style={{background:'#080f20'}}>
    {scenes.map((Scene,i)=><Sequence key={sceneNames[i]} name={sceneNames[i]} from={starts[i]} durationInFrames={starts[i+1]-starts[i]} premountFor={12}>
      <Scene/>
    </Sequence>)}
    <SoundDesign/>
  </AbsoluteFill>;
}
registerRoot(()=><Composition id="SunWeek" component={SunWeek} width={1080} height={1920} fps={30} durationInFrames={2700}/>);

import {Audio} from '@remotion/media';
import {Sequence, staticFile} from 'remotion';

export function SoundDesign() {
  return <>
    <Sequence name="Музыка · эмбиент"><Audio src={staticFile('audio/music.wav')} /></Sequence>
    <Sequence name="Среда · ветер и океан"><Audio src={staticFile('audio/ambience.wav')} /></Sequence>
    <Sequence name="Синхронные эффекты"><Audio src={staticFile('audio/effects.wav')} /></Sequence>
  </>;
}

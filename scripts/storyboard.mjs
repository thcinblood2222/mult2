import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {mkdir, rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {boardFrames} from '../src/timeline.ts';

const browserExecutable=process.env.REMOTION_BROWSER || undefined;
const browser=await openBrowser('chrome',{browserExecutable});
try {
  const serveUrl=await bundle({entryPoint:'src/index.tsx'});
  const composition=await selectComposition({serveUrl,id:'SunWeek',puppeteerInstance:browser});
  await mkdir('out/board',{recursive:true});
  for(const [i,frame] of boardFrames.entries()){
    await renderStill({serveUrl,composition,frame,scale:.25,imageFormat:'jpeg',jpegQuality:87,
      output:`out/board/${String(i).padStart(2,'0')}.jpg`,puppeteerInstance:browser});
  }
  const result=spawnSync('ffmpeg',['-v','error','-y','-framerate','1','-i','out/board/%02d.jpg','-vf',
    'tile=5x4:padding=10:margin=16:color=0x111d2e','-frames:v','1','-q:v','2','out/storyboard.jpg'],{stdio:'inherit'});
  if(result.status!==0)throw new Error('FFmpeg could not assemble the storyboard');
  await rm('out/board',{recursive:true,force:true});
} finally {await browser.close({silent:true});}

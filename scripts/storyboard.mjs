import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import sharp from 'sharp';
import {boardFrames} from '../src/timeline.ts';

const browserExecutable=process.env.REMOTION_BROWSER || undefined;
const browser=await openBrowser('chrome',{browserExecutable});
try {
  const serveUrl=await bundle({entryPoint:'src/index.tsx'});
  const composition=await selectComposition({serveUrl,id:'SunWeek',puppeteerInstance:browser});
  await mkdir('out',{recursive:true});
  const tiles=[];
  for(const [i,frame] of boardFrames.entries()){
    const {buffer}=await renderStill({serveUrl,composition,frame,scale:.25,imageFormat:'jpeg',jpegQuality:87,
      puppeteerInstance:browser});
    tiles.push({input:buffer,left:16+i%5*280,top:16+Math.floor(i/5)*490});
  }
  await sharp({create:{width:1422,height:1982,channels:3,background:'#111d2e'}})
    .composite(tiles).jpeg({quality:91}).toFile('out/storyboard.jpg');
} finally {await browser.close({silent:true});}

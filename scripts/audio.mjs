import {writeFileSync, mkdirSync} from 'node:fs';
import {starts, day1TimerAt, day1TimerSteps, day1Tick, plantAt, plantSteps, thermometerSteps} from '../src/timeline.ts';

const rate = 48000, frames = 90*rate, tau = 2*Math.PI;
let seed=1203657;
function random() {
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  return seed/2147483648-1;
}
function wav(name, data) {
  const buffer=Buffer.alloc(44+data.length*2);
  buffer.write('RIFF');buffer.writeUInt32LE(buffer.length-8,4);
  buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);
  buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*2,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);
  buffer.write('data',36);buffer.writeUInt32LE(data.length*2,40);
  data.forEach((v,i)=>buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2));
  writeFileSync(new URL(`../public/audio/${name}.wav`,import.meta.url),buffer);
}
const clip=x=>Math.max(0,Math.min(1,x));
const envelope=(t,a,b)=>clip((t-a)/1.9)*clip((b-t)/2.5);
const music=new Float32Array(frames), ambience=new Float32Array(frames), effects=new Float32Array(frames);
const chords=[[55,82.41,130.81,164.81],[49,73.42,116.54,146.83],[46.25,69.30,110,138.59],
  [41.20,61.74,98,123.47],[43.65,65.41,103.83,130.81],[41.20,61.74,92.50,116.54],
  [36.71,55,87.31,110],[46.25,69.30,116.54,155.56],[38.89,58.27,92.50,116.54]];
let air=0, rumble=0;
for (let i=0;i<frames;i++) {
  const t=i/rate, noise=random();
  air=air*.982+.018*noise;
  rumble=rumble*.998+.002*noise;
  let bed=0;
  for (let j=0;j<chords.length;j++) {
    const a=starts[j]/30-1.2,b=starts[j+1]/30+1.3;
    if(t<a||t>b)continue;
    const chord=chords[j];
    let voice=0;
    for(let k=0;k<chord.length;k++) {
      const hz=chord[k], mod=.77+.23*Math.sin(t*(.58+k*.12)+k);
      voice+=mod*(Math.sin(tau*hz*t+k)+.18*Math.sin(tau*(hz*2+.14)*t+k*2))*(k===0?.054:.023);
    }
    bed+=voice*envelope(t,a,b);
  }
  const dark = envelope(t,12,28), wind=Math.max(envelope(t,28,36),envelope(t,73,85));
  const water=envelope(t,40,75);
  const fade=clip(t/.48)*clip((90-t)/.55);
  music[i]=bed*fade;
  ambience[i]=(air*wind*(.052+.014*Math.sin(t*1.1))+rumble*water*.18+
    Math.sin(tau*(32.2*t+.021*Math.sin(t*.7)))*(.009*dark+.013*water))*fade;
}
const cues=[];
function effect(frame,name,length,fn) {
  const start=Math.round(frame/30*rate);
  cues.push([frame,name]);
  for(let i=0;i<Math.min(length*rate,frames-start);i++)effects[start+i]+=fn(i/rate);
}
function tone(frame, label, from,to,length=.18,gain=.12) {
  effect(frame,label,length,t=>{
    const phase=tau*(from*t+(to-from)*t*t/(2*length));
    const e=clip(t/.009)*Math.exp(-t/(length*.31))*clip((length-t)/.021);
    return gain*e*(Math.sin(phase)+.28*Math.sin(phase*2.01));
  });
}
function wash(frame,label,length,gain) {
  let filtered=0;
  effect(frame,label,length,t=>{
    filtered=filtered*.973+.027*random();
    return gain*Math.sin(Math.PI*t/length)**2*(filtered*.36+Math.sin(tau*(105*t-33*t*t))*.21);
  });
}
// The filtered air rises into the cut, then falls quickly while its low body trails off.
function whoosh(cutFrame, label, {lead=8, tail=11, gain=.15, low=130, high=1750}={}) {
  const length=(lead+tail)/30;
  const cut=lead/30;
  let upper=0, lower=0;
  effect(cutFrame-lead,label,length,t=>{
    const rise=clip(t/cut);
    const decay=clip((t-cut)/(length-cut));
    const envelope=t<cut ? Math.sin(Math.PI*rise/2)**2 : (1-decay)**3;
    const noise=random();
    const upperHz=high*(.30+.70*rise)*(1-.68*decay);
    const lowerHz=upperHz*.22;
    upper+=(1-Math.exp(-tau*upperHz/rate))*(noise-upper);
    lower+=(1-Math.exp(-tau*lowerHz/rate))*(noise-lower);
    const phase=tau*(low*t+low*.78*t*t/(2*length));
    const body=Math.sin(phase)*.28+Math.sin(phase*1.47)*.12;
    return gain*envelope*((upper-lower)*1.30+(1-.55*decay)*body);
  });
}
function impact(frame,label,gain) {
  effect(frame,label,1.15,t=>gain*clip(t/.007)*Math.exp(-t*4.7)*(Math.sin(tau*(55*t-14*t*t))+
    .29*Math.sin(tau*(93*t-17*t*t))+.047*random()*Math.exp(-t*23)));
}
whoosh(179,'Whoosh · из космоса в город',{lead:15,tail:13,gain:.20,low:88,high:1640});
for(let i=0;i<=day1TimerSteps;i++)tone(starts[1]+day1TimerAt+i*day1Tick,'Таймер',870-i*18,620-i*14,.09,.095);
impact(starts[1]+196,'Свет гаснет',.31);
whoosh(starts[1]+322,'Whoosh · переход к Луне',{lead:11,tail:10,gain:.12,low:113,high:1430});
tone(starts[2]+110,'Скорость',610,730,.13,.08);
tone(starts[2]+203,'Счётчик расстояния',470,650,.13,.08);
wash(starts[3]+21,'Выдох на морозе',.53,.22);
wash(starts[3]+58,'Шорох куртки',.6,.32);
wash(starts[3]+83,'Рукава',.45,.24);
wash(starts[3]+105,'Молния куртки',.46,.37);
wash(starts[3]+144,'Шапка',.4,.3);
for(const [i,f] of plantSteps.entries())tone(starts[3]+plantAt+f,'Падение фотосинтеза',840-i*131,645-i*114,.23,.15);
tone(starts[3]+plantAt+116,'Кислород',462,564,.19,.09);
whoosh(starts[4]+94,'Whoosh · переход к схеме приливов',{lead:12,tail:12,gain:.14,low:143,high:1900});
wash(starts[5]+65,'Лёд',1.2,.37);
for(const f of [104,136,151])tone(starts[5]+f,'Трещины во льду',1480,620,.088,.085);
whoosh(starts[5]+198,'Whoosh · под поверхность воды',{lead:19,tail:20,gain:.20,low:71,high:1160});
for(const f of [182,213,255])tone(starts[5]+f,'Пузырьки',278,489,.23,.075);
impact(starts[6]+67,'Подводный гул источника',.17);
for(const [i,f] of thermometerSteps.entries())tone(starts[7]+f,'Щелчок термометра',682-i*59,372-i*36,.16,.145);
whoosh(starts[7]+212,'Whoosh · возвращение Солнца',{lead:17,tail:16,gain:.18,low:141,high:2180});
tone(starts[7]+226,'Первый луч',331,416,.68,.09);
impact(starts[8]+70,'Новая траектория',.39);
whoosh(starts[2]+52,'Whoosh · выход на касательную',{lead:7,tail:12,gain:.12,low:118,high:1790});
whoosh(starts[3]+plantAt,'Whoosh · с улицы к растению',{lead:12,tail:10,gain:.14,low:110,high:1580});
whoosh(starts[8],'Whoosh · переход к финальной орбите',{lead:11,tail:8,gain:.15,low:91,high:1370});
mkdirSync(new URL('../public/audio/',import.meta.url),{recursive:true});
wav('music',music);wav('ambience',ambience);wav('effects',effects);

function timecode(f) {
  const s=Math.floor(f/30);
  return [Math.floor(s/60),s%60,f%30].map(v=>String(v).padStart(2,'0')).join(':');
}
if(process.argv.includes('--table')){
  const sorted=cues.sort((a,b)=>a[0]-b[0]);
  writeFileSync(new URL('../docs/SOUND.md',import.meta.url),
    '# Звуковые эффекты\n\nТаймкод в формате минута, секунда, кадр (30 fps). Эмбиент, шумы и эффекты синтезируются на отдельных дорожках.\n\n| Таймкод | Кадр | Событие |\n|---|---:|---|\n'+
    sorted.map(([f,name])=>`| ${timecode(f)} | ${f} | ${name} |`).join('\n')+'\n');
}

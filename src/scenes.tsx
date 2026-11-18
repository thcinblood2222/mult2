import {Sequence, interpolateColors, useCurrentFrame} from 'remotion';
import {Character2D} from './art/Character';
import {Breath, City, WindowPlantBackdrop} from './art/City';
import {AnimatedOcean, HydrothermalField, IceShelf, Underwater} from './art/Ocean';
import {AnimatedEarth, Moon, Sun, sunlight} from './art/Planet';
import {AnimatedPlant, PhotosynthesisCounter} from './art/Plant';
import {Day, InfographicSystem, ParallaxCamera, Reveal, Snow, Stage, Stars, mix, noise, smooth} from './visual';

import {day1TimerAt, day1Tick, day1TimerSteps, thermometerSteps, plantAt, plantSteps} from './timeline';
const orbitLine='M360 246 A245 245 0 1 0 360 736 A245 245 0 1 0 360 246';

function SpaceBackdrop({f,warm=0}: {f:number;warm?:number}) {
  return <>
    <defs><radialGradient id="space-nebula" cx=".52" cy=".44" r=".64"><stop stopColor={interpolateColors(warm,[0,1],['#1b3554','#40334b'])}/><stop offset=".56" stopColor="#14243d"/><stop offset="1" stopColor="#080c1c"/></radialGradient></defs>
    <rect x="-100" y="-100" width="920" height="1480" fill="url(#space-nebula)"/>
    <ellipse cx="355" cy="566" rx="455" ry="202" fill="#a66b88" opacity={.052+warm*.04} transform="rotate(-37 355 566)"/>
    <Stars f={f}/>
  </>;
}
export function IntroScene() {
  const f=useCurrentFrame(), t=f/180, push=smooth(f,106,178);
  return <Stage>
    <SpaceBackdrop f={f} warm={1}/>
    <ParallaxCamera t={t} dx={-13} dy={10} zoom={.17} pivotY={550}>
      <path d="M-78 750Q309 388 794 412" fill="none" stroke="#75aab9" strokeOpacity=".42" strokeWidth="1.2" strokeDasharray="3 11"/>
      <Sun x={130} y={433} r={79} f={f}/>
      <AnimatedEarth f={f} x={mix(414,436,push)} y={mix(518,565,push)} r={mix(192,323,push)}/>
      <Moon x={648} y={377} r={17} light={.84}/>
    </ParallaxCamera>
    <rect width="720" height="1280" fill="url(#vignette)"/>
    <Reveal at={17} until={159}><g transform="translate(56 872)">
      <path d="M0-43h74" stroke="#ffc283" strokeWidth="4"/>
      <text fontSize="94" fontWeight="860" fill="#fff1db" letterSpacing="-2">7 ДНЕЙ</text>
      <text y="94" fontSize="83" fontWeight="860" fill="#fff1db" letterSpacing="-3">БЕЗ СОЛНЦА</text>
      <text y="158" fontSize="23" fontWeight="730" fill="#a5ddd7" letterSpacing="3.5">МЫСЛЕННЫЙ ЭКСПЕРИМЕНТ</text>
    </g></Reveal>
    <rect width="720" height="1280" fill="#f8ba95" opacity={smooth(f,160,179)*.88}/>
  </Stage>;
}
export function Day1Scene() {
  const f=useCurrentFrame();
  const light=sunlight(f), pan=smooth(f,283,337), alarm=smooth(f,192,206);
  const remaining=Math.max(0,500-Math.max(0,Math.floor((f-day1TimerAt)/day1Tick))*500/day1TimerSteps);
  const seconds=Math.round(remaining);
  const time=[Math.floor(seconds/60),seconds%60].map(x=>String(x).padStart(2,'0')).join(':');
  return <Stage>
    <ParallaxCamera t={f/360} zoom={.065} dx={-13} dy={0}>
      <City f={f} light={light} skyMoon/>
      <ellipse cx={268+Math.min(f,154)*.83} cy="1101" rx="122" ry="24" fill="#10152b" opacity=".57"/>
      <Character2D f={f} x={268+Math.min(f,154)*.83} y={647} scale={1.03} light={light}
        walk={1-smooth(f,153,196)} feeling={alarm*(1-.54*smooth(f,227,271))} look={alarm*(.42-.55*Math.sin(f/15))}/>
    </ParallaxCamera>
    <rect width="720" height="1280" fill="url(#vignette)"/>
    <rect width="720" height="1280" fill="#eeb08e" opacity={(1-smooth(f,0,15))*.76}/>
    <Day number={1} until={47}/>
    <InfographicSystem at={day1TimerAt} until={229} eyebrow="ЗАДЕРЖКА СИГНАЛА" value={time} label={seconds>0?"Свет ещё в пути":"Последний свет достиг Земли"} accent="#ffcf90" y={187}/>
    <g opacity={pan}><SpaceBackdrop f={f}/><Moon x={mix(540,360,pan)} y={mix(278,458,pan)} r={mix(37,112,pan)} light={1-smooth(f,310,338)}/></g>
    <Reveal at={332} until={359}><text x="60" y="1027" fontSize="33" fill="#ecf5ef" fontWeight="810">Луна гаснет. Звёзды остаются.</text></Reveal>
  </Stage>;
}
function OrbitEarth({f,final=false}: {f:number;final?:boolean}) {
  const t=final?smooth(f,23,121):smooth(f,56,266);
  const eccentricity=.12;
  const angle=1.45-t*.96;
  const radius=245/(1+eccentricity*Math.cos(angle+Math.PI/2));
  const x=final?360+radius*Math.cos(angle):mix(361,638,t);
  const y=final?491+radius*Math.sin(angle):736-t*8;
  const oldOpacity=final?1-smooth(f,73,124):1;
  const newOrbit=Array.from({length:129},(_,i)=>{
    const theta=1.62-i*Math.PI/64, r=245/(1+eccentricity*Math.cos(theta+Math.PI/2));
    return `${i===0?'M':'L'}${360+r*Math.cos(theta)} ${491+r*Math.sin(theta)}`;
  }).join(' ')+'Z';
  const newPath=final?newOrbit:'M360 736Q520 736 674 726';
  const opacity=smooth(f,45,80);
  return <>
    <g opacity={.19} stroke="#91becb" fill="none" strokeWidth="1">
      {[121,178,296].map(r=><circle key={r} cx="360" cy="491" r={r}/>)}
      <path d="M35 491h650M360 181v620" strokeDasharray="4 9"/>
    </g>
    <path d={orbitLine} fill="none" stroke="#93b5c7" strokeWidth="2" strokeDasharray="4 8" opacity={oldOpacity*smooth(f,10,52)}/>
    <Sun x={360} y={491} f={f} r={35} alpha={final?smooth(f,13,47):.17*(1-smooth(f,40,95))}/>
    {!final&&<circle cx="360" cy="491" r="37" stroke="#72879a" strokeOpacity=".31" strokeDasharray="3 5" fill="none"/>}
    <path d={newPath} pathLength="1" strokeDasharray="1" strokeDashoffset={1-smooth(f,final?26:52,final?78:214)}
      opacity={opacity} stroke={final?'#ffb281':'#9bf1dc'} strokeWidth="3.7" fill="none"/>
    {!final&&<path d="M657 716l17 10-16 12" stroke="#9bf1dc" strokeWidth="3" fill="none" opacity={smooth(f,199,218)}/>}
    <AnimatedEarth f={f} x={x} y={y} r={43} light={final?.9:.3} tag="diagram-earth"/>
    <Moon x={x+48*Math.cos(f*.024)} y={y+35*Math.sin(f*.024)} r={10.5} light={final?.8:.32}/>
  </>;
}
export function Day2Scene() {
  const f=useCurrentFrame(), distance=Math.round(mix(0,25,smooth(f,200,282)))*100000;
  return <Stage>
    <SpaceBackdrop f={f}/>
    <ParallaxCamera t={f/330} dx={-19} dy={8} zoom={.04} pivotY={496}><OrbitEarth f={f}/></ParallaxCamera>
    <Day number={2}/>
    <InfographicSystem at={98} until={184} eyebrow="СКОРОСТЬ ЗЕМЛИ" value="29,8 км/с" label="По касательной к прежней орбите" y={957}/>
    <InfographicSystem at={189} until={322} eyebrow="ПУТЬ ЗА СУТКИ" value={`${distance.toLocaleString('ru-RU')}${f>=282?'+':''} км`} label="Луна движется вместе с Землёй" y={957}/>
  </Stage>;
}
function Day3City() {
  const f=useCurrentFrame(), cold=smooth(f,4,56);
  return <Stage>
    <ParallaxCamera t={f/plantAt} dx={-10} dy={-24} zoom={.13} pivotY={633}>
      <City f={f+290} light={.09*(1-cold)} cold={cold}/>
      <ellipse cx="340" cy="1165" rx="144" ry="31" fill="#08101f" opacity=".65"/>
      <path d="M473 733l201-46 21 30-1 73-217 53-29-28z" fill="#385464" stroke="#7c9aac" strokeWidth="3"/>
      <path d="M460 813l205-56 28 7m-208 66l-16 228m191-278l-2 178m-191 89l199-67" stroke="#172a3b" fill="none" strokeWidth="9"/>
      <path d="M454 807l218-57 25 10" stroke="#bad2d8" fill="none" strokeWidth="6" opacity=".71"/>
      <Character2D f={f} x={338} y={579} scale={1.42} dressing feeling={mix(.57,.1,smooth(f,126,184))} light={.2}/>
      <Breath f={f} x={364} y={541} opacity={smooth(f,10,31)}/>
    </ParallaxCamera>
    <Snow f={f} intensity={cold*.91}/>
    <rect width="720" height="1280" fill="url(#vignette)"/>
    <Day number={3}/>
    <path d={`M${-860+smooth(f,172,184)*1900} 0 h200 l-250 1280 h-200z`} fill="#354657" opacity=".85"/>
  </Stage>;
}
function PlantScene() {
  const f=useCurrentFrame(), stress=plantSteps.reduce((t,at)=>t+.25*smooth(f,at,at+9),0);
  return <Stage>
    <ParallaxCamera t={f/146} dx={0} dy={-12} zoom={.16} pivotY={670}>
      <WindowPlantBackdrop f={f}/><AnimatedPlant f={f} stress={stress}/>
    </ParallaxCamera>
    <rect width="720" height="1280" fill="url(#vignette)"/>
    <PhotosynthesisCounter f={f} stress={stress}/>
  </Stage>;
}
export function Day3Scene() {
  return <><Sequence durationInFrames={plantAt} name="Куртка и шапка"><Day3City/></Sequence>
  <Sequence from={plantAt} durationInFrames={330-plantAt} name="Фотосинтез"><PlantScene/></Sequence></>;
}
function TideDiagram({f}: {f:number}) {
  const theta=mix(-.63,-.35,smooth(f,100,330)), bulge=smooth(f,142,207), lines=smooth(f,116,166);
  return <g>
    <SpaceBackdrop f={f}/>
    <g transform={`translate(309 573) rotate(${theta*180/Math.PI})`}>
      <ellipse rx={137+bulge*(34+Math.sin(f/15)*4)} ry="139" fill="#65d6d7" opacity={.26*bulge} stroke="#87e7e4" strokeWidth="2.4"/>
      <ellipse rx={140+bulge*38} ry="141" fill="none" stroke="#9aefee" strokeWidth="1.3" strokeDasharray="4 7" opacity={.45*bulge}/>
      <path d="M-169 0h-68m14-8l-14 8 14 8M169 0h79m-15-8l15 8-15 8" pathLength="1" fill="none" stroke="#a8e5e1" strokeWidth="2.3" strokeDasharray="1" strokeDashoffset={1-lines} opacity={lines}/>
      <path d="M-233 0H297" fill="none" opacity={lines*.4} stroke="#a7c9cd" strokeDasharray="3 8"/>
    </g>
    <AnimatedEarth f={f} x={309} y={573} r={134} light={.45} tag="tide-earth"/>
    <Moon x={309+293*Math.cos(theta)} y={573+293*Math.sin(theta)} r={41} light={.45}/>
  </g>;
}
export function Day4Scene() {
  const f=useCurrentFrame(), reveal=smooth(f,76,114);
  return <Stage>
    <ParallaxCamera t={f/330} dx={-20} dy={-30} zoom={.13}><AnimatedOcean f={f}/></ParallaxCamera>
    <g opacity={reveal}><TideDiagram f={f}/></g>
    <Day number={4}/>
    <InfographicSystem at={188} until={320} eyebrow="ЛУННОЕ ПРИТЯЖЕНИЕ" value="Приливы остаются" label="Без Солнца их рисунок меняется" y={959}/>
  </Stage>;
}
export function Day5Scene() {
  const f=useCurrentFrame(), dive=smooth(f,137,245), spread=smooth(f,33,147);
  const height=mix(509,-215,dive);
  return <Stage>
    <g opacity={1-smooth(f,159,215)}><AnimatedOcean f={f} height={height}/></g>
    <g opacity={smooth(f,146,215)}><Underwater f={f}/></g>
    <IceShelf f={f} t={spread} y={mix(574,166,dive)}/>
    <Day number={5}/>
    <InfographicSystem at={223} until={321} eyebrow="ПОДО ЛЬДОМ" value="Вода жидкая" label="Глубина сохраняет тепло" y={961}/>
    <rect width="720" height="1280" fill="#071122" opacity={smooth(f,305,329)*.72}/>
  </Stage>;
}
export function Day6Scene() {
  const f=useCurrentFrame();
  return <Stage>
    <Underwater f={f} deep/>
    <ParallaxCamera t={smooth(f,0,303)} dx={-12} dy={-70} zoom={.125} pivotY={580}>
      <HydrothermalField f={f}/>
    </ParallaxCamera>
    <rect width="720" height="1280" fill="url(#vignette)" opacity=".64"/>
    <defs><linearGradient id="vents-caption" x2="0%" y2="100%"><stop stopColor="#081422" stopOpacity="0"/><stop offset=".46" stopColor="#081422" stopOpacity=".9"/><stop offset="1" stopColor="#081422"/></linearGradient></defs>
    <rect x="0" y="864" width="720" height="416" fill="url(#vents-caption)" opacity={smooth(f,211,239)}/>
    <Day number={6} at={22} until={69}/>
    <InfographicSystem at={223} until={346} eyebrow="ГИДРОТЕРМАЛЬНЫЕ ИСТОЧНИКИ" value="Жизнь на глубине" label="Энергия из химических реакций" y={961}/>
  </Stage>;
}
export function TemperatureGauge({f}: {f:number}) {
  const step=thermometerSteps.findLastIndex(t=>f>=t);
  const values=[4,0,-4,-8,-12,-15,-18];
  const value=values[Math.max(step,0)];
  const fluid=thermometerSteps.slice(1).reduce((n,t,i)=>mix(n,values[i+1],smooth(f,t,t+10)),4);
  return <Reveal at={57} until={186}>
    <g transform="translate(555 409)">
      <rect x="-52" y="-44" width="104" height="309" rx="51" fill="#132840" stroke="#a7dfec" strokeOpacity=".73" strokeWidth="2.3"/>
      <path d="M-13 6v196a21 21 0 1 0 26 0V6a13 13 0 0 0-26 0z" fill="#091b30" stroke="#89becd" strokeWidth="2"/>
      <path d={`M0 ${mix(43,186,(4-fluid)/22)}v177`} stroke="#6ce3ed" strokeWidth="10" strokeLinecap="round" clipPath="url(#mercury)"/>
      <defs><clipPath id="mercury"><rect x="-12" width="24" height="222"/></clipPath></defs>
      <circle cy="217" r="15" fill="#6ce3ed"/>
      {Array.from({length:8},(_,i)=><path key={i} d={`M 22 ${12+i*24} h ${i%2?8:16}`} stroke="#9cd7de" opacity=".69"/>)}
    </g>
    <g transform="translate(60 239)" fill="#f5fbfb">
      <text fontSize="17" letterSpacing="3.1" fill="#b1edea" fontWeight="800">ИЛЛЮСТРАТИВНАЯ ТЕМПЕРАТУРА</text>
      <text y="74" fontSize="67" letterSpacing="-3" fontWeight="850">{value<0?`−${-value}`:value} °C</text>
    </g>
  </Reveal>;
}
export function Day7Scene() {
  const f=useCurrentFrame(), rise=smooth(f,187,289), confused=smooth(f,302,330);
  return <Stage>
    <ParallaxCamera t={f/330} dx={13} dy={-13} zoom={.09} pivotY={627}>
      <City f={f+456} light={.03+.93*rise} cold={1}/>
      <ellipse cx="280" cy="1117" rx="150" ry="25" fill="#122036" opacity=".63"/>
      <Character2D f={f} x={288} y={643} scale={1.09} winter light={.16+.84*rise}
        look={mix(.46,-.62,rise)+confused*.7} feeling={mix(mix(.46,-.89,rise),.38,confused)}/>
      <Breath f={f} x={305} y={614} opacity={.71}/>
    </ParallaxCamera>
    <Snow f={f} intensity={.73-rise*.55}/>
    <g opacity={rise*.48}>
      <defs><linearGradient id="return-rays" x2="50%" y2="100%"><stop stopColor="#ffdfa2"/><stop offset="1" stopColor="#ffb47d" stopOpacity="0"/></linearGradient></defs>
      {Array.from({length:6},(_,i)=><path key={i} d={`M530 469l${-450+i*175} 820h${46+noise(i)*125}z`} fill="url(#return-rays)" opacity={.18+noise(i+39)*.44}/>)}
    </g>
    <Day number={7}/>
    <TemperatureGauge f={f}/>
    <InfographicSystem at={222} until={315} eyebrow="ВОЗВРАЩЕНИЕ СВЕТА" value="Солнце вернулось" label="Город всё ещё во льду" accent="#ffcf99" y={170}/>
  </Stage>;
}
export function FinalScene() {
  const f=useCurrentFrame();
  return <Stage>
    <SpaceBackdrop f={f} warm={.43}/>
    <OrbitEarth f={f} final/>
    <Reveal at={70} until={149}><g transform="translate(56 933)">
      <path d="M0-42h58" stroke="#ffb281" strokeWidth="4"/>
      <text fontSize="56" fill="#fff4e8" fontWeight="860" letterSpacing="-2">ПРЕЖНЕЙ ОРБИТЫ</text>
      <text y="63" fontSize="56" fill="#fff4e8" fontWeight="860" letterSpacing="-2">БОЛЬШЕ НЕТ</text>
      <text y="115" fontSize="18" fill="#b2c7d0">Изменение траектории показано схематично</text>
    </g></Reveal>
    <rect width="720" height="1280" fill="#050a14" opacity={smooth(f,127,149)}/>
  </Stage>;
}

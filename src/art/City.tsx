import {interpolateColors} from 'remotion';
import {mix, noise, Stars, smooth} from '../visual';
import {Sun, Moon} from './Planet';

const cityBuildings=[
  [-35,540,106,241,2],[61,584,84,255,0],[138,507,92,281,1],[216,577,64,220,0],[272,520,99,239,2],
  [360,597,61,262,0],[413,489,90,275,1],[494,557,96,249,2],[578,578,68,250,0],[630,466,102,333,1],[713,520,85,370,0],
];
function Skyline({f, light, cold}: {f:number;light:number;cold:number}) {
  return <g transform={`translate(${-6-f*.018} 0)`}>
    {cityBuildings.map(([x,y,w,h,type],i)=>{
      const wall=interpolateColors(light,[0,1],['#14263d',i%2===0?'#744c61':'#88616b']);
      return <g key={x} transform={`translate(${x} ${y})`}>
        <path d={`M0 ${h}V0h${w}v${h}z`} fill={wall} stroke="#394150" strokeWidth="1"/>
        <path d={`M${w*.72} 0l${w*.28} -14v${h+14}l-${w*.28} 7z`} fill="#0f2034" opacity=".43"/>
        {type===1&&<path d={`M-4 0L${w*.45} -48l${w*.6} 48zM${w*.47} -49v-20`} fill={wall} stroke="#495268" strokeWidth="2"/>}
        {type===2&&<path d={`M4 0v-20h${w*.8}V0m-12-21v-18m-3 0h6`} fill={wall} stroke="#566273" strokeWidth="3"/>}
        {Array.from({length:24},(_,j)=>{
          const col=j%4,row=Math.floor(j/4), on=noise(i*36+j+830)>.61;
          return <g key={j} transform={`translate(${9+col*(w-18)/4} ${19+row*28})`}>
            <rect width={w*.104} height="14" fill={on?'#ffbf77':'#24334a'} opacity={on?mix(.75,.25,light):.65}/>
            <path d={`M0 13h${w*.104}m-${w*.052}-13v13`} stroke={wall} strokeWidth="1.2"/>
          </g>;
        })}
        <path d={`M0 10h${w}m-${w} 163h${w}m-${w} 16h${w}`} stroke="#b3a1a5" opacity=".23"/>
        <path d={`M-2 1h${w+5}l-3-5-${w} 1z`} fill="#d6edee" opacity={cold*.81}/>
      </g>;
    })}
  </g>;
}
function BareTree({x,y, scale=1,cold,f}: {x:number;y:number;scale?:number;cold:number;f:number}) {
  return <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${Math.sin(f/32)*.9})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 0q8-87 1-173L-10-284m14 110q-30-37-68-75l-14-49m58 102l-58-20-31-45M2-192q29-20 50-41l15-57m-28 72l46-10 24-31M-8-256l24-48 3-33m41 75l39-35m-165 52l-22-17-11-34m-9 35l-16-9m204 45l25-5" stroke="#111f32" strokeWidth="6"/>
    <path d="M-2-6q6-90 1-153m-50-78l-17-12m103 34l29-21m-69-31l-7-13m82 38l16-5" stroke="#bbd9e7" opacity={cold*.61} strokeWidth="2.5"/>
  </g>;
}
export function City({f,light,cold=0, skyMoon=false}: {f:number;light:number;cold?:number;skyMoon?:boolean}) {
  const sky=interpolateColors(light,[0,1],['#0a172d','#302b52']);
  const horizon=interpolateColors(light,[0,1],['#2c4867','#eea37f']);
  return <g>
    <defs>
      <linearGradient id="city-sky" x2="0%" y2="100%"><stop stopColor={sky}/><stop offset=".56" stopColor={horizon}/><stop offset="1" stopColor="#1a2b43"/></linearGradient>
      <linearGradient id="city-road" x2="0%" y2="100%"><stop stopColor="#425069"/><stop offset="1" stopColor="#17263d"/></linearGradient>
      <radialGradient id="city-lamp"><stop stopColor="#fbdc96" stopOpacity=".64"/><stop offset="1" stopColor="#e89959" stopOpacity="0"/></radialGradient>
      <linearGradient id="city-ice" x2="13%" y2="99%"><stop stopColor="#b9e4ef"/><stop offset="1" stopColor="#44627c"/></linearGradient>
    </defs>
    <rect x="-42" y="-40" width="810" height="1360" fill="url(#city-sky)"/>
    <Stars f={f} opacity={(1-light)*.50}/>
    {skyMoon&&<Moon x={567} y={278} r={34} light={light}/>}
    <Sun x={534} y={481} r={45} alpha={light*.87} f={f}/>
    <g fill="none" strokeLinecap="round" opacity={.26+.12*light} transform={`translate(${-f*.16} 0)`}>
      <path d="M-80 395q190-29 352-3t391-16m-689 72q184-22 290-11t297-5m-372-104q171-16 297 5t312-13" stroke={horizon} strokeWidth="16"/>
      <path d="M-120 450q180-18 276-10m317-52q164-15 295-14m-551-50q138-6 185 4" stroke="#dfc1b9" strokeWidth="4"/>
    </g>
    <path d="M-60 604l58-30 75-14 87-52 55 27 59-21 75 21 65-38 87 20 50-23 64 48 74-23 91 19v416H-60z" fill={interpolateColors(light,[0,1],['#283955','#81536e'])}/>
    <Skyline f={f} light={light} cold={cold}/>
    <path d="M-50 901L450 659h32l277 234v430H-50z" fill="url(#city-road)"/>
    <path d="M-53 983l492-297m-493 421L440 689m350 291L493 689" fill="none" stroke={horizon} strokeWidth="4" opacity=".6"/>
    <path d="M307 1066l84-133 10-36-107 138zm110-225l42-84 2-10-52 88zm48-102l9-21 1-3-13 21z" fill="#b8bac4" opacity=".29"/>
    <path d="M-50 901L433 672l-49 57L-50 1049zm807 9L507 700l23 44 228 308z" fill="url(#city-ice)" opacity={cold*.74}/>
    <path d="M-27 1063l82-14 52-43 86-20m-124 54l47 16 58-30 62 7m361-13l40 23 27-7 60 46M446 745l21 6-9 20 32 11 30-11m-95 34l43 11 41-38" stroke="#cfe9ee" fill="none" opacity={cold*.37} strokeWidth="2"/>
    <BareTree x={87} y={875} scale={1.14} f={f} cold={cold}/>
    <BareTree x={650} y={783} scale={.72} f={f} cold={cold}/>
    <g transform="translate(622 889)">
      <path d="M0 0v-322q0-38-44-38h-35" fill="none" stroke="#14233a" strokeWidth="8"/>
      <path d="M-2 0v-322q0-34-42-36" fill="none" stroke="#9fb0bb" strokeWidth="1.6" opacity=".56"/>
      <path d="M-95-360q11-12 43 0l-7 8h-32z" fill="#263047"/><path d="M-91-352h34" stroke="#ffd698" strokeWidth="4"/>
      <ellipse cx="-76" cy="-350" rx="91" ry="66" fill="url(#city-lamp)" opacity={.8-.4*light}/>
      <path d="M-2-303l-2 21 4 9 2-21m-69-57l1 12 4-12" stroke="#c9edf0" strokeWidth="2" opacity={cold}/>
    </g>
    <path d="M-30 1111q231-17 410 30t378 22v155H-30z" fill="#0d1a2b" opacity=".63"/>
  </g>;
}
export function Breath({f,x,y,opacity}: {f:number;x:number;y:number;opacity:number}) {
  const t=(f%36)/36;
  return <g opacity={opacity*Math.sin(Math.PI*t)*.58} transform={`translate(${x+49*t} ${y-22*t}) scale(${.76+t})`}>
    <ellipse rx="16" ry="7" fill="#d9f4f1" opacity=".55"/>
    <ellipse cx="11" cy="-3" rx="12" ry="8" fill="#d9f4f1" opacity=".32"/>
    <ellipse cx="26" cy="2" rx="13" ry="7" fill="#d9f4f1" opacity=".20"/>
  </g>;
}
export function WindowPlantBackdrop({f}: {f:number}) {
  return <g>
    <defs><linearGradient id="plant-room" x2="100%" y2="83%"><stop stopColor="#182d3a"/><stop offset=".47" stopColor="#263e46"/><stop offset="1" stopColor="#111b2e"/></linearGradient></defs>
    <rect width="720" height="1280" fill="url(#plant-room)"/>
    <path d="M109 109H595v712H109z" fill="#07172a" stroke="#425865" strokeWidth="18"/>
    <Stars f={f} opacity={.8*(1-smooth(f,126,200))}/>
    <path d="M112 114h480v700H112z" fill="#283944" opacity=".42"/>
    <path d="M110 112h487v709H110zM354 111v705m-238-378h477" stroke="#58676a" strokeWidth="8" opacity=".59" fill="none"/>
    <path d="M155 133h174L144 497h-16V200zm219 318h195L413 804h-39z" fill="#83b8b8" opacity=".06"/>
    <path d="M0 869q300-32 720 0v103H0z" fill="#3d424b"/>
    <path d="M0 870q339-29 720 0m-718 25q300-15 717 7m-718 29q318-13 719 2" stroke="#6f6968" opacity=".52" fill="none" strokeWidth="2"/>
    <path d="M0 963h720v317H0z" fill="#101b2b"/>
  </g>;
}

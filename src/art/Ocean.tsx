import {staticFile} from 'remotion';
import {fract, mix, noise, smooth, Stars} from '../visual';

function wave(f:number,i:number,y:number,amount:number) {
  const shift=Math.sin(f/(22+i*3)+i)*39;
  return `M-80 ${y} Q${40+shift} ${y-amount} ${170+shift} ${y}T ${420+shift} ${y} ${670+shift} ${y} ${920+shift} ${y}V1380H-80Z`;
}
export function AnimatedOcean({f, height=522}: {f:number;height?:number}) {
  return <g>
    <defs><linearGradient id="ocean-night" x2="0%" y2="100%"><stop stopColor="#0a142d"/><stop offset=".43" stopColor="#285374"/><stop offset=".77" stopColor="#0f3050"/><stop offset="1" stopColor="#0a1830"/></linearGradient>
      <linearGradient id="wave-dark" x2="0%" y2="100%"><stop stopColor="#3a7f92"/><stop offset=".36" stopColor="#20475f"/><stop offset="1" stopColor="#08182d"/></linearGradient>
    </defs>
    <rect width="720" height="1280" fill="url(#ocean-night)"/><Stars f={f} opacity={.63}/>
    <path d={`M0 ${height}q92-44 176-22 55-39 117-25 55-13 96 20 110-42 196-14l136-11v105H0z`} fill="#12253e" opacity=".87"/>
    {Array.from({length:8},(_,i)=>{
      const y=height+40+i*(42+i*6);
      return <g key={i}><path d={wave(f,i,y,12+i*4)} fill={i%2?'url(#wave-dark)':'#21546d'} opacity={.75+i*.028}/>
      <path d={wave(f,i,y,12+i*4).split('V')[0]} fill="none" stroke={i>5?'#74adb7':'#75c5cc'} opacity={.19+i*.02} strokeWidth={1+i*.21}/></g>;
    })}
    <image href={staticFile('art/current-lines.svg')} x={Math.sin(f/31)*17} y={height-485} width="720" height="1280"/>
  </g>;
}
export function IceShelf({f, t, y=535}: {f:number;t:number;y?:number}) {
  return <g transform={`translate(0 ${y})`}>
    <defs>
      <linearGradient id="ice-top" x2="15%" y2="97%"><stop stopColor="#8ac2d4"/><stop offset=".58" stopColor="#447a98"/><stop offset="1" stopColor="#32516e"/></linearGradient>
      <linearGradient id="ice-edge" x2="0%" y2="100%"><stop stopColor="#c3e8ec"/><stop offset=".25" stopColor="#6bb3c5"/><stop offset="1" stopColor="#325f85" stopOpacity=".45"/></linearGradient>
      <clipPath id="ice-spread"><rect x="-40" y="-110" width={840*t} height="380"/></clipPath>
    </defs>
    <g clipPath="url(#ice-spread)" transform={`translate(0 ${Math.sin(f/29)*2})`}>
      <path d="M-30-36l102-11 72 12 104-26 58 20 87-13 94 16 89-12 75 16 88-23v77l-62-11-58 42-57-6-57 24-83-17-47 14-59-31-67 39-59-19-62 23-58-33-65 11z" fill="url(#ice-top)" stroke="#92becf" strokeWidth="2.6"/>
      <path d="M-30 54l65-11 58 33 62-23 59 19 67-39 59 31 47-14 83 17 57-24 57 6 58-42 62 11v57l-49-12-42 40-25-10-35 26-39-17-52 19-44-9-38 16-79-14-72 35-72-41-39 15-24-14-68 13z" fill="url(#ice-edge)" stroke="#6b9caf" strokeWidth="2"/>
      <path d="M42-36l52 34 71-23m-71 23l50 16 11 39m107-107l-30 42 49 10 8 34m105-81l-53 52 65 16 64 47m65-98l-20 32 53 24 18 25m58-54l-42 22 23 23" fill="none" stroke="#c4ecf4" opacity=".65" strokeWidth="2.6"/>
      <path d="M35 47l58 29 62-23 59 19 67-39 59 31 47-14 83 17 57-24 57 6 58-42" fill="none" stroke="#cceff1" strokeWidth="4" opacity=".74"/>
      <path d="M30 83l44-9 36 31 39-13m36-14l24 17 10 25 31-10m40-52l29 32-4 19m81-51l65 26 35-6m75-30l-35 33 41 18m83-69l39 21" stroke="#1b4f74" strokeWidth="2.6" fill="none" opacity=".58"/>
    </g>
  </g>;
}
export function Underwater({f, deep=false}: {f:number;deep?:boolean}) {
  return <g>
    <defs>
      <linearGradient id="water-depth" x2="0%" y2="100%"><stop stopColor={deep?'#061124':'#226580'}/><stop offset=".40" stopColor={deep?'#0a2334':'#17405d'}/><stop offset="1" stopColor="#071122"/></linearGradient>
      <radialGradient id="vent-glow"><stop stopColor="#48c3a9" stopOpacity=".35"/><stop offset="1" stopColor="#48c3a9" stopOpacity="0"/></radialGradient>
    </defs>
    <rect x="-10" y="-20" width="750" height="1350" fill="url(#water-depth)"/>
    {!deep&&[0,1,2,3].map(i=><path key={i} d={`M${90+i*155+Math.sin(f/69+i)*23} -40l${24+i*4} 0 ${105+i*22} 990h-245z`} fill="#a3fbef" opacity=".028"/>)}
    {Array.from({length:58},(_,i)=>{
      const scale=.1+noise(i+206), x=noise(i+369)*736+Math.sin(f*.009+i)*16;
      const y=fract(noise(i+440)-f*.00033*scale)*1280;
      return <circle key={i} cx={x} cy={y} r={.6+scale*2} fill="#b3e1dc" opacity={.12+scale*.32}/>;
    })}
    {!deep&&Array.from({length:10},(_,i)=>{
      const t=fract(f*.003+noise(i+532)),y=1110-940*t,x=135+noise(i+801)*440+Math.sin(f/25+i)*12;
      return <circle key={i} cx={x} cy={y} r={2+noise(i+445)*7} fill="#91d9e7" fillOpacity=".11" stroke="#c0f1f3" strokeOpacity={.21+.35*(1-t)} strokeWidth="1.3"/>;
    })}
  </g>;
}
function Chimney({x,y,scale,f}: {x:number;y:number;scale:number;f:number}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {Array.from({length:13},(_,i)=>{
      const t=fract(i/13+f*.0041), x=Math.sin(t*7+f*.015+i)*28*t;
      return <ellipse key={i} cx={x} cy={-290-t*375} rx={14+t*90} ry={17+t*65} fill={i%2?'#3e8e93':'#6bbab1'} opacity={Math.sin(Math.PI*t)*.079}/>;
    })}
    <path d="M-93 27l15-69 22-34-11-29 28-37-6-51 20-31 1-51 16-24 34 5 20 32-4 67 18 33-7 33 22 40 2 47 22 48 26 26z" fill="url(#vent-rock)" stroke="#396473" strokeWidth="2.6"/>
    <path d="M-77-56l46-19-8-39 25-60-6-50 22-62m-55 176l28 14 27-14 18-54m-52 97l61-22 31 17m-67-75l43-18m-10-42l2-53m-53 215l25-49 37 3 11 34 33 10" stroke="#678b8d" opacity=".58" fill="none" strokeWidth="3"/>
    <path d="M-48 20l18-53 14-36 31 11-5 56-14 22zm6-122l17-40 11-20 11 16-10 61zm23-118l8-57 21-19-1 53zm64 120l15 17 11 56-20-1-15-42z" fill="#102b3b" opacity=".75"/>
    <ellipse cx="8" cy="-290" rx="20" ry="9" fill="#6ab9a7"/><ellipse cx="9" cy="-293" rx="14" ry="4.5" fill="#203d4a"/>
  </g>;
}
function Worms({f}: {f:number}) {
  return <g>{Array.from({length:19},(_,i)=>{
    const x=101+i*25+noise(i+790)*10,y=964+noise(i+841)*110,h=29+noise(i+683)*111;
    const cx=x+Math.sin(f/24+i)*8,cy=y-h;
    return <g key={i}>
      <path d={`M${x} ${y}q-11 ${-h*.58} ${cx-x} ${-h}`} stroke="#90b9b1" strokeWidth={4.7+noise(i)*6} fill="none" strokeLinecap="round"/>
      <path d={`M${x-3} ${y}q-9 ${-h*.58} ${cx-x+1} ${-h}`} stroke="#e1d7ba" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".78"/>
      <path d={`M${cx-4} ${cy}q-4 -11 1-16 3 3 4 7 8-9 10-4l-5 14z`} fill="#ce7372" stroke="#795462" strokeWidth="1.2"/>
    </g>;
  })}</g>;
}
function Fish({x,y,scale,f,id}: {x:number;y:number;scale:number;f:number;id:number}) {
  return <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${Math.sin(f/26)*5})`}>
    <ellipse rx="59" ry="33" cx="15" cy="-6" fill="url(#vent-glow)" opacity={.66+.29*Math.sin(f/19)}/>
    <path d={`M-18-2 Q-38 ${-17+Math.sin(f/5)*7} -57-19l8 15-10 17q19 1 40-11z`} fill="#537e87" stroke="#78aca9" strokeWidth="1.3"/>
    <path d="M-34-2q17-18 39-18l14-9 11 14Q50-10 49 2 41 14 20 17L1 29l-3-13q-20 0-32-18z" fill="#426d7e" stroke="#85afa9" strokeWidth="1.4"/>
    <path d="M-23-5q21-9 38-7m-3 20q12 9 16-6m7 4l13-2m-43-16q0 10-6 17" fill="none" stroke="#acd2be" opacity=".65"/>
    {[0,1,2,3,4].map(i=><circle key={i} cx={-18+i*9} cy={3+(i%2)*2} r="1.7" fill="#9df0bd" opacity={.5+.35*Math.sin(i+f/14+id)}/>)}
    <circle cx="32" cy="-6" r="3.3" fill="#cef6bc"/><circle cx="33" cy="-6" r="1.5" fill="#102638"/>
  </g>;
}
export function HydrothermalField({f}: {f:number}) {
  const visible=smooth(f,35,108);
  return <g opacity={visible}>
    <defs><linearGradient id="vent-rock" x2="95%" y2="85%"><stop stopColor="#537d80"/><stop offset=".49" stopColor="#294456"/><stop offset="1" stopColor="#192939"/></linearGradient></defs>
    <ellipse cx="361" cy="685" rx="353" ry="550" fill="url(#vent-glow)"/>
    <path d="M0 829l87-91 91 62 81-68 91 39 101-133 75 95 55-62 139 107v493H0z" fill="#112a3e"/>
    <path d="M0 902l78-72 96 40 88-37 62 22 120-58 77 34 99-42 100 33v451H0z" fill="#18354a" opacity=".9"/>
    <Chimney f={f+61} x={149} y={981} scale={.67}/>
    <Chimney f={f} x={382} y={976} scale={1.3}/>
    <Chimney f={f+118} x={598} y={1000} scale={.82}/>
    <path d="M-40 1020l111-59 83 21 86-30 122 33 112-22 104 31 93-20 68 45v301H-40z" fill="#11263a" stroke="#2c4c5c" strokeWidth="3"/>
    <Worms f={f}/>
    <path d="M-50 1180l87-52 86 1 79-47 99 46 150-12 86 31 126-44 79 43v176H-50z" fill="#0a1728"/>
    {[0,1,2,3,4].map(i=><Fish key={i} id={i} f={f+i*28} x={fract((f*.0025)+noise(i+1085))*1000-130}
      y={470+i*89+20*Math.sin(f/42+i)} scale={mix(.54,1.37,noise(i+43))}/>)}
  </g>;
}

import {mix, smooth, noise} from '../visual';

const continents = [
  'M-156 -106l28 -22 19 9 12 -9 21 7 21 -5 16 14 1 13 16 9-4 12-20 7-8 15-12 4-1 18-17 5-5 19-14 -4-6 -21-24 -10-3 -13-16 -7-13-20z',
  'M-86 -21l14 9 7 18 15 3 6 12 23 6 14 16-2 24-17 17-4 21-15 12-4 30-14 11-11-16-4-34-12-20-6-25-12-20 5-22 15-8z',
  'M-30 -132l27-18 27 6 13 14-7 15-21 21-15 5-6-21-13-8z',
  'M41 -61l15-16 13 1 7-14 16 1 19-17 20 4 17-11 36 11 27 15 18 25-10 22-23 7-16 22-15 1-9 18-13 1-11-22-14 5-11 21-14-12-8-10-21-7-4-20-15 9-13-10z',
  'M50 -34l24 3 23 16 17 6 2 22-15 15-8 32-15 13-14-16-9-29-18-12-11-18 12-20z',
  'M163 66l20-6 17 10 19 7 7 19-15 13-26-3-22 5-16-10 3-16z',
  'M117 50l-4 26-11 12-5-6 4-17z',
  'M-156 151q57 -21 89 -12t65 0 94 0 62 9l12 34h-320z',
];
export function AnimatedEarth({f,x,y,r,light=1, tag='earth'}: {f:number;x:number;y:number;r:number;light?:number;tag?:string}) {
  return <g transform={`translate(${x} ${y}) scale(${r/160})`}>
    <defs>
      <clipPath id={tag+'disk'}><circle r="160"/></clipPath>
      <linearGradient id={tag+'ocean'} x2="85%" y2="80%">
        <stop stopColor="#77dbc7"/><stop offset=".33" stopColor="#267f9e"/><stop offset=".72" stopColor="#164266"/><stop offset="1" stopColor="#101d3a"/>
      </linearGradient>
      <linearGradient id={tag+'land'} x2="100%" y2="90%"><stop stopColor="#d4d58b"/><stop offset=".32" stopColor="#75ba89"/><stop offset=".74" stopColor="#3b8d7e"/><stop offset="1" stopColor="#19364f"/></linearGradient>
      <linearGradient id={tag+'shadow'} x1="5%" y1="6%" x2="92%" y2="85%"><stop offset=".26" stopColor="#121c39" stopOpacity="0"/><stop offset="1" stopColor="#010618" stopOpacity=".95"/></linearGradient>
      <radialGradient id={tag+'air'}><stop offset=".8" stopColor="#42abdf" stopOpacity="0"/><stop offset=".87" stopColor="#70cee9" stopOpacity=".21"/><stop offset=".92" stopColor="#3b96ba" stopOpacity=".36"/><stop offset="1" stopColor="#217dab" stopOpacity="0"/></radialGradient>
    </defs>
    <circle r="181" fill={`url(#${tag}air)`} opacity={.48+light*.5}/>
    <g clipPath={`url(#${tag}disk)`}>
      <circle r="160" fill={`url(#${tag}ocean)`}/>
      <g transform={`rotate(-17) translate(${(f*.35)%380-35} 0)`}>
        {[-380,0,380].map(shift=><g key={shift} transform={`translate(${shift} 0)`}>
          {continents.map((d,i)=><path key={d} d={d} fill={`url(#${tag}land)`} stroke={i===7?'#a4cebc':'#629d8b'} strokeWidth="1.7"/>)}
          <g fill="none" stroke="#d4c387" strokeLinecap="round" opacity=".42">
            <path d="M-145-86q20 4 26 25t13 40m23 33q17 10 24 31t-1 49M46-16q23-12 44 5m20-61q14 14 52 12m-25 8l39 14" strokeWidth="10"/>
            <path d="M48-2q22 1 39 18t8 22m63 42l37 5" strokeWidth="4"/>
          </g>
          <g fill="none" stroke="#edf8ed" strokeLinecap="round">
            <path d="M-169-52q39 -28 87-26t66-10m-146 41q28-9 54-9m73 30q26-21 63-13t49 4m17-35q62-36 117-15m-343 160q58-26 121-12t92-6m31 56q42-22 83-21" strokeWidth="8" opacity=".30"/>
            <path d="M-151-55q41-24 77-22m57 38q33-10 78 2m98-53q37-6 70 13M-139 79q31-13 54-14m89 2q32 9 71-5m46 49q35-17 63-17" opacity=".49" strokeWidth="2"/>
          </g>
        </g>)}
      </g>
      <circle r="160" fill={`url(#${tag}shadow)`}/>
      <circle r="160" fill="#050a1e" opacity={(1-light)*.83}/>
      <path d="M-148 59A159 159 0 0 1 94-128" fill="none" stroke="#b5eee6" strokeWidth="2.8" opacity={.20+.52*light}/>
    </g>
  </g>;
}
export function Sun({x,y,r,f,alpha=1}: {x:number;y:number;r:number;f:number;alpha?:number}) {
  return <g transform={`translate(${x} ${y})`} opacity={alpha}>
    <defs>
      <radialGradient id="sun-corona"><stop stopColor="#fff3be" stopOpacity=".8"/><stop offset=".38" stopColor="#fdb466" stopOpacity=".48"/><stop offset=".66" stopColor="#ec7541" stopOpacity=".14"/><stop offset="1" stopColor="#ec7541" stopOpacity="0"/></radialGradient>
      <radialGradient id="sun-core" cx=".34" cy=".27" r=".77"><stop stopColor="#ffffdb"/><stop offset=".56" stopColor="#ffde87"/><stop offset="1" stopColor="#ef8b53"/></radialGradient>
      <clipPath id="sun-disk"><circle r={r}/></clipPath>
    </defs>
    <circle r={r*(2.9+.07*Math.sin(f/22))} fill="url(#sun-corona)"/><circle r={r} fill="url(#sun-core)"/>
    <g clipPath="url(#sun-disk)">{Array.from({length:19},(_,i)=><path key={i} d={`M${r*(noise(i+58)*2-1)} ${r*(noise(i+70)*2-1)}q ${r*.27} ${-r*.12} ${r*.39} ${r*.027}`} fill="none" stroke="#ae6336" strokeWidth={1+noise(i)*2} opacity=".2"/>)}</g>
  </g>;
}
export function Moon({x,y,r,light=1}: {x:number;y:number;r:number;light?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${r/50})`}>
    <defs><linearGradient id="moon-surface" x2="100%" y2="88%"><stop stopColor="#edf2dd"/><stop offset=".54" stopColor="#a9bac2"/><stop offset="1" stopColor="#4b6680"/></linearGradient></defs>
    <circle r="50" fill="url(#moon-surface)" stroke="#a4c7d1" strokeWidth=".7"/>
    {[[19,-13,14],[-19,13,10],[4,21,5],[-8,-27,8],[30,18,6],[-31,-8,4]].map(([cx,cy,q])=><g key={cx}>
      <ellipse cx={cx} cy={cy} rx={q} ry={q*.72} fill="#526981" opacity=".54"/>
      <path d={`M${cx-q} ${cy} a ${q} ${q*.72} 0 0 0 ${2*q} 0`} fill="none" stroke="#f4f5d7" opacity=".59" strokeWidth="1.2"/>
    </g>)}
    <circle r="50" fill="#091024" opacity={mix(.95,0,light)}/>
  </g>;
}
export const sunlight = (f:number) => 1-smooth(f,193,202);

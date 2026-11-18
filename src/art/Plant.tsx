import {interpolateColors} from 'remotion';
import {InfographicSystem, mix, smooth} from '../visual';

const leaves = [
  [0,-144,-159,-264,1.16],[-11,-194,122,-237,1.24],[-10,-251,-126,-334,.9],
  [3,-297,113,-329,.85],[6,-343,-57,-414,.57],
];
export function AnimatedPlant({f,stress}: {f:number;stress:number}) {
  const droop=smooth(stress,.28,1), curl=smooth(stress,.54,1);
  const color1=interpolateColors(stress,[0,.38,.72,1],['#a0d993','#91b878','#c1b05b','#b18856']);
  const color2=interpolateColors(stress,[0,.42,.78,1],['#309577','#537e5f','#8b874d','#8c633e']);
  const color3=interpolateColors(stress,[0,.45,.78,1],['#25564f','#34544b','#615c3a','#603e36']);
  return <g transform="translate(358 845)">
    <defs>
      <linearGradient id="leaf-color" x1="5%" y1="15%" x2="87%" y2="92%"><stop stopColor={color1}/><stop offset=".49" stopColor={color2}/><stop offset="1" stopColor={color3}/></linearGradient>
      <linearGradient id="pot-color" x2="94%" y2="84%"><stop stopColor="#cb957f"/><stop offset=".57" stopColor="#8a5c60"/><stop offset="1" stopColor="#4a4055"/></linearGradient>
    </defs>
    <ellipse cy="27" rx="139" ry="22" fill="#121b29" opacity=".65"/>
    <g transform={`rotate(${droop*23+Math.sin(f/19)*.75})`}>
      <path d={`M-3-55q13-95 -5-155T${10+droop*15} -342q13-41-8-62`} fill="none" stroke={color3} strokeWidth="12" strokeLinecap="round"/>
      <path d={`M-1-58q12-97-6-154t${17+droop*15}-129q11-32-8-62`} fill="none" stroke={color1} strokeOpacity=".8" strokeWidth="3" strokeLinecap="round"/>
      {leaves.map(([x,y,tx,ty,scale],i)=>{
        const turn=Math.atan2(ty-y,tx-x)*180/Math.PI;
        const angle=turn+(tx>0?1:-1)*(droop*(45+i*4))+Math.sin(f/12+i)*mix(2.4,.45,stress);
        return <g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
          <path d={`M0 0q17 1 34 -2q55 ${-85+curl*35} 139 ${-15+curl*27}q-21 ${12-curl*9}-41 ${35-curl*10}Q66 ${60-curl*24} 34 5z`} fill="url(#leaf-color)" stroke={color3} strokeWidth="2.1"/>
          <path d={`M14 0q49 ${2-curl*7} 104 ${-12+curl*14}l53 ${-4+curl*13}m-123 14q16-19 43-27m-25 24q22 11 48 11m-29-16q19-15 47-16m-29 14q14 9 28 10`} fill="none" stroke={color1} strokeWidth="1.8" opacity=".64"/>
          <path d={`M44-11q58 ${-46+curl*22} 119 ${-6+curl*20}M63 13q21 ${21-curl*9} 70 5`} fill="none" stroke="#fef1a4" opacity={.18+stress*.36}/>
          <path d={`M122 ${-24+curl*14}q19-3 29 5l-8 9-18-6zm-36 34l21-5 5 9-21 4z`} fill="#dfc75d" opacity={smooth(stress,.28,.78)*.64}/>
        </g>;
      })}
    </g>
    <path d="M-86-72h172L67 15q-16 23-66 22-53 0-68-21z" fill="url(#pot-color)" stroke="#493e50" strokeWidth="3"/>
    <ellipse cy="-73" rx="91" ry="19" fill="#bf8978" stroke="#684551" strokeWidth="3"/>
    <ellipse cy="-74" rx="77" ry="13" fill="#473e42"/><path d="M-30-76q22-8 49-5m-68 8l14-6m58 4l17-5" stroke="#78604e" strokeWidth="2" fill="none"/>
    <path d="M-89-75q4 22 19 24 72 13 142 0 14-3 17-22-78 26-178-2z" fill="url(#pot-color)" stroke="#664953" strokeWidth="2"/>
    <path d="M-56-40l10 54m-4-52l12 55m65-55l-5 57m12-60l-7 58m-74-28q41 12 106-3" fill="none" stroke="#edd1bb" strokeWidth="1.6" opacity=".31"/>
  </g>;
}
export function PhotosynthesisCounter({f,stress}: {f:number;stress:number}) {
  return <>
    <InfographicSystem at={14} until={111} eyebrow="ФОТОСИНТЕЗ" value={`${Math.round(100*(1-stress)/5)*5}%`} label="Ускоренная визуализация" accent="#d7dd9a" y={965}>
      <path d="M0 162h310" stroke="#cdd99a" strokeOpacity=".25" strokeWidth="4"/>
      <path d={`M0 162h${310*(1-stress)}`} stroke="#d9df98" strokeWidth="4"/>
    </InfographicSystem>
    <InfographicSystem at={112} until={145} eyebrow="КИСЛОРОД В АТМОСФЕРЕ" value="≈ 20,9%" label="Запас кислорода за неделю почти не меняется" y={965}/>
  </>;
}

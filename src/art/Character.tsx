import {mix, smooth} from '../visual';
import {interpolateColors} from 'remotion';

type Pose = { left:number; leftElbow:number; right:number; rightElbow:number; head:number; lean:number };
const keyPoses: [number, Pose][] = [
  [0,{left:5,leftElbow:-6,right:-5,rightElbow:8,head:1,lean:0}],
  [22,{left:16,leftElbow:-25,right:-19,rightElbow:32,head:-7,lean:4}],
  [38,{left:23,leftElbow:-112,right:-22,rightElbow:101,head:-7,lean:7}],
  [56,{left:53,leftElbow:-47,right:-7,rightElbow:37,head:10,lean:-4}],
  [72,{left:62,leftElbow:-32,right:-50,rightElbow:55,head:4,lean:-5}],
  [93,{left:22,leftElbow:-15,right:-22,rightElbow:26,head:-2,lean:-2}],
  [107,{left:-18,leftElbow:-56,right:14,rightElbow:89,head:4,lean:2}],
  [121,{left:-4,leftElbow:-8,right:12,rightElbow:128,head:3,lean:1}],
  [131,{left:8,leftElbow:-14,right:-47,rightElbow:63,head:-4,lean:0}],
  [142,{left:40,leftElbow:96,right:-40,rightElbow:-96,head:-4,lean:0}],
  [154,{left:53,leftElbow:119,right:-53,rightElbow:-119,head:0,lean:0}],
  [170,{left:42,leftElbow:105,right:-43,rightElbow:-105,head:2,lean:0}],
  [184,{left:7,leftElbow:-10,right:-7,rightElbow:12,head:-2,lean:1}],
];
function dressingPose(f:number): Pose {
  const index=keyPoses.findIndex(([k])=>k>f);
  if(index<0)return keyPoses.at(-1)![1];
  const [a,p]=keyPoses[Math.max(index-1,0)], [b,q]=keyPoses[index];
  const t=smooth(f,a,b);
  return {left:mix(p.left,q.left,t),leftElbow:mix(p.leftElbow,q.leftElbow,t),right:mix(p.right,q.right,t),rightElbow:mix(p.rightElbow,q.rightElbow,t),head:mix(p.head,q.head,t),lean:mix(p.lean,q.lean,t)};
}
export function CharacterFaceRig({f, feeling, turn, warmth}: {f:number;feeling:number;turn:number;warmth:number}) {
  const blink=Math.max(0,1-Math.abs(((f+31)%108)-54)/4.5);
  const eye=Math.max(.10,1+.34*Math.max(0,feeling)-blink-.32*warmth);
  const worried=Math.max(feeling,0), smile=Math.max(-feeling,0);
  const look=turn*3.5;
  return <g>
    <path d="M-20-20l-3 35q20 23 45 0l-3-37z" fill="url(#neckColor)"/>
    <path d="M-53-66q-14-11-15 6t13 27l9-4m96-35q16-6 15 9t-16 24l-7-6" fill="#cb816a" stroke="#6c4350" strokeWidth="2"/>
    <path d="M-53-55q-2 20 13 40 15 20 36 23 19 0 42-19 18-17 19-63l-6-33-36-16-51 7-18 30z" fill="url(#skin)" stroke="#51334a" strokeWidth="2.1"/>
    <path d="M-50-48Q-38-29-23-25q17 10 21 27-22 5-43-24zm90-6q-1 20-13 37-9 13-21 23 35-13 45-50z" fill="#ab6364" opacity=".38"/>
    <path d="M-53-48q-7-11-11-25-9-17 0-36-1-18 13-31 15-16 47-14 29-11 51 12 18 8 20 30 8 25-12 55l-7-10q3-27-8-40-11 11-45 13 8-5 13-13-22 17-50 20l-4 38z" fill="url(#hair)" stroke="#211c30" strokeWidth="2.9"/>
    <path d="M-59-104q14-28 51-31 31-11 52 1M-48-112q12-16 38-18m19 13q30-19 44 7m-14 8q16-4 18 8" fill="none" stroke="#916459" strokeWidth="2.4" opacity=".65"/>
    <path d={`M-62-116q16 ${-31+2*Math.sin(f/10)} 48-27`} fill="none" stroke="#c48b69" strokeWidth="2.7" strokeLinecap="round" opacity=".6"/>
    <g transform={`translate(${look} 0)`}>
      <path d={`M-43 ${-78+worried*3}q12 ${-8-worried*7} 24 ${-2-worried*7}m26 ${2-worried*7}q14 ${-8-worried*3} 26 ${2+worried*9}`} fill="none" stroke="#3a2536" strokeWidth="4.2" strokeLinecap="round"/>
      {[-33,21].map(x=><g key={x} transform={`translate(${x} -66) scale(1 ${eye})`}>
        <path d="M-11 1q10-9 21-1-7 11-19 4z" fill="#fff3d9" stroke="#553540" strokeWidth="1.8"/>
        <ellipse cx={look*.36+1} cy="1" rx="3.9" ry="4.7" fill="#405358"/><circle cx={look*.36+2} cy="0" r="1.8" fill="#202032"/><circle cx={look*.36+.5} cy="-1" r="1" fill="#fff3d9"/>
      </g>)}
      <path d="M-8-61q-1 10-6 17l7 4 7-2" fill="none" stroke="#9c5459" strokeWidth="1.6" strokeLinecap="round"/>
      <path d={`M-15-26Q-5 ${-33-worried*3+smile*12} 9 ${-26-smile*5}Q-2 ${-23+worried*17+smile*12} -15-26z`} fill="#733e4d" stroke="#713a44" strokeWidth="1.5"/>
      <path d="M-11-16q6 3 13 0" fill="none" stroke="#aa6064" strokeWidth="1.25" opacity=".68"/>
    </g>
    <ellipse cx="-33" cy="-41" rx="12" ry="5" fill="#e66e66" opacity={.22+.21*warmth}/>
    <ellipse cx="28" cy="-42" rx="10" ry="5" fill="#e66e66" opacity={.18+.16*warmth}/>
    <path d="M-49-16q15 22 38 26m-18-5l2-4m3 6l2-5m5 8l2-5m5 6l2-5m5 4l2-4m6 3l1-4m5 2l1-4" stroke="#794951" opacity=".5" fill="none" strokeWidth="1.2"/>
  </g>;
}

function GloveOrHand({glove}: {glove:boolean}) {
  return <g>
    <path d="M-9-2q-5 6-7 12l-3 9q1 4 4 2l5-6-2 12q2 4 5 1l3-9-1 12q1 4 4 1l3-10 1 8q2 3 4 0l2-11 2 5q3 2 4-1l1-12-5-13z" fill={glove?'#203346':'url(#skin)'} stroke={glove?'#142434':'#7e4b53'} strokeWidth="1.6"/>
    <path d="M-10 14q6 1 7-6m5 11l2-7m6 7l1-5" stroke={glove?'#638192':'#995b5b'} opacity=".65" fill="none" strokeLinecap="round"/>
  </g>;
}
function reach(shoulderX:number,x:number,y:number,bend:number) {
  const dx=x-shoulderX, dy=y-37;
  const upper=79, lower=77;
  const distance=Math.max(10,Math.min(upper+lower-1,Math.hypot(dx,dy)));
  const angle=Math.atan2(-dx,dy)+bend*Math.acos((upper*upper+distance*distance-lower*lower)/(2*upper*distance));
  const elbow=-bend*(Math.PI-Math.acos((upper*upper+lower*lower-distance*distance)/(2*upper*lower)));
  return [angle*180/Math.PI,elbow*180/Math.PI];
}
function Arm({angle, elbow, coat, flip}: {angle:number;elbow:number;coat:number;flip:boolean}) {
  const sleeve=coat>.14;
  return <g transform={`rotate(${angle})`}>
    <path d="M-23 4q1-17 22-16 20 0 22 24l-4 68q-15 17-31 2z" fill="url(#skin)" stroke="#6e4653" strokeWidth="2"/>
    <path d="M-23 4q0-18 22-19 24 2 25 24l-2 27q-22 13-43 2z" fill="url(#shirt)" stroke="#5a474f" strokeWidth="2"/>
    <path d="M-24 1q5-20 23-19 25 3 28 28l-5 68q-13 18-41 4z" opacity={coat} fill="url(#coat)" stroke="#233747" strokeWidth="2.6"/>
    <path d="M-22 32q23 7 47-2m-45 26q20 9 42-3" opacity={coat*.65} stroke="#97afba" fill="none" strokeWidth="1.6"/>
    <g transform={`translate(1 79) rotate(${elbow})`}>
      <path d="M-17-5q16-10 33-3l-4 62-3 10-18 1-5-21z" fill="url(#skin)" stroke="#754651" strokeWidth="2"/>
      <path d="M-21-7q27-10 43 1l-6 56-4 11h-26l-5-18z" opacity={coat} fill="url(#coat)" stroke="#253a4b" strokeWidth="2.5"/>
      <path d="M-18 20q17 7 37 0m-34 26q19 5 31 0m-27 10h22" opacity={coat*.68} stroke="#a3bbc6" fill="none" strokeWidth="1.6"/>
      <g transform={`translate(0 62) scale(${flip?-1:1} 1)`}><GloveOrHand glove={sleeve && coat>.94}/></g>
    </g>
  </g>;
}
function Leg({angle,x, f}: {angle:number;x:number;f:number}) {
  return <g transform={`translate(${x} 249) rotate(${angle})`}>
    <path d="M-36-17q31-12 63 2 7 86-1 167l-5 38-43 3-9-45z" fill="url(#denim)" stroke="#192938" strokeWidth="3"/>
    <path d="M-20 15q12 57 7 110m36 3l-25 3m-19 44q17 4 41 0" fill="none" stroke="#84969b" opacity=".57" strokeWidth="2.3"/>
    <g transform={`translate(1 186) rotate(${Math.sin(f/11)*Math.abs(angle)*.18})`}>
      <path d="M-24-7q25 7 45 0l7 11 22 8q9 5 9 15l-81 1q-10-8-2-35z" fill="#9c584f" stroke="#482d38" strokeWidth="2.6"/>
      <path d="M-27 22q34 3 85 2l1 7q-44 8-84 1z" fill="#e8d9b6" stroke="#6e584f" strokeWidth="1.8"/>
      <path d="M12 8l15-1m-9 7l17-1m4 2l8 4m-69 9h56" stroke="#ffe1b5" strokeWidth="1.6"/>
      <path d="M-19 12h18l7 6-25 1z" fill="#623d48"/>
    </g>
  </g>;
}
export function CharacterClothing({coat, zip, sides=0}: {coat:number;zip:number;sides?:number}) {
  return <g opacity={coat}>
    <path d="M-84 32q22-18 59-21l21 26-1 206q-38 11-74-1l-4-57-7-124z" fill="url(#coat)" stroke="#21374c" strokeWidth="3" transform={`translate(${-sides*16} 0) skewX(${-sides*7})`}/>
    <path d="M84 32q-22-18-58-21L3 37l2 206q40 11 73-1l6-57 7-124z" fill="url(#coat)" stroke="#21374c" strokeWidth="3" transform={`translate(${sides*16} 0) skewX(${sides*7})`}/>
    <g fill="none" stroke="#a3bcc2" strokeWidth="2.2" opacity=".59">
      <path d="M-82 67q37 12 69 10m25 0q38 1 69-10M-80 110q38 13 65 10m29 0q35 1 65-10m-155 44q34 11 60 9m30 1q34 0 62-10m-148 48q33 9 59 5m29 0q28 4 59-5"/>
      <path d="M-65 202l15-31m98 0l15 31" strokeWidth="4" stroke="#20394d"/>
    </g>
    <path d="M-48 112l16 2v12l-16-2z" fill="#edb08a"/><path d="M-83 234q37 14 80 5 50 9 84-5v10q-40 17-84 6-42 11-79-4z" fill="#324c60"/>
    <path d="M-26 10l20 28-10 28-31-43zm52 0L6 38l10 28 31-43z" fill="#49677a" stroke="#274557" strokeWidth="2"/>
    <path d={`M0 237V${mix(230,42,zip)}`} stroke="#d3c29d" strokeDasharray="2 2" strokeWidth="4" opacity={.3+.7*zip}/>
    <rect x="-3" y={mix(224,40,zip)} width="6" height="12" rx="2" fill="#f3c58c"/>
  </g>;
}
function JacketProp({f, x, y}: {f:number;x:number;y:number}) {
  return <g opacity={smooth(f,49,56)*(1-smooth(f,78,93))} transform={`translate(${x} ${y}) rotate(${mix(-22,4,smooth(f,50,87))}) scale(${mix(.66,.93,smooth(f,50,86))})`}>
    <path d="M-70 32l-35 28-24 109 29 12 35-75m130 0l34 75 30-12-25-109-35-28" fill="url(#coat)" stroke="#22384d" strokeWidth="3"/>
    <CharacterClothing coat={1} zip={0} sides={.5}/>
  </g>;
}
function Hat({x=0,y=0,opacity=1}: {x?:number;y?:number;opacity?:number}) {
  return <g opacity={opacity} transform={`translate(${x} ${y})`}>
    <path d="M-64-104q-4-37 19-53 18-11 44-11 39 0 55 25 14 17 11 43z" fill="url(#hat)" stroke="#202e43" strokeWidth="3"/>
    <path d="M-50-112q2-34 23-49m-8 54q1-39 20-57m-4 52q-2-34 11-55m4 56q0-35 5-56m12 55q2-33-3-52m20 52q-2-27-8-45m19 47q-1-25-8-38" fill="none" stroke="#e9b18b" opacity=".49" strokeWidth="2.2"/>
    <path d="M-63-114q57 11 128 0l-2 22q-65 12-125 0z" fill="#8c5a60" stroke="#392e46" strokeWidth="2"/>
    <path d="M-54-109l1 13m10-11 1 13m10-12 1 13m10-12 1 13m10-12 1 13m10-12v13m11-13v13m11-14v13m11-14v13m11-14v13m11-15v13" stroke="#f0b395" opacity=".55" strokeWidth="1.3"/>
    <path d="M38-106l15-2v10l-15 2z" fill="#e2b394"/>
  </g>;
}
export function Character2D({f,x,y,scale=1,dressing=false,winter=false,feeling=0,light=1,walk=0,look=0}:{
  f:number;x:number;y:number;scale?:number;dressing?:boolean;winter?:boolean;feeling?:number;light?:number;walk?:number;look?:number;
}) {
  const shiver=dressing?smooth(f,12,25)*(1-smooth(f,94,152)):winter?.14:0;
  const pose=dressing?dressingPose(f):{left:8+Math.sin(f/10)*15*walk,leftElbow:-8,right:-9-Math.sin(f/10)*15*walk,rightElbow:11,head:look*12,lean:look*3};
  const adjust=dressing?smooth(f,128,150)*(1-smooth(f,168,187)):0;
  const jacketGrip=dressing?smooth(f,44,56)*(1-smooth(f,75,93)):0;
  const zipper=dressing?smooth(f,94,108)*(1-smooth(f,121,132)):0;
  const gripY=mix(205,-89,smooth(f,128,154));
  const gripX=mix(137,59,smooth(f,128,154));
  const [hatLeft,hatLeftElbow]=reach(-74,-58,mix(70,-96,smooth(f,131,154)),1);
  const [hatRight,hatRightElbow]=reach(73,gripX,gripY,-1);
  const [jacketRight,jacketRightElbow]=reach(73,mix(163,94,smooth(f,54,78)),mix(91,39,smooth(f,54,83)),-1);
  const [zipRight,zipRightElbow]=reach(73,3,mix(175,44,smooth(f,105,122)),-1);
  const coat=dressing?smooth(f,75,93):Number(winter);
  const zip=dressing?smooth(f,105,122):1;
  const hat=dressing?smooth(f,143,154):Number(winter);
  const breath=Math.sin(f/15)*1.5;
  const shade=1-light;
  const skinLight=interpolateColors(shade,[0,1],['#ffd29e','#c3a4ab']);
  const skinShade=interpolateColors(shade,[0,1],['#b66561','#766180']);
  return <g transform={`translate(${x+Math.sin(f*1.8)*2.6*shiver} ${y+breath+Math.sin(f/5)*3*walk}) scale(${scale})`}>
    <defs>
      <linearGradient id="skin" x2="95%" y2="79%"><stop stopColor={skinLight}/><stop offset=".58" stopColor={interpolateColors(shade,[0,1],['#e9a37f','#a98795'])}/><stop offset="1" stopColor={skinShade}/></linearGradient>
      <linearGradient id="neckColor" x2="5%" y2="97%"><stop stopColor="#674352"/><stop offset=".7" stopColor={skinShade}/><stop offset="1" stopColor={skinLight}/></linearGradient>
      <linearGradient id="hair" x2="100%" y2="85%"><stop stopColor="#674749"/><stop offset=".3" stopColor="#4b3340"/><stop offset="1" stopColor="#231f34"/></linearGradient>
      <linearGradient id="shirt" x2="85%" y2="80%"><stop stopColor="#d2ad88"/><stop offset=".43" stopColor="#b68d79"/><stop offset="1" stopColor="#75566b"/></linearGradient>
      <linearGradient id="denim" x2="97%" y2="70%"><stop stopColor="#536875"/><stop offset=".65" stopColor="#334758"/><stop offset="1" stopColor="#233042"/></linearGradient>
      <linearGradient id="coat" x2="100%" y2="83%"><stop stopColor="#8aa8b1"/><stop offset=".3" stopColor="#567a8f"/><stop offset=".75" stopColor="#3d5b74"/><stop offset="1" stopColor="#254157"/></linearGradient>
      <linearGradient id="hat" x2="100%" y2="80%"><stop stopColor="#daa27d"/><stop offset=".5" stopColor="#aa7271"/><stop offset="1" stopColor="#6c4b60"/></linearGradient>
    </defs>
    <Leg x={-41} angle={5+Math.sin(f/10)*17*walk} f={f}/>
    <Leg x={33} angle={-3-Math.sin(f/10)*17*walk} f={f}/>
    <g transform={`rotate(${pose.lean+shiver*Math.sin(f*1.3)})`}>
      <path d="M-76 22q30-13 48-12h61q32 3 47 16l-3 214q-83 23-160 0l7-49z" fill="url(#shirt)" stroke="#6b4c5b" strokeWidth="3"/>
      <path d="M-33 13q14 32 33 30 24-1 34-29m-94 89q6 62-1 96m112-75q13 49 10 70m-135 31q67 17 144-2" fill="none" stroke="#684b5d" strokeWidth="2.5" opacity=".7"/>
      <path d="M27 97l32-8v26l-11 8-20-7z" fill="#b98c78" stroke="#825c63" strokeWidth="1.5"/>
      <path d="M28 101l28-7m-105 66q-11 47-10 62" stroke="#e9c59c" opacity=".6" fill="none" strokeWidth="1.8"/>
      <CharacterClothing coat={coat} zip={zip} sides={dressing?1-zip:0}/>
      <g transform={`rotate(${pose.head+Math.sin(f/21)*2})`}>
        <CharacterFaceRig f={f} feeling={feeling} turn={look} warmth={shiver}/>
        <Hat opacity={hat}/>
      </g>
      {dressing&&<JacketProp f={f} x={mix(132,9,smooth(f,51,78))} y={mix(104,15,smooth(f,53,90))}/>}
      {dressing&&<Hat x={mix(86,0,smooth(f,128,154))} y={gripY+101} opacity={smooth(f,123,131)*(1-smooth(f,147,155))}/>}
      <g transform="translate(-74 37)"><Arm angle={mix(pose.left,hatLeft,adjust)} elbow={mix(pose.leftElbow,hatLeftElbow,adjust)} coat={coat} flip={false}/></g>
      <g transform="translate(73 37)"><Arm angle={mix(mix(mix(pose.right,jacketRight,jacketGrip),zipRight,zipper),hatRight,adjust)} elbow={mix(mix(mix(pose.rightElbow,jacketRightElbow,jacketGrip),zipRightElbow,zipper),hatRightElbow,adjust)} coat={coat} flip/></g>
    </g>
  </g>;
}

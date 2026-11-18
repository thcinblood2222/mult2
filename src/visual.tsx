import type {ReactNode} from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from 'remotion';

export const W = 720;
export const H = 1280;
export const smooth = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
export const mix = (a: number, b: number, t: number) => a+(b-a)*t;
export const fract = (v: number) => v-Math.floor(v);
export const noise = (i: number) => fract(Math.sin(i*127.1+19.74)*43758.5453);
export const arc = (f: number, at: number) => spring({frame: f-at, fps: 30, config: {mass: .8, stiffness: 96, damping: 17}});
export function Stage({children, background='#080f20'}: {children: ReactNode; background?: string}) {
  return <AbsoluteFill style={{background}}><svg width="100%" height="100%" viewBox="0 0 720 1280" style={{fontFamily:'Manrope Variable, sans-serif',overflow:'hidden'}}><defs>
    <radialGradient id="vignette"><stop offset="55%" stopColor="#020810" stopOpacity="0"/><stop offset="100%" stopColor="#020810" stopOpacity=".59"/></radialGradient>
    <pattern id="stippling" width="7" height="7" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="2" r=".65" fill="#fff" opacity=".27"/><circle cx="5" cy="5" r=".48" fill="#050c14" opacity=".7"/>
    </pattern>
  </defs>{children}<rect width={W} height={H} fill="url(#stippling)" opacity=".16" pointerEvents="none"/></svg></AbsoluteFill>;
}
export function ParallaxCamera({children, t, dx=12, dy=8, zoom=.06, pivotY=640}: {
  children: ReactNode; t: number; dx?: number; dy?: number; zoom?: number; pivotY?: number;
}) {
  return <g transform={`translate(${360+dx*t} ${pivotY+dy*t}) scale(${1+zoom*t}) translate(-360 ${-pivotY})`}>{children}</g>;
}
export function Stars({f, opacity=1}: {f: number; opacity?: number}) {
  return <g opacity={opacity}>{Array.from({length:83}, (_,i)=>{
    const depth=i%3;
    const x=fract(noise(i+22)+f*(depth+1)*.000031)*W;
    const y=noise(i+112)*H;
    const r=.55+noise(i+192)*1.7;
    return <circle key={i} cx={x} cy={y} r={r} fill={depth===1?'#8bcbeb':'#f4eee0'}
      opacity={(.22+.64*noise(i+511))*(.87+.13*Math.sin(f/29+i))}/>;
  })}</g>;
}
export function Snow({f, intensity=1}: {f: number; intensity?: number}) {
  return <g opacity={intensity}>{Array.from({length:77},(_,i)=>{
    const near = noise(i+1490), x = fract(noise(i+81)+f*(.0015+near*.0021))*790-35;
    const y = fract(noise(i+348)+f*(.001+near*.0021))*H;
    return <path key={i} d={`M ${x} ${y} l ${1+near*6} ${1.3+near*3}`} stroke="#d7f4ff" strokeWidth={.6+near*2.1}
      strokeLinecap="round" opacity={.16+near*.52}/>;
  })}</g>;
}
export function Reveal({at=0, until=9999, children}: {at?: number; until?: number; children: ReactNode}) {
  const f=useCurrentFrame();
  return <g opacity={smooth(f,at,at+12)*(1-smooth(f,until-12,until))} transform={`translate(0 ${15*(1-arc(f,at))})`}>{children}</g>;
}
export function InfographicSystem({at, until, eyebrow, value, label, accent='#a1eee3', y=1000, children}: {
  at:number; until:number; eyebrow?: string; value: string; label?: string; accent?: string; y?:number; children?:ReactNode;
}) {
  return <Reveal at={at} until={until}><g transform={`translate(58 ${y})`}>
    <path d="M0 3 H604" stroke={accent} strokeOpacity=".42"/>
    <path d="M0 3 h37" stroke={accent} strokeWidth="4"/>
    {eyebrow && <text y="37" fontSize="16" letterSpacing="3.4" fontWeight="780" fill={accent}>{eyebrow}</text>}
    <text y="103" fontSize="57" letterSpacing="-2.1" fontWeight="820" fill="#f4f8f5" style={{fontVariantNumeric:'tabular-nums'}}>{value}</text>
    {label && <text y="140" fontSize="22" fill="#c2d7de" fontWeight="620">{label}</text>}{children}
  </g></Reveal>;
}
export function Day({number, at=10, until=58}: {number: number; at?: number; until?:number}) {
  return <Reveal at={at} until={until}><g transform="translate(60 125)">
    <rect x="-13" y="-30" width="139" height="46" rx="23" fill="#071322" opacity=".86" stroke="#9ddcd9" strokeOpacity=".5"/>
    <circle cx="7" cy="-7" r="3.1" fill="#a7efe1"/><text x="23" fill="#edf9f5" fontWeight="800" fontSize="20" letterSpacing="2.3">ДЕНЬ {number}</text>
  </g></Reveal>;
}

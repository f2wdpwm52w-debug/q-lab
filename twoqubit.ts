export type C={re:number;im:number};
export const c=(re:number,im=0):C=>({re,im});
const plus=(a:C,b:C):C=>c(a.re+b.re,a.im+b.im);
const times=(a:C,b:C):C=>c(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const neg=(a:C):C=>c(-a.re,-a.im);
export const probability=(a:C)=>a.re*a.re+a.im*a.im;
export type QState=[C,C,C,C];
export const zero=():QState=>[c(1),c(0),c(0),c(0)];
export function single(state:QState,gate:'H'|'X'|'Z',target:0|1):QState {
 const r=1/Math.sqrt(2);
 const m: C[][]=gate==='H'?[[c(r),c(r)],[c(r),c(-r)]]:gate==='X'?[[c(0),c(1)],[c(1),c(0)]]:[[c(1),c(0)],[c(0),c(-1)]];
 const out=state.map(v=>c(v.re,v.im)) as QState;
 const bit=target===0?2:1;
 for(let i=0;i<4;i++)if((i&bit)===0){const j=i|bit;out[i]=plus(times(m[0][0],state[i]),times(m[0][1],state[j]));out[j]=plus(times(m[1][0],state[i]),times(m[1][1],state[j]));}
 return out;
}
export function cnot(state:QState,control:0|1):QState {
 const out=state.map(v=>c(v.re,v.im)) as QState;
 if(control===0){out[2]=state[3];out[3]=state[2];}else{out[1]=state[3];out[3]=state[1];}
 return out;
}
export function bell(name:'Phi+'|'Phi-'|'Psi+'|'Psi-'):QState {
 let s=single(zero(),'H',0);
 if(name.startsWith('Psi'))s=single(s,'X',1);
 s=cnot(s,0);
 if(name.endsWith('-'))s=single(s,'Z',0);
 return s;
}
export const probabilities=(s:QState)=>s.map(probability);
export function sample(s:QState,n=1000):number[]{const ps=probabilities(s);const counts=[0,0,0,0];for(let k=0;k<n;k++){const r=Math.random();let total=0;for(let i=0;i<4;i++){total+=ps[i];if(r<total||i===3){counts[i]++;break;}}}return counts;}
export const amplitude=(a:C)=>`${Math.abs(a.re)<1e-9?'0':a.re.toFixed(3)} ${a.im<0?'-':'+'} ${Math.abs(a.im)<1e-9?'0':Math.abs(a.im).toFixed(3)}i`;

import './style.css';
type Complex = {re:number,im:number};
type State = [Complex,Complex];
const c=(re:number,im=0):Complex=>({re,im});
const add=(a:Complex,b:Complex)=>c(a.re+b.re,a.im+b.im);
const mul=(a:Complex,b:Complex)=>c(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const scale=(a:Complex,k:number)=>c(a.re*k,a.im*k);
const norm=(a:Complex)=>a.re*a.re+a.im*a.im;
let yaw=0.65, pitch=0.32;
let state:State=[c(1),c(0)];let history:string[]=[];let shots:[number,number]|null=null;
function gate(name:string){const [a,b]=state;const root=1/Math.sqrt(2);switch(name){case 'X':state=[b,a];break;case 'Y':state=[mul(c(0,-1),b),mul(c(0,1),a)];break;case 'Z':state=[a,scale(b,-1)];break;case 'H':state=[scale(add(a,b),root),scale(add(a,scale(b,-1)),root)];break;case 'S':state=[a,mul(c(0,1),b)];break;case 'T':state=[a,mul(c(Math.SQRT1_2,Math.SQRT1_2),b)];break;case 'RY':{const t=Math.PI/4;state=[add(scale(a,Math.cos(t/2)),scale(b,-Math.sin(t/2))),add(scale(a,Math.sin(t/2)),scale(b,Math.cos(t/2)))];break;} }history.push(name);shots=null;render();}
function reset(){state=[c(1),c(0)];history=[];shots=null;render();}
function measure(){const p=norm(state[0]);let zero=0;for(let i=0;i<1000;i++)if(Math.random()<p)zero++;shots=[zero,1000-zero];render();}
const fmt=(v:number)=>Math.abs(v)<1e-10?'0':v.toFixed(3);
const complex=(v:Complex)=>`${fmt(v.re)} ${v.im<0?'-':'+'} ${fmt(Math.abs(v.im))}i`;
function blochSVG(x:number,y:number,z:number){
 const project=(v:[number,number,number]):[number,number]=>{
  const [a,b,c]=v;const u=a*Math.cos(yaw)-b*Math.sin(yaw);const d=a*Math.sin(yaw)+b*Math.cos(yaw);
  return [160+105*u,150+105*(d*Math.sin(pitch)-c*Math.cos(pitch))];
 };
 const line=(a:[number,number,number],b:[number,number,number],color:string,dash='')=>{const p=project(a),q=project(b);return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${color}" stroke-width="1.5" ${dash?'stroke-dasharray="4 5"':''}/>`};
 const v=project([x,y,z]);const origin=project([0,0,0]);
 let circles='';for(let axis=0;axis<3;axis++){let points:string[]=[];for(let i=0;i<=96;i++){let t=i*2*Math.PI/96;let a:[number,number,number]=axis===0?[0,Math.cos(t),Math.sin(t)]:axis===1?[Math.cos(t),0,Math.sin(t)]:[Math.cos(t),Math.sin(t),0];const p=project(a);points.push(p.join(','))}circles+=`<polyline points="${points.join(' ')}" fill="none" stroke="#625b99" stroke-width="1" opacity=".7"/>`}
 return `<svg id="bloch-svg" viewBox="0 0 320 300" role="img" aria-label="Sphère de Bloch orientable au toucher"><defs><radialGradient id="bg"><stop stop-color="#34275f" stop-opacity=".5"/><stop offset="1" stop-color="#16152f" stop-opacity=".05"/></radialGradient><marker id="tip" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="#5de7d3"/></marker></defs><circle cx="160" cy="150" r="105" fill="url(#bg)" stroke="#514b82"/>${circles}${line([-1,0,0],[1,0,0],'#d29aff', 'dash')}${line([0,-1,0],[0,1,0],'#8b91d9','dash')}${line([0,0,-1],[0,0,1],'#a9a6d0','dash')}<line x1="${origin[0]}" y1="${origin[1]}" x2="${v[0]}" y2="${v[1]}" stroke="#5de7d3" stroke-width="3" marker-end="url(#tip)"/><circle cx="${v[0]}" cy="${v[1]}" r="5" fill="#5de7d3"/><text x="${project([0,0,1])[0]+7}" y="${project([0,0,1])[1]-7}" fill="#fff" font-size="13">|0⟩</text><text x="${project([0,0,-1])[0]+7}" y="${project([0,0,-1])[1]+14}" fill="#fff" font-size="13">|1⟩</text></svg>`;
}
let pointer:{x:number,y:number}|null=null;
function attachSphere(){const el=document.querySelector<SVGSVGElement>('#bloch-svg');if(!el)return;el.onpointerdown=e=>{pointer={x:e.clientX,y:e.clientY};el.setPointerCapture(e.pointerId)};el.onpointermove=e=>{if(!pointer)return;yaw+=(e.clientX-pointer.x)*.012;pitch=Math.max(-1.5,Math.min(1.5,pitch+(e.clientY-pointer.y)*.012));pointer={x:e.clientX,y:e.clientY};const [x,y,z]=blochCoords();el.outerHTML=blochSVG(x,y,z);attachSphere()};el.onpointerup=()=>{pointer=null};el.onpointercancel=()=>{pointer=null};}
function blochCoords():[number,number,number]{const [a,b]=state;const ab=mul(c(a.re,-a.im),b);return [2*ab.re,2*ab.im,norm(a)-norm(b)]}
function render(){const p0=Math.max(0,Math.min(1,norm(state[0])));const p1=1-p0;const [x,y,z]=blochCoords();
document.querySelector<HTMLDivElement>('#app')!.innerHTML=`<main><header><div class="brand">◈ Q-LAB <small>QUANTUM COMPUTING STUDIO</small></div><span class="tag">● LOCAL SIMULATOR</span></header><section class="hero"><p class="eyebrow">EXPERIMENT • LEARN • DISCOVER</p><h1>Explore the <em>quantum</em> world.</h1><p>Manipule un qubit, construis un circuit et observe ses probabilités en temps réel.</p></section><section class="panel" style="margin-bottom:20px"><h2>04 / Quantum Circuit Builder</h2><p>Crée des circuits de 1 à 5 qubits, exécute des mesures et exporte tes expériences.</p><a class="builder-link" href="/circuit-builder.html">Ouvrir l’éditeur de circuits →</a></section><section class="layout"><div class="panel"><div class="panelhead"><h2>01 / Quantum gates</h2><span>1 QUBIT</span></div><p>Applique une porte au qubit initial |0⟩.</p><div class="gates">${['X','Y','Z','H','S','T','RY'].map(g=>`<button data-gate="${g}" title="Porte ${g}">${g}</button>`).join('')}</div><div class="actions"><button id="reset" class="secondary">↺ Réinitialiser</button><button id="measure" class="primary">▶ Mesurer × 1000</button></div><h3>Circuit</h3><div class="circuit"><span>|0⟩</span>${history.map(g=>`<b>${g}</b>`).join('')}<span>→</span></div><h3>Vecteur d'état</h3><div class="vector">|ψ⟩ = (${complex(state[0])})|0⟩ + (${complex(state[1])})|1⟩</div></div><div class="panel"><div class="panelhead"><h2>02 / Probabilities</h2><span>LIVE</span></div><div class="prob"><div><span>|0⟩</span><strong>${(p0*100).toFixed(2)}%</strong></div><div class="bar"><i style="width:${p0*100}%"></i></div></div><div class="prob"><div><span>|1⟩</span><strong>${(p1*100).toFixed(2)}%</strong></div><div class="bar violet"><i style="width:${p1*100}%"></i></div></div><h3>Bloch vector (x, y, z)</h3><div class="vector">(${fmt(x)}, ${fmt(y)}, ${fmt(z)})</div><div class="bloch-view">${blochSVG(x,y,z)}<p>Fais glisser la sphère pour la faire tourner.</p></div><h3>1000 measurements</h3>${shots?`<div class="results">|0⟩ : ${shots[0]} &nbsp; |1⟩ : ${shots[1]}</div>`:'<p>Appuie sur « Mesurer » pour simuler les résultats.</p>'}</div></section><footer>Q-LAB V0.2 · Simulation classique d'un qubit · Aucune connexion à un processeur quantique réel</footer></main>`;
document.querySelectorAll<HTMLButtonElement>('[data-gate]').forEach(b=>b.onclick=()=>gate(b.dataset.gate!));document.querySelector<HTMLButtonElement>('#reset')!.onclick=reset;document.querySelector<HTMLButtonElement>('#measure')!.onclick=measure;attachSphere();}
render();

// Two-qubit laboratory: separate state so the existing Bloch experiment is preserved.
import {zero as twoZero,single as twoSingle,cnot as twoCnot,bell as makeBell,probabilities as twoProb,sample as twoSample,amplitude as twoAmplitude,type QState} from './twoqubit';
let twoState:QState=twoZero();let twoHistory:string[]=[];let twoShots:number[]|null=null;
const labels=['00','01','10','11'];
function renderTwo(){
 const host=document.querySelector<HTMLDivElement>('#two-qubit');if(!host)return;
 const ps=twoProb(twoState);
 host.innerHTML=`<div class="panelhead"><h2>03 / Two-qubit laboratory</h2><span>2 QUBITS</span></div><p>Construis un circuit à deux qubits, puis mesure les corrélations.</p>
 <div class="two-row"><label>Qubit cible <select id="target"><option value="0">q0 (gauche)</option><option value="1">q1 (droite)</option></select></label><div class="two-buttons"><button data-two="H">H</button><button data-two="X">X</button><button data-two="Z">Z</button></div></div>
 <div class="two-buttons"><button data-two="CNOT0">CNOT q0 → q1</button><button data-two="CNOT1">CNOT q1 → q0</button></div>
 <h3>États de Bell (préparations)</h3><div class="two-buttons">${['Phi+','Phi-','Psi+','Psi-'].map(n=>`<button data-bell="${n}">Φ/Ψ ${n.slice(-1)} (${n.startsWith('Phi')?'Φ':'Ψ'})</button>`).join('')}</div>
 <h3>Circuit / opérations</h3><div class="circuit"><span>|00⟩</span>${twoHistory.map(h=>`<b>${h}</b>`).join('')}<span>→</span></div>
 <h3>Amplitudes complexes</h3><div class="vector">${labels.map((l,i)=>`|${l}⟩: ${twoAmplitude(twoState[i])}`).join('<br>')}</div>
 <h3>Probabilités</h3>${labels.map((l,i)=>`<div class="prob"><div><span>|${l}⟩</span><strong>${(ps[i]*100).toFixed(2)}%</strong></div><div class="bar ${i%2?'violet':''}"><i style="width:${ps[i]*100}%"></i></div></div>`).join('')}
 <div class="actions"><button id="two-reset" class="secondary">↺ Réinitialiser 2 qubits</button><button id="two-measure" class="primary">▶ Mesurer × 1000</button></div>
 <h3>Résultats</h3>${twoShots?`<div class="results">${labels.map((l,i)=>`|${l}⟩ : ${twoShots![i]}`).join(' · ')}</div>`:'<p>Appuie sur « Mesurer » pour échantillonner 1000 fois.</p>'}
 <p class="note">Simulation classique idéale, sans bruit. Les mesures n’altèrent pas l’état du circuit.</p>`;
 host.querySelectorAll<HTMLButtonElement>('[data-two]').forEach(b=>b.onclick=()=>{const g=b.dataset.two!;if(g.startsWith('CNOT'))twoState=twoCnot(twoState,g==='CNOT0'?0:1);else{const t=Number(host.querySelector<HTMLSelectElement>('#target')!.value) as 0|1;twoState=twoSingle(twoState,g as 'H'|'X'|'Z',t)}twoHistory.push(g);twoShots=null;renderTwo()});
 host.querySelectorAll<HTMLButtonElement>('[data-bell]').forEach(b=>b.onclick=()=>{const name=b.dataset.bell as 'Phi+'|'Phi-'|'Psi+'|'Psi-';twoState=makeBell(name);twoHistory=[`Bell ${name}`];twoShots=null;renderTwo()});
 host.querySelector<HTMLButtonElement>('#two-reset')!.onclick=()=>{twoState=twoZero();twoHistory=[];twoShots=null;renderTwo()};
 host.querySelector<HTMLButtonElement>('#two-measure')!.onclick=()=>{twoShots=twoSample(twoState);renderTwo()};
}
const originalRender=render;
render=function(){originalRender();const layout=document.querySelector('.layout');if(layout){const section=document.createElement('section');section.className='panel two-panel';section.id='two-qubit';layout.after(section)}const footer=document.querySelector('footer');if(footer)footer.textContent='Q-LAB V0.3 · Simulations classiques idéales · Aucun processeur quantique réel';renderTwo()};
render();

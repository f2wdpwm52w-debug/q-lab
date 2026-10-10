/* Q-LAB V1.1 — stockage local, aucune donnée envoyée au serveur. */
(function(){'use strict';
const PREFIX='qlab-v11-';
function read(name,fallback){try{const raw=localStorage.getItem(PREFIX+name);return raw?JSON.parse(raw):fallback}catch{return fallback}}
function write(name,value){try{localStorage.setItem(PREFIX+name,JSON.stringify(value));return true}catch{return false}}
function id(){return 'e-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)}
function validCircuit(v){if(!v||!Number.isInteger(v.n)||v.n<1||v.n>5||!Array.isArray(v.ops)||v.ops.length>100)return false;const occupied=new Set();for(const o of v.ops){if(!o||!['H','X','Y','Z','CNOT'].includes(o.type)||!Number.isInteger(o.r)||o.r<0||o.r>=v.n||!Number.isInteger(o.c)||o.c<0||o.c>=8)return false;if(o.type==='CNOT'&&(!Number.isInteger(o.t)||o.t<0||o.t>=v.n||o.t===o.r))return false;for(const r of o.type==='CNOT'?[o.r,o.t]:[o.r]){const k=r+':'+o.c;if(occupied.has(k))return false;occupied.add(k)}}return true}
function circuit(v){return {n:v.n,ops:v.ops.map(o=>({type:o.type,r:o.r,c:o.c,...(o.type==='CNOT'?{t:o.t}:{})}))}}
function experiments(){return read('experiments',[]).filter(e=>e&&typeof e.id==='string'&&validCircuit(e.circuit))}
function history(){return read('history',[]).filter(h=>h&&typeof h.id==='string'&&validCircuit(h.circuit))}
window.QLabStorage={validCircuit,experiments,history,draft(){const d=read('draft',null);return validCircuit(d)?d:null},saveDraft(v){return validCircuit(v)&&write('draft',circuit(v))},saveExperiment(name,v){if(!validCircuit(v))return null;const list=experiments();const entry={id:id(),name:String(name||'Expérience').trim().slice(0,70)||'Expérience',created:new Date().toISOString(),circuit:circuit(v)};list.unshift(entry);if(!write('experiments',list.slice(0,50)))return null;return entry},deleteExperiment(itemId){return write('experiments',experiments().filter(e=>e.id!==itemId))},addHistory(kind,v,probs,counts){if(!validCircuit(v)||!Array.isArray(probs)||probs.length!==2**v.n)return false;const entry={id:id(),at:new Date().toISOString(),kind:kind==='shots'?'shots':'simulation',circuit:circuit(v),probs:probs.map(x=>Number(x)||0),counts:Array.isArray(counts)?counts:null};return write('history',[entry,...history()].slice(0,100))},clearHistory(){return write('history',[])}};
})();

import type { ExtractedFeatures } from '@/shared/types/types';
declare global { interface Window { EssentiaWASM?: any; Essentia?: any; } }
let wm:any=null,ei:any=null,ip:Promise<void>|null=null,di=false;
const W='/essentia-wasm/';
function inj(u:string):Promise<void>{return new Promise((r,j)=>{const s=document.createElement('script');s.src=u;s.onload=()=>r();s.onerror=()=>j(new Error(u));document.head.appendChild(s)});}
async function load():Promise<void>{if(wm)return;if(!window.EssentiaWASM)await inj(W+'essentia-wasm.web.js');if(!window.Essentia)await inj(W+'essentia-core-global.js');const E=window.EssentiaWASM,C=window.Essentia;if(!E||!C)throw new Error('load fail');(E as any).locateFile=(p:string)=>p.endsWith('.wasm')?W+p:p;wm=await E();ei=new C(wm);}
export async function getEssentia():Promise<any>{if(di)throw new Error('disposed');if(ei)return ei;if(!ip)ip=load();await ip;return ei;}
export async function extractFeatures(ab:AudioBuffer):Promise<ExtractedFeatures>{
  const ess=await getEssentia(),d=ab.getChannelData(0),sr=ab.sampleRate;
  try{
    const e=ess as any;
    const vec=e.arrayToVector(Array.from(d));
    const hp=e.HPCP(vec,sr,{size:36,referenceFrequency:440,minFrequency:80,maxFrequency:2000,weightType:'cosine',nonLinear:true,windowSize:1.0});
    const ch:Float32Array[]=[];for(const f of hp){const c=new Float32Array(12);for(let i=0;i<12;i++)c[i]=f[i*3]+f[i*3+1]+f[i*3+2];ch.push(c);}
    const kr=e.Key(vec,sr,{profileType:'temperley'});
    const rh=e.RhythmExtractor2013(vec,sr,{method:'multifeature'});
    return {hpcp:hp,chroma:ch,key:kr.key||'C',scale:kr.scale||'major',keyStrength:kr.strength??0,bpm:rh.bpm??120,beats:Array.isArray(rh.beats)?Array.from(rh.beats):[]};
  }catch(e){console.error('[extract]',e);throw e;}
}
export function dispose():void{if(ei){try{ei.shutdown?.()}catch{}}ei=null;wm=null;ip=null;di=true}
export function isReady():boolean{return ei!==null&&!di}

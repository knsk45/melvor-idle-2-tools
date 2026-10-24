export interface Settings {schemaVersion:1;lang:'ru'|'en';mode:'base'|'manual';level:string;target:string;interval:string;xp:string;items:string;price:string;channel:string;version:string}
export const defaults:Settings={schemaVersion:1,lang:'ru',mode:'base',level:'1',target:'100',interval:'',xp:'',items:'',price:'',channel:'demo',version:''};
export const storageKey='melvor2.settings.v1';
export function restore(raw:string|null):Settings {
 try {const v=JSON.parse(raw??'null');if(!v||v.schemaVersion!==1)return {...defaults};
 const result={...defaults};
 for(const k of ['level','target','interval','xp','items','price','channel','version'] as const)if(typeof v[k]==='string'&&v[k].length<=100)result[k]=v[k];
 if(v.lang==='ru'||v.lang==='en')result.lang=v.lang;
 if(v.mode==='base'||v.mode==='manual')result.mode=v.mode;
 return result;}catch{return {...defaults};}
}
export function parseNumber(raw:string):number|null {if(!raw.trim())return null;const n=Number(raw.replace(',','.'));return Number.isFinite(n)?n:null;}

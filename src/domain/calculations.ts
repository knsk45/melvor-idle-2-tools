export interface Values { intervalSeconds:number|null; xpPerAction:number|null; expectedQuantityPerAction:number|null; sellPriceGp:number|null }
export interface Tree extends Values { id:string; name:{en:string;ru:string|null}; requiredLevel:number; channel:string; gameVersion:string; verificationStatus:'verified'|'provisional'|'unknown'; checkedAt:string|null; sourceRefs:string[] }
export const finite = (x:unknown): x is number => typeof x==='number' && Number.isFinite(x);
export function rates(v:Values) {
 if(!finite(v.intervalSeconds)||v.intervalSeconds<=0) return null;
 const actionsPerHour=3600/v.intervalSeconds;
 const nonnegative=(n:number|null)=>finite(n)&&n>=0 ? n : null;
 const xp=nonnegative(v.xpPerAction),items=nonnegative(v.expectedQuantityPerAction),price=nonnegative(v.sellPriceGp);
 const itemsPerHour=items===null?null:actionsPerHour*items;
 const result={actionsPerHour,xpPerHour:xp===null?null:actionsPerHour*xp,itemsPerHour,grossGpPerHour:itemsPerHour===null||price===null?null:itemsPerHour*price};
 return Object.values(result).every(n=>n===null||Number.isFinite(n))?result:null;
}
export function secondsForQuantity(quantity:number,itemsPerHour:number|null) {
 if(!finite(quantity)||quantity<0||!finite(itemsPerHour)||itemsPerHour<=0)return null;
 const seconds=quantity/itemsPerHour*3600;return Number.isFinite(seconds)?seconds:null;
}
export function eligible(trees:Tree[],level:number,channel:string,version:string) {
 return trees.filter(t=>t.verificationStatus==='verified'&&t.requiredLevel<=level&&t.channel===channel&&t.gameVersion===version&&t.checkedAt&&t.sourceRefs.length>0);
}
export function validateData(trees:Tree[],sources:{id:string;url:string}[]) {
 const errors:string[]=[]; const ids=new Set<string>(); const refs=new Set(sources.map(s=>s.id));
 for(const s of sources) {try {const u=new URL(s.url);if(u.protocol!=='https:')errors.push('Source must use HTTPS');}catch {errors.push('Invalid source URL');}}
 for(const t of trees) {
  if(!t.id||ids.has(t.id))errors.push('Duplicate or empty ID: '+t.id); ids.add(t.id);
  if(!t.name.en||!Number.isInteger(t.requiredLevel)||t.requiredLevel<1||!t.channel.trim()||!t.gameVersion.trim())errors.push('Invalid metadata: '+t.id);
  if(!['verified','provisional','unknown'].includes(t.verificationStatus))errors.push('Invalid status: '+t.id);
  if(t.intervalSeconds!==null&&(!finite(t.intervalSeconds)||t.intervalSeconds<=0))errors.push('Invalid interval: '+t.id);
  for(const n of [t.xpPerAction,t.expectedQuantityPerAction,t.sellPriceGp])if(n!==null&&(!finite(n)||n<0))errors.push('Invalid value: '+t.id);
  if(t.sourceRefs.some(r=>!refs.has(r)))errors.push('Missing source: '+t.id);
  if(t.verificationStatus==='verified'&&(!t.sourceRefs.length||!t.checkedAt||!/^\d{4}-\d{2}-\d{2}$/.test(t.checkedAt)||!Number.isFinite(Date.parse(t.checkedAt))))errors.push('Unproven verification: '+t.id);
 }
 return errors;
}

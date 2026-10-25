export interface Settings {
  schemaVersion:2;
  lang:'en'|'ru';
}
export const defaults:Settings={schemaVersion:2,lang:'en'};
export const storageKey='melvor2.reference.v2';
export function restore(raw:string|null):Settings {
  try {
    const value:unknown=JSON.parse(raw??'null');
    if(value&&typeof value==='object'&&'schemaVersion' in value&&value.schemaVersion===2&&'lang' in value&&(value.lang==='ru'||value.lang==='en'))return {schemaVersion:2,lang:value.lang};
  }catch { /* A corrupt preference must not prevent reading the reference. */ }
  return {...defaults};
}

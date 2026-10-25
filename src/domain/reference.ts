export interface ProductRate {
  id:string;
  name:string;
  role:'primary'|'side'|'junk';
  basis:string;
  probability:number|null;
  quantity:number|null;
  itemsPerHour:number|null;
  gpPerHour:number|null;
}
export interface ActionRow {
  id:string;
  gameId:string;
  name:string;
  requiredLevel:number|null;
  availability:'demo'|'locked'|'conditional';
  conditions:string[];
  intervalSeconds:number|null;
  intervalLabel:string;
  baseXp:number|null;
  successChance:number|null;
  xpPerHour:number|null;
  itemsPerHour:number|null;
  gpPerHour:number|null;
  products:ProductRate[];
  sourcePointer:string;
  notes:string[];
}
export interface SkillTable {
  id:string;
  gameVersion:string;
  steamBuildId:string;
  packageSha256:string;
  checkedAt:string;
  method:string;
  rows:ActionRow[];
  notes:string[];
  scenario?:string;
}
export type SortKey='xp'|'items'|'gold'|'level';
export function selectRows(rows:ActionRow[],query:string,scope:'demo'|'all',sort:SortKey) {
  const q=query.trim().toLocaleLowerCase();
  return rows.filter(r=>scope==='all'||r.availability==='demo')
    .filter(r=>(r.name+' '+r.products.map(p=>p.name).join(' ')).toLocaleLowerCase().includes(q))
    .sort((a,b)=>{
      const key=sort==='xp'?'xpPerHour':sort==='items'?'itemsPerHour':sort==='gold'?'gpPerHour':'requiredLevel';
      const av=a[key],bv=b[key];
      if(av===null&&bv!==null)return 1;
      if(bv===null&&av!==null)return -1;
      return (av===null||bv===null?0:sort==='level'?av-bv:bv-av)||a.name.localeCompare(b.name,'en');
    });
}

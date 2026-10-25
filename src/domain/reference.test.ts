import {describe,it,expect} from 'vitest';
import {selectRows,type ActionRow,type SkillTable} from './reference';
import {restore,defaults} from './settings';
import woodJson from '../data/skills/woodcutting.json';
import fishJson from '../data/skills/fishing.json';
import mineJson from '../data/skills/mining.json';
import index from '../data/skills/index.json';
const wood=woodJson as SkillTable,fish=fishJson as SkillTable,mine=mineJson as SkillTable;
const find=(table:SkillTable,id:string)=>table.rows.find(r=>r.id===id)!;
describe('Fixed versioned base reference',()=>{
 it.each([[wood,20,9],[fish,23,11],[mine,27,14]] as const)('%s keeps defined and demo action counts separate',(table,total,demo)=>{
  expect(table.rows).toHaveLength(total);expect(selectRows(table.rows,'','demo','xp')).toHaveLength(demo);
  expect(table.gameVersion).toBe('0.11.2-alpha.4');expect(table.packageSha256).toBe('2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474');
 });
 it('has 25 real skill sections, with the verified static rate tables',()=>{expect(index.skills).toHaveLength(25);expect(index.skills.filter(s=>s.status==='ready').map(s=>s.id).sort()).toEqual(['astrology','beastcrafting','cooking','crafting','farming','firemaking','fishing','fletching','herblore','mining','ranching','runecrafting','smithing','thieving','woodcutting']);});
 it.each([wood,fish,mine])('has unique source-bound actions and valid finite values',table=>{
  expect(new Set(table.rows.map(r=>r.id)).size).toBe(table.rows.length);
  for(const row of table.rows){expect(row.sourcePointer).toMatch(/^\/Objects\//);expect(row.gameId).toMatch(/^MelvorBase:/);
   for(const value of [row.intervalSeconds,row.baseXp,row.xpPerHour,row.itemsPerHour,row.gpPerHour])expect(value===null||Number.isFinite(value)&&value>=0).toBe(true);
   for(const p of row.products){expect(p.probability===null||p.probability>=0&&p.probability<=1).toBe(true);expect(p.itemsPerHour===null||p.itemsPerHour>=0).toBe(true);}
  }
 });
 it('retains the Oak level requirement rather than raw Level 5',()=>expect(find(wood,'OakTree').requiredLevel).toBe(10));
 it('retains the full cut and side rewards for Normal Tree',()=>{const r=find(wood,'NormalTree');expect(r.intervalSeconds).toBe(3);expect(r.xpPerHour).toBe(3600);expect(r.itemsPerHour).toBe(1200);expect(r.gpPerHour).toBe(3852);});
});
describe('Fishing equations verified against CIL',()=>{
 it('uses mean duration and awards XP even on junk',()=>{const r=find(fish,'ShallowPools');expect(r.intervalSeconds).toBe(6);expect(r.xpPerHour).toBe(4800);expect(r.itemsPerHour).toBe(480);expect(r.gpPerHour).toBeCloseTo(3006);});
 it('keeps primary, junk and special quantities separate',()=>{const r=find(fish,'ShallowPools');expect(r.products.find(p=>p.role==='junk')?.itemsPerHour).toBeCloseTo(120);expect(r.products.find(p=>p.id==='MelvorBase:BaitBox')?.itemsPerHour).toBe(6);});
 it('uses weighted fish products rather than granting each product every action',()=>{const r=find(fish,'CalmShallows');expect(r.products.find(p=>p.id==='MelvorBase:RawSardine')?.itemsPerHour).toBe(180);expect(r.products.find(p=>p.id==='MelvorBase:RawShrimp')?.itemsPerHour).toBe(180);});
 it('respects first-success special ordering for Dock Waters',()=>{const r=find(fish,'DockWaters');const box=r.products.find(p=>p.id==='MelvorBase:BaitBox')!;expect(box.probability).toBeCloseTo(.01986);expect(box.quantity).toBe(3);expect(box.itemsPerHour).toBeCloseTo(19.49890909090909);});
 it('retains a location gate with recipe requirements',()=>expect(find(fish,'DockWaters').conditions.some(c=>c.includes('Fishing level 18'))).toBe(true));
});
describe('Mining progress and guaranteed breaks',()=>{
 it('includes the Stone forced-break cap instead of a simple chance multiplier',()=>{const r=find(mine,'Stone');expect(r.intervalSeconds).toBeCloseTo(2.94);expect(r.itemsPerHour).toBeCloseTo(1224.4897959183675);expect(r.xpPerHour).toBeCloseTo(3673.4693877551026);expect(r.gpPerHour).toBeCloseTo(2448.979591836735);});
 it('uses the 0.9999 threshold for Clay, not a naive ceil(1/p)',()=>{const r=find(mine,'Clay');expect(r.intervalLabel).toContain('at most 3 hits');expect(r.itemsPerHour).toBeCloseTo(1136.8002225513794);});
 it('awards Copper XP on breaks and Geodes on hits',()=>{const r=find(mine,'CopperOre');expect(r.xpPerHour).toBeCloseTo(5684.95854717726);expect(r.products.find(p=>p.id==='MelvorBase:Geode')?.itemsPerHour).toBe(6);expect(r.gpPerHour).toBeCloseTo(3010.47927358863);expect(r.products.some(p=>p.id==='MelvorBase:CopperBar')).toBe(false);});
 it('preserves primary quantity greater than one for essence',()=>expect(find(mine,'RuneEssence').itemsPerHour).toBeCloseTo(2273.600445102759));
 it('excludes conditional Sulfur and debris from the ordinary demo list',()=>{const ids=selectRows(mine.rows,'','demo','xp').map(r=>r.id);expect(ids).not.toContain('Sulfur');expect(ids).not.toContain('StoneDebris');});
});
describe('Reference browsing has no personal model',()=>{
 it('orders all three numerical efficiency measures independently',()=>{
  for(const sort of ['xp','items','gold'] as const){const rows=selectRows(fish.rows,'','demo',sort);const key=sort==='xp'?'xpPerHour':sort==='items'?'itemsPerHour':'gpPerHour';expect(rows.map(r=>r[key])).toEqual([...rows.map(r=>r[key])].sort((a,b)=>(b??-1)-(a??-1)));}
 });
 it('searches item names as well as action names',()=>expect(selectRows(fish.rows,'shrimp','demo','xp').map(r=>r.id)).toContain('ShallowPools'));
 it('never ranks unknown metrics as zero',()=>{const original=find(fish,'ShallowPools');const rows=[{...original,id:'unknown',xpPerHour:null},{...original,id:'zero',xpPerHour:0}];expect(selectRows(rows as ActionRow[],'','demo','xp').map(r=>r.id)).toEqual(['zero','unknown']);});
 it('stores only the language preference and ignores old calculator inputs',()=>{expect(restore('{"schemaVersion":1,"lang":"ru","mode":"manual","level":"999"}')).toEqual(defaults);expect(restore('{"schemaVersion":2,"lang":"ru","mode":"manual","target":"100"}')).toEqual({schemaVersion:2,lang:'ru'});});
 it.each([null,'{','[]','{"schemaVersion":2,"lang":"invalid"}'])('recovers corrupt language preferences %s',raw=>expect(restore(raw)).toEqual(defaults));
});

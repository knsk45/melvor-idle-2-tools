import {describe,it,expect} from 'vitest';
import data from '../data/woodcutting.json';
import catalog from '../../data/catalog/woodcutting.json';
import recipeCatalog from '../../data/catalog/recipes.json';
import itemCatalog from '../../data/catalog/items.json';
import {type Tree,validateData} from './calculations';
import {sideDropRates,totalBaselineGp} from './woodcutting';
import sources from '../data/sources.json';
const rows=data as Tree[];
const get=(id:string)=>rows.find(t=>t.id===id)!;
describe('Static package cross-checks',()=>{
 it('matches all nine observed baselines to exact requirement and package facts',()=>{
  for(const t of data){const f=catalog.records.find(r=>r.id===t.gameId)!;
   expect(f).toBeDefined();expect(f.availabilityClassification).toBe('definition-without-demo-lock-or-display-condition');
   expect(t.requiredLevel).toBe(Math.max(...f.requirementLevels));expect(t.health).toBe(f.baseMaxHealth);
   expect(t.hitIntervalSeconds*1000).toBe(f.baseIntervalMilliseconds);expect(t.xpPerAction).toBe(f.baseExperience);
   expect(t.sellPriceGp).toBe(f.primaryItem!.sellsFor!.Quantity);expect(t.sourcePackageSha256).toBe(catalog.source.packageSha256);
  }
 });
 it('does not use Oak raw Level 5 as its unlock requirement 10',()=>{const oak=data.find(t=>t.id==='oak-tree')!;expect(oak.rawLevel).toBe(5);expect(oak.requiredLevel).toBe(10);});
 it('retains hidden and locked definitions without adding them to baseline recommendations',()=>{
  expect(catalog.records).toHaveLength(20);
  expect(catalog.records.filter(r=>r.availabilityClassification==='demo-locked')).toHaveLength(6);
  expect(catalog.records.filter(r=>r.availabilityClassification==='conditional-display-requirements')).toHaveLength(5);
  expect(data).toHaveLength(9);
 });
 it('retains catalog preparation without claiming other skill calculators are implemented',()=>{
  expect(itemCatalog.records).toHaveLength(664);expect(Object.values(recipeCatalog.tables).reduce((n,rows)=>n+rows.length,0)).toBe(1120);
  expect(recipeCatalog.tables.FishingRecipe).toHaveLength(23);expect(recipeCatalog.tables.MiningRecipe).toHaveLength(27);
 });
});
describe('Hit and cut reward frequency',()=>{
 it('rolls Bird Nests per hit, not per tree',()=>{const d=sideDropRates(get('normal-tree'))![0];expect(d.probability).toBe(0.0025);expect(d.itemsPerHour).toBe(9);expect(d.grossGpPerHour).toBe(252);expect(totalBaselineGp(get('normal-tree'))).toBe(3852);});
 it('rolls Oak seeds once per full cut',()=>{const d=sideDropRates(get('oak-tree'))!.find(d=>d.itemId==='MelvorBase:OakTreeSeed')!;expect(d.itemsPerHour).toBeCloseTo(0.9);expect(d.grossGpPerHour).toBeCloseTo(437.4);expect(totalBaselineGp(get('oak-tree'))).toBeCloseTo(6089.4);});
 it.each([['flax-bush',900,2700],['ambervine-bush',1800,7200],['spikemoss-shrub',2700,11700]])('%s stick expectations', (id,sticks,gp)=>{expect(sideDropRates(get(id))![0].itemsPerHour).toBe(sticks);expect(totalBaselineGp(get(id))).toBe(gp);});
 it('preserves unknown side-drop prices',()=>{const row=get('normal-tree');expect(totalBaselineGp({...row,sideDrops:row.sideDrops?.map(d=>({...d,sellPriceGp:null}))})).toBeNull();});
 it('rejects invalid drop probabilities',()=>{const row=get('normal-tree');expect(validateData([{...row,sideDrops:row.sideDrops?.map(d=>({...d,probability:1.1}))}],sources)).not.toEqual([]);});
});

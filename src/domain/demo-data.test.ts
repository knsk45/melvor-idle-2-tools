import {describe,it,expect} from 'vitest';
import data from '../data/woodcutting.json';
import sources from '../data/sources.json';
import {rates,eligible,validateData,secondsForQuantity,type Tree} from './calculations';
import {defaults,restore} from './settings';
const trees=data as Tree[];
describe('Observed demo v0.11.2-alpha.4',()=>{
 it('has six trees and three bushes with valid evidence',()=>{expect(trees).toHaveLength(9);expect(data.filter(t=>t.kind==='tree')).toHaveLength(6);expect(validateData(trees,sources)).toEqual([]);});
 it.each([
 ['normal-tree',1200,3600,3600],['oak-tree',900,7200,5400],['willow-tree',720,12240,12240],
 ['teak-tree',600,13200,15000],['maple-tree',450,15750,14850],['mahogany-tree',360,18360,16560],
 ['flax-bush',1800,5400,1800],['ambervine-bush',1800,7200,5400],['spikemoss-shrub',1800,14400,9000],
 ])('%s baseline full-cut rates', (id,items,xp,gp)=>{
  const t=trees.find(t=>t.id===id)!;expect(rates(t)).toMatchObject({itemsPerHour:items,xpPerHour:xp,grossGpPerHour:gp});
 });
 it('does not confuse one-second hits with one-second full cuts',()=>{const normal=trees.find(t=>t.id==='normal-tree')!;expect(normal.hitIntervalSeconds).toBe(1);expect(normal.intervalSeconds).toBe(3);expect(secondsForQuantity(100,rates(normal)!.itemsPerHour)).toBe(300);});
 it('respects demo levels and exact build',()=>{expect(eligible(trees,1,'demo',defaults.version).map(t=>t.id)).toEqual(['normal-tree']);expect(eligible(trees,5,'demo',defaults.version).map(t=>t.id)).toEqual(['normal-tree','flax-bush']);expect(eligible(trees,60,'release',defaults.version)).toEqual([]);expect(eligible(trees,60,'demo','other')).toEqual([]);});
 it('rejects inconsistent health and full-cut timing',()=>expect(validateData([{...trees[0],intervalSeconds:1}],sources)).not.toEqual([]));
 it('uses English by default and preserves an explicit Russian choice',()=>{expect(restore(null).lang).toBe('en');expect(restore(JSON.stringify({...defaults,lang:'ru'})).lang).toBe('ru');});
 it('keeps observed buffs out of the baseline',()=>{expect(data.every(t=>t.calculationProfile==='base-no-bonuses')).toBe(true);expect(trees.find(t=>t.id==='flax-bush')?.xpPerAction).toBe(3);});
});

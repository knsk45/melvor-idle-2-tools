import {describe,it,expect} from 'vitest';
import {rates,secondsForQuantity,eligible,validateData,type Tree} from './calculations';
import {restore,parseNumber,defaults} from './settings';
import data from '../data/woodcutting.json';import sources from '../data/sources.json';
// Synthetic fixture. These numbers do not describe any in-game tree.
const fixture:Tree={id:'test-only',name:{en:'Synthetic fixture',ru:null},requiredLevel:5,intervalSeconds:4,xpPerAction:10,expectedQuantityPerAction:2,sellPriceGp:5,channel:'test',gameVersion:'fixture-1',verificationStatus:'verified',checkedAt:'2026-10-24',sourceRefs:['fixture']};
describe('Independent repeatable action model',()=>{
 it('matches the handoff example',()=>expect(rates(fixture)).toEqual({actionsPerHour:900,xpPerHour:9000,itemsPerHour:1800,grossGpPerHour:9000}));
 it('scales with interval without intermediate rounding',()=>expect(rates({...fixture,intervalSeconds:8})?.xpPerHour).toBe(4500));
 it.each([0,-1,NaN,Infinity,null])('rejects invalid interval %s',intervalSeconds=>expect(rates({...fixture,intervalSeconds})).toBeNull());
 it('preserves unknown fields',()=>expect(rates({...fixture,xpPerAction:null,expectedQuantityPerAction:null})).toMatchObject({xpPerHour:null,itemsPerHour:null,grossGpPerHour:null}));
 it('accepts zero sale price',()=>expect(rates({...fixture,sellPriceGp:0})?.grossGpPerHour).toBe(0));
 it('does not treat missing price as zero',()=>expect(rates({...fixture,sellPriceGp:null})?.grossGpPerHour).toBeNull());
 it('calculates expected quantity time',()=>{expect(secondsForQuantity(100,1800)).toBe(200);expect(secondsForQuantity(0,1800)).toBe(0);});
 it.each([0,null,-10,Infinity])('rejects unavailable production %s',n=>expect(secondsForQuantity(100,n)).toBeNull());
 it('rejects negative targets',()=>expect(secondsForQuantity(-1,1800)).toBeNull());
 it('excludes locked, provisional and incompatible rows',()=>{
 const rows=[fixture,{...fixture,id:'provisional',verificationStatus:'provisional' as const},{...fixture,id:'channel',channel:'demo'},{...fixture,id:'version',gameVersion:'2'},{...fixture,id:'unproven',sourceRefs:[]}];
 expect(eligible(rows,4,'test','fixture-1')).toEqual([]);expect(eligible(rows,5,'test','fixture-1')).toEqual([fixture]);
 });
 it('guards overflow',()=>expect(rates({...fixture,intervalSeconds:Number.MIN_VALUE})).toBeNull());
});
describe('Data validation',()=>{
 const refs=[{id:'fixture',url:'https://example.org/fixture'}];
 it('accepts the checked-in empty dataset',()=>expect(validateData(data,sources)).toEqual([]));
 it('validates a synthetic record',()=>expect(validateData([fixture],refs)).toEqual([]));
 it('rejects duplicate IDs',()=>expect(validateData([fixture,fixture],refs)).not.toEqual([]));
 it('rejects unresolved sources',()=>expect(validateData([fixture],[])).not.toEqual([]));
 it('rejects invalid metadata and values',()=>expect(validateData([{...fixture,requiredLevel:1.5,channel:'',gameVersion:'',sellPriceGp:-1}],refs).length).toBeGreaterThan(0));
 it('requires evidence for verified rows',()=>expect(validateData([{...fixture,checkedAt:null,sourceRefs:[]}],refs)).not.toEqual([]));
 it('does not overwrite null with zero',()=>{const t={...fixture,xpPerAction:null};validateData([t],refs);expect(t.xpPerAction).toBeNull();});
});
describe('Settings recovery',()=>{
 it.each([null,'{','null','[]','{"schemaVersion":2}'])('recovers %s',raw=>expect(restore(raw)).toEqual(defaults));
 it('rejects malformed fields',()=>expect(restore('{"schemaVersion":1,"level":{},"mode":"bad","lang":"xx"}')).toEqual(defaults));
 it('restores manual settings',()=>expect(restore(JSON.stringify({...defaults,mode:'manual',price:'0'}))).toMatchObject({mode:'manual',price:'0'}));
 it('distinguishes empty, zero and unknown',()=>{expect(parseNumber('')).toBeNull();expect(parseNumber('0')).toBe(0);expect(parseNumber('x')).toBeNull();expect(parseNumber('1,5')).toBe(1.5);});
});

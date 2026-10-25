import {rates,finite,type Tree} from './calculations';
/** Baseline only: one damage per hit, no modifiers, no roll interactions. */
export function sideDropRates(tree:Tree) {
 const primary=rates(tree);
 if(!primary||!finite(tree.hitIntervalSeconds)||tree.hitIntervalSeconds<=0)return null;
 return (tree.sideDrops??[]).map(drop=>{
  const rollsPerHour=drop.basis==='hit'?3600/tree.hitIntervalSeconds!:primary.actionsPerHour;
  const itemsPerHour=rollsPerHour*drop.probability*drop.quantity;
  return {...drop,itemsPerHour,grossGpPerHour:drop.sellPriceGp===null?null:itemsPerHour*drop.sellPriceGp};
 });
}
export function totalBaselineGp(tree:Tree):number|null {
 const primary=rates(tree)?.grossGpPerHour,side=sideDropRates(tree);
 if(primary==null||side===null||side.some(d=>d.grossGpPerHour===null))return null;
 const total=side.reduce((sum,d)=>sum+d.grossGpPerHour!,primary);
 return Number.isFinite(total)?total:null;
}

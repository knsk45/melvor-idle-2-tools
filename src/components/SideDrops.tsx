import {sideDropRates} from '../domain/woodcutting';
import type {Tree} from '../domain/calculations';
export function SideDrops({tree,lang}:{tree:Tree;lang:'en'|'ru'}){
 const drops=sideDropRates(tree);
 if(!drops?.length)return <>—</>;
 const f=(n:number)=>new Intl.NumberFormat(lang,{maximumFractionDigits:4}).format(n);
 return <details className="drop-details"><summary>{drops.length} {lang==='en'?'side drops':'побочных предмета'}</summary><ul>{drops.map(d=><li key={d.itemId+d.basis}><strong>{d.name}</strong><br/>{f(d.probability*100)}% / {d.basis==='hit'?(lang==='en'?'hit':'удар'):(lang==='en'?'full cut':'сруб')} × {d.quantity}<br/>{f(d.itemsPerHour)} {lang==='en'?'items/h':'шт/ч'} · {d.grossGpPerHour===null?'—':f(d.grossGpPerHour)} GP/h</li>)}</ul></details>;
}

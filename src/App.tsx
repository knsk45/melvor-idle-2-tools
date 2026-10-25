import {useEffect,useState} from 'react';
import {messages} from './i18n/messages';
import {defaults,restore,storageKey,type Settings} from './domain/settings';
import {selectRows,type SkillTable,type SortKey} from './domain/reference';
import index from './data/skills/index.json';
import woodcutting from './data/skills/woodcutting.json';
import fishing from './data/skills/fishing.json';
import mining from './data/skills/mining.json';
import astrology from './data/skills/astrology.json';
import beastcrafting from './data/skills/beastcrafting.json';
import cooking from './data/skills/cooking.json';
import crafting from './data/skills/crafting.json';
import firemaking from './data/skills/firemaking.json';
import fletching from './data/skills/fletching.json';
import farming from './data/skills/farming.json';
import herblore from './data/skills/herblore.json';
import thieving from './data/skills/thieving.json';
import runecrafting from './data/skills/runecrafting.json';
import smithing from './data/skills/smithing.json';
const tables:Record<string,SkillTable>={woodcutting:woodcutting as SkillTable,fishing:fishing as SkillTable,mining:mining as SkillTable,astrology:astrology as SkillTable,beastcrafting:beastcrafting as SkillTable,cooking:cooking as SkillTable,crafting:crafting as SkillTable,farming:farming as SkillTable,firemaking:firemaking as SkillTable,fletching:fletching as SkillTable,herblore:herblore as SkillTable,runecrafting:runecrafting as SkillTable,smithing:smithing as SkillTable,thieving:thieving as SkillTable};
const knownSkills=new Set(index.skills.map(s=>s.id));
const fromHash=()=>{const id=window.location.hash.slice(1);return knownSkills.has(id)?id:'woodcutting';};
const skillRu:Record<string,string>={woodcutting:'Рубка дерева',fishing:'Рыбалка',mining:'Добыча руды',cooking:'Кулинария',crafting:'Ремесло',farming:'Земледелие',firemaking:'Разведение огня',fletching:'Изготовление стрел',herblore:'Травничество',hunting:'Охота',runecrafting:'Изготовление рун',smithing:'Кузнечное дело',thieving:'Воровство',ranching:'Животноводство',astrology:'Астрология',agility:'Ловкость',beastcrafting:'Beastcrafting',attack:'Атака',strength:'Сила',defence:'Защита',hitpoints:'Здоровье',ranged:'Дальний бой',magic:'Магия',prayer:'Молитва',slayer:'Slayer'};
const ordered=[...index.skills].sort((a,b)=>(a.status==='ready'?0:1)-(b.status==='ready'?0:1)||a.name.localeCompare(b.name));
export function App(){
  const [settings,setSettings]=useState<Settings>(()=>{try{return restore(localStorage.getItem(storageKey));}catch{return {...defaults};}});
  const [skill,setSkill]=useState(fromHash);
  const [search,setSearch]=useState('');
  const [sort,setSort]=useState<SortKey>('xp');
  const [scope,setScope]=useState<'demo'|'all'>('demo');
  const t=messages[settings.lang];
  useEffect(()=>{document.documentElement.lang=settings.lang;try{localStorage.setItem(storageKey,JSON.stringify(settings));}catch{/* Reading the reference remains possible without storage. */}},[settings]);
  useEffect(()=>{const handle=()=>{setSkill(fromHash());setSearch('');};window.addEventListener('hashchange',handle);return()=>window.removeEventListener('hashchange',handle);},[]);
  const selected=index.skills.find(s=>s.id===skill)!;
  const name=settings.lang==='ru'?skillRu[skill]??selected.name:selected.name;
  const table=tables[skill];
  const rows=table?selectRows(table.rows,search,scope,sort):[];
  const f=(n:number|null,digits=2)=>n===null||!Number.isFinite(n)?'—':new Intl.NumberFormat(settings.lang,{maximumFractionDigits:digits}).format(n);
  const availability=(status:string)=>status==='locked'?t.locked:status==='conditional'?t.conditional:t.demo;
  return <>
    <header><a className="brand" href="#woodcutting"><span className="brand-icon" aria-hidden="true">M₂</span><span>MELVOR IDLE 2 <small>BASE REFERENCE</small></span></a><nav aria-label="Language"><button className="language" onClick={()=>setSettings(s=>({...s,lang:s.lang==='en'?'ru':'en'}))}>{settings.lang==='en'?'RU':'EN'}</button><a href="https://github.com/knsk45/melvor-idle-2-tools">GitHub ↗</a></nav></header>
    <div className="app-layout">
      <aside><p className="eyebrow">{t.skills} / {index.skills.length}</p><nav aria-label={t.skills}>{ordered.map(s=><a key={s.id} href={'#'+s.id} aria-current={s.id===skill?'page':undefined}><span>{settings.lang==='ru'?skillRu[s.id]??s.name:s.name}</span><small>{s.status==='ready'?'●':'○'}</small></a>)}</nav></aside>
      <main>
        <div className="mobile-skill"><label>{t.skillLabel}<select value={skill} onChange={e=>{window.location.hash=e.target.value;}}>{ordered.map(s=><option value={s.id} key={s.id}>{settings.lang==='ru'?skillRu[s.id]??s.name:s.name}{s.status==='ready'?'':' · '+t.planned}</option>)}</select></label></div>
        <section className="page-heading"><p className="coverage-notice">{t.notice}</p><p className="eyebrow">{t.title}</p><h1>{name}</h1><p>{t.description}</p><div className="source-badge"><span aria-hidden="true"/> {t.build}</div></section>
        {table?<section className="workspace" aria-label={name}>
          <div className="workspace-heading"><strong>{t.baseline}</strong><span>{rows.length} / {table.rows.length} {settings.lang==='en'?'actions':'действий'}</span></div>
          <div className="toolbar"><label>{t.search}<input type="search" value={search} onChange={e=>setSearch(e.target.value)}/></label><label>{t.sort}<select value={sort} onChange={e=>setSort(e.target.value as SortKey)}><option value="xp">{t.xp}</option><option value="items">{t.items}</option><option value="gold">{t.gold}</option><option value="level">{t.level}</option></select></label><label>{t.scope}<select value={scope} onChange={e=>setScope(e.target.value as 'demo'|'all')}><option value="demo">{t.demo}</option><option value="all">{t.all}</option></select></label></div>
          <div className="table-wrap" tabIndex={0} role="region" aria-label={name+' '+t.title}><table><caption>{name} · {t.nominal}</caption><thead><tr>{[t.action,t.level,t.interval,t.baseXp,t.chance,t.xp,t.items,t.gold,t.details].map((label,i)=><th key={label} scope="col" aria-sort={i===5&&sort==='xp'||i===6&&sort==='items'||i===7&&sort==='gold'?'descending':i===1&&sort==='level'?'ascending':undefined}>{label}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.id} className={row.availability==='demo'?'':'unavailable'}><th scope="row">{row.name}<small className={row.availability==='demo'?'':'content-status'}>{availability(row.availability)}</small></th><td>{f(row.requiredLevel)}</td><td>{f(row.intervalSeconds,4)}<small>{row.intervalLabel}</small></td><td>{f(row.baseXp,4)}</td><td>{row.successChance===null?'—':f(row.successChance*100,3)+'%'}</td><td className={sort==='xp'?'sorted':''}>{f(row.xpPerHour)}</td><td className={sort==='items'?'sorted':''}>{f(row.itemsPerHour)}</td><td className={sort==='gold'?'sorted':''}>{f(row.gpPerHour)}</td><td><details><summary>{t.products}</summary><ul className="drop-list">{row.products.map((p,i)=><li key={p.id+i}><strong>{p.name}</strong><br/>{f(p.itemsPerHour,4)} {t.hour} · {f(p.gpPerHour,4)} GP/h<small>{p.basis} · {t.probability}: {p.probability===null?'—':f(p.probability*100,4)+'%'} · {t.quantity}: {f(p.quantity,4)}</small></li>)}</ul><strong>{t.conditions}</strong><ul>{row.conditions.map((c,i)=><li key={i}>{c}</li>)}</ul>{row.notes.map((n,i)=><p key={i}>{n}</p>)}<small>{row.gameId}<br/>{t.sourceRecord}: {row.sourcePointer}</small></details></td></tr>)}</tbody></table></div>
          {rows.length===0&&<div className="empty"><h2>{t.empty}</h2><p>{t.noResult}</p></div>}
          <div className="workspace-foot"><p>{t.rules}</p><p>{t.noResult}</p></div>
        </section>:<section className="workspace planned"><span className="planned-mark" aria-hidden="true">○</span><h2>{t.plannedTitle}</h2><p>{t.plannedBody}</p><p>{selected.definitionCount?selected.definitionCount+' '+t.definitions:t.noRecipes}</p>{selected.demoLocked&&<p className="content-status">{t.locked}</p>}</section>}
        <section className="notes"><article><p className="eyebrow">{t.source}</p><h2>{t.build}</h2><p>{t.coverage}</p>{table?.notes.map((note,i)=><p key={i}>{note}</p>)}<a href="https://github.com/knsk45/melvor-idle-2-tools/blob/main/docs/BASE_SKILL_FORMULAS.md">{t.methods} ↗</a></article><article><p className="eyebrow">{t.modifiers}</p><h2>{t.baseline}</h2><p>{t.modifiersText}</p><a href="https://github.com/knsk45/melvor-idle-2-tools/blob/main/docs/MODIFIERS_ARTICLE_PLAN.md">{t.modifiers} ↗</a></article></section>
      </main>
    </div><footer><span>Melvor Idle 2 · Base Reference</span><p>{t.footer}</p></footer>
  </>;
}

import { useState } from 'react';
import raw from '../data/monsters.json';
import { defaultMonsterFilters, selectMonsters, shortId, type Monster, type MonsterCatalog, type MonsterFilters } from '../domain/monsters';
import { monsterMessages } from '../i18n/monsters';
import './monsters.css';

const catalog = raw as unknown as MonsterCatalog;
const areas = new Map(catalog.areas.map(a => [a.id, a]));
const human = (id: string) => shortId(id).replace(/([a-z])([A-Z])/g, '$1 $2');

function MonsterCard({ monster: m, lang }: { monster: Monster; lang: 'en' | 'ru' }) {
  const t = monsterMessages[lang];
  const f = (n: number | null | undefined, digits = 3) => n == null ? '—' : new Intl.NumberFormat(lang, { maximumFractionDigits: digits }).format(n);
  const range = (min: number | null, max: number | null) => min === max ? f(min) : `${f(min)}–${f(max)}`;
  const style = (s: string) => t[s as 'Melee' | 'Ranged' | 'Magic'] ?? s;
  const status = t[m.availability];
  const localAreas = m.areas.map(id => areas.get(id)).filter(a => a !== undefined);
  const attackIds = new Set(m.attacks.map(a => a.id));
  const passiveIds = new Set([...m.passives.map(p => p.id), ...localAreas.flatMap(a => a.passives ?? [])]);
  return <details className="monster-card">
    <summary><span className="monster-name">{m.name}<small className={'monster-status ' + m.availability}>{status}</small></span>
      <span className="monster-hp">{f(m.baseHp)} <small>HP</small></span>
      <span className="monster-style">{m.styles.map(style).join(' / ') || '—'}</span>
      <span className="monster-place">{localAreas.map(a => a.name).join(' · ') || t.unknown}</span>
      <span className="monster-expand">+</span>
    </summary>
    <div className="monster-body">
      <section><h3>{t.stats}</h3><dl className="monster-stats">
        <div><dt>{t.hp}</dt><dd>{f(m.baseHp)}</dd></div>
        <div><dt>{t.interval}</dt><dd>{m.baseStats['MelvorBase:AttackInterval'] == null ? '—' : f(m.baseStats['MelvorBase:AttackInterval'] / 1000) + ' s'}</dd></div>
        <div><dt>{t.damageType}</dt><dd>{m.damageType ? human(m.damageType) : '—'}</dd></div>
        <div><dt>{t.element}</dt><dd>{m.element ? human(m.element) : '—'}</dd></div>
      </dl><p className="monster-note">{t.baseNote}</p>
        <h4>{t.levels}</h4><dl className="monster-stats">{Object.entries(m.levels).map(([id, value]) => <div key={id}><dt>{human(id)}</dt><dd>{f(value)}</dd></div>)}</dl>
        <details><summary>{t.bonuses}</summary><dl className="monster-stat-list">{Object.entries(m.baseStats).map(([id, value]) => <div key={id}><dt>{human(id)}</dt><dd>{f(value)}</dd></div>)}</dl>
          <h4>{t.power}</h4><p>{m.powerRatings?.map(r => `${human(r.DamageType)}: ${f(r.Value)}`).join(' · ') || '—'}</p>
          <h4>{t.protection}</h4><p>{m.protectionRatings?.map(r => `${human(r.DamageType)}: ${f(r.Value)}`).join(' · ') || '—'}</p>
        </details>
      </section>
      <section><h3>{t.locations}</h3>{localAreas.map(a => <div className="monster-area" key={a.id}>
        <strong>{a.name}</strong><small>{a.kind === 'Dungeon' ? lang === 'ru' ? 'Подземелье' : 'Dungeon' : lang === 'ru' ? 'Область' : 'Area'} · {a.difficulty ? human(a.difficulty) : '—'}</small>
        {(a.requirements?.length || a.displayRequirements?.length || a.passives?.length || a.effect) ? <details><summary>{t.areaRequirements}</summary><pre>{JSON.stringify({ requirements: a.requirements, displayRequirements: a.displayRequirements, passives: a.passives, effect: a.effect }, null, 2)}</pre></details> : null}
      </div>)}</section>
      <section><h3>{t.drops}</h3>{m.drops.length > 0 ? <div className="table-wrap" tabIndex={0} role="region" aria-label={m.name + ' ' + t.drops}><table><caption>{m.name} · {t.drops}</caption><thead><tr>{[t.item, t.chance, t.quantity, t.group].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{m.drops.map((d, i) => <tr key={d.id + i}><th scope="row">{d.name}</th><td>{d.probability == null ? '—' : f(d.probability * 100, 5) + '%'}</td><td>{range(d.min, d.max)}</td><td>{d.group === 'fixed' ? t.fixed : t.table + ' ' + d.group.split('-')[1]}</td></tr>)}</tbody></table></div> : <p>{m.dropDefinitionKnown ? t.noDrops : t.unknown}</p>}
        {m.currencies.length > 0 && <><h4>{t.gold}</h4><ul>{m.currencies.map((c, i) => <li key={c.id + i}>{c.name}: {range(c.min, c.max)}</li>)}</ul></>}
        <p className="monster-note">{t.lootNote}</p>
      </section>
      <section><h3>{t.abilities}</h3><h4>{t.stances}</h4><p>{m.stances.map(s => `${s.name} (${style(s.style)})`).join(' · ') || t.none}</p>
        <h4>{t.attacks}</h4><ul>{m.attacks.length ? m.attacks.map((a, i) => <li key={a.id + i}>{a.name} · {a.chance == null ? '—' : f(a.chance * 100) + '%'}</li>) : <li>{t.none}</li>}</ul>
        <h4>{t.passives}</h4><p>{m.passives.map(p => p.name).join(' · ') || t.none}</p><p className="monster-note">{t.abilityNote}</p>
        {(attackIds.size > 0 || passiveIds.size > 0) && <details><summary>{t.specialDefinitions}</summary><pre>{JSON.stringify({ attacks: catalog.attackDefinitions.filter(d => attackIds.has(d.id)), passives: catalog.passiveDefinitions.filter(d => passiveIds.has(d.id)) }, null, 2)}</pre></details>}
      </section>
      <details className="monster-source"><summary>{t.source}</summary><p>{m.id} · {m.sourcePointer}</p><p>{catalog.channel} · {catalog.gameVersion} · {catalog.steamBuildId} · {catalog.checkedAt}</p><p>SHA-256: {catalog.packageSha256}</p><h4>{t.requirements}</h4><pre>{JSON.stringify({ requirements: m.requirements, displayRequirements: m.displayRequirements }, null, 2)}</pre></details>
    </div>
  </details>;
}

export default function MonsterDatabase({ lang }: { lang: 'en' | 'ru' }) {
  const t = monsterMessages[lang];
  const [filters, setFilters] = useState<MonsterFilters>(defaultMonsterFilters);
  const [limit, setLimit] = useState(24);
  const update = <K extends keyof MonsterFilters>(key: K, value: MonsterFilters[K]) => { setFilters(s => ({ ...s, [key]: value })); setLimit(24); };
  const rows = selectMonsters(catalog, filters);
  const populatedAreas = catalog.areas.filter(a => a.enemyIds.length).sort((a, b) => a.name.localeCompare(b.name));
  return <section className="monster-database" aria-label={t.title}>
    <p className="monster-coverage">{t.coverage}</p>
    <div className="monster-tools">
      <label className="monster-search">{t.search}<input type="search" value={filters.search} onChange={e => update('search', e.target.value)} /></label>
      <label>{t.style}<select value={filters.style} onChange={e => update('style', e.target.value)}><option value="">{t.all}</option>{(['Melee', 'Ranged', 'Magic'] as const).map(s => <option key={s} value={s}>{t[s]}</option>)}</select></label>
      <label>{t.area}<select value={filters.area} onChange={e => update('area', e.target.value)}><option value="">{t.all}</option>{populatedAreas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
      <label>{t.status}<select value={filters.availability} onChange={e => update('availability', e.target.value)}><option value="">{t.all}</option>{(['unconfirmed', 'conditional', 'locked'] as const).map(s => <option key={s} value={s}>{t[s]}</option>)}</select></label>
      <label>{t.sort}<select value={filters.sort} onChange={e => update('sort', e.target.value as 'name' | 'hp')}><option value="name">{t.name}</option><option value="hp">{t.hp}</option></select></label>
    </div>
    <div className="monster-results" aria-live="polite"><span>{rows.length} / {catalog.definitionCount} {t.count}</span><button onClick={() => { setFilters(defaultMonsterFilters); setLimit(24); }}>{t.reset}</button></div>
    <p className="monster-note">{t.statusNote}</p>
    <div className="monster-list">{rows.slice(0, limit).map(m => <MonsterCard key={m.id} monster={m} lang={lang} />)}</div>
    {rows.length === 0 && <p className="monster-empty">{t.empty}</p>}
    {rows.length > limit && <button className="monster-more" onClick={() => setLimit(n => n + 24)}>{t.more} ({Math.min(24, rows.length - limit)})</button>}
  </section>;
}

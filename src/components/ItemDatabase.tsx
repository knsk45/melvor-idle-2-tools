import { useEffect, useState } from 'react';
import { itemCatalog } from '../domain/itemCatalog';
import { defaultItemFilters, itemFiltersFromUrl, itemFiltersToHash, selectItems, type ItemFilters, type ItemRecord, type ItemSource } from '../domain/items';
import { shortId } from '../domain/monsters';
import { itemMessages } from '../i18n/items';
import './monsters.css';
import './items.css';

type Lang = 'en' | 'ru';
const skillName = (id: string, names: Record<string, string>) => names[id] ?? id.charAt(0).toUpperCase() + id.slice(1);

function SourceRow({ s, lang, skillNames }: { s: ItemSource; lang: Lang; skillNames: Record<string, string> }) {
  const t = itemMessages[lang];
  const f = (n: number | null | undefined, digits = 4) => n == null || !Number.isFinite(n) ? '—' : new Intl.NumberFormat(lang, { maximumFractionDigits: digits }).format(n);
  const pct = (p: number | null) => p == null ? '—' : f(p * 100, 5) + '%';
  const status = (a: string) => t[a as 'locked' | 'conditional' | 'unconfirmed' | 'demo'] ?? a;
  if (s.kind === 'monster') return <tr className={s.availability === 'locked' ? 'unavailable' : ''}>
    <th scope="row"><a href="#monsters">{s.sourceName}</a><small>{s.areas.join(' · ')}</small></th>
    <td>{t.monsterKind}<small>{s.group === 'fixed' ? t.fixed : t.table + ' ' + s.group.split('-')[1]}</small></td>
    <td>{pct(s.probability)}<small>{t.perKill}</small></td>
    <td>{s.min === s.max ? f(s.min) : `${f(s.min)}–${f(s.max)}`}</td>
    <td>—</td>
    <td><small className="content-status">{status(s.availability)}</small></td>
  </tr>;
  return <tr className={s.availability === 'demo' ? '' : 'unavailable'}>
    <th scope="row"><a href={'#' + s.skill}>{s.sourceName}</a><small>{s.requiredLevel == null ? '' : t.level + ' ' + s.requiredLevel}</small></th>
    <td>{skillName(s.skill, skillNames)}<small>{s.basis}</small></td>
    <td>{pct(s.probability)}<small>{t.perAction}</small></td>
    <td>{f(s.quantity)}</td>
    <td>{f(s.itemsPerHour, 2)}</td>
    <td><small className="content-status">{status(s.availability)}</small></td>
  </tr>;
}

function ItemCard({ item: i, lang, skillNames }: { item: ItemRecord; lang: Lang; skillNames: Record<string, string> }) {
  const t = itemMessages[lang];
  const f = (n: number | null | undefined) => n == null ? '—' : new Intl.NumberFormat(lang).format(n);
  const price = i.sellsFor ? `${f(i.sellsFor.Quantity)} ${shortId(i.sellsFor.Currency) === 'GoldPieces' ? 'GP' : shortId(i.sellsFor.Currency)}` : '—';
  const monsters = new Set(i.sources.filter(s => s.kind === 'monster').map(s => s.sourceId)).size;
  const skills = [...new Set(i.sources.flatMap(s => s.kind === 'skill' ? [skillName(s.skill, skillNames)] : []))];
  const summary = [monsters ? `${monsters} × ${t.monsterKind}` : '', ...skills].filter(Boolean).join(' · ');
  return <details className="monster-card item-card">
    <summary><span className="monster-name">{i.name}<small className="monster-status">{shortId(i.id)}</small></span>
      <span className="monster-hp">{price}</span>
      <span className="monster-style">{t.sources}: {i.sources.length}</span>
      <span className="monster-place">{summary || t.none}</span>
      <span className="monster-expand">+</span>
    </summary>
    <div className="monster-body">
      <section><h3>{t.basics}</h3><dl className="monster-stats">
        <div><dt>{t.id}</dt><dd>{i.id}</dd></div>
        <div><dt>{t.plural}</dt><dd>{i.plural ?? '—'}</dd></div>
        <div><dt>{t.sellsFor}</dt><dd>{price}</dd></div>
        <div><dt>{t.completion}</dt><dd>{i.ignoreCompletion == null ? '—' : i.ignoreCompletion ? t.no : t.yes}</dd></div>
      </dl></section>
      <section><h3>{t.sources}</h3>{i.sources.length ? <div className="table-wrap" tabIndex={0} role="region" aria-label={i.name + ' ' + t.sources}><table><caption>{i.name} · {t.sources}</caption>
        <thead><tr>{[t.sourceName, t.kind, t.chance, t.quantity, t.rate, t.status].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
        <tbody>{i.sources.map((s, n) => <SourceRow key={s.sourceId + n} s={s} lang={lang} skillNames={skillNames} />)}</tbody></table></div>
        : <p>{t.noSources}</p>}
        <p className="monster-note">{t.sourceNote}</p>
      </section>
    </div>
  </details>;
}

export default function ItemDatabase({ lang, skillNames }: { lang: Lang; skillNames: Record<string, string> }) {
  const t = itemMessages[lang];
  const fromUrl = () => itemFiltersFromUrl(window.location.hash, window.location.search, itemCatalog.skills);
  const [filters, setFilters] = useState<ItemFilters>(fromUrl);
  // Keep the address shareable without adding a history entry per keystroke; replaceState fires no hashchange.
  useEffect(() => {
    const hash = itemFiltersToHash(filters);
    if (window.location.hash !== hash || window.location.search) window.history.replaceState(null, '', window.location.pathname + hash);
  }, [filters]);
  useEffect(() => {
    const handle = () => { if (window.location.hash.startsWith('#items')) { setFilters(fromUrl()); setLimit(24); } };
    window.addEventListener('hashchange', handle);
    return () => window.removeEventListener('hashchange', handle);
  }, []);
  const [limit, setLimit] = useState(24);
  const update = <K extends keyof ItemFilters>(key: K, value: ItemFilters[K]) => { setFilters(s => ({ ...s, [key]: value })); setLimit(24); };
  const rows = selectItems(itemCatalog.rows, filters);
  return <section className="monster-database item-database" aria-label={t.title}>
    <p className="monster-coverage">{t.coverage}</p>
    <div className="monster-tools item-tools">
      <label className="monster-search">{t.search}<input type="search" value={filters.search} onChange={e => update('search', e.target.value)} /></label>
      <label>{t.source}<select value={filters.source} onChange={e => update('source', e.target.value)}><option value="">{t.all}</option><option value="monster">{t.monster}</option>{itemCatalog.skills.map(s => <option key={s} value={s}>{skillName(s, skillNames)}</option>)}<option value="none">{t.none}</option></select></label>
      <label>{t.sort}<select value={filters.sort} onChange={e => update('sort', e.target.value as ItemFilters['sort'])}><option value="name">{t.name}</option><option value="value">{t.value}</option><option value="sources">{t.sourceCount}</option></select></label>
    </div>
    <div className="monster-results" aria-live="polite"><span>{rows.length} / {itemCatalog.rows.length} {t.count}</span><button onClick={() => { setFilters(defaultItemFilters); setLimit(24); }}>{t.reset}</button></div>
    <div className="monster-list">{rows.slice(0, limit).map(i => <ItemCard key={i.id} item={i} lang={lang} skillNames={skillNames} />)}</div>
    {rows.length === 0 && <p className="monster-empty">{t.empty}</p>}
    {rows.length > limit && <button className="monster-more" onClick={() => setLimit(n => n + 24)}>{t.more} ({Math.min(24, rows.length - limit)})</button>}
    <p className="monster-note">{itemCatalog.channel} · {itemCatalog.gameVersion} · {itemCatalog.steamBuildId} · {itemCatalog.checkedAt} · SHA-256 {itemCatalog.packageSha256}</p>
  </section>;
}

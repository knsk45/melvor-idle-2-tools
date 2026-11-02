import type { MonsterCatalog } from './monsters';
import type { ActionRow, SkillTable } from './reference';

export interface SellValue { Currency: string; Quantity: number }
export interface CatalogItem { id: string; name: string; plural: string | null; sellsFor: SellValue | null; ignoreCompletion: boolean | null }

/** A per-kill enemy drop. Probability already includes its table chance; separate tables are independent rolls. */
export interface MonsterSource {
  kind: 'monster'; sourceId: string; sourceName: string; availability: string; areas: string[];
  probability: number | null; min: number | null; max: number | null; group: string;
}
/** A product of one skill action, as published in the fixed skill tables (no modifiers). */
export interface SkillSource {
  kind: 'skill'; skill: string; sourceId: string; sourceName: string; availability: ActionRow['availability'];
  requiredLevel: number | null; basis: string; role: string;
  probability: number | null; quantity: number | null; itemsPerHour: number | null;
}
export type ItemSource = MonsterSource | SkillSource;
export interface ItemRecord extends CatalogItem { sources: ItemSource[] }
export interface ItemCatalog { rows: ItemRecord[]; skills: string[] }

export interface ItemFilters { search: string; source: string; sort: 'name' | 'value' | 'sources' }
export const defaultItemFilters: ItemFilters = { search: '', source: '', sort: 'name' };

/**
 * Joins the item registry with sources that are already committed elsewhere: enemy drop tables and
 * fixed skill-table products. Nothing is derived beyond what those sources state.
 */
export function buildItemCatalog({ items, monsters, tables }: {
  items: CatalogItem[]; monsters: Pick<MonsterCatalog, 'rows' | 'areas'>; tables: SkillTable[];
}): ItemCatalog {
  const sources = new Map<string, ItemSource[]>();
  const add = (id: string, s: ItemSource) => { const list = sources.get(id); if (list) list.push(s); else sources.set(id, [s]); };
  const areaNames = new Map(monsters.areas.map(a => [a.id, a.name]));
  for (const m of monsters.rows) for (const d of m.drops) add(d.id, {
    kind: 'monster', sourceId: m.id, sourceName: m.name, availability: m.availability,
    areas: m.areas.map(a => areaNames.get(a) ?? a), probability: d.probability, min: d.min, max: d.max, group: d.group,
  });
  for (const table of tables) for (const row of table.rows) for (const p of row.products) add(p.id, {
    kind: 'skill', skill: table.id, sourceId: row.gameId, sourceName: row.name, availability: row.availability,
    requiredLevel: row.requiredLevel, basis: p.basis, role: p.role,
    probability: p.probability, quantity: p.quantity, itemsPerHour: p.itemsPerHour,
  });
  return {
    rows: items.map(i => ({ ...i, sources: sources.get(i.id) ?? [] })),
    skills: [...new Set(tables.filter(t => t.rows.some(r => r.products.length)).map(t => t.id))].sort(),
  };
}

const matchesSource = (item: ItemRecord, source: string) =>
  !source ? true : source === 'none' ? item.sources.length === 0
    : source === 'monster' ? item.sources.some(s => s.kind === 'monster')
      : item.sources.some(s => s.kind === 'skill' && s.skill === source);

export function selectItems(rows: ItemRecord[], filters: ItemFilters): ItemRecord[] {
  const query = filters.search.trim().toLocaleLowerCase();
  const value = (i: ItemRecord) => i.sellsFor?.Quantity ?? null;
  return rows.filter(i => matchesSource(i, filters.source) &&
    (!query || [i.name, i.id, ...i.sources.map(s => s.sourceName)].join(' ').toLocaleLowerCase().includes(query)))
    .sort((a, b) => {
      if (filters.sort === 'value' && value(a) !== value(b)) {
        const av = value(a), bv = value(b);
        return av === null ? 1 : bv === null ? -1 : bv - av;
      }
      if (filters.sort === 'sources' && a.sources.length !== b.sources.length) return b.sources.length - a.sources.length;
      return a.name.localeCompare(b.name, 'en');
    });
}

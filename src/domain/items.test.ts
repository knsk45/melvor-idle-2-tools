import { describe, expect, it } from 'vitest';
import { buildItemCatalog, defaultItemFilters, itemFiltersFromUrl, itemFiltersToHash, selectItems, type ItemRecord } from './items';
import type { MonsterCatalog } from './monsters';
import type { SkillTable } from './reference';
import { itemCatalog } from './itemCatalog';

const find = (id: string) => itemCatalog.rows.find(i => i.id === 'MelvorBase:' + id)!;

describe('Item registry built from committed catalogs', () => {
  it('keeps every one of the 664 item records with name, plural and sale value', () => {
    expect(itemCatalog.rows).toHaveLength(664);
    expect(new Set(itemCatalog.rows.map(i => i.id)).size).toBe(664);
    expect(itemCatalog.packageSha256).toBe('2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474');
    expect(find('NormalLog')).toMatchObject({ name: 'Normal Log', plural: 'Normal Logs', sellsFor: { Currency: 'MelvorBase:GoldPieces', Quantity: 3 } });
  });

  it('links monster drops with their per-kill probability, quantity range and roll group', () => {
    const stone = find('Stone').sources.find(s => s.kind === 'monster' && s.sourceId === 'MelvorBase:Golbin');
    expect(stone).toMatchObject({ kind: 'monster', sourceName: 'Golbin', probability: 15 / 23, min: 1, max: 1, group: 'table-1' });
    expect(stone?.kind === 'monster' && stone.areas).toContain('Golbin Forest');
    const bone = find('Bone').sources.find(s => s.sourceId === 'MelvorBase:Golbin');
    expect(bone).toMatchObject({ probability: 1, group: 'fixed' });
  });

  it('links skill actions with per-action probability, mean quantity and base rate per hour', () => {
    const shrimp = find('RawShrimp').sources.find(s => s.kind === 'skill' && s.sourceId === 'MelvorBase:ShallowPools');
    expect(shrimp).toMatchObject({ kind: 'skill', skill: 'fishing', sourceName: 'Shallow Pools', probability: 0.8, quantity: 1, itemsPerHour: 480, availability: 'demo', basis: 'fishing action' });
    expect(find('BaitBox').sources.some(s => s.kind === 'skill' && s.basis === 'first successful special roll')).toBe(true);
  });

  it('keeps items without a known source and never invents one', () => {
    const fists = find('DefaultWeapon');
    expect(fists.sources).toEqual([]);
    expect(itemCatalog.rows.filter(i => i.sources.length > 0)).toHaveLength(507);
  });

  it('keeps unknown probability as null instead of zero', () => {
    const items = [{ id: 'X:A', name: 'A', plural: 'As', sellsFor: null, ignoreCompletion: false }];
    const monsters = { rows: [{ id: 'X:M', name: 'M', availability: 'locked', areas: [], drops: [{ id: 'X:A', name: 'A', min: 1, max: 2, probability: null, group: 'table-1', sellsFor: null }] }], areas: [] } as unknown as MonsterCatalog;
    const catalog = buildItemCatalog({ items, monsters, tables: [] as SkillTable[] });
    expect(catalog.rows[0].sources[0]).toMatchObject({ probability: null, min: 1, max: 2 });
  });
});

describe('Item browsing', () => {
  it('searches item names, IDs and source names case-insensitively', () => {
    expect(selectItems(itemCatalog.rows, { ...defaultItemFilters, search: ' normal LOG ' }).map(i => i.id)).toContain('MelvorBase:NormalLog');
    expect(selectItems(itemCatalog.rows, { ...defaultItemFilters, search: 'golbin' }).map(i => i.id)).toContain('MelvorBase:Stone');
    expect(selectItems(itemCatalog.rows, { ...defaultItemFilters, search: 'no such item fixture' })).toEqual([]);
  });

  it('filters by source kind, including items with no known source', () => {
    const fromMonsters = selectItems(itemCatalog.rows, { ...defaultItemFilters, source: 'monster' });
    fromMonsters.forEach(i => expect(i.sources.some(s => s.kind === 'monster')).toBe(true));
    const fishing = selectItems(itemCatalog.rows, { ...defaultItemFilters, source: 'fishing' });
    expect(fishing.map(i => i.id)).toContain('MelvorBase:RawShrimp');
    fishing.forEach(i => expect(i.sources.some(s => s.kind === 'skill' && s.skill === 'fishing')).toBe(true));
    const none = selectItems(itemCatalog.rows, { ...defaultItemFilters, source: 'none' });
    expect(none).toHaveLength(664 - 507);
  });

  it('sorts by sale value with unknown values last, without mutating the catalog', () => {
    const original = itemCatalog.rows.map(i => i.id);
    const rows: ItemRecord[] = [
      { ...find('Stone'), id: 'unknown', sellsFor: null },
      { ...find('Stone'), id: 'cheap', sellsFor: { Currency: 'MelvorBase:GoldPieces', Quantity: 1 } },
      { ...find('Stone'), id: 'dear', sellsFor: { Currency: 'MelvorBase:GoldPieces', Quantity: 9 } },
    ];
    expect(selectItems(rows, { ...defaultItemFilters, sort: 'value' }).map(i => i.id)).toEqual(['dear', 'cheap', 'unknown']);
    expect(itemCatalog.rows.map(i => i.id)).toEqual(original);
  });
});

describe('Item query in the page URL', () => {
  const skills = ['fishing', 'mining'];
  it('reads search, source and order from the hash query', () => {
    expect(itemFiltersFromUrl('#items?q=raw%20shrimp&source=fishing&sort=value', '', skills))
      .toEqual({ search: 'raw shrimp', source: 'fishing', sort: 'value' });
    expect(itemFiltersFromUrl('#items?q=stone+sword', '', skills).search).toBe('stone sword');
  });
  it('also accepts an ordinary ?q= query before the hash', () => {
    expect(itemFiltersFromUrl('#items', '?q=bone&source=monster', skills)).toEqual({ ...defaultItemFilters, search: 'bone', source: 'monster' });
    expect(itemFiltersFromUrl('#items?q=stone', '?q=bone', skills).search).toBe('stone');
  });
  it('ignores unknown sources and orders instead of producing an empty or broken list', () => {
    expect(itemFiltersFromUrl('#items?source=cheating&sort=random', '', skills)).toEqual(defaultItemFilters);
    expect(itemFiltersFromUrl('#items?source=none', '', skills).source).toBe('none');
    expect(itemFiltersFromUrl('#items', '', skills)).toEqual(defaultItemFilters);
  });
  it('writes only non-default filters back to a shareable hash that reads back identically', () => {
    expect(itemFiltersToHash(defaultItemFilters)).toBe('#items');
    const filters = { search: 'raw shrimp & co', source: 'fishing', sort: 'value' as const };
    const hash = itemFiltersToHash(filters);
    expect(hash).toBe('#items?q=raw+shrimp+%26+co&source=fishing&sort=value');
    expect(itemFiltersFromUrl(hash, '', skills)).toEqual(filters);
  });
});

import { describe, expect, it } from 'vitest';
import raw from '../data/monsters.json';
import { defaultMonsterFilters, selectMonsters, type MonsterCatalog } from './monsters';

const catalog = raw as unknown as MonsterCatalog;
const find = (id: string) => catalog.rows.find(m => m.id === 'MelvorBase:' + id)!;

describe('Complete pinned-build monster registry', () => {
  it('retains all 155 unique source rows with build, date and explicit availability boundaries', () => {
    expect(catalog.rows).toHaveLength(155);
    expect(catalog.definitionCount).toBe(155);
    expect(new Set(catalog.rows.map(m => m.id)).size).toBe(155);
    expect(catalog.packageSha256).toBe('2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474');
    expect(catalog.steamBuildId).toBe('26074343');
    expect(catalog.checkedAt).toBe('2026-10-27');
    expect(catalog.rows.filter(m => m.availability === 'locked')).toHaveLength(97);
    expect(catalog.rows.filter(m => m.availability === 'conditional')).toHaveLength(2);
    expect(catalog.rows.filter(m => m.availability === 'unconfirmed')).toHaveLength(56);
    catalog.rows.forEach((m, i) => {
      expect(m.sourcePointer).toBe('/Objects/Enemy/' + i);
      expect(m.baseHp).toBe(m.levels['MelvorBase:Hitpoints'] * 10);
      expect(m).not.toHaveProperty('xpPerHour');
    });
  });

  it('includes dungeon membership and resolves every monster, area, attack and passive reference', () => {
    const monsters = new Map(catalog.rows.map(m => [m.id, m]));
    const areas = new Map(catalog.areas.map(a => [a.id, a]));
    const attacks = new Set(catalog.attackDefinitions.map(a => a.id));
    const passives = new Set(catalog.passiveDefinitions.map(p => p.id));
    expect(catalog.areas).toHaveLength(67);
    expect(new Set(catalog.areas.map(a => a.id)).size).toBe(67);
    expect(find('Golbin').areas).toEqual(expect.arrayContaining(['MelvorBase:GolbinForest', 'MelvorBase:HobgolbinCamp']));
    for (const m of catalog.rows) {
      expect(m.areas.length).toBeGreaterThan(0);
      m.areas.forEach(id => expect(areas.get(id)?.enemyIds).toContain(m.id));
      m.attacks.forEach(a => expect(attacks.has(a.id)).toBe(true));
      m.passives.forEach(p => expect(passives.has(p.id)).toBe(true));
    }
    for (const area of catalog.areas) {
      area.enemyIds.forEach(id => expect(monsters.get(id)?.areas).toContain(area.id));
      area.passives?.forEach(id => expect(passives.has(id)).toBe(true));
    }
  });

  it('keeps configured weighted loot and currency ranges instead of inventing hourly rewards', () => {
    const golbin = find('Golbin');
    expect(golbin.baseHp).toBe(20);
    expect(golbin.baseStats['MelvorBase:AttackInterval']).toBe(2400);
    expect(golbin.drops.find(d => d.id === 'MelvorBase:Stone')?.probability).toBe(15 / 23);
    expect(golbin.drops.find(d => d.id === 'MelvorBase:Bone')?.probability).toBe(1);
    expect(golbin.currencies[0]).toMatchObject({ id: 'MelvorBase:GoldPieces', min: 10, max: 40 });
    for (const m of catalog.rows) for (const d of m.drops) {
      expect(d.probability === null || Number.isFinite(d.probability) && d.probability >= 0 && d.probability <= 1).toBe(true);
      expect(d.min === null || d.min >= 0).toBe(true);
      expect(d.max === null || d.min === null || d.max >= d.min).toBe(true);
    }
  });

  it('retains conditional quest gates instead of labelling them ordinary demo encounters', () => {
    expect(find('Ringleader').availability).toBe('conditional');
    expect(find('Ringleader').requirements?.[0].Type).toBe('MelvorBase:QuestStepActive');
  });
});

describe('Monster browsing', () => {
  it('searches drop and location names case-insensitively', () => {
    expect(selectMonsters(catalog, { ...defaultMonsterFilters, search: ' STONE SWORD ' }).map(m => m.id)).toContain('MelvorBase:Golbin');
    expect(selectMonsters(catalog, { ...defaultMonsterFilters, search: 'Golbin Forest' }).map(m => m.id)).toContain('MelvorBase:Golbin');
  });
  it('combines style, area and lock filters without mutating the catalog', () => {
    const original = catalog.rows.map(m => m.id);
    const rows = selectMonsters(catalog, { ...defaultMonsterFilters, style: 'Melee', area: 'MelvorBase:GolbinForest', availability: 'unconfirmed' });
    expect(rows.map(m => m.id)).toContain('MelvorBase:Golbin');
    rows.forEach(m => { expect(m.styles).toContain('Melee'); expect(m.areas).toContain('MelvorBase:GolbinForest'); expect(m.availability).toBe('unconfirmed'); });
    expect(catalog.rows.map(m => m.id)).toEqual(original);
  });
  it('supports empty results and keeps unknown HP last when sorting', () => {
    expect(selectMonsters(catalog, { ...defaultMonsterFilters, search: 'no such monster fixture' })).toEqual([]);
    const small = { ...catalog, rows: [{ ...find('Golbin'), id: 'unknown', baseHp: null }, { ...find('Golbin'), id: 'known' }] };
    expect(selectMonsters(small, { ...defaultMonsterFilters, sort: 'hp' }).map(m => m.id)).toEqual(['known', 'unknown']);
  });
});

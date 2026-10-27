export interface Requirement { Type: string; Data: Record<string, unknown> }
export interface MonsterDrop {
  id: string; name: string; min: number | null; max: number | null;
  probability: number | null; group: string;
  sellsFor: { Currency: string; Quantity: number } | null;
}
export interface Monster {
  id: string; name: string; sourcePointer: string; baseHp: number | null;
  levels: Record<string, number>; baseStats: Record<string, number>;
  powerRatings: { DamageType: string; Value: number }[] | null;
  protectionRatings: { DamageType: string; Value: number }[] | null;
  damageType: string | null; element: string | null;
  stances: { id: string; name: string; style: string; weight: number | null }[];
  styles: string[]; areas: string[]; availability: 'locked' | 'conditional' | 'unconfirmed';
  requirements: Requirement[] | null; displayRequirements: Requirement[] | null;
  drops: MonsterDrop[]; currencies: { id: string; name: string; min: number | null; max: number | null }[];
  dropDefinitionKnown: boolean;
  attacks: { id: string; name: string; chance: number | null }[];
  passives: { id: string; name: string }[];
}
export interface MonsterArea {
  id: string; name: string; kind: string; difficulty: string | null; enemyIds: string[];
  requirements: Requirement[] | null; displayRequirements: Requirement[] | null;
  passives: string[] | null; effect: unknown; sourcePointer: string;
}
export interface MonsterCatalog {
  gameVersion: string; steamBuildId: string; channel: string; checkedAt: string;
  packageSha256: string; definitionCount: number; rows: Monster[]; areas: MonsterArea[];
  attackDefinitions: { id: string; sourcePointer: string; data: unknown }[];
  passiveDefinitions: { id: string; sourcePointer: string; data: unknown }[];
}
export interface MonsterFilters {
  search: string; style: string; area: string; availability: string; sort: 'name' | 'hp';
}
export const defaultMonsterFilters: MonsterFilters = {
  search: '', style: '', area: '', availability: '', sort: 'name',
};
export const shortId = (id: string) => id.split(':').at(-1) ?? id;
export function selectMonsters(catalog: MonsterCatalog, filters: MonsterFilters): Monster[] {
  const query = filters.search.trim().toLocaleLowerCase();
  const areas = new Map(catalog.areas.map(a => [a.id, a.name]));
  return catalog.rows.filter(r => (!filters.style || r.styles.includes(filters.style)) &&
    (!filters.area || r.areas.includes(filters.area)) &&
    (!filters.availability || r.availability === filters.availability) &&
    (!query || [r.name, r.id, ...r.drops.map(d => d.name), ...r.areas.map(a => areas.get(a) ?? a)]
      .join(' ').toLocaleLowerCase().includes(query)))
    .sort((a, b) => filters.sort === 'hp' && a.baseHp !== b.baseHp
      ? a.baseHp === null ? 1 : b.baseHp === null ? -1 : a.baseHp - b.baseHp
      : a.name.localeCompare(b.name, 'en'));
}

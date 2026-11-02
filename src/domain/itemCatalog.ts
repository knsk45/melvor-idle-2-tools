import items from '../../data/catalog/items.json';
import monsters from '../data/monsters.json';
import beastcrafting from '../data/skills/beastcrafting.json';
import cooking from '../data/skills/cooking.json';
import crafting from '../data/skills/crafting.json';
import farming from '../data/skills/farming.json';
import firemaking from '../data/skills/firemaking.json';
import fishing from '../data/skills/fishing.json';
import fletching from '../data/skills/fletching.json';
import herblore from '../data/skills/herblore.json';
import hunting from '../data/skills/hunting.json';
import mining from '../data/skills/mining.json';
import ranching from '../data/skills/ranching.json';
import runecrafting from '../data/skills/runecrafting.json';
import smithing from '../data/skills/smithing.json';
import woodcutting from '../data/skills/woodcutting.json';
import { buildItemCatalog, type CatalogItem } from './items';
import type { MonsterCatalog } from './monsters';
import type { SkillTable } from './reference';

// Joined in the browser from the existing committed catalogs, so item sources cannot drift from the
// monster database or the skill tables. Astrology and Thieving tables publish no item products yet.
const tables = [beastcrafting, cooking, crafting, farming, firemaking, fishing, fletching, herblore, hunting, mining, ranching, runecrafting, smithing, woodcutting] as unknown as SkillTable[];
const monsterCatalog = monsters as unknown as MonsterCatalog;

export const itemCatalog = {
  ...buildItemCatalog({ items: items.records as CatalogItem[], monsters: monsterCatalog, tables }),
  gameVersion: items.source.gameVersion, steamBuildId: items.source.steamBuildId, channel: items.source.channel,
  checkedAt: items.source.checkedAt, packageSha256: items.source.packageSha256,
};

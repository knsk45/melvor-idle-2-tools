# Item database

Route: `#items`. Build: demo v0.11.2-alpha.4, Steam build 26074343, package SHA-256 `2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474`.

## What it shows

- **Base information** for all 664 records of `data/catalog/items.json`: ID, name, plural, sale value and whether the item counts for completion (`ignoreCompletion`). Missing values display as unknown.
- **Sources** joined from data that is already committed and verified elsewhere — no new game data is introduced:
  - enemy drops from `src/data/monsters.json`: per-kill probability (`table chance × weight / table weight sum`, as documented in [MONSTER_DATABASE.md](MONSTER_DATABASE.md)), quantity range, roll group and the monster's locations;
  - products of the fixed skill tables in `src/data/skills`: per-action probability, mean quantity, items/hour and calculation basis, as documented in [BASE_SKILL_FORMULAS.md](BASE_SKILL_FORMULAS.md).
- Filters by source (monster drops, one skill, or no verified source), search by item name, ID or source name, and sorting by name, sale value or number of sources.

The join happens at runtime in `src/domain/itemCatalog.ts` (pure logic in `src/domain/items.ts`), so item sources cannot drift from the monster database or the skill tables.

## Limits

- 507 of 664 items currently have at least one listed source. Shops, chests/opening, quests, dungeon completion rewards, Thieving and Astrology rewards are not yet extracted; an item without a source is **not** proven unobtainable.
- Probabilities from different source types have different bases (per kill vs per action) and are never added together. Separate monster tables are independent rolls.
- Locked and conditional sources are shown and marked; they are not claims of playability. Placeholder recipes (e.g. locked Herblore) appear under `DemoPlaceholderItem` exactly as in the skill tables.
- No modifiers, drop-rate bonuses, doubling or item use are applied.

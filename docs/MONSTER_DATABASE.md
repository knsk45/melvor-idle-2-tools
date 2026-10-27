# Monster database

Checked directly on Laptop-Alia on 2026-10-27. Source: Steam demo v0.11.2-alpha.4, build 26074343; embedded `res://Data/Packages/MelvorDemo.json` at EXE offset 587290512, length 7411090. Package SHA-256: `2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474`.

## Coverage

The database contains every one of the package's 155 Enemy records, preserving source order, IDs and JSON pointers. It is complete for this registry only. It does not claim completeness for an unreleased/full game, other builds or actual demo accessibility.

- 155 monsters, all linked to at least one source location.
- 55 CombatArea and 12 Dungeon definitions retained; 43 of these explicitly reference monsters. Empty/placeholder areas are not offered as dead-end location filters.
- Dungeon formations are traversed for enemy membership; area membership is not inferred from quests, item names or matching display names.
- 109 referenced Attack and 30 referenced CombatPassive definitions, including area passives. Their structured numeric/configuration data are available under advanced disclosures.
- 97 Enemy records explicitly include DemoLocked; two have other requirements; 56 have no explicit enemy lock. The last group is **not** labelled playable. Area unlock/display requirements, effects and passives are retained independently.

No artwork, music, narrative descriptions, game binaries or saves are bundled. Monster/item/ability display names and selected configuration facts retain original identifiers. Names are not invented translations: navigation/explanations are localized, while canonical game names remain visible.

## Characteristics and drops

Levels, declared stat bonuses, power/protection ratings, stances, damage types and elements are source facts. Missing values stay null or absent and display as unknown. Base HP uses the configured style's Hitpoints level × 10, independently verified in `CharacterStats.ComputeBaseMaxHitpoints` (`0x0601169e`) of DLL SHA-256 `7352a8b5fd7275a19908059398babcc643ce7e30a428e2633b936f9f191c0af5`. Base HP is not a prediction after passives, area effects or modifiers.

Fixed item ranges are shown with probability 1. For each separate item table, displayed probability is `table chance × item weight / sum(table weights)`. Table labels preserve independent roll groups; rows from multiple tables must not be normalized together. Quantity endpoints and currency ranges are retained. A zero-total-weight table yields an unknown probability. Enemy drop definitions are not dungeon completion rewards and do not promise received loot when a location suppresses drops or inventory is full. Item use, opening, doubling and costs are excluded.

Declared attack chances are not final hit chances. Empty explicit attack lists do not prove an enemy cannot attack. Advanced attack/effect definitions are retained without claiming all their dynamic semantics are interpreted. No player-dependent damage, chance-to-win, XP/hour, kill/hour or training recommendations are generated.

## Reproduction

`scripts/extract_monsters.py` reads the original EXE without executing game code, verifies the package hash and prints normalized JSON. `scripts/import_monsters.py` validates that output and generates `src/data/monsters.json`:

```sh
python scripts/extract_monsters.py --exe PATH_TO_EXE --checked-at YYYY-MM-DD | python scripts/import_monsters.py
```

Python 3.11+ is sufficient. Execution may be split across Laptop-Alia and CT111 using the existing SSH channel: only the normalized JSON crosses the connection. Different package hashes are rejected. Do not commit game files or private extraction tools.

## Product behavior

The database is the default route (`#monsters`). Search includes monster IDs/names, locations and drop names; filters combine style, location and explicit enemy lock class. Sorting is by name or base HP, with unknown HP last. Initially 24 records are shown, with incremental loading through all 155. Details are collapsed by default.

Combat skill calculations are postponed by the owner as of 2026-10-27. The previous Golbin worked example is retained in source history/code but disconnected from the product UI. Existing non-combat reference tables remain available.

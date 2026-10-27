# Verified combat base facts

Product update, 2026-10-27: combat calculations are on hold at the owner's request. The Golbin worked-example implementation below is retained as historical evidence but disconnected from the interface. Use the [monster database](MONSTER_DATABASE.md) for the current product.

Checked directly on Laptop-Alia on 2026-10-27, Steam demo `0.11.2-alpha.4`, build `26074343`.

- Package SHA-256: `2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474`.
- DLL SHA-256: `7352a8b5fd7275a19908059398babcc643ce7e30a428e2633b936f9f191c0af5`.
- JSON resource: `res://Data/Packages/MelvorDemo.json`, offset 587290512, length 7411090 in the installed EXE.

Both hashes were checked against source bytes during this extraction. The digest in the earlier targeted audit was mistyped; it must not replace this measured package digest. Absence of a standalone PCK does not imply absence of package data: it is embedded in the EXE.

## Selected source facts

`data/catalog/combat-base.json` contains five enemy records from Golbin Forest, Stone Sword equipment/weapon capabilities and the Stab stance. Each record has a JSON pointer. Enemy records preserve levels, base stat bonuses, power/protection ratings, requirements and reward definitions; these are not final derived character stats. Empty requirement arrays are not proof that an arbitrary player can access an area.

Reproduce on a machine with the pinned installation and Python 3.11+:

```sh
python scripts/extract_combat_facts.py --exe PATH_TO_EXE --dll PATH_TO_DLL --checked-at YYYY-MM-DD
```

The extractor reads game files and prints selected JSON to stdout. It rejects different package or DLL hashes. No assembly is loaded into the CLR. The resource offset is build-specific.

## Recovered method bodies

REA's 64 MiB metadata limit was bypassed using the existing independent dnfile/dncil reader on Laptop-Alia. This is static CIL decoding, not successful REA decompilation. Fresh method-body evidence is stored privately in `_work/combat-direct-20261027/method-bodies.json`; source files and readers remain on the laptop.

| DLL method token | Method | Recovered rule |
| --- | --- | --- |
| `0x0600c5d5` | `TargetCharacterStats.ComputeHitChance` | If accuracy A is below stance evasion E: A/(2E); otherwise 1−E/(2A); add flat hit chance, then clamp to [0,1]. |
| `0x0600cfb4` | `StrengthBonusMaxHitFormula.ComputeMaxHit` | floor(22 + L + (L+17)×B/64), where L is the configured level-ratio result and B the configured strength bonus. |
| `0x06011690` | `CharacterStats.ComputeBaseAccuracyRating` | floor((L+9)×(B+64)), using stance/style dependencies. |
| `0x06011697` | `CharacterStats.ComputeBaseAttackInterval` | Integer conversion of the style's attack-interval stat. |
| `0x06011698` | `CharacterStats.ModifyAttackInterval` | max(250, floor(base×(1+percent)+flat)), in milliseconds. |
| `0x0601169e` | `CharacterStats.ComputeBaseMaxHitpoints` | Configured Hitpoints level ×10. |
| `0x060116a9`, `0x060116ab` | Base/final armour computation | max(0, integer conversion of the configured armour stat). |

`src/domain/combat.ts` implements only the no-modifier forms of five of these rules. Undefined 0/0 hit chance returns null. Invalid inputs return null instead of manufacturing rates. These helpers do not calculate final combat stats in the presence of modifiers, triangle effects or state.

Regression fixtures: the selected Stone Sword has attack interval 2700 ms, Stab bonus 13 and melee strength bonus 12. Evaluating just the recovered base expressions at level 1 gives accuracy 770 and maximum hit 26. Golbin's Hitpoints level 2 gives base HP 20. These isolated expressions do not establish a playable level-1 combat scenario or expected damage.

## Experience and timing

Stab's package record grants Attack experience-per-damage 0.4 and Hitpoints experience-per-damage 0.133. The stored same-DLL CIL for `CombatExperienceComponent.PlayerAttackedHandler` (`0x06010846`) checks miss status and positive health damage, multiplies damage by the configured XP stat, then calls AddRawXp. `EnemyKilledHandler` (`0x06010845`) processes a separate bonus-killed-XP list. Damage experience and kill bonuses must not be conflated.

The stored same-DLL CIL for `StartSpawning` (`0x0600c7fe`) starts a separate timer from `CombatActionStats.SpawnInterval`. `EnemyDiedHandler` (`0x0600c807`) queues spawning; `SpawnNext` (`0x0600c808`) starts the next spawn. These bodies were inspected directly from the retained laptop evidence; a numerical spawn interval has not yet been derived.

## Golbin worked example

The Attack section now contains a fixed worked example, marked ◇, rather than a verified hourly table. Its generated artifact is `src/data/combat/golbin.json`; regenerate it with `python3 scripts/build_golbin_reference.py`. English and Russian UI text explicitly describes the scope. The existing count of 16 hourly/table-backed skill sections is unchanged.

The scenario freezes Attack and Strength at level 1, uses Stone Sword, Stab and no other equipment or modifiers. These are illustrative inputs, not a player's save or a claim about starting equipment. Golbin has 20 base HP and Stab evasion 680. Player accuracy is 770, giving hit chance 43/77 (55.8441558442%).

Additional method bodies decoded directly on 2026-10-27:

| Token | Method | Verified behavior |
| --- | --- | --- |
| `0x06011711` | `EvasionRatingStats.ComputeEvasionRating` | floor((configured level+9)×(stance defence bonus+64)). |
| `0x0600c5ed`, `0x0600c5ee` | `ResistanceStats.ComputeResistance`, constructor | No-modifier resistance is protection/(attacker power+protection), capped at 0.7; constructor establishes argument bindings. |
| `0x06011681` | `CharacterStats.ComputeMinHit` | No-modifier minimum is 1, clamped to [1,max hit]. |
| `0x0600cb33`, `0x0600cd92`, `0x0600cd93` | Damage roll and NormalDamage bounds | Inclusive integer draw between minimum and maximum; bounds are truncated percentage-scaled MinHit/MaxHit. |
| `0x0600cd8d` | `NormalDamageFormula.get_HasMinimum` | Returns true, confirming that NormalDamage uses the random range rather than a fixed maximum. |
| `0x06001868` | `Xoshiro256StarStarRandom.NextInclusiveInt32` | Inclusive endpoints. |
| `0x0601150b`, `0x06011502` | Modify/PerformAttack | Resistance before armour; final damage is truncated with a minimum of 1, then applied to target health. |
| `0x0601158c` | `CharacterHealth.Damage` | Actual damage is min(modified damage, remaining HP). |
| `0x060116b8` | `CharacterStats.ComputeCriticalHitChance` | No-modifier critical chance is zero. |
| `0x060104f7`, `0x060104f9` | Combat loot kill handler and ProvideDrops | Per-kill fixed items, weighted item tables and fixed currency ranges; available inventory/wallet capacity matters. |
| `0x0600c7f4`, `0x0600c842` | Combat initialization and spawn interval | Base spawn is 3000 ms; modifiers apply separately. |

Stone Sword Normal power is 56 and Golbin Normal protection is 1. Thus resistance is 1/57. Uniform raw damage 1–26 becomes final damage 1 twice as often as each value 2–25. Ignoring enemy retaliation, the exact expectation is about 3.907468803 outgoing attack attempts to remove 20 HP. It is not 20 divided by average damage: that shortcut omits overkill and miss effects.

The generator uses rational arithmetic, with `E(0)=0` and `E(h)=1/p + sum(P(d)×E(max(0,h−d)))` for this positive-damage distribution. The domain implementation also handles zero-damage self-loops. Regression tests compare the independent implementations and cover certain-hit, miss, zero-damage, overkill and invalid distributions.

For a completed kill without enemy healing, damage XP is 20×0.4 = 8 Attack XP and 20×0.133 = 2.66 Hitpoints XP. Rewards are one Bone, one weighted item (Stone 15/23, Shrimp 5/23, Stone Helmet 2/23, Stone Sword 1/23) and 10–40 GP. Mean direct gold is 25; mean direct-sale gross value is 27+119/23 = 32.1739130435 GP. No doubling, burial, item opening, input costs or sale automation is assumed.

Private method bodies are retained under `_work/combat-direct-20261027/`. Public files contain selected numerical facts and original explanations, not assembly dumps.

## Hourly scenario boundary

The example is an outgoing-only absorption model: it omits retaliation, healing, player survival and progression. The attack count is not a win probability or an expectation conditioned on winning a full duel. Rewards describe a completed kill, not guaranteed loot from an attempted duel. Base spawn duration alone does not determine elapsed cycle time; tick order and survival/healing policies still matter. Hourly XP, kills and GP remain null, and no hourly combat ranking or training recommendation is shown. The old `combatRates` test uses synthetic inputs and is not the model used by the example.

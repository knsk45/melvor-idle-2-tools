# Remaining skill coverage

This document defines what is and is not covered by the fixed base reference. It prevents a shipped definition, a catalog entry, or a stateful baseline from being mistaken for a universal rate.

## Current coverage

Sixteen sections have data tables in `src/data/skills`:

- Woodcutting, Fishing, Mining
- Astrology, Smithing, Crafting, Fletching, Runecrafting, Beastcrafting
- Cooking, Firemaking, Herblore placeholders
- Farming, Thieving, Hunting and Ranching

The source package is demo `v0.11.2-alpha.4`, Steam build `26074343`, package SHA-256 `2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474`, checked 2026-10-25. Table rows carry their own provenance; this summary does not replace row-level evidence.

## Pending or scenario-dependent sections

| Section | Current boundary | What is required before universal rates |
| --- | --- | --- |
| Agility | No accessible course, location, or obstacle definitions were found in the demo package. | A verified course/obstacle activity with interval, XP, costs, and conditions. |
| Attack, Strength, Defence, Hitpoints, Ranged, Magic, Prayer, Slayer | Combat model exists in `src/domain/combat.ts`, but no target/scenario rows are published. | Compatible target, style, player stats, attack interval, hit chance, XP timing, kill state, and loot evidence. |

The navigation therefore contains 25 skills, with 16 table-backed sections and 9 pending sections. Combat is a model boundary, not coverage: its formulas are tested, but the product must not invent target rows.

Update 2026-10-27: direct laptop extraction now supplies five enemy records, Stone Sword and Stab facts in `data/catalog/combat-base.json`. Eight CIL bodies were recovered with the independent static decoder, including hit chance, max hit, accuracy and interval formulas. See [verified combat base](COMBAT_VERIFIED_BASE.md). Hourly Attack remains pending until damage distribution, spawn timing, reward execution and survival are checked.

Later on 2026-10-27: Attack gained a separate Golbin worked-example view (◇) with fixed Stone Sword/Stab inputs, outgoing damage/hit-count model and per-kill rewards. More CIL bodies verify evasion, resistance, integer damage, health-damage clamping, loot execution and base spawn 3000 ms. This is not a 17th hourly rate table. Full combat-loop timing and survival remain outside the example.

## Stateful baselines already published

Hunting uses a base tracking/trapping interval and base trap success baseline. It publishes product throughput, while XP and GP remain unknown where the event state or item prices are not verified. It excludes tools, bait, equipment modifiers, trapless behavior, and rare-state branches.

Ranching uses a healthy adult with happiness 1.0, full food, and a repaired enclosure. It publishes base product quantities; XP and GP remain unknown where `XpToAdd`, state transitions, or prices are not verified. Variant, care, disease, automation, and cost effects are excluded.

These are labelled scenarios, not character settings. They must not be generalized into universal player rates.

## Completion rule

A pending section becomes ready only when its action/state model, source/build/date, compatible baseline, derived rates, and regression checks are all recorded. Otherwise the correct result is an explicit `null`, a locked row, or a documented pending status.

# Verified base skill formulas

Checked 25 October 2026 against demo **v0.11.2-alpha.4**, Steam build **26074343**. These formulas generate fixed reference data offline. The application has no character calculator or modifier inputs.

## Sources and limits

Selected numerical facts originate from `res://Data/Packages/MelvorDemo.json`, embedded in the installed `Melvor2.exe`. Each action retains its original ID and JSON pointer. Source hashes:

- Package SHA-256: `2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474`.
- EXE SHA-256: `c7249cff551d5420b7b1dd31f138cb55517e71105dc0c53e5952352c8e9bb3e4`.
- `GamesByMalcs.Melvor2.dll` SHA-256: `7352a8b5fd7275a19908059398babcc643ce7e30a428e2633b936f9f191c0af5`.

Managed methods were decoded statically using dnfile 0.18.0 and dncil 1.0.2, without loading the assembly into the CLR, executing it or changing the installation. REA managed inspection hit its 64 MiB representation limit; this is an independent static fallback, not a claim of successful REA decompilation. Tokens below are valid only for the identified DLL. Full private evidence remains outside Git under `_work/rea-20261025`, `_work/fishing-20261025` and `_work/mining-20261025`. Game code and complete packages are not bundled.

Only Woodcutting, Fishing and Mining have verified reference tables. The other 22 navigation sections remain pending. All shipped definitions can be inspected, but locked/conditional entries are labelled and excluded from the default demo list. Requirements describe progression prerequisites, not the current player's state.

## Common rates

An hour means 3,600 nominal game seconds. Long-run rate is **expected reward / expected cycle duration**, multiplied by 3,600. It is not the average of the reciprocal random durations. Display rounding does not affect stored values.

Primary items/hour counts primary outputs only. Gross GP/hour sums expected direct sale prices of all listed primary, junk and side outputs. Containers are sold unopened. It does not deduct costs or imply profit. Unknown prices propagate null; null sorts last. No equipment, buffs, doubling, downtime or offline limits are applied.

## Woodcutting

A baseline hit deals one damage. Complete cut duration = base health × base hit interval. Primary product and XP are granted on the completed cut. Per-hit drops roll at hits/hour; per-cut drops roll at cuts/hour. Expected drop quantity = roll frequency × probability × quantity.

The static `WoodcuttingActionComponent` hit/death/reward path was verified in the [extraction notes](EXTRACTED_DATA.md); the first nine ordinary actions also have [UI observations](DEMO_OBSERVATION_20261024.md). The old observation document describes an earlier calculator and modified live character; that interface is no longer present.

Normal Tree: 3 HP × 1 second = 3 seconds/cut; 1,200 logs/hour and 3,600 XP/hour. Including direct-sale side drops, gross value is **3,852 GP/hour**. Bird Nest base chance is 0.25% per hit, not the modified 0.27% observed on the character.

## Fishing

`FishingActionComponent.ActionTimerFiredHandler` (`0x06009ffd`) confirms:

1. The base FishChance roll determines fish versus one junk item.
2. A successful fish outcome selects a weighted product, probability `weight / totalWeight`; quantity is inclusive uniform between MinQuantity and MaxQuantity.
3. XP is awarded on **every action**, including junk.
4. Special drops are processed separately, sorted by ascending chance with stable ordering, stopping after the first success.

For duration bounds a,b in seconds, mean duration = `(a+b)/2`, actions/hour = `3600/meanDuration`. For fish product i, items/hour = actions/hour × FishChance × weight_i/totalWeight × `(minQuantity_i+maxQuantity_i)/2`. Junk/hour = actions/hour × `(1-FishChance)`. XP/hour = actions/hour × BaseExperience.

For ordered special chances c_i, effective probability is `c_i × product(1-c_j for earlier j)`, not simply c_i. Side quantity multiplies this effective probability. No bait, fish priority, additional roll or reroll is enabled.

Supporting method tokens: RollForSpecialItem `0x06009ffe`, chance sort selector `0x0600a01c`, RollTimerInterval `0x0600a004`, uniform RNG NextDouble `0x0600186a`, inclusive integer `0x06001868`, weighted table `0x06001856`/`0x06001855`. Tick timer rounds duration to ticks (`MSToTicks 0x06006f92`, Tick `0x06006f91`, constants initialization `0x06006f36`). The 23 packaged recipes have whole-second interval endpoints; symmetric rounding preserves their mean. No extra completion tick was found.

Both action and fishing-location requirements are checked. Seven locations are recorded in `data/catalog/fishing-locations.json`; five contain the 11 ordinary demo actions, two are demo-locked.

Examples:

- Shallow Pools: mean 6 seconds, 600 actions/hour, **4,800 XP/hour**, **480 Shrimp/hour**, 120 junk/hour and 6 Bait Boxes/hour. Direct sale totals **3,006 GP/hour**, including junk; primary item throughput is 480, not 606.
- Dock Waters: Seaweed Clump chance 0.007 is rolled before Bait Box chance 0.02. The box's effective probability is `0.02 × (1-0.007) = 0.01986`; at quantity 3 this yields **19.49890909 boxes/hour**.

## Mining

`MiningActionComponent.ActionTimerFiredHandler` (`0x06009177`) confirms a built-in progress guarantee. A hit first rolls per-hit random rewards. Then a successful base break roll p grants the primary product and XP and resets progress. A failed roll adds p to progress; reaching **0.9999** forces the same break. Without modifiers initial/reset progress is zero.

Let N be the first repeated addition of p reaching 0.9999. Expected hits per break = `sum((1-p)^k, k=0..N-1)`. Mean break duration = expected hits × base hit interval. Breaks/hour = `3600/meanBreakDuration`. Primary items/hour = breaks/hour × primary quantity; XP/hour = breaks/hour × base XP. Thus simply multiplying hits/hour by p understates throughput.

Determine N using the actual threshold, not naive ceil(1/p): p=0.3333 forces a break after three failed hits. Per-hit Geode rolls also occur on breaking hits; their rate is hits/hour × chance × quantity. Modifier-only BarItem/StoneItem/EssenceItem drops, starting prospecting, shatter, doubling and extra products are excluded. Shipped definitions alone do not imply a baseline chance for those modifier-only rewards.

Supporting tokens: AddRandomItems `0x06009178`, GetInterval `0x060091e5`, GetMinimumProspecting `0x060091e6`, GetProductChance `0x060091e7`.

Examples with 1.5-second hits:

- Stone p=0.4, N=3: expected hits 1.96; mean break 2.94 seconds; **1,224.48979592 stone/hour**, **3,673.46938776 XP/hour**, **2,448.97959184 GP/hour**.
- Clay p=0.3333, N=3: expected hits 2.11118889; **1,136.80022255 clay/hour**.
- Copper p=0.3, N=4: **947.49309120 ore/hour**, **5,684.95854718 XP/hour**. Six Geodes/hour add 168 GP/hour, giving **3,010.47927359 gross GP/hour**.
- Rune Essence grants quantity 2 per break: **2,273.60044510 primary items/hour**.

There are 27 mining definitions: 14 ordinary demo, 11 demo-locked and two conditional (Stone Debris and Sulfur). Ordinary demo interval is 1,500 ms. Six ordinary ores have base Geode chance 0.0025 per hit.

## Reproduction and verification

`scripts/build_base_reference.py` regenerates `src/data/skills/{index,woodcutting,fishing,mining}.json` and location metadata. It verifies the embedded package SHA-256 before writing selected facts. It requires only Python's standard library and the read-only installed EXE; no assembly execution is involved.

Independent derivations compared all 23 fishing actions and 14 ordinary mining actions across XP, primary items and gross GP: **111 numerical comparisons passed**. Local receipt: `_work/base-reference-cross-check.json`. Public regression tests cover reference values, content counts, source identity, sorting, null handling, item search and language-only settings. See the project log for automated and browser validation results.

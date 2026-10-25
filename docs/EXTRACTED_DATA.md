# Extracted demo data

Checked on 25 October 2026. The owner supplied the installed Steam demo. Inspection was static and read-only: no game code was executed and no installed file or save was edited during this extraction.

## Source identity

- Steam app: 5373510; build: 26074343. The in-game version v0.11.2-alpha.4 was observed on 24 October.
- Melvor2.exe: 599949344 bytes; SHA-256 `c7249cff551d5420b7b1dd31f138cb55517e71105dc0c53e5952352c8e9bb3e4`.
- PE section `pck`: file offset 109411328, size 490527888. Godot PCK v4, flags 2, file base 112, 14238 directory entries.
- Resource `res://Data/Packages/MelvorDemo.json`: absolute EXE offset 587290512, length 7411090 bytes.
- Resource MD5 `b056181fbabcaf9bab1f60bb108ed7e6` matches the PCK directory.
- Resource SHA-256 `2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474`.

The parser reads the PE section table and PCK directory, verifies entry size and MD5, and parses the selected JSON in memory. Public files contain selected structured facts, names, IDs and requirements. Game binaries, the complete game package, images, audio and game code are not distributed.

Repeated extraction reproduced woodcutting-facts.json byte for byte, SHA-256 `156e11448f236cec25809cafd79345647bafd51908959e949b3637a2c9284a1d`.

## Collected catalog

| Definition type | Count |
| --- | ---: |
| Items | 664 |
| Artisan recipes | 704 |
| Cooking recipes | 74 |
| Woodcutting recipes | 20 |
| Mining recipes | 27 |
| Fishing recipes | 23 |
| Firemaking recipes | 25 |
| Farming recipes | 49 |
| Grain Mill recipes | 6 |
| Thieving recipes | 40 |
| Herblore recipes | 152 |

Total: **1120 recipes**. See data/catalog/{items,recipes,woodcutting,manifest}.json. These are shipped definitions, not a claim that every recipe is playable in the demo. Collecting data has not implemented calculators for the other skills.

Woodcutting contains 9 ordinary definitions corroborated by UI observation, 6 with DemoLocked, and 5 with conditional DisplayRequirements. Only the 9 corroborated ordinary objects enter baseline recommendations. Original conditions remain in the catalog. Absence of DemoLocked alone does not prove playability outside those nine reviewed objects.

Oak Tree has raw Level 5 but an explicit Woodcutting Experience requirement of 10. The UI also shows 10. Availability therefore uses Requirements, not raw Level.

## Primary and side rewards

All nine primary baselines match the UI transcription: required level, health, hit interval, base XP, primary quantity and GP price. Original game IDs, JSON pointers, package SHA-256 and the check date are retained in the bundled dataset.

| Side reward | Base probability | Basis | Quantity | Sell GP |
| --- | ---: | --- | ---: | ---: |
| Bird Nest | 0.0025 | Hit | 1 | 28 |
| Stick from Flax | 0.25 | Hit | 1 | 1 |
| Stick from Ambervine | 0.5 | Hit | 1 | 1 |
| Stick from Spikemoss | 0.75 | Hit | 1 | 1 |
| Oak Tree Seed | 0.001 | Full cut | 1 | 486 |
| Willow Tree Seed | 0.0009 | Full cut | 1 | 984 |
| Teak Tree Seed | 0.0009 | Full cut | 1 | 1635 |
| Maple Tree Seed | 0.0009 | Full cut | 1 | 1673 |
| Mahogany Tree Seed | 0.0009 | Full cut | 1 | 2701 |

Bird Nest baseline chance is 0.25%, whereas the owner's modified UI showed 0.27%. The calculator uses the base value. It values direct sale of the nest, not opening its contents.

Baseline hits/h = 3600 / hit seconds; cuts/h = 3600 / full-cut seconds. Expected items/h = rolls/h × probability × quantity. Primary GP and combined GP are separate columns. Combined GP assumes direct sale of primary and listed side rewards. Unknown prices remain unknown.

Normal Tree: 9 nests/h, 252 side GP/h, 3852 combined GP/h. Oak: 0.9 seeds/h worth 437.4 GP/h, plus 252 nest GP/h, giving 6089.4 combined GP/h. Flax: 900 sticks/h plus 1800 Flax/h, giving 2700 combined GP/h. No buffs are applied.

## Managed formula evidence

GamesByMalcs.Melvor2.dll SHA-256: `7352a8b5fd7275a19908059398babcc643ce7e30a428e2633b936f9f191c0af5`.

REA recognized PE/CLI but reached its 64 MiB metadata representation budget. Retained REA evidence:

- `ev_b2eb0d4e231656b6ec4e89db0fed699ab802695dfb66dfbe413511e7a53cb755`: artifact inspection, partial.
- `ev_62dbbe2a5ac2ca934a820d1f0742cf1a9e7047bfa26e36fb460a25f7517de67f`: selected member inspection, unavailable.

This is a provider limit, not evidence that methods are absent. An independent static dnfile 0.18.0 / dncil 1.0.2 decoder supplied targeted CIL without loading the target into a CLR. This is **not** described as successful REA decompilation. Private CIL and tool results remain under _work/rea-20261025/.

Build-local anchors and authored interpretation:

- `WoodcuttingActionComponent.ActionTimerFiredHandler`, token `0x0600736f`, RVA `0x1988f8`: OnHit rolls occur before damage. Initial damage is 1. The IsDead branch grants OnCut rewards, the primary product and XP, then resets health with SetMax. This confirms per-cut XP and an OnHit roll on the finishing hit.
- `AddRandomItems`, token `0x06007370`, RVA `0x198b80`: each listed item rolls its own chance, then output doubling can multiply its quantity.
- `GetMaxHealth`, token `0x060073e7`: ceil((base health + flat health) × (1 + percent health)).
- `GetProductQuantity`, token `0x060073e8`: base quantity plus integer-converted flat quantity.
- `ModifyInterval`, token `0x060073e9`: floor((base interval in milliseconds + flat interval) × (1 + percent interval)).
- `GetItemChance`, token `0x060073e4`: (base chance + flat chance) × (1 + percent chance), with integer-converted flat quantity added separately.

For HP greater than 1, the handler checks instant cut first. Otherwise, weak spot may set damage to 3 + trunc(0.1 × max HP), then double damage may multiply it by 2. These are static branch observations. Full modifier aggregation, clamps, overgrowth effects and XP precision remain outside current calculator coverage. The UI retains a no-bonus baseline and manual effective full-cut inputs.

## Reproduction and checks

The extractor uses only Python's standard library:

~~~sh
python scripts/extract_demo_facts.py --exe "C:/Program Files (x86)/Steam/steamapps/common/Melvor Idle 2 Demo/Melvor2.exe" --output _work/demo-extract
~~~

It writes selected facts, inventory and provenance into the chosen output directory. It rejects unsupported PCK versions/flags and MD5 mismatches. Review manifest identity and availability conditions before importing another build. A new game build requires a new source identity; do not overwrite existing versioned data automatically.

`pnpm check` covers catalog counts, nine UI/file cross-checks, exact level requirements, probability validation, hit/cut reward frequency, unknown prices and baseline examples.

# Demo woodcutting observations — 24 October 2026

Primary source: the owner's running Steam demo, inspected through its UI on 24 October 2026, approximately 14:26–14:36 Asia/Krasnoyarsk. No first-game values or third-party dataset used.

Identity: window banner **Melvor Idle 2: v0.11.2-alpha.4**; read-only Steam appmanifest **5373510**, buildid **26074343**. The appmanifest identifies this installation; the in-game banner identifies the running version. No exact process-to-manifest binary attestation was performed.

## Transcribed facts

Unlock levels come from **Unlocks → Tree / Bush**. Health and 1.00-second hit intervals come from the woodcutting cards. XP comes from the explicit **Base Skill XP** tooltip, not the rounded modified number on the card. Primary quantity is the **Full Cut** reward (one item). GP is the coin value on the primary item's tooltip.

| Object | Type | Level | Health | Hit seconds | Base XP / full cut | Primary reward / full cut | Sell GP |
| --- | --- | ---: | ---: | ---: | ---: | --- | ---: |
| Normal Tree | Tree | 1 | 3 | 1 | 3 | 1 Normal Log | 3 |
| Oak Tree | Tree | 10 | 4 | 1 | 8 | 1 Oak Log | 6 |
| Willow Tree | Tree | 25 | 5 | 1 | 17 | 1 Willow Log | 17 |
| Teak Tree | Tree | 35 | 6 | 1 | 22 | 1 Teak Log | 25 |
| Maple Tree | Tree | 45 | 8 | 1 | 35 | 1 Maple Log | 33 |
| Mahogany Tree | Tree | 55 | 10 | 1 | 51 | 1 Mahogany Log | 46 |
| Flax Bush | Bush | 5 | 2 | 1 | 3 | 1 Flax | 1 |
| Ambervine Bush | Bush | 20 | 2 | 1 | 4 | 1 Ambervine Leaf | 3 |
| Spikemoss Shrub | Bush | 50 | 2 | 1 | 8 | 1 Spikemoss Leaf | 5 |

Russian names are interface translations, not a claim of official localization. Original English names are retained.

## Mechanics and calculation boundary

Guide confirms: hits reduce health; primary rewards are granted when health reaches zero; some other rewards can occur per hit. The active tree showed damage **1**. Baseline assumes exactly one damage per hit, zero bonuses, continuous cutting and immediate tree reset. Thus full-cut seconds = health × hit seconds. XP and primary quantity are evaluated per completed cut, not every hit.

A brief Normal Tree check replaced active Flax, then restored Flax. At 07:33:50.907 UTC the visible total XP was 222322 and Normal Logs89; at07:34:01.151 UTC XP222415 and Logs119. XP+93 alongside Logs+30 is consistent with XP at completion with output doubling, rather than one whole log per hit. It is a short, rounded, buffed observation, not an exact action trace or a controlled no-bonus run. The observed wall-clock progress is faster than nominal one-second game timing would predict. No speed/settings diagnosis or clock modification was attempted; nominal game time must not be presented as measured real-time throughput for this session.

## Observed character modifiers (not baseline data)

Flax modifiers: double-damage chance5%; instant-cut0%; weak-spot0%; output doubling7%; skill XP+10%, flat0; interval modifier0%, flat0. These were read, not changed. Mastery showed Apprentice Woodcutter+10%XP. No equipment, mastery, purchases, saves or clock settings were edited.

A conditional stochastic cross-check for Flax: if each hit independently deals1 or2 damage with5% double chance, expected hits at health2 =1.95. With the observed XP and output bonuses (assuming multiplicative expectation), expected full-cut XP3.3 and primary quantity1.07 imply6092.31XP/h and1975.38 primary items/h. The game's rolling panel later showed6054XP/h and1908.20Flax/h. The magnitudes agree approximately, but this is not exact validation: rolling history includes the short Normal test, chance outcomes and rounding. Bonus stacking/precision have not been fully verified, so automatic bonus application is deliberately absent from the baseline.

Sticks, seeds, feathers and other side drops are excluded from dataset rates and gross GP. Displayed per-hit percentages are character observations, not verified base drop distributions. No unsupported probabilities have been silently imported. The three bushes are included because they belong to Woodcutting in this build.

## Baseline cross-checks

Normal:3hits ×1s =3s/cut →1200logs/h,3600XP/h,3600grossGP/h;100logs =300nominal game seconds.

Mahogany:10hits ×1s =10s/cut →360logs/h,18360XP/h,16560grossGP/h.

All nine numerical expectations are asserted independently in src/domain/demo-data.test.ts. Dataset validation checks full-cut time against observed health and hit interval. The dataset covers all six trees and three bushes listed by demo Unlocks, not alpha/release or hidden unavailable content.

## Local evidence

Original screenshots are retained only in the owner's workspace under _work/demo-20261024/ (ignored by Git). No game binaries, assets or screenshots are distributed in the public repository. Authored numerical transcription is the published source record. A local SHA256 evidence manifest supports future review.

Evidence includes: guide, tree/bush levels, all nine Base Skill XP tooltips, all nine primary-item prices, cards, current modifiers, active Normal start/end and restored Flax. The date/build and field provenance are included in each JSON record through sourceRefs and this document.

# Blockers

1. REA managed analysis could identify the installed DLL as managed PE/CLI, but metadata admission stopped at the 64 MiB representation limit. The focused `inspect_managed_members` call returned `coverage=unavailable`; it did not recover CIL bodies for the selected combat types.
2. The selected package evidence contains `CombatArea` references and 198 `Attack` definitions, but not the compatible enemy records needed for HP, armour, evasion, requirements and loot.
3. No compatible weapon/equipment records were available in the selected combat evidence. Therefore weapon ID, style binding, interval, level, accuracy/damage ratings and ammo/rune consumption remain null.
4. Method names show event boundaries and candidate formula methods, but method names alone do not prove formulas, order of application, constants or timing. Those values remain null.
5. The installed directory contains no standalone `.pck`/package file discovered by the read-only inventory. The package hash is retained from the pinned static evidence and is not relabeled as an installed-file hash.
6. No full Attack scenario was created, per instruction. A row must wait for compatible enemy, weapon, player baseline and reward evidence from the same build/channel.

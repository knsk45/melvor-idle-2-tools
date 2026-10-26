# Combat static audit — 2026-10-26

## Result

Полный совместимый Attack-сценарий для справочника **не построен**. В доступном нормализованном пакете подтверждены боевые сущности, области, стили, атаки и обработчики боевого опыта, но отсутствует совместимый набор `enemy stats + weapon/equipment stats + player stats + loot table`, необходимый для численных hit chance, damage, kill time и XP/hour.

Аудит read-only: игра не запускалась, live-state не использовался, игровые файлы и репозиторий вне этой папки не изменялись. REA вызван для установленной DLL; его managed metadata provider остановился на лимите представления 64 MiB, поэтому member-level результат помечен partial/unavailable. Дополнительные текстовые method-token отчёты сохранены из ранее подготовленного статического REA/dnfile evidence того же hash-pinned пакета; это не runtime evidence.

Папка санитизирована для передачи: в ней нет EXE, DLL, PCK, игровых ресурсов, сохранений, credentials, токенов, ключей, cookies, персональных данных или необезличенных временных файлов. Абсолютный путь установки игры указан только как источник аудита; сами игровые файлы не копировались. Передача выполняется отдельной GitHub-веткой, не через `main`.

## Confirmed

- Установленная DLL — PE/CLI x86_64, SHA-256 `7352A8B5FD7275A19908059398BABCC643CE7E30A428E2633B936F9F191C0AF5`.
- EXE SHA-256: `C7249CFF551D5420B7B1DD31F138CB55517E71105DC0C53E5952352C8E9BB3E4`.
- Совместимый пакетный hash из статического evidence: `2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474`; канал/версия: `0.11.2-alpha.4`, Steam build `26074343`.
- Combat skill IDs: Attack, Strength, Defence, Hitpoints, Ranged, Magic, Prayer, Slayer. `CombatLevel` содержит соответствующие skill/entity bindings.
- В пакете 55 `CombatArea`, включая `GolbinForest`, `CorruptedFarmlands`, `GreenMangroves` и другие области. `GolbinForest` содержит enemy IDs Golbin, GolbinScout, MindGolbin, GolbinAmbusher и Hobgolbin, но сами enemy stat records в выбранном evidence отсутствуют.
- Подтверждены 3 styles: Melee, Ranged, Magic. Подтверждены 9 attack stances и 198 `Attack` definitions.
- `Normal` attack: одна avoidable hit, `NormalDamage` 100%, interval 1 (attack-definition unit; это не подтверждённый player attack interval).
- `CombatActionComponent` имеет handlers `PlayerDiedHandler` и `EnemyDiedHandler`; `CombatExperienceComponent` имеет `EnemyKilledHandler` и `PlayerAttackedHandler`.
- `OffensiveStatsContainer` имеет `UpdateHitChance`, `UpdateHitChanceEmpty`, `get_HitChanceValue`, `get_AccuracyRatingValue`, `AttackIntervalValueChangedHandler` и damage aggregation handlers.
- `CombatExperienceStats` хранит `EnemyBaseMaxHealth`, `EnemyBaseArmour`, `EnemyBaseWard`, `ExperienceGain`, `BonusKilledExperience`; `GetExperienceGain` и `ComputeFromContext` являются отдельными методами.

## Unknowns

HP/armour/evasion enemy, weapon ID/level/bonuses, player stats, final attack interval, final hit chance, damage distribution, XP constants, kill completion timing, recovery/stun timing and loot rolls are `null` in `combat-facts.json` unless directly represented above. Recipe/item definitions сами по себе не использовались как доказательство combat playability.

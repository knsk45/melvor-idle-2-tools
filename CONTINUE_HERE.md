## 27.10.2026 — публикация Golbin по поручению владельца

Владелец поручил опубликовать текущий пример для просмотра и дальнейших правок. Публикуется код Golbin, выбранные numerical facts, генераторы, тесты и актуализация документации. Игнорируемые `_work` evidence/бинарники не включаются. Локальная адаптация `AGENTS.md` для CT111 остаётся незакоммиченной. Перед push выполнен pnpm check; состояние Actions/Pages и точный commit после отправки фиксируются в родительском реестре перехода и ignored `_work/publication-golbin-20261027.json`. Страница просмотра: https://knsk45.github.io/melvor-idle-2-tools/#attack . Пример outgoing-only, survival и hourly не заявлены.

## 27.10.2026 — готовый UI-пример Golbin в Attack

По запросу «Доведи до ума на примере с первым монстром» добавлен отдельный экран Attack → Golbin. Условия фиксированы: Attack/Strength1, Stone Sword/Stab, без другой экипировки/модификаторов. Шанс43/77=55.8442%, raw damage1–26, resistance1/57, итоговый damage1–25 с двойной массой на1. Точная outgoing-only модель даёт3.907468803 попытки для снятия20HP. За завершённое убийство без лечения врага:8AttackXP,2.66HitpointsXP,25directGP и32.173913GP gross со всей прямой продажей добычи.

Эта модель не учитывает ответные удары, выживание, лечение и рост уровней; она не является прогнозом победы/скорости реальной дуэли. Часовые XP/kills/GP остаются null. Базовый spawn3000ms подтверждён `CombatActionComponent.OnDataLoaded`; один этот параметр не закрывает full-loop tick ordering. В UI пример помечен◇,16готовых таблиц не превращены в17. Новый код: `src/components/GolbinReference.tsx`, combat.css, i18n/combat.ts, domain expectedAttacksToDefeat и golbin tests; данные `src/data/combat/golbin.json` генерирует `scripts/build_golbin_reference.py` по catalog, exact rational arithmetic. Расширен read-only extractor selected rewards/area/Normal attack. CIL-evidence приватно в `_work/combat-direct-20261027/`.

Проверки: pnpm check через pinned11.25.0 —36tests/lint/tsc/build passed. Генерация дважды с одинаковым SHA2563979a4cb3b392e66aa470d423b64dffb528607c0a4680dabba1f6c18ddadb71b. Browser EN/RU, раскрытие damage table, desktop1440 и mobile390: documentWidth390/viewport390, таблица drops прокручивается внутри, открытые evidence/hashes не ломают ширину. Сайт не публиковался, commit/push нет. Следующее для реальных hourly combat rates — полный цикл с retaliation/survival/healing/tick ordering; для per-kill reference UI уже готов.

## 27.10.2026 — прямой доступ к исходникам и combat base

CT111 напрямую читает Laptop-Alia через SSH; доступны `laptop-projects`, `laptop-terminal`, `laptop-codex` и MCP `laptop_rea`. Для анализа больше не нужны пересылки промптов через пользователя. Ноутбук должен быть включён и доступен в LAN. Канонический checkout продукта остаётся `/home/codex/projects/melvor-idle-2-tools`; ноутбук — источник game files и частных инструментов. Не запускать второй publisher.

Непосредственно прочитан embedded JSON из EXE (offset 587290512, length 7411090), package SHA совпал с `2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474`. DLL SHA `7352a8b5fd7275a19908059398babcc643ce7e30a428e2633b936f9f191c0af5` и Steam appmanifest build `26074343` проверены. Найдены 155 Enemy records; выбранные пять Golbin Forest, Stone Sword и Stab извлечены в `data/catalog/combat-base.json`. Воспроизводимый read-only extractor — `scripts/extract_combat_facts.py`.

Свежий независимый dnfile/dncil разбор на ноутбуке восстановил восемь CIL bodies, включая hit chance, accuracy, max hit, attack interval и HP. Пять base-функций добавлены в domain и проверены на source fixtures. Это не REA decompilation: его 64 MiB limit сохраняется. Приватные CIL сохранены в ignored `_work/combat-direct-20261027/method-bodies.json`. Подробная методика и tokens — `docs/COMBAT_VERIFIED_BASE.md`.

`pnpm check` через pinned npm exec прошёл: ESLint, 31 тест, TypeScript, production build. Attack hourly table ещё не добавлена: следующие проверки — stance evasion, фактическое распределение/округление урона и overkill, исполнение drop rolls, SpawnInterval/ticks и survival/food policy фиксированного сценария. Проверка сохранённых CIL показала отдельный spawn timer; старый `combatRates` — синтетическая арифметика, не verified модель игрового цикла. Commit/push/deploy не выполнялись.

## 26.10.2026 — перенос рабочей папки

По поручению пользователя весь каталог `/home/codex/projects/workspace/melvor-idle-2-tools` перемещён в `/home/codex/projects/melvor-idle-2-tools` через rename без копирования и удаления содержимого. Сохранены `.git`, скрытые и игнорируемые файлы, исходное незакоммиченное изменение AGENTS.md. Ветка main, HEAD 7525be4 (feat: add combat rate model). Старого каталога нет. Продолжать работу из нового пути; родительские инструкции — `/home/codex/projects/AGENTS.md`. Общий контекст и реестр перехода остаются в `/home/codex/projects/workspace/00_Контекст/`. Commit/push и публикация не выполнялись. Изменён только контекст переноса; код не менялся. Проверены сохранение inode каталога и доступ к Git из новой папки.

# Продолжение Melvor Idle 2 Tools

25.10.2026, Asia/Krasnoyarsk. Репозиторий: https://github.com/knsk45/melvor-idle-2-tools, public/main. Перед работой читать AGENTS.md, README.md и последнюю запись PROJECT_LOG.md.

Текущий продукт — справочник базовой эффективности, без калькулятора персонажа. Нет ручных числовых параметров, целей, уровней пользователя и модификаторов. Есть выбор навыка, поиск, сортировки XP/основные предметы/выручка за час, фильтр demo/all. English default, RU переключается. Только язык сохраняется в localStorage schema 2.

Готовы Woodcutting/Fishing/Mining и одиннадцать новых статических таблиц: Astrology, Smithing, Crafting, Fletching, Runecrafting, Beastcrafting, Cooking, Firemaking, Herblore, Farming, Thieving. Herblore содержит только locked placeholder definitions и не считается playable. Farming использует healthy-plot baseline; Thieving — unlock-level baseline с базовым stun. Все 25 навыков сборки присутствуют в навигации; Agility, Hunting, Ranching и боевые навыки ещё требуют проверки механик. Не объявлять их реализованными. Модификаторы — отдельная будущая статья.

Источник demo v0.11.2-alpha.4, Steam build26074343. Пакет SHA256 2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474. Публичные факты data/catalog, фиксированные таблицы src/data/skills, повторяемый генератор scripts/build_base_reference.py. Формулы и статические method-token якоря: docs/BASE_SKILL_FORMULAS.md. Старые UI наблюдения сохранены data/observations; их описание калькулятора историческое.

Рыбалка: XP за каждый цикл, включая мусор; веса/количество рыбы, специальные награды до первого успеха. Mining: базовый progress до гарантированного break, XP только за break, geode за удар. Выручка включает прямую продажу побочных наград, без вскрытия и расходов. Частные CIL/инструменты/независимая сверка111чисел — ignored _work/{fishing-20261025,mining-20261025,rea-20261025,base-reference-cross-check.json}. REA упёрлась в64MiB; использован независимый статический dnfile/dncil, без запуска игровой сборки.

Команды: pnpm dev; pnpm check. URL http://127.0.0.1:5173/melvor-idle-2-tools/ . Последние результаты проверок и итоговый commit — PROJECT_LOG.md и родительский реестр перехода. Source base d8990f84b465946cd1eff3a89ad92a67653d1ea9.

Pages опубликован: https://knsk45.github.io/melvor-idle-2-tools/ . Пользователь 25.10.2026 разрешил публикацию и дальнейшие обновления main после pnpm check; pages.yml теперь запускается по push main и вручную. Серверы/расписания/сохранения/установленные игровые файлы не менялись. Devserver зависит от процесса временного ноутбука. Для возврата fetch main, Node22.12+/pnpm11; приватную evidence при необходимости переносить отдельно, секреты не копировать. Следующее — реализовать следующие навыки с проверкой формул.

## 26.10.2026 — актуализация покрытия и оставшихся сценариев

По поручению владельца синхронизированы README/README.ru, ROADMAP и BASE_SKILL_FORMULAS с фактическим состоянием checkout. В `src/data/skills` есть 16 таблиц: Woodcutting, Fishing, Mining, Astrology, Smithing, Crafting, Fletching, Runecrafting, Beastcrafting, Cooking, Firemaking, Herblore locked placeholders, Farming, Thieving, Hunting и Ranching. Оставшиеся 9 из 25 — Agility и восемь боевых навыков; combat domain model существует, но target/scenario rows не публикуются без verified inputs.

Добавлен `docs/REMAINING_SKILLS_STATUS.md` с границами Agility/combat и описанием state-dependent baseline Hunting/Ranching. Расширен план отдельной статьи о модификаторах: evidence contract, классификация эффектов, разделение base/state/build и запрет вывода неизвестных stacking rules. Игровые файлы, серверы и Pages не менялись.

Проверка: `pnpm check` через `npm exec --yes pnpm@11.25.0 -- check` — lockfile policy success, ESLint success, 28 Vitest tests passed, TypeScript и Vite production build success. Системный Corepack напрямую не использован из-за `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`; права выполнения восстановлены только у уже существующего игнорируемого `node_modules`-бинарника esbuild. Следующее — при отдельном поручении либо собрать доказательства для Agility/combat, либо продолжить редакционную статью модификаторов; не превращать baseline в калькулятор.

## 26.10.2026 — аудит combat источников

По поручению владельца выполнен адресный аудит доступных локальных источников для Attack. В checkout сохранены только `src/data/skills/index.json` и доменная модель `src/domain/combat.ts` с тестом; combat package/catalog с целями, оружием, стилями, hit chance, XP timing и loot не сохранён. Каталоги предметов/рецептов не доказывают боевую доступность. Attack и остальные боевые навыки оставлены pending; искусственные target rows не добавлялись. Результат и требуемые входы записаны в `docs/COMBAT_TABLE_DESIGN.md` и `docs/SOURCES.md`.

Следующий реальный шаг — отдельное read-only извлечение из совместимого игрового package/DLL с SHA, channel/build, method provenance и датой; без такого источника расширять combat UI нельзя.

## 26.10.2026 — импорт combat evidence из GitHub

Из ветки `audit/combat-evidence-20261026` репозитория `knsk45/melvor-idle-2-tools` в локальный ignored `_work/combat-audit-20261026/` перенесены только sanitized audit-файлы: README, manifest, combat-facts, methods, blockers и два raw text/JSON отчёта. Игровые бинарники, сохранения, credentials и ключи не переносились.

При локальной проверке обнаружено, что опубликованный `manifest.json` имел синтаксическую ошибку: в массиве `sourceAndLimits.limitations` отсутствовала закрывающая `]`. Исправлена только локальная копия; GitHub-ветка не изменялась. Все четыре JSON-файла локально разбираются, `git diff --check` проходит. Методы и данные подтверждают область/стили/атаки, но не дают совместимого enemy + weapon + player + loot набора для Attack.

Из новой ветки `audit/combat-targeted-20261026` импортированы 10 targeted evidence-файлов в ignored `_work/combat-audit-20261026-targeted/`. Все JSON локально разбираются. Targeted audit подтверждает тот же blocker: REA coverage unavailable на 64 MiB, а полного enemy + weapon + player + rewards набора нет; Attack scenario остаётся unavailable.

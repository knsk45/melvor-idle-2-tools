# Журнал проекта

## 27.10.2026 — полный справочник монстров вместо боевых расчётов

После просмотра Golbin владелец отложил боевые навыки и поручил полную базу монстров. App больше не открывает GolbinReference; combat sections помечены отложенными. Исходники сохранены для истории. Добавлен отдельный lazy-loaded `#monsters`, он же default/home route: все155Enemy pinned demo, search/drop/location,style/location/explicitlock filters,sortname/baseHP,24карточки с paginationдо155, раскрываемые stats/locations/loot/abilities/source. EN/RU, базовые значения без персонажа.

Новый read-only scripts/extract_monsters.py прочитал embedded JSON на Laptop-Alia, проверив packageSHA. scripts/import_monsters.py сгенерировал src/data/monsters.json.155uniqueIDs,155местами,55CombatArea+12Dungeon,43явно содержатmonsters;109Attack и30CombatPassive definitions.97locked/2conditional/56noexplicitlock, без утверждений оplayability. Dungeon membership не потерян. HPlevel×10 имеет CIL-anchor, raw bonuses/lootgroups/currency/requirements сохранены; нет изображений/бинарников/сюжета. Методика docs/MONSTER_DATABASE.md. Новые domain/filter/sourceintegritytests7; предыдущие таблицы сохранены.

Первый полныйcheck43tests/lint/tsc/build прошёл. Браузер: поискGolbin6результатов, карточкаGolbin20HP/2.4s,5drop rows иDungeonHobgolbinCamp;RU;mobile390documentWidth390;Showmoreдо155;Attackpaused/oldexampleabsent;Woodcutting9rowsсохранены. Передпубликацией выполняется итоговыйcheck. Livecommit/runreceiptпослеdeploy в родительскомреестре и ignored_work/publication-monsters-20261027.json. Игровыефайлы/сохранения/productionслужбы не менялись.

## 27.10.2026 — публикация для просмотра владельцем

По явному поручению владельца подготовлены commit/pushmain и штатный Pages deploy текущего Golbin example вместе с проверенными source facts/формулами/генераторами/тестами и документацией. pnpm check повторён непосредственно перед отправкой:36tests/lint/tsc/build. Старые незакоммиченные рабочие правки сохранены; локальный AGENTS.md CT111 не включается. Бинарники, credentials и ignored_work не публикуются. Точный SHA, Actions result и live asset verification сохраняются после отправки в родительский Реестр перехода и ignored_work/publication-golbin-20261027.json. URL просмотра https://knsk45.github.io/melvor-idle-2-tools/#attack .

## 27.10.2026 — Golbin как законченный per-kill пример

Добавлен отдельный UI Attack/Golbin с фиксированными Stone Sword/Stab и Attack/Strength1. На Laptop-Alia независимо восстановлены CIL evasion/resistance/NormalDamage minimum+maximum+HasMinimum, actual HP damage clamping, crit baseline, per-kill loot execution и default spawn3000ms. Evidence остаётся ignored `_work/combat-direct-20261027/`. Full target code не исполнялся.

Расширен catalog выбранными reward prices/Normal attack/area; добавлены reproducible `scripts/build_golbin_reference.py` (rational recurrence), `src/data/combat/golbin.json`, domain expectedAttacksToDefeat,5regression tests, компонент/стили и EN/RU. UI отличает пример◇ от16rate tables. Outgoing benchmark:55.8442%hit,3.907468803attempts/20HP; per completed kill8AttackXP,2.66HPXP,25directGP/32.173913grossGP. Overkill не добавляетXP, final damage не uniform1–25: mass on1 вдвое больше. Hourly остаётсяnull; retaliation/survival/healing/progression/full-loop timing не моделируются. Никакой win-probability/training recommendation не заявлено.

Проверки: полный pnpm check (pinned11.25.0 через npm exec) —36tests,ESLint,tsc,Vitebuild passed. Generator повторён, SHA2563979a4cb3b392e66aa470d423b64dffb528607c0a4680dabba1f6c18ddadb71b совпал; Python syntax/JSON/diffcheck прошли. Браузер: desktop1440, EN/RU, damage disclosure; mobile390x844, bodyWidth390, internal drop-table scroll739/360 и source hashes wrap. Игровые файлы/production/сохранения не менялись, push/deploy нет. Devserver только loopback5173; временный отдельный Chromium использован для проверки. Следующее — full-loop модель для hourly либо расширение per-kill references по отдельному поручению.

## 27.10.2026 — combat base напрямую с Laptop-Alia

По запросу владельца продолжена разработка с прямым SSH-доступом. Установленный EXE прочитан на ноутбуке, package SHA проверен; DLL SHA и Steam appmanifest build26074343 совпали с pinned demo0.11.2-alpha.4. В полном пакете есть 155 Enemy records: прежнее отсутствие enemy/weapon относилось только к неполным переданным выборкам. Добавлены авторский `scripts/extract_combat_facts.py` и выбранные source facts `data/catalog/combat-base.json` (пять Golbin Forest enemies, Stone Sword и Stab, pointers/requirements/drops).

Независимый dnfile/dncil-reader на ноутбуке прочитал восемь адресных CIL bodies без CLR/runtime; приватная evidence `_work/combat-direct-20261027/method-bodies.json`. В `src/domain/combat.ts` добавлены base accuracy/hit chance/max hit/interval/HP functions; `combat-base.test.ts` содержит source fixtures и branch/invalid-input checks. Токены/формулы/границы описаны в `docs/COMBAT_VERIFIED_BASE.md`, обновлены README и coverage/design docs. Game binaries не переносились, игровых файлов/сохранений/служб не меняли.

Полный `pnpm check` через pinned pnpm11.25.0 прошёл: lint, 31 тест, TypeScript, Vite build; предупреждение large bundle сохраняется. Python syntax/catalog JSON и git diff --check проверены. Hourly Attack остаётся pending: надо проверить evasion, damage distribution/overkill, drop-roll execution, spawn timing/ticks и survival. Доступ к исходникам больше не blocker. Commit/push/deploy не выполнялись; предыдущие незакоммиченные изменения сохранены.

## 24.10.2026 — создание и подготовка

Запрос: подготовить отдельную папку, создать melvor-idle-2-tools в GitHub, прочитать handoff и подготовить проект.

Создан новый Git checkout main в папке melvor-idle-2-tools рабочего корня. Новый public remote knsk45/melvor-idle-2-tools создан через авторизованный браузер; ранее git ls-remote возвращал Repository not found, после создания доступен пустой remote. Локальный автор коммитов настроен только в этом repo на knsk45 с GitHub noreply email. Не создавались credentials/ключи.

Источник требований: C:\Users\ashes\Downloads\MELVOR_IDLE_2_CODEX_HANDOFF.md, прочитан по прямому запросу, скопирован в docs/CODEX_HANDOFF.md. SHA256 исходного файла: 8F91A5CA8EBABE76AA2A1B105AB0BD91980459DFDE19E7C8B80BB5383A26BD4D. В копию добавлен текущий статус; исходник не изменялся. Это новый проект; базового commit и исторических AGENTS/журналов на G: нет. Общий CONTINUE_HERE.md отсутствует, создан проектный.

Новые файлы: React/TypeScript/Vite приложение (src/App.tsx, components/NumberField.tsx, style.css, main.tsx), domain/calculations.ts/settings.ts и 33 теста, JSON источников и пустой набор деревьев, RU/EN, package.json/lockfile/конфигурация, README RU/EN, CONTRIBUTING, LICENSE MIT, AGENTS, docs/SOURCES/METHODOLOGY/ROADMAP/CODEX_HANDOFF, CI, ручной Pages workflow, Issue/PR templates, CONTINUE_HERE/PROJECT_LOG. Служебные scaffold-скрипты удалены до коммита. Собственный код создан с нуля, сторонний игровой код/ресурсы не копировались.

Проверены официальные Steam и новость о демо от19.10.2026; параметров рубки не подтверждают. Расхождение 21/22 навыка в новости задокументировано, не использовано. Игровая база пустая, фиктивного победителя нет. Ручной режим не участвует в рекомендациях. Введённые пользователем эффективные значения трактуются без неподтверждённого bonus stacking.

Проверки: pnpm check прошёл (lint,33 Vitest,tsc,Vite build). Браузер: вложенный URL доступен; синтетический ручной ввод4с/10XP/2items/5GP дал9000XP/h,1800items/h,9000GP/h,100items~200сек; reload сохранил значения; RU/EN; мобильная ширина390px без горизонтального переполнения всей страницы (375/375 с учётом scrollbar), desktop1440px. После проверки settings сброшены. Пустая таблица сохраняет горизонтальный scroll внутри контейнера. Unit-тесты проверяют нулевые/неизвестные/невалидные поля, интервалы, время цели, совместимость/доступность, источники/ID и recovery настроек. Таблица на реальных данных пока не проверена: набор пуст.

Установка pnpm11 первоначально проигнорировала store-dir из .npmrc и записала package cache в стандартный LocalAppData/pnpm/store/v11. Это отклонение от рабочей границы обнаружено и сообщено владельцу. Конфигурация исправлена через pnpm-workspace.yaml (storeDir внутри проекта), install повторён с явным --store-dir .pnpm-store; esbuild postinstall разрешён адресно. Внешний кэш не чистили и не меняли вручную. Все дальнейшие рабочие результаты внутри проекта; секреты/G: не трогали. Для воспроизводимости зафиксированы pnpm lockfile и packageManager.

Серверов/служб/расписаний не меняли. Pages не включали и deploy не запускали. Локальный dev-сервер на127.0.0.1:5173 оставлен для просмотра; зависит от процесса на ноутбуке. Откат нового проекта — обычный revert коммита; чужая база отсутствует.

Осталось: проверенные игровые данные с точным build/channel/источником и бонусами, приёмка таблицы на них; затем отдельно порученная публикация. Для возврата fetch/clone main и перенос родительских журналов; node_modules/dist/store заново получить, GCM/ключи не копировать.

### GitHub и проверка CI
Исходный commit0f07b46a7dc985b95741089d96e31ff55337abd2 отправлен вmain, совпадение HEAD/ls-remote проверено. Первый Actions run40073334413 выявил конфигурационный конфликт: pnpm/action-setup явно version11 и packageManager11.25.0. Убрано дублирование из обоих workflow, единственный pin — package.json. Локальный frozen install и pnpm store path подтвердили актуальный store внутри проекта. Последующий результат CI фиксируется отдельно.

### Итог подготовки
Исправленный CI run40073431458 на1a001e6 завершёнsuccess. Дополнительно отображение неизвестного времени цели защищено отNaN: показывается «—». После этой правки повторно прошёл полный pnpm check(33tests/lint/tsc/build). Код/документация отправляются вmain; реальный игровой набор по-прежнему пуст. Локальный checkout сверяется сorigin/main по завершении. Публичный Pages не запускался.

## 25.10.2026 — получение данных из файлов демо

Запрос: получить из установленного Melvor Idle 2 Demo данные для наполнения ресурса; продолжить сбор. Завершено также начатое24.10 заполнение девяти строк по UI и уточнение English default / Russian switch. База до правок: main9a796b77ad9633e67d71e65c30feffd496a9c4ee. Ранее незафиксированные изменения принадлежали этой же работе и сохранены.

Источники только для чтения: предоставленная папка Steam, Melvor2.exe и GamesByMalcs.Melvor2.dll; appmanifest5373510 с build26074343. EXE SHA256c7249cff551d5420b7b1dd31f138cb55517e71105dc0c53e5952352c8e9bb3e4, DLL7352a8b5fd7275a19908059398babcc643ce7e30a428e2633b936f9f191c0af5. Найден PE-раздел pck/PCKv4 с plaintext JSON res://Data/Packages/MelvorDemo.json, offset587290512/length7411090, MD5b056181fbabcaf9bab1f60bb108ed7e6 сверен, SHA2562b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474. Полный игровой пакет/ассеты не сохранялись в проект.

Собраны data/catalog/{items,recipes,woodcutting,manifest}.json и README:664предмета,1120рецептов десяти типов. Все20Woodcutting классифицированы:9обычных,6DemoLocked,5сусловиямипоказа. В src/data/woodcutting.json только9UI-проверенных, исходныеid/JSONpointer/packageSHAдобавлены, все прежние базовые поля совпали. Oak rawLevel5 не подменяет requirement10. Другие навыки пока каталог, не готовые калькуляторы.

Добавлены исходные вероятности/цены побочных наград, domain/woodcutting.ts, компонентSideDrops, отдельный общийGPи сортировка по нему. OnHit/OnCut различены; BirdNest0.0025/hit, Stick0.25/0.5/0.75, seeds0.001/0.0009percut;гнёздаоцениваютсяпрямойпродажей. Английский default и основнойREADME, русский переключается. Данные/формулы/описанияисточниковобновлены. Новые tests:demo-data/package-data; полныйcheck59Vitest/lint/tsc/buildпрошёл.

REA artifact/member inspection остановилась по64MiB representation budget, evidence ev_b2eb0d4e231656b6ec4e89db0fed699ab802695dfb66dfbe413511e7a53cb755 и ev_62dbbe2a5ac2ca934a820d1f0742cf1a9e7047bfa26e36fb460a25f7517de67f сохраненыв_work/rea-20261025/evidence. Не объявлятьуспешнуюREAдекомпиляцию. Независимые dnfile0.18.0/dncil1.0.2/pefile2024.8.26 установлены только в _work/rea-20261025/tools/python;pipcache/TEMPвнутрипроекта. Статические адресныеCILдекодировки без загрузки сборки вCLR подтвердили OnHitпередуроном и Product/XPтолькоприIsDead,ceilHP/floorintervalипорядокinstant/weak/double. Подробныеякоряиограничениявdocs/EXTRACTED_DATA.md. Анализаторнативнойцели неоткрывался.

Для независимого вопроса формата пакета использованподагентпопрямомуworkflowнавыкаREA;результатыпровереныосновным исполнителем. Воспроизводимыйscripts/extract_demo_facts.pyпрочиталисточник повторно;woodcutting-factsсовпалпобайтно,SHA256156e11448f236cec25809cafd79345647bafd51908959e949b3637a2c9284a1d. Частныескриншоты24.10,CIL,инструменты/промежуточныетаблицыостаютсяignored_work,непубликуются.

Браузер25.10:обновлённаятаблицадевятистрок,сортировкаобщейGPдаётMahogany→Teak→Maple;NormalраскрываетBirdNest0.25%/hit,9items/h,252GP/h,общая3852GP/h. СтараявкладказастряланастраницеERR_CONNECTION_REFUSEDпослеостановкивчерашнегосервера;pnpmdevперезапущен,HTTP200подтверждён,свежаяIABвкладкаработает. Никакихзащит/профилейсетінеменяли.

Серверы/расписания/учётные данные/G: не менялись. В установленной игре/сохранениях/процессе25.10правокнет;краткоеUIнаблюдение24.10сNormal→Flaxописаноотдельно. Pagesнепубликовался. Локальныйdevserver127.0.0.1:5173зависитотпроцесса. Измененияготовятсякcommit/pushmain,итоговыйSHAзаписанвреестреперехода. Следующее: выбратьследующийнавык,проверитьегоформулы/доступность;расширенныебонусы/overgrowthпоканепокрыты. Длявозвратаfetchmain,перенести_work/свидетельствапринадобности,Node22.12+/pnpm11;секретынекопировать.

## 25.10.2026 — базовый справочник вместо калькулятора; Fishing и Mining

Запрос: добавить рыбалку и добычу руды по собранным данным, проверить игровые формулы, сохранить в GitHub; убрать калькулятор, оставить базовую эффективность и отдельные разделы навыков. Source base main d8990f84b465946cd1eff3a89ad92a67653d1ea9.

Результат: калькулятор и его ручные параметры/уровни персонажа/цели/компоненты/старые тесты удалены. Браузер получает фиксированные показатели из src/data/skills; только поиск, выбор навыка, scope demo/all, сортировки XP/primary items/gross GP за игровой час и язык EN/RU. Сохраняется только язык schema2, старые calc-настройки игнорируются. Все25 реальных навыков сборки есть в навигации, но готовы только3: Woodcutting20/9demo, Fishing23/11demo, Mining27/14demo; остальные22 явно ожидают проверки. Условные/заблокированные действия исключены по умолчанию.

Формулы сверены адресным статическим CIL: Fishing XP на каждом цикле включая мусор, взвешенная рыба/равномерное количество, special rolls по возрастанию шанса до первого успеха. Mining учитывает progress до0.9999, XP и основную добычу только за break, per-hit Geode на всех ударах. Modifier-only bar/stone/essence не добавлены. Подробные SHA/method tokens/примеры/границы: docs/BASE_SKILL_FORMULAS.md. REA64MiB limitation сохраняется; это независимый dnfile/dncil разбор без исполнения сборки. Частные материалы _work/fishing-20261025 и _work/mining-20261025; опубликованы только выбранные факты и авторское объяснение.

Новые/изменённые: scripts/build_base_reference.py (повторяемая генерация с pinned package SHA), src/data/skills/*.json, data/catalog/fishing-locations.json, src/domain/reference.ts и reference.test.ts, App/style/messages/settings, README наEN/RU, AGENTS, docs методика/roadmap/статья-план модификаторов. Прежний числовой UI-снимок перемещён в data/observations/woodcutting-20261025.json. Генерация повторена: хеши всех4JSON до/после совпали. Независимая сверка всех23fishing и14обычныхmining:111числовых сравнений прошли (_work/base-reference-cross-check.json).

Проверка: pnpm check —27Vitest, ESLint, TypeScript, production build успешны. IAB: Fishing11/23demo и23/23all с явным locked; Shallow Pools480shrimp/120junk/6box и3006GP; сортировкиXP/items/gold, поискshrimp; Mining14/27, Stone2.94sec/1224.49items/3673.47XP; Cooking честно pending74defs; RU послеreload сохраняется, hashнавыка сохраняется. В узком окне636px видны мобильный select и горизонтально прокручиваемая таблица, без калькулятора; скрин _work/base-reference-mining.png. Desktop1440/390послеэтойпереработки отдельно не проверялись.

Серверы/расписания/G:/credentials не менялись. Игровые файлы/сохранения не менялись, игра не инструментировалась. Pages не публиковался. Локальный dev127.0.0.1:5173 зависит от процесса ноутбука. GitHub push/CI и итоговый commit фиксируются в родительском реестре после отправки. Следующее: по очереди проверить и наполнить22остальныхнавыка, затем отдельная статья о модификаторах. Для возврата fetchmain, Node22.12+/pnpm11; приватную evidence переносить отдельно внутри рабочей копии, секреты не копировать. Откат — обычный git revert опубликованного commit, без force/reset.

## 25.10.2026 — первая публикация Pages и разрешённые обновления

Пользователь явно поручил опубликовать Pages и продолжать последовательное добавление навыков с публикацией. Через существующий Git HTTPS/GCM доступ настроен Pages build_type=workflow, HTTPS enforced. Секрет прочитан только в памяти helper _work/github-api.ps1, не выводился/не сохранялся в документах. GitHub-коннектор не предоставляет Pages/dispatch API; использован адресный REST. Первая публикация commit1e29769e3d440e13fa453e7da36082f54927708b: build/deploy success, run40164172046. https://knsk45.github.io/melvor-idle-2-tools/ вернулHTTP200, реальныеJS/CSSпути с basepath; IAB открыл действующий справочник с тремя навыками и25разделами. Исходные локальные файлы/игра/серверы/G: не менялись.

pages.yml обновлён: push main или manual, pnpm check перед upload/deploy, PRнепубликуются; прежнее ограничение manual-only заменено актуальным поручением в AGENTS/CONTRIBUTING/README/CONTINUE/ROADMAP. Следующее — верификация остальных навыков по статическим файлам; производство/сбор/другие механики исследуются независимыми исполнителями по прямому workflow REA skill. Базовая точка1e29769; новая публикация первой версии успешна, итогworkflowcommit смотреть gitlog/родительский реестр. Откат изменений обычным revert; сайтможнопереопубликоватьпровереннымmainбезсменыcredentials. Локальныйdevсервер больше не нужен для просмотра опубликованного сайта.

## 25.10.2026 — публикация Pages и девять новых статических таблиц

Pages включён по прямому поручению владельца: `pages.yml` запускается после push в main, выполняет `pnpm check`, затем deploy. Первая публикация commit 1e29769 прошла build/deploy success; адрес https://knsk45.github.io/melvor-idle-2-tools/ проверен HTTP200 и IAB.

Добавлены проверенные таблицы Astrology, Smithing, Crafting, Fletching, Runecrafting, Beastcrafting, Cooking, Firemaking и Herblore из независимых статических разборов DLL/package. Производственные формулы и ограничения описаны в `docs/BASE_SKILL_FORMULAS.md`; `scripts/import_verified_skill_tables.py` воспроизводимо импортирует выбранные private facts. Cooking закреплён на уровне открытия рецепта; Firemaking считает независимые byproduct rolls; Herblore оставлен locked placeholder-only. Astrology сохраняет вторичные OR-условия и zero item/gold output.

Navigation: 12 готовых таблиц из 25 навыков; Agility, Farming, Hunting, Ranching, Thieving и боевые навыки ещё требуют отдельной проверки. `pnpm check`: 27 tests, lint, TypeScript и production build success. В GitHub отправляются только нормализованные факты; DLL, EXE и private evidence не публикуются.
## 25.10.2026 — Farming baseline

Продолжена очередная проверка навыков. Добавлена Farming (49 definitions, 26 ordinary demo rows) из pinned package. Формула использует healthy plot: BaseInterval + RegrowInterval × Regrows, урожай и XP амортизируются по первой полной серии harvests; disease/pest reduction, watering, compost, automation and costs явно исключены. Generated by `scripts/import_farming_reference.py`, package hash verified. App imports the fixed table and status index now has 13 ready sections.

`pnpm check` снова прошёл: 27 tests, lint, TypeScript, build. Остались Agility (в сборке нет course/location/obstacle definitions), Hunting/Ranching/Thieving и combat-dependent skills; их rates нельзя честно свести к одной universal base action without state/target/care assumptions. No game files, servers, credentials or Pages state changed in this local step; commit and Pages workflow follow after push.

## 25.10.2026 — Thieving unlock-level reference

REA-backed static CIL review added Thieving: 40 definitions, 20 ordinary demo rows. `GetSuccessChance 0x06007925` uses stealth/perception; the fixed table evaluates at each target's unlock level. Action failures can start the constructor's 2,000 ms base stun (`0x06007899`); completion XP and pickpocket rewards are staged. Weighted item throughput remains null where a universal expected item rate would require action-specific reward-state handling, while direct GP expectation is retained. `scripts/import_thieving_reference.py` verifies package SHA before generating the table.

`pnpm check` passed again (27 tests, lint, TypeScript, build). Ready sections: 14/25. Remaining audited sections: Agility has no configured activities; Hunting/Ranching require persistent animal/trap/care state; combat skills require a target, player stats and stance. No game files or external servers changed.

## 25.10.2026 — Ranching data and table design

Подготовлен нормализованный каталог 20 животных Ranching из `package-selected.json` и статической сверки REA: цена, уровень, XP, взросление, срок жизни, часовой цикл, продукты, корм, лакомства, требования питомца и варианты. Добавлены `data/catalog/ranching-base.json` и воспроизводимый `scripts/extract-ranching-base.py`.

Добавлена `docs/RANCHING_TABLE_DESIGN.md`: базовая карточка животного, отдельный сценарий здорового взрослого животного, независимые сортировки XP/ч, предметы/ч и золото/ч, раскрытие вариантов и таблица чувствительности ухода. Зафиксированы формулы счастья и производства из статического CIL; универсальные XP/ч и чистое золото/ч не заявляются без состояния и цен расходов. Игра, сохранения и серверы не менялись; публикация будет после проверки и push.

## 25.10.2026 — Ranching baseline in UI

Подключён Ranching как 15-я проверенная таблица. UI использует общий поиск, scope Demo/All и сортировки XP/ч, предметы/ч, золото/ч и уровень. В baseline отображаются 20 животных и базовые продукты на час при happiness 1.0; XP/ч и золото/ч оставлены неизвестными до декодирования state-dependent XP и цен. `pnpm check` прошёл, commit `de93682` опубликован в `main`.


## 26.10.2026 — перенос рабочей папки

По поручению пользователя весь каталог `/home/codex/projects/workspace/melvor-idle-2-tools` перемещён в `/home/codex/projects/melvor-idle-2-tools` через rename без копирования и удаления содержимого. Сохранены `.git`, скрытые и игнорируемые файлы, исходное незакоммиченное изменение AGENTS.md. Ветка main, HEAD 7525be4 (feat: add combat rate model). Старого каталога нет. Продолжать работу из нового пути; родительские инструкции — `/home/codex/projects/AGENTS.md`. Общий контекст и реестр перехода остаются в `/home/codex/projects/workspace/00_Контекст/`. Commit/push и публикация не выполнялись. Изменён только контекст переноса; код не менялся. Проверены сохранение inode каталога и доступ к Git из новой папки.

## 26.10.2026 — синхронизация покрытия и проверка

По поручению владельца выполнены все пять пунктов актуализации разработки. README/README.ru, ROADMAP и BASE_SKILL_FORMULAS приведены к фактическому состоянию: 16 таблиц из 25, девять pending/scenario-dependent. Добавлен `docs/REMAINING_SKILLS_STATUS.md`: Agility не имеет доступных course/location/obstacle definitions; восемь боевых навыков требуют target/style/player-state inputs. Combat formulas остаются протестированной моделью, без искусственных target rows.

Hunting и Ranching зафиксированы как опубликованные state-dependent baselines с ограничениями, а не как универсальные rates. План `docs/MODIFIERS_ARTICLE_PLAN.md` расширен evidence contract и структурой будущей статьи; числовые модификаторы и stacking не добавлялись.

Проверка выполнена через `npm exec --yes pnpm@11.25.0 -- check`: lockfile policy, ESLint, 28 тестов Vitest, TypeScript и Vite production build прошли успешно. Для запуска восстановлено право выполнения только у существующего игнорируемого `node_modules` бинарника esbuild; исходные файлы и lockfile не менялись. Pages, серверы, игровые файлы и credentials не затрагивались. Следующее: отдельная проверка источников для Agility/combat либо продолжение статьи о модификаторах.

## 26.10.2026 — аудит combat источников

По поручению владельца выполнен адресный read-only аудит перед реализацией Attack. В рабочем checkout нет сохранённого combat package/catalog с target definitions, weapon stats, styles, hit chance, XP timing или loot; имеются только `src/data/skills/index.json` и протестированная доменная модель `src/domain/combat.ts`. Existing item/recipe catalogs не считаются доказательством боевой playability. Attack и остальные боевые навыки оставлены pending, target rows и rates не выдумывались.

Обновлены `docs/COMBAT_TABLE_DESIGN.md` и `docs/SOURCES.md` с результатом аудита и минимальным контрактом следующего источника: package SHA, channel/build, method provenance и дата. Pages, серверы, игровые файлы и внешние отправки не затрагивались.

## 26.10.2026 — импорт combat evidence из GitHub

По поручению владельца найден и прочитан GitHub branch `audit/combat-evidence-20261026`. Sanitized evidence импортирован в ignored `_work/combat-audit-20261026/`: README, manifest, combat-facts, methods, blockers, REA summary и static source ledger. Локальная проверка подтвердила отсутствие EXE/DLL/PCK, сохранений, credentials и ключей; JSON-файлы разобраны успешно после исправления только локальной копии manifest.

В опубликованном manifest отсутствовала закрывающая `]` у `sourceAndLimits.limitations`; upstream GitHub не изменялся. Audit подтверждает CombatArea/style/Attack definitions и method tokens, но не enemy stats, weapon/equipment stats, player baseline и loot; Attack rates не добавлялись. Pages, main, серверы и внешние отправки не затрагивались.

## 26.10.2026 — импорт targeted combat evidence

Найдена и прочитана ветка `audit/combat-targeted-20261026`. В ignored `_work/combat-audit-20261026-targeted/` импортированы 10 файлов: README, manifest, enemy/weapon/player/formula/XP/loot/Attack scenario facts и methods. Все JSON локально разобраны успешно; `git diff --check` проходит. Targeted результат не закрыл blocker: REA снова ограничен 64 MiB, enemy/weapon/player/reward chain не даёт полного совместимого числового Attack scenario. Код, main, игра, серверы и внешние отправки не затрагивались.

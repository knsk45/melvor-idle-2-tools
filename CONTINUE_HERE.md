# Продолжение Melvor Idle 2 Tools

25.10.2026, Asia/Krasnoyarsk. Репозиторий: https://github.com/knsk45/melvor-idle-2-tools, public/main. Перед работой читать AGENTS.md, README.md и последнюю запись PROJECT_LOG.md.

Текущий продукт — справочник базовой эффективности, без калькулятора персонажа. Нет ручных числовых параметров, целей, уровней пользователя и модификаторов. Есть выбор навыка, поиск, сортировки XP/основные предметы/выручка за час, фильтр demo/all. English default, RU переключается. Только язык сохраняется в localStorage schema 2.

Готовы Woodcutting/Fishing/Mining и десять новых статических таблиц: Astrology, Smithing, Crafting, Fletching, Runecrafting, Beastcrafting, Cooking, Firemaking, Herblore, Farming. Herblore содержит только locked placeholder definitions и не считается playable. Farming использует явно подписанный healthy-plot baseline. Все 25 навыков сборки присутствуют в навигации; Agility, Hunting, Ranching, Thieving и боевые навыки ещё требуют проверки механик. Не объявлять их реализованными. Модификаторы — отдельная будущая статья.

Источник demo v0.11.2-alpha.4, Steam build26074343. Пакет SHA256 2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474. Публичные факты data/catalog, фиксированные таблицы src/data/skills, повторяемый генератор scripts/build_base_reference.py. Формулы и статические method-token якоря: docs/BASE_SKILL_FORMULAS.md. Старые UI наблюдения сохранены data/observations; их описание калькулятора историческое.

Рыбалка: XP за каждый цикл, включая мусор; веса/количество рыбы, специальные награды до первого успеха. Mining: базовый progress до гарантированного break, XP только за break, geode за удар. Выручка включает прямую продажу побочных наград, без вскрытия и расходов. Частные CIL/инструменты/независимая сверка111чисел — ignored _work/{fishing-20261025,mining-20261025,rea-20261025,base-reference-cross-check.json}. REA упёрлась в64MiB; использован независимый статический dnfile/dncil, без запуска игровой сборки.

Команды: pnpm dev; pnpm check. URL http://127.0.0.1:5173/melvor-idle-2-tools/ . Последние результаты проверок и итоговый commit — PROJECT_LOG.md и родительский реестр перехода. Source base d8990f84b465946cd1eff3a89ad92a67653d1ea9.

Pages опубликован: https://knsk45.github.io/melvor-idle-2-tools/ . Пользователь 25.10.2026 разрешил публикацию и дальнейшие обновления main после pnpm check; pages.yml теперь запускается по push main и вручную. Серверы/расписания/сохранения/установленные игровые файлы не менялись. Devserver зависит от процесса временного ноутбука. Для возврата fetch main, Node22.12+/pnpm11; приватную evidence при необходимости переносить отдельно, секреты не копировать. Следующее — реализовать следующие навыки с проверкой формул.

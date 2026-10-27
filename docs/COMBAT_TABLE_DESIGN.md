# Combat: модель таблицы

Актуализация 27.10.2026: исходный embedded package прочитан напрямую на Laptop-Alia, enemy/equipment records извлечены, восемь method bodies восстановлены независимым CIL-reader. Проверенные факты и формулы: [COMBAT_VERIFIED_BASE.md](COMBAT_VERIFIED_BASE.md). Исторический blocker отсутствия исходников ниже снят; полный hourly scenario ещё не подтверждён.

Далее 27.10 добавлен отдельный экран Attack → Golbin: фиксированная outgoing-only модель и per-kill награды, с явными границами и пустыми часовыми значениями. Интерфейс отмечает пример символом ◇. Это не готовая модель выживания/дуэли и не универсальный боевой рейтинг.

Боевые навыки не используют таблицу ресурсных действий. Строка сравнения должна содержать цель и стиль боя, а не только название рецепта.

Минимальный сценарий: `attackIntervalSeconds`, `hitChance`, XP за попадание, XP за убийство, среднее число попаданий на убийство и ожидаемая добыча за убийство.

Показатели выводятся независимо:

- атак/ч;
- успешных попаданий/ч;
- XP/ч;
- убийств/ч;
- предметов или золота/ч.

Формулы доменного слоя:

`attacks/h = 3600 / attackIntervalSeconds`  
`hits/h = attacks/h × hitChance`  
`kills/h = hits/h / killsPerFight`  
`XP/h = hits/h × xpOnHit + kills/h × xpOnKill`  
`loot/h = kills/h × lootPerKill`

Оружие, характеристики игрока, защитные параметры цели, расход боеприпасов и стиль боя должны быть отдельными входами сценария. Пока цели и их параметры не извлечены из файлов игры, раздел не получает искусственных строк и рейтингов.

## Audit result — 26 October 2026

The current checkout contains `src/data/skills/index.json` and the tested domain model, but no retained combat package/catalog with target definitions, weapon stats, attack styles, hit chances, XP timing, or loot tables. The available item and recipe catalogs do not establish combat playability or target rates. Attack therefore remains pending; adding a demo target row would require a new read-only source extraction with package SHA, build/channel, method provenance, and date.

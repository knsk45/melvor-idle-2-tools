# Участие / Contributing

1. Создайте Issue или PR с описанием изменения. Ошибки данных — через форму Data error.
2. Для игровых чисел укажите **Melvor Idle 2**, канал, точный build, дату, источник, активные бонусы и единицы измерения. Скриншоты должны быть вашими или разрешёнными для распространения, без персональных данных.
3. Не импортируйте данные первой игры, файлы игры или сторонние наборы без отдельной проверки лицензии. Неизвестное храните как null. Версии/каналы не смешивайте.
4. До подтверждения используйте provisional/unknown. Verified требует проверенного источника и даты. Вероятностную добычу документируйте исходными вероятностями и количеством до добавления ожидаемого значения.
5. Фиксированные показатели генерируйте в scripts/build_base_reference.py, данные — src/data/skills, тексты — src/i18n. Калькулятор персонажа не добавлять. Добавьте значимые тесты формул и пройдите pnpm check.
6. Публикация Pages разрешена владельцем 25.10.2026: push main запускает check и только затем deploy. PR не публикуются.

English: every game-data PR must include sequel identity, channel, exact build, observation date, sources, units and active bonuses. Unknown is null, not zero. Keep synthetic fixtures in tests. Run pnpm check. Do not redistribute game assets or third-party data without permission.

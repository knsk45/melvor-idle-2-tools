# Shipped numerical catalog

Source: [extraction and provenance](../../docs/EXTRACTED_DATA.md).

- items.json: 664 item IDs, names and sale values.
- recipes.json: 1120 recipes across 10 types, with requirements and availability markers.
- woodcutting.json: 20 definitions, including 6 DemoLocked and 5 conditional entries.
- manifest.json: source hashes, build identity and counts.

These are shipped definitions, not a list of playable content. Only nine Woodcutting objects currently feed the reviewed baseline UI. Other calculators remain future work. Preserve original JSON pointers and requirements when implementing them.

No game art, audio or executable code is included. The project's MIT license applies to its original code and does not claim rights over third-party game content.


25 October update: `fishing-locations.json` preserves the seven location definitions and requirements used alongside recipe gates. Fixed Woodcutting/Fishing/Mining tables and the 25-skill navigation index are generated in `src/data/skills`; see [base formulas](../../docs/BASE_SKILL_FORMULAS.md). Locked and conditional data are not default demo recommendations.

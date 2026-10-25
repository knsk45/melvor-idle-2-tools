# Reference methodology

The current product is a fixed base reference, replacing the former character calculator on 25 October 2026. Historical observation documents describe the earlier interface and are not current product instructions.

The browser reads precomputed JSON. Users can search, select a skill/content scope and sort by XP/hour, primary items/hour or gross sale GP/hour. No personal modifiers, levels or targets are accepted. Only language is persisted under settings schema 2; the old calculator settings are ignored.

Rates use expected rewards divided by expected duration in nominal game time, without intermediate display rounding. Unknown values remain null and sort last. Prices are direct gold sale values, including listed secondary rewards; containers are not opened. Costs, downtime and offline limits are outside this reference.

See [the complete formula verification](BASE_SKILL_FORMULAS.md) for mechanics, assumptions, source hashes, method tokens and examples. The offline generator `scripts/build_base_reference.py` reads the selected numerical catalog and supplemental navigation/location metadata from the installed package. It rejects a changed package SHA-256. Run `python scripts/build_base_reference.py --exe <installed-Melvor2.exe>` from the project after reviewing provenance. Python standard library only; it neither executes nor modifies game files.

Coverage: 3 verified skill tables, 25 navigation sections. Other skill sections remain pending until their reward timing, requirements and mechanics are verified. Presence in the catalog is not proof of demo availability.

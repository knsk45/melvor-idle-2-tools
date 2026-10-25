# Melvor Idle 2 Tools

Unofficial, open-source skill calculators for **Melvor Idle 2**. English is the default language; Russian is available using the language switch. No account or backend required.

## Woodcutting demo dataset

**Six trees and three bushes** have been transcribed from the running demo **v0.11.2-alpha.4**, Steam build **26074343**, checked 24 October 2026. Each row includes an observation source and exact channel/build. See [primary observations](docs/DEMO_OBSERVATION_20261024.md).

The base table uses **one damage per hit, no bonuses**. Full-cut time = tree health × hit interval. Primary items and XP are awarded per completed cut, not one whole tree every hit. Example: Normal Tree takes3seconds per cut and yields1200logs/hour,3600XP/hour and3600grossGP/hour at baseline. Side drops are excluded.

The owner's observed buffs and a conditional comparison with the game's rolling rates are documented separately. Bonus stacking is not automatically inferred. Manual mode accepts effective **full-cut** values and never modifies the baseline. Quantities and nominal time estimates are long-run expectations, not guaranteed wall-clock timings for an accelerated session.

The screen includes numeric sorting, search, level availability, exact channel/build isolation, quantity targets, RU/EN and versioned settings recovery. No first-game data is used.

## Run locally

Node.js22.12+ and pnpm11:

~~~sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
~~~

Visit http://127.0.0.1:5173/melvor-idle-2-tools/ . Checks include ESLint, Vitest, TypeScript and the production build. The package store is configured inside the project.

## Project structure

- src/data: numerical observations and sources.
- src/domain: pure calculations, data validation, settings and tests.
- src/components, src/i18n: UI components and English/Russian strings.
- docs: provenance, methodology, roadmap and original handoff.
- .github: CI, manual Pages publication, Issue and PR templates.

GitHub Pages is **not published**. The workflow is manual and main-only; first publication requires an explicit owner request. Intended URL: https://knsk45.github.io/melvor-idle-2-tools/ .

See [contributing](CONTRIBUTING.md), [methodology](docs/METHODOLOGY.md), [sources](docs/SOURCES.md), [roadmap](docs/ROADMAP.md) and [continuation](CONTINUE_HERE.md).

MIT applies to original code. Game assets, binaries and source code are not bundled. Game trademarks remain with their respective owners. Local evidence screenshots are ignored by Git.

[Русский](README.ru.md)

## 25 October 2026 — static package data

The previous UI baseline is now corroborated by the shipped package. Collected **664 items and 1120 recipe definitions** across ten types; see [extraction/provenance](docs/EXTRACTED_DATA.md) and [catalog](data/catalog/README.md). Definition presence does not establish demo availability. Of20woodcuttingdefinitions,onlythe9UI-corroboratedordinaryobjectsparticipateinrecommendations;6DemoLockedand5conditionalentriesremaincatalog-only.

Woodcuttingsidedropsnowhaveverifiedbaseprobabilitiesandprices. ThetablekeepsprimaryGP/hseparatefromGP/hincludingdirectly-soldnests,seedsandsticks. Nestsarenotopenedforvaluation. Nobonusesareautomaticallyapplied. BaseBirdNestchanceis0.25%perhit,ratherthanthemodified0.27%observedintheUI.

Thestaticextractoronlyreadsinstalledfilesandwritesintothechosenprojectoutput. Reproductionandbuildhashesareindocs/EXTRACTED_DATA.md. Englishremainsthedefault;Russianisswitchable. Pagesremainsunpublished.

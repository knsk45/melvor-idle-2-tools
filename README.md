# Melvor Idle 2 Tools

An unofficial **base skill reference** for Melvor Idle 2. English is the default; Russian is available with the language switch.

Open a skill and order actions by **XP/hour, primary items/hour or gross GP/hour**. These are fixed, precomputed expectations using unmodified game parameters. There is no character calculator, level input, quantity target or modifier configuration.

## Coverage

| Skill | Ordinary demo actions | All shipped definitions |
| --- | ---: | ---: |
| Woodcutting | 9 | 20 |
| Fishing | 11 | 23 |
| Mining | 14 | 27 |
| Astrology | 6 | 12 |
| Smithing | 100 | 206 |
| Crafting | 58 | 161 |
| Fletching | 34 | 66 |
| Runecrafting | 57 | 120 |
| Beastcrafting | 37 | 143 |
| Cooking | 36 | 74 |
| Firemaking | 11 | 25 |
| Herblore | 0 | 152 (locked placeholders) |
| Farming | 26 | 49 |
| Thieving | 20 | 40 |

Navigation includes all **25 skills** from the shipped package. Fifteen sections now have fixed tables; the remaining sections are pending verification, with no fabricated rates. Locked and conditional definitions are labelled and excluded by default. Recipe definitions do not prove playability.

Source: demo **v0.11.2-alpha.4**, Steam build **26074343**, checked 25 October 2026. Mining includes built-in prospecting progress; fishing includes junk, weighted fish and sequential special rolls. See [verified formulas](docs/BASE_SKILL_FORMULAS.md) and [extraction provenance](docs/EXTRACTED_DATA.md). Gold includes direct sale of listed drops, without opening containers or deducting costs; it is revenue, not profit. Item throughput counts primary products only.

## Run locally

Node.js 22.12+ and pnpm 11:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
```

Open http://127.0.0.1:5173/melvor-idle-2-tools/ . Checks run ESLint, Vitest, TypeScript and the production build. The package store is inside the project.

`src/data/skills` contains fixed tables; `src/domain` only handles selection, ordering and language preferences. `data/catalog` contains selected extracted facts. `scripts/build_base_reference.py` regenerates tables from those facts and the hash-pinned installed package. See [methodology](docs/METHODOLOGY.md).

Modifiers belong in a [separate future article](docs/MODIFIERS_ARTICLE_PLAN.md). See [roadmap](docs/ROADMAP.md), [contributing](CONTRIBUTING.md) and [continuation](CONTINUE_HERE.md).

Published site: https://knsk45.github.io/melvor-idle-2-tools/ . Pushes to main run checks before updating GitHub Pages; publication was authorized on 25 October 2026. MIT covers original code. Game binaries, assets and source code are not bundled.

[Русский](README.ru.md)

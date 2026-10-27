# Roadmap

## Current

- Complete source-bound monster database for the pinned demo: 155 records, locations, base characteristics, drops, declared attacks/passives and explicit lock boundaries. Default route `#monsters`.
- Combat skill calculations are on hold by owner decision (2026-10-27). The former Golbin example is disconnected from the UI. Work next on monster-reference usability/coverage, not a player calculator.

- English default and Russian switch.
- Fixed reference tables for 16 sections: Woodcutting, Fishing, Mining, Astrology, Smithing, Crafting, Fletching, Runecrafting, Beastcrafting, Cooking, Firemaking, Herblore placeholders, Farming, Thieving, Hunting and Ranching.
- Ordering by base XP/hour, primary items/hour and gross GP/hour; search and explicit content scope.
- All 25 actual skill sections in navigation; nine remain pending or scenario-dependent. Coverage status is recorded in [REMAINING_SKILLS_STATUS.md](REMAINING_SKILLS_STATUS.md).
- No character calculator, manual numeric inputs, targets or modifier settings.

## Next

Implement or explicitly close the remaining skills individually. For each: inspect reward timing, costs, requirements and random mechanics; preserve provenance; add fixed base rates and meaningful regression checks only when a compatible scenario is defined; otherwise keep the section pending and document the missing state/target inputs. Recipe count alone cannot establish coverage, especially for combat and separate activity models.

Develop a separate, source-backed modifiers article. Pages publication and continued updates were authorized on 25 October 2026. Main pushes publish after successful checks.

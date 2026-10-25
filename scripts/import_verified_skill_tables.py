"""Import independently verified static skill facts into public reference tables."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FACTS = ROOT / "_work/production-20261025/production-facts.json"
ASTRO = ROOT / "_work/other-skills-20261025/selected-facts.json"
SHA = "2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474"

def out(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf8")

def products(row):
    return [{"id": p["id"], "name": p["name"], "role": "side" if row["id"] == "NormalLog" else "primary",
             "basis": "independent product roll" if row["id"] == "NormalLog" else "completed action",
             "probability": p["probability"], "quantity": p["quantity"],
             "itemsPerHour": p["itemsPerHour"], "gpPerHour": p["gpPerHour"]} for p in row["products"]]

def convert(row, skill):
    conditions = []
    if row["requiredLevel"] is not None:
        conditions.append(f"{skill} level {row['requiredLevel']}")
    for ing in row.get("ingredients", {}).get("Items", []):
        conditions.append(f"Consumes {ing['Item'].split(':')[-1]} × {ing['Quantity']} per completed action")
    if row.get("baseline") == "at recipe unlock level":
        conditions.append("Cooking success is evaluated at this recipe's unlock level")
    notes = ["Fixed base reference; no equipment, bonuses, preservation or downtime."]
    if row["id"] == "NormalLog":
        notes.append("Firemaking lists all independent byproduct rolls; its primary-product hook is empty in this build.")
    if row.get("placeholder"):
        notes.append("Locked demo placeholder definition; not a playable potion baseline.")
    return {"id": row["id"], "gameId": "MelvorBase:" + row["id"], "name": row["name"],
            "requiredLevel": row["requiredLevel"], "availability": row["availability"],
            "conditions": conditions, "intervalSeconds": row["intervalSeconds"],
            "intervalLabel": f"{row['intervalSeconds']}s base cycle", "baseXp": row["baseXp"],
            "successChance": row["successChance"], "xpPerHour": row["xpPerHour"],
            "itemsPerHour": row["itemsPerHour"], "gpPerHour": row["gpPerHour"],
            "products": products(row), "sourcePointer": row["sourcePointer"], "notes": notes}

def table(skill, rows, method):
    return {"id": skill.lower(), "gameVersion": "0.11.2-alpha.4", "steamBuildId": "26074343",
            "packageSha256": SHA, "checkedAt": "2026-10-25", "method": method,
            "rows": rows, "notes": ["Rates are fixed offline from independently verified base facts.",
            "Ingredient consumption and gross sale value are shown; costs are not deducted."]}

def main():
    facts = json.loads(FACTS.read_text(encoding="utf8"))
    for skill, rows in facts["skills"].items():
        out(ROOT / "src/data/skills" / f"{skill.lower()}.json",
            table(skill, [convert(r, skill) for r in rows], "docs/BASE_SKILL_FORMULAS.md#artisan-production"))
    astro = json.loads(ASTRO.read_text(encoding="utf8"))["astrology"]["rows"]
    rows = []
    for r in astro:
        cond = [f"Astrology level {r['requiredLevel']}"]
        if r["secondaryRequirements"]:
            cond.append("Secondary requirement group: " + " OR ".join(
                x["Data"]["Component"]["Entity"].split(":")[-1] + " level " + str(x["Data"]["Level"])
                for x in r["secondaryRequirements"]))
        rows.append({"id": r["id"], "gameId": r["gameId"], "name": r["name"], "requiredLevel": r["requiredLevel"],
                     "availability": r["availability"], "conditions": cond,
                     "intervalSeconds": r["baseIntervalMs"] / 1000, "intervalLabel": "3s study cycle",
                     "baseXp": r["baseXp"], "successChance": 1, "xpPerHour": r["xpPerHour"],
                     "itemsPerHour": 0, "gpPerHour": 0, "products": [], "sourcePointer": r["sourcePointer"],
                     "notes": ["No constellation or global events are configured in this build; study grants XP only."]})
    out(ROOT / "src/data/skills/astrology.json", table("Astrology", rows, "docs/BASE_SKILL_FORMULAS.md#astrology"))
    index = json.loads((ROOT / "src/data/skills/index.json").read_text(encoding="utf8"))
    ready = {s.lower() for s in facts["skills"]} | {"astrology"}
    for s in index["skills"]:
        if s["id"] in ready: s["status"] = "ready"
    out(ROOT / "src/data/skills/index.json", index)
    print("imported", sorted(ready))

if __name__ == "__main__": main()

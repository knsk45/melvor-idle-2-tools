"""Create a small, publishable Ranching catalog from the inspected game package."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = root / "_work" / "gathering-20261025" / "package-selected.json"
target = root / "data" / "catalog" / "ranching-base.json"
pkg = json.loads(source.read_text(encoding="utf-8"))

def ms_to_hours(value):
    return value / 3_600_000

rows = []
for animal in pkg["RanchingAnimal"]:
    currencies = animal.get("PurchaseCosts", {}).get("Currencies", [])
    gold = next((x["Quantity"] for x in currencies if x.get("Currency") == "MelvorBase:GoldPieces"), None)
    req = next((x.get("Data", {}).get("Level") for x in animal.get("Requirements", []) if x.get("Type") == "MelvorBase:Level"), None)
    rows.append({
        "id": animal["Id"],
        "displayName": animal["DisplayName"]["Singular"],
        "unlockLevel": req,
        "purchaseGold": gold,
        "baseExperience": animal.get("BaseExperience"),
        "maturityHours": ms_to_hours(animal["BaseVariantInterval"]),
        "lifespanHours": ms_to_hours(animal["LifespanInterval"]),
        "productCycleHours": ms_to_hours(animal["ProductInterval"]),
        "products": animal.get("Products", []),
        "feed": animal.get("Eats", []),
        "treats": animal.get("Treats", []),
        "requiresPets": animal.get("RequiresPets", False),
        "variants": animal.get("Variants", []),
    })

target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps({"source": "Melvor Idle 2 Demo package-selected.json", "animals": rows}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

skill_rows = []
for row in rows:
    products = [{
        "id": p["Item"], "name": p["Item"].split(":")[-1], "role": "primary",
        "basis": "healthy adult, happiness 1.0", "probability": 1,
        "quantity": p["Quantity"], "itemsPerHour": p["Quantity"], "gpPerHour": None
    } for p in row["products"]]
    skill_rows.append({
        "id": row["id"], "gameId": "MelvorBase:" + row["id"], "name": row["displayName"],
        "requiredLevel": row["unlockLevel"], "availability": "demo", "conditions": ["Healthy adult baseline", "Full food and repaired enclosure"],
        "intervalSeconds": 3600, "intervalLabel": "1h product cycle", "baseXp": row["baseExperience"],
        "successChance": 1, "xpPerHour": None, "itemsPerHour": sum(p["Quantity"] for p in row["products"]), "gpPerHour": None,
        "products": products, "sourcePointer": "package-selected.json#/RanchingAnimal/" + row["id"],
        "notes": ["XP/ч and gold/ч require state-dependent XpToAdd and item price data; intentionally not estimated.", "Product rates are base quantities at happiness 1.0; variant and care modifiers are excluded."]
    })
skill = {"id":"ranching", "gameVersion":"0.11.2-alpha.4", "steamBuildId":"26074343", "packageSha256":"2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474", "checkedAt":"2026-10-25", "method":"docs/RANCHING_TABLE_DESIGN.md", "rows":skill_rows, "notes":["Healthy adult baseline. See Ranching table design for state formulas."]}
(root / "src" / "data" / "skills" / "ranching.json").write_text(json.dumps(skill, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

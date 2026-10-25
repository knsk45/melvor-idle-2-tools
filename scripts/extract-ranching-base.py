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

hunting_rows = []
for animal in pkg["HuntingAnimal"]:
    req = next((x.get("Data", {}).get("Level") for x in animal.get("Requirements", []) if x.get("Type") == "MelvorBase:Level" and x.get("Data", {}).get("Component", {}).get("Entity") == "MelvorBase:Hunting"), None)
    track = (animal.get("BaseMinTrackInterval", 0) + animal.get("BaseMaxTrackInterval", 0)) / 2 / 1000
    trap = (animal.get("BaseMinTrapInterval", 0) + animal.get("BaseMaxTrapInterval", 0)) / 2 / 1000
    interval = track + trap
    success = animal.get("BaseTrapSuccessChance")
    products = [{"id": p["Item"], "name": p["Item"].split(":")[-1], "role":"primary", "basis":"trap success baseline", "probability": p.get("Chance", 1) * success, "quantity":p["Quantity"], "itemsPerHour":p["Quantity"] * p.get("Chance", 1) * success * 3600 / interval, "gpPerHour":None} for p in animal.get("Products", [])]
    hunting_rows.append({"id":animal["Id"],"gameId":"MelvorBase:"+animal["Id"],"name":animal["DisplayName"],"requiredLevel":req,"availability":"demo","conditions":["Base tracking/trapping interval","Base trap success chance"],"intervalSeconds":interval,"intervalLabel":"mean tracking + trap interval","baseXp":animal.get("BaseExperience"),"successChance":success,"xpPerHour":None,"itemsPerHour":sum(p["itemsPerHour"] for p in products),"gpPerHour":None,"products":products,"sourcePointer":"package-selected.json#/HuntingAnimal/"+animal["Id"],"notes":["Baseline excludes tool, bait, trapless, rare species and equipment modifiers.","XP/ч requires the game's journal/trapping event state; it is intentionally not estimated."]})
hunting = {"id":"hunting","gameVersion":"0.11.2-alpha.4","steamBuildId":"26074343","packageSha256":"2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474","checkedAt":"2026-10-25","method":"package-selected.json HuntingAnimal baseline","rows":hunting_rows,"notes":["Baseline mean tracking + trap interval with base trap success; modifiers excluded."]}
(root / "src" / "data" / "skills" / "hunting.json").write_text(json.dumps(hunting, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

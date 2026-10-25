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

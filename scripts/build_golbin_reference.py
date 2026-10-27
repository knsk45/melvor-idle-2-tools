"""Generate a fixed per-kill Golbin example; use rational hit-count arithmetic."""
import json
from fractions import Fraction as F
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def build():
    facts = json.loads((ROOT / 'data/catalog/combat-base.json').read_text())
    assert facts['packageSha256'] == '2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474'
    assert facts['dllSha256'] == '7352a8b5fd7275a19908059398babcc643ce7e30a428e2633b936f9f191c0af5'
    enemy = next(e for e in facts['enemies'] if e['id'] == 'MelvorBase:Golbin')
    sword = next(e for e in facts['equipment'] if e['id'] == 'MelvorBase:StoneSword')
    levels = {v['Key'].split(':')[1]: v['Value'] for v in enemy['levels']}
    stats = {v['Stat'].split(':')[1]: v['Value'] for v in enemy['stats']['Stats']}
    weapon = {v['Stat'].split(':')[1]: v['Value'] for v in sword['equipment']['Stats']['Stats']}
    # Illustrative fixed levels; not a save, starting loadout or recommendation.
    attack, strength = 1, 1
    accuracy = (attack + 9) * (weapon['StabAttackBonus'] + 64)
    evasion = (levels['Defence'] + 9) * (stats['StabDefenceBonus'] + 64)
    chance = F(accuracy, 2 * evasion) if accuracy < evasion else 1 - F(evasion, 2 * accuracy)
    maximum = int(22 + strength + F((strength + 17) * weapon['MeleeStrengthBonus'], 64))
    power = next(v['Value'] for v in sword['equipment']['Stats']['PowerRatings'] if v['DamageType'] == 'MelvorBase:Normal')
    protection = next(v['Value'] for v in enemy['stats']['ProtectionRatings'] if v['DamageType'] == 'MelvorBase:Normal')
    resistance = min(F(7, 10), F(protection, power + protection))
    damage = {}
    for raw in range(1, maximum + 1):
        value = max(1, int(raw * (1 - resistance)))
        damage[value] = damage.get(value, F(0)) + F(1, maximum)
    hp = levels['Hitpoints'] * 10
    expected = [F(0)] * (hp + 1)
    for remaining in range(1, hp + 1):
        expected[remaining] = 1 / chance + sum(p * expected[max(0, remaining - d)] for d, p in damage.items())
    items = {i['id']: i for i in facts['rewardItems']}
    drops = [(i, F(1)) for i in enemy['drops']['FixedItems']]
    for table in enemy['drops']['ItemTables']:
        total = sum(i['Weight'] for i in table['Table'])
        drops.extend((i, F(str(table['Chance'])) * F(i['Weight'], total)) for i in table['Table'])
    rewards = []
    for drop, probability in drops:
        item = items[drop['Item']]
        quantity = F(drop['MinQuantity'] + drop['MaxQuantity'], 2)
        rewards.append({'id': item['id'], 'name': item['name'], 'probability': float(probability),
                        'quantity': float(quantity), 'expectedQuantity': float(probability * quantity),
                        'salePrice': item['sellsFor']['Quantity']})
    gold = sum(F(i['MinQuantity'] + i['MaxQuantity'], 2) for i in enemy['drops']['FixedCurrencies']
               if i['Currency'] == 'MelvorBase:GoldPieces')
    xp = {g['Component']['Entity'].split(':')[1]: hp * F(str(g['ExperiencePerDamage']))
          for g in facts['stances'][0]['experienceGain']}
    return {
        'id': 'golbin-stone-sword-stab', 'gameVersion': facts['gameVersion'],
        'channel': facts['channel'], 'steamBuildId': facts['steamBuildId'],
        'checkedAt': facts['checkedAt'], 'packageSha256': facts['packageSha256'],
        'dllSha256': facts['dllSha256'], 'method': 'docs/COMBAT_VERIFIED_BASE.md#golbin-worked-example',
        'sourcePointer': enemy['sourcePointer'], 'weaponSourcePointer': sword['sourcePointer'],
        'player': {'attackLevel': attack, 'strengthLevel': strength, 'weapon': 'Stone Sword',
                   'stance': 'Stab', 'otherEquipment': [], 'modifiersApplied': False},
        'enemy': {'id': enemy['id'], 'name': enemy['name'], 'hitpoints': hp,
                  'defenceLevel': levels['Defence'], 'evasionRating': evasion,
                  'armour': 0, 'ward': 0, 'protectionRating': protection},
        'offense': {'accuracyRating': accuracy, 'hitChance': float(chance),
                    'rawMinHit': 1, 'rawMaxHit': maximum, 'powerRating': power,
                    'resistance': float(resistance), 'attackIntervalMs': weapon['AttackInterval'],
                    'damageOutcomes': [{'damage': d, 'probability': float(p)} for d, p in sorted(damage.items())],
                    'expectedAttacks': float(expected[hp])},
        'perKill': {'attackXp': float(xp['Attack']), 'hitpointsXp': float(xp['Hitpoints']),
                    'directGold': float(gold), 'items': rewards,
                    'grossGold': float(gold) + sum(i['expectedQuantity'] * i['salePrice'] for i in rewards)},
        'baseSpawnIntervalMs': 3000, 'hourly': {'xp': None, 'kills': None, 'gold': None},
        'scope': 'Outgoing-only example. Enemy attacks, survival, healing and full combat-loop timing are excluded. Rewards are per completed kill, assuming sufficient inventory capacity.',
    }


if __name__ == '__main__':
    target = ROOT / 'src/data/combat/golbin.json'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(build(), indent=2, ensure_ascii=False, allow_nan=False) + '\n')
    print('Generated', target.relative_to(ROOT))

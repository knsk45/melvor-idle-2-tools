"""Read selected combat facts from the pinned demo; never execute game code.

Outputs JSON to stdout. Game binaries remain at their original locations.
"""
import argparse
import hashlib
import json

PACKAGE_SHA = '2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474'
DLL_SHA = '7352a8b5fd7275a19908059398babcc643ce7e30a428e2633b936f9f191c0af5'
ENEMIES = {'Golbin', 'GolbinScout', 'MindGolbin', 'GolbinAmbusher', 'Hobgolbin'}


def digest_file(path):
    with open(path, 'rb') as source:
        return hashlib.file_digest(source, 'sha256').hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--exe', required=True)
    parser.add_argument('--dll', required=True)
    parser.add_argument('--checked-at', required=True)
    args = parser.parse_args()
    dll_sha = digest_file(args.dll)
    if dll_sha != DLL_SHA:
        raise ValueError('DLL changed: review the new build before extraction')
    with open(args.exe, 'rb') as source:
        source.seek(587290512)
        raw = source.read(7411090)
    package_sha = hashlib.sha256(raw).hexdigest()
    if package_sha != PACKAGE_SHA:
        raise ValueError('Package changed: review the new build before extraction')
    objects = json.loads(raw)['Objects']
    enemies = []
    for index, enemy in enumerate(objects['Enemy']):
        if enemy['Id'] not in ENEMIES:
            continue
        enemies.append({
            'id': 'MelvorBase:' + enemy['Id'], 'name': enemy['DisplayName'],
            'sourcePointer': f'/Objects/Enemy/{index}',
            'levels': enemy['Levels'], 'stats': enemy['Stats'],
            'damageType': enemy['DamageType'], 'element': enemy['Element'],
            'stances': enemy['Stances'], 'drops': enemy['Drops'],
            'attacks': enemy['Attacks'], 'passives': enemy['Passives'],
            'requirements': enemy['Requirements'],
            'displayRequirements': enemy['DisplayRequirements'],
            'pauseOnSpawn': enemy['PauseOnSpawn'],
        })
    if {entry['id'].split(':')[1] for entry in enemies} != ENEMIES:
        raise ValueError('Expected Golbin Forest enemy records missing')
    equipment = []
    for index, item in enumerate(objects['Item']):
        if item['Id'] != 'StoneSword':
            continue
        equipment.append({
            'id': 'MelvorBase:' + item['Id'], 'name': item['DisplayName']['Singular'],
            'sourcePointer': f'/Objects/Item/{index}',
            'equipment': item['Capabilities']['MelvorBase:Equipment'],
            'weapon': item['Capabilities']['MelvorBase:Weapon'],
        })
    result = {
        'checkedAt': args.checked_at, 'gameVersion': '0.11.2-alpha.4',
        'channel': 'Steam demo', 'steamBuildId': '26074343',
        'packageSha256': package_sha, 'dllSha256': dll_sha,
        'method': 'scripts/extract_combat_facts.py',
        'enemies': enemies, 'equipment': equipment,
        'stances': [{'sourcePointer': f'/Objects/AttackStance/{i}',
                     'id': 'MelvorBase:' + s['Id'],
                     'combatStyle': s['CombatStyle'], 'accuracyStat': s['AccuracyStat'],
                     'evasionStat': s['EvasionStat'], 'experienceGain': s['ExperienceGain']}
                    for i, s in enumerate(objects['AttackStance']) if s['Id'] == 'Stab'],
        'scenario': {'available': False, 'xpPerHour': None, 'killsPerHour': None,
                     'gpPerHour': None,
                     'reason': 'Sustainable hourly rates require full combat-loop timing and survival; a separate outgoing-only Golbin example is available.'},
        'scope': 'Selected source facts, not a playable or universal hourly baseline.',
    }
    result['area'] = next({
        'id': 'MelvorBase:' + area['Id'],
        'sourcePointer': f'/Objects/CombatArea/{i}',
        **{key: value for key, value in area.items()
           if key in ('Enemies', 'Requirements', 'DisplayRequirements', 'Difficulty', 'Type', 'EnemiesDropLoot')},
    } for i, area in enumerate(objects['CombatArea']) if area['Id'] == 'GolbinForest')
    result['normalAttack'] = next({
        'sourcePointer': f'/Objects/Attack/{i}',
        **{key: value for key, value in attack.items()
           if key in ('Id', 'Hits', 'IsAvoidable', 'DamageType', 'PreHitEffects', 'OnHitEffects')},
    } for i, attack in enumerate(objects['Attack']) if attack['Id'] == 'Normal')
    result['rewardItems'] = [{
        'id': 'MelvorBase:' + item['Id'], 'name': item['DisplayName']['Singular'],
        'sourcePointer': f'/Objects/Item/{i}', 'sellsFor': item['SellsFor'],
    } for i, item in enumerate(objects['Item'])
        if item['Id'] in {'Bone', 'Stone', 'Shrimp', 'StoneHelmet', 'StoneSword'}]
    print(json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False))


if __name__ == '__main__':
    main()

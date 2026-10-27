"""Read the complete Enemy registry from the pinned demo. Print selected facts.

No game code is executed. Artwork and narrative descriptions are not exported.
"""
import argparse
import hashlib
import json

PACKAGE_SHA = '2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474'


def clean(value):
    if isinstance(value, list):
        return [clean(v) for v in value]
    if isinstance(value, dict):
        return {k: clean(v) for k, v in value.items() if k not in {
            'Icon', 'Sprite', 'SpriteOffset', 'Description', 'CoverBackground',
            'Background', 'OverrideMusicTrack', 'Height', 'IsScarySpider',
        } and not k.endswith(('Audio', 'Media'))}
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--exe', required=True)
    parser.add_argument('--checked-at', required=True)
    args = parser.parse_args()
    with open(args.exe, 'rb') as source:
        source.seek(587290512)
        raw = source.read(7411090)
    if hashlib.sha256(raw).hexdigest() != PACKAGE_SHA:
        raise ValueError('Package changed; review build before extracting')
    objects = json.loads(raw)['Objects']
    def registry(typ):
        return {'MelvorBase:' + r['Id']: (i, r) for i, r in enumerate(objects[typ])}
    enemies, stances, styles = registry('Enemy'), registry('AttackStance'), registry('CombatStyle')
    items, currencies = registry('Item'), registry('Currency')
    attacks, passives = registry('Attack'), registry('CombatPassive')
    def named(id, entries):
        entry = entries.get(id)
        if entry is None:
            raise ValueError('Unresolved reference ' + id)
        name = entry[1].get('DisplayName', id)
        return name.get('Singular', id) if isinstance(name, dict) else name
    def refs(value):
        if isinstance(value, str):
            return {value} if value in enemies else set()
        if isinstance(value, list):
            return set().union(*(refs(v) for v in value)) if value else set()
        if isinstance(value, dict):
            return refs(list(value.values()))
        return set()
    areas = []
    for typ in ['CombatArea', 'Dungeon']:
        for i, r in enumerate(objects[typ]):
            members = sorted(refs(r.get('Enemies', [])))
            areas.append({'id': 'MelvorBase:' + r['Id'], 'name': r['DisplayName'],
                          'kind': typ, 'difficulty': r.get('Difficulty'),
                          'category': r.get('Category'), 'enemyIds': members,
                          'requirements': r.get('UnlockRequirements'),
                          'displayRequirements': r.get('DisplayRequirements'),
                          'passives': r.get('Passives'), 'effect': clean(r.get('Effect')),
                          'sourcePointer': f'/Objects/{typ}/{i}'})
    # Registry aliases between area types are retained separately by kind.
    rows = []
    for id, (i, r) in enemies.items():
        levels = {l['Key']: l['Value'] for l in r.get('Levels', [])}
        base_stats = {s['Stat']: s['Value'] for s in (r.get('Stats') or {}).get('Stats', [])}
        stance_rows = []
        for s in r.get('Stances', []):
            _, stance = stances[s['Stance']]
            _, style = styles[stance['CombatStyle']]
            stance_rows.append({'id': s['Stance'], 'name': named(s['Stance'], stances),
                                'style': style['Id'], 'weight': s.get('Weight')})
        hp_levels = {styles[stances[s['Stance']][1]['CombatStyle']][1]['MaxHitpointsLevel']
                     for s in r.get('Stances', [])}
        hp_key = next(iter(hp_levels)) if len(hp_levels) == 1 else None
        hp = levels[hp_key] * 10 if hp_key in levels else None
        drops = r.get('Drops')
        drop_rows = []
        def drop(item, probability, group):
            entry = items[item['Item']][1]
            drop_rows.append({'id': item['Item'], 'name': named(item['Item'], items),
                              'min': item.get('MinQuantity'), 'max': item.get('MaxQuantity'),
                              'probability': probability, 'group': group,
                              'sellsFor': entry.get('SellsFor')})
        for item in (drops or {}).get('FixedItems', []):
            drop(item, 1, 'fixed')
        for n, table in enumerate((drops or {}).get('ItemTables', [])):
            total = sum(item['Weight'] for item in table['Table'])
            for item in table['Table']:
                probability = table['Chance'] * item['Weight'] / total if total > 0 else None
                drop(item, probability, f'table-{n + 1}')
        currency_rows = [{'id': c['Currency'], 'name': named(c['Currency'], currencies),
                          'min': c.get('MinQuantity'), 'max': c.get('MaxQuantity')}
                         for c in (drops or {}).get('FixedCurrencies', [])]
        req = r.get('Requirements')
        status = 'locked' if any(q['Type'] == 'MelvorBase:DemoLocked' for q in req or []) else 'conditional' if req or r.get('DisplayRequirements') else 'unconfirmed'
        rows.append({'id': id, 'name': r['DisplayName'], 'sourcePointer': f'/Objects/Enemy/{i}',
                     'baseHp': hp, 'hpLevelKey': hp_key, 'levels': levels,
                     'baseStats': base_stats, 'powerRatings': (r.get('Stats') or {}).get('PowerRatings'),
                     'protectionRatings': (r.get('Stats') or {}).get('ProtectionRatings'),
                     'damageType': r.get('DamageType'), 'element': r.get('Element'),
                     'stances': stance_rows, 'styles': sorted({s['style'] for s in stance_rows}),
                     'areas': [a['id'] for a in areas if id in a['enemyIds']],
                     'requirements': clean(req), 'displayRequirements': clean(r.get('DisplayRequirements')),
                     'availability': status, 'pauseOnSpawn': r.get('PauseOnSpawn'),
                     'ignoreCompletion': r.get('IgnoreCompletion'),
                     'drops': drop_rows, 'currencies': currency_rows, 'dropDefinitionKnown': drops is not None,
                     'attacks': [{'id': a['Attack'], 'name': named(a['Attack'], attacks),
                                  'chance': a.get('Chance')} for a in r.get('Attacks', [])],
                     'passives': [{'id': p, 'name': named(p, passives)} for p in r.get('Passives', [])]})
    ids = {r['id'] for r in rows}
    if len(ids) != len(objects['Enemy']):
        raise ValueError('Duplicate or missing enemy IDs')
    used_attacks = {a['id'] for r in rows for a in r['attacks']}
    used_passives = {p['id'] for r in rows for p in r['passives']}
    used_passives.update(p for area in areas for p in area['passives'] or [])
    def definitions(typ, ids, source):
        return [{'id': id, 'sourcePointer': f'/Objects/{typ}/{source[id][0]}',
                 'data': clean(source[id][1])} for id in sorted(ids)]
    result = {'gameVersion': '0.11.2-alpha.4', 'steamBuildId': '26074343', 'channel': 'Steam demo',
              'checkedAt': args.checked_at, 'packageSha256': PACKAGE_SHA,
              'method': 'scripts/extract_monsters.py', 'definitionCount': len(rows),
              'baseHpDerivation': {'formula': 'configured Hitpoints level * 10',
                                   'methodToken': '0x0601169e',
                                   'dllSha256': '7352a8b5fd7275a19908059398babcc643ce7e30a428e2633b936f9f191c0af5',
                                   'evidenceCheckedAt': '2026-10-27'},
              'scope': 'Complete shipped Enemy registry, not complete game or demo playability.',
              'rows': rows, 'areas': areas,
              'attackDefinitions': definitions('Attack', used_attacks, attacks),
              'passiveDefinitions': definitions('CombatPassive', used_passives, passives)}
    print(json.dumps(result, ensure_ascii=False, separators=(',', ':'), allow_nan=False))


if __name__ == '__main__':
    main()

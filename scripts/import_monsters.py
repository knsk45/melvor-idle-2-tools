"""Validate extractor JSON on stdin and generate the browser's monster catalog."""
import json
import sys
from pathlib import Path

data = json.load(sys.stdin)
if data['packageSha256'] != '2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474':
    raise ValueError('Unexpected package')
if data['definitionCount'] != len(data['rows']) or len({r['id'] for r in data['rows']}) != len(data['rows']):
    raise ValueError('Missing or duplicate monsters')
target = Path(__file__).resolve().parents[1] / 'src/data/monsters.json'
target.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':'), allow_nan=False) + '\n')
print(json.dumps({'monsters': len(data['rows']), 'areas': len(data['areas']),
                  'attacks': len(data['attackDefinitions']), 'passives': len(data['passiveDefinitions']),
                  'unplaced': sum(not r['areas'] for r in data['rows']),
                  'availability': {s: sum(r['availability'] == s for r in data['rows'])
                                   for s in ['locked', 'conditional', 'unconfirmed']}}))

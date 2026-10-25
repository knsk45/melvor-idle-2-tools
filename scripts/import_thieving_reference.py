"""Build Thieving's unlock-level fixed reference from the pinned package."""
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; SHA='2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474'
def main():
 m=json.loads((ROOT/'data/catalog/manifest.json').read_text(encoding='utf8'))['source']; exe=Path(r'C:\Program Files (x86)\Steam\steamapps\common\Melvor Idle 2 Demo\Melvor2.exe')
 with exe.open('rb') as f:f.seek(m['absoluteFileOffset']);raw=f.read(m['resourceBytes'])
 assert hashlib.sha256(raw).hexdigest()==SHA
 d=json.loads(raw); items={x['id']:x for x in json.loads((ROOT/'data/catalog/items.json').read_text(encoding='utf8'))['records']}; rows=[]
 for i,r in enumerate(d['Objects']['ThievingRecipe']):
  lvl=next((x['Data']['Level'] for x in r.get('Requirements',[]) if x['Type'].endswith(':Level')),None); locked=any(x['Type'].endswith(':DemoLocked') for x in r.get('Requirements',[])); p=min(1,(100+(lvl or 0))/(100+r['Perception']))
  stages=max(1,r['Stages']); interval=r['BaseInterval']/1000; stun=2; attempts=stages/p; seconds=stages*interval+stages*(1-p)/p*stun; completions=3600/seconds
  currency=r.get('CurrencyReward'); cur=(currency['MinQuantity']+currency['MaxQuantity'])/2 if currency else 0; common=r.get('CommonDropTable',[]); rare=r.get('RareDropTable',[])
  def expected(table):
   total=sum(x['Weight'] for x in table) or 1; return sum(((items.get(x['Item'],{}).get('sellsFor') or {}).get('Quantity') or 0)*((x['MinQuantity']+x['MaxQuantity'])/2)*x['Weight']/total for x in table)
  gp=(p*r.get('BaseCurrencyLootChance',0)*cur + p*r.get('BaseCommonLootChance',0)*expected(common) + p*r.get('BaseRareLootChance',0)*expected(rare))*attempts*completions/stages
  rows.append({'id':r['Id'],'gameId':'MelvorBase:'+r['Id'],'name':r['DisplayName'],'requiredLevel':lvl,'availability':'locked' if locked else 'demo','conditions':[f'Thieving level {lvl}'] if lvl else [],'intervalSeconds':seconds,'intervalLabel':f'{interval:g}s expected stage+stun cycle at unlock level','baseXp':r['BaseExperience'],'successChance':p,'xpPerHour':completions*r['BaseExperience'],'itemsPerHour':None,'gpPerHour':gp,'products':[],'sourcePointer':f'/Objects/ThievingRecipe/{i}','notes':['Fixed at the recipe unlock level with zero modifiers. Success chance is (100 + Thieving level) / (100 + perception).','Failures inflict the base 2-second stun; XP is granted on completion, while pickpocket currency/loot rolls occur on successful stages. Item quantities are kept null because weighted drop tables are action-specific.']})
 out={'id':'thieving','gameVersion':'0.11.2-alpha.4','steamBuildId':'26074343','packageSha256':SHA,'checkedAt':'2026-10-25','method':'docs/BASE_SKILL_FORMULAS.md#thieving','rows':rows,'notes':['Unlock-level baseline; no player level or equipment controls. Unknown item throughput remains null.']}
 (ROOT/'src/data/skills/thieving.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf8'); idx=json.loads((ROOT/'src/data/skills/index.json').read_text(encoding='utf8'))
 for s in idx['skills']:
  if s['id']=='thieving':s['status']='ready'
 (ROOT/'src/data/skills/index.json').write_text(json.dumps(idx,ensure_ascii=False,indent=2)+'\n',encoding='utf8'); print(len(rows),sum(x['availability']=='demo' for x in rows))
if __name__=='__main__':main()

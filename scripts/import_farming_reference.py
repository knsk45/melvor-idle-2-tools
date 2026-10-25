"""Build the fixed healthy-plot Farming reference from the pinned package."""
import hashlib, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SHA="2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474"
def main():
 m=json.loads((ROOT/'data/catalog/manifest.json').read_text(encoding='utf8'))['source']
 exe=Path(r'C:\Program Files (x86)\Steam\steamapps\common\Melvor Idle 2 Demo\Melvor2.exe')
 with exe.open('rb') as f: f.seek(m['absoluteFileOffset']); raw=f.read(m['resourceBytes'])
 assert hashlib.sha256(raw).hexdigest()==SHA
 d=json.loads(raw); items={x['id']:x for x in json.loads((ROOT/'data/catalog/items.json').read_text(encoding='utf8'))['records']}
 rows=[]
 for i,r in enumerate(d['Objects']['FarmingRecipe']):
  req=next((q['Data']['Level'] for q in r.get('Requirements',[]) if q['Type'].endswith(':Level')),None)
  locked=any(q['Type'].endswith(':DemoLocked') for q in r.get('Requirements',[]))
  sec=r.get('DisplayRequirements') or []
  seconds=(r['BaseInterval']+r.get('Regrows',0)*r.get('RegrowInterval',0))/1000
  harvests=1+r.get('Regrows',0); per=3600/seconds if seconds else None
  q=r['Product']['Quantity']*harvests; item=r['Product']['Item']; price=items.get(item,{}).get('sellsFor'); gp=price.get('Quantity') if price and price.get('Currency','').endswith(':GoldPieces') else None
  rows.append({'id':r['Id'],'gameId':'MelvorBase:'+r['Id'],'name':r['DisplayName'],'requiredLevel':req,'availability':'locked' if locked else 'conditional' if sec else 'demo','conditions':[f'Farming level {req}'] if req is not None else [],'intervalSeconds':seconds,'intervalLabel':f"{r['BaseInterval']/1000:g}s growth + {r.get('Regrows',0)} regrowths",'baseXp':r['BaseExperience'],'successChance':1,'xpPerHour':per*r['BaseExperience'] if per else None,'itemsPerHour':per*q if per else None,'gpPerHour':per*q*gp if per and gp is not None else None,'products':[{'id':item,'name':items.get(item,{}).get('name',item.split(':')[-1]),'role':'primary','basis':'healthy plot harvests','probability':1,'quantity':q,'itemsPerHour':per*q if per else None,'gpPerHour':per*q*gp if per and gp is not None else None}], 'sourcePointer':f'/Objects/FarmingRecipe/{i}','notes':['Healthy plot baseline: no disease or pest reduction; water/compost and automation are excluded.','Regrowths are amortized across the first harvest cycle; seed and plot costs are shown as conditions only, not deducted from gross GP.']})
 out={'id':'farming','gameVersion':'0.11.2-alpha.4','steamBuildId':'26074343','packageSha256':SHA,'checkedAt':'2026-10-25','method':'docs/BASE_SKILL_FORMULAS.md#farming','rows':rows,'notes':['Rates use a healthy plot baseline. Disease/pest state can only reduce quantity and is not a user input.']}
 (ROOT/'src/data/skills/farming.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 idx=json.loads((ROOT/'src/data/skills/index.json').read_text(encoding='utf8'))
 for s in idx['skills']:
  if s['id']=='farming': s['status']='ready'
 (ROOT/'src/data/skills/index.json').write_text(json.dumps(idx,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print(len(rows),sum(x['availability']=='demo' for x in rows))
if __name__=='__main__':main()

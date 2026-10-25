"""Build fixed, versioned reference tables. No user-input or character model.
Reads shipped numerical catalogs; only supplemental location/navigation metadata
is read from the hash-pinned package. Does not execute or modify the game.
"""
import argparse, hashlib, json, math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
EXPECTED_PACKAGE='2b43f26ce76d86178f56a72c8dced08a0ae545779786cccdcac868bdc3478474'
def load(p): return json.loads((ROOT/p).read_text('utf-8-sig'))
def write(p,value):
 target=ROOT/p; target.parent.mkdir(parents=True,exist_ok=True)
 target.write_text(json.dumps(value,ensure_ascii=False,indent=2,allow_nan=False)+'\n',encoding='utf8')
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--exe',default=r'C:\Program Files (x86)\Steam\steamapps\common\Melvor Idle 2 Demo\Melvor2.exe');args=ap.parse_args()
 manifest=load('data/catalog/manifest.json')['source']
 assert manifest['packageSha256']==EXPECTED_PACKAGE
 with open(args.exe,'rb') as f:f.seek(manifest['absoluteFileOffset']);raw=f.read(manifest['resourceBytes'])
 assert hashlib.sha256(raw).hexdigest()==EXPECTED_PACKAGE,'Game package changed; review the new build before importing.'
 package=json.loads(raw);objects=package['Objects'];configs=package['EntityConfig']
 catalog=load('data/catalog/recipes.json')['tables'];items={r['id']:r for r in load('data/catalog/items.json')['records']}
 locations={'MelvorBase:'+r['Id']:r for r in objects['FishingLocation']}
 def itemname(id):return items[id]['name']
 def level(reqs,entity):
  levels=[q['Data']['Level'] for q in reqs if q['Type']=='MelvorBase:Level' and q['Data'].get('Component',{}).get('Entity')=='MelvorBase:'+entity]
  return max(levels) if levels else None
 def conditions(reqs,display):
  result=[]
  for r in reqs:
   typ=r['Type'].split(':')[-1];d=r.get('Data',{})
   if typ=='Level': result.append(d.get('Component',{}).get('Entity','').split(':')[-1]+' level '+str(d['Level']))
   elif typ=='DemoLocked':result.append('Not available in this demo build')
   elif 'Item' in d:result.append(typ+': '+itemname(d['Item'])+((' × '+str(d['Value'])) if 'Value' in d else ''))
   else:result.append(typ+' progression requirement (see original source conditions)')
  if display:result.append('Conditional visibility: quest or progression state')
  return list(dict.fromkeys(result))
 def row(r,skill,pointer,extra=None):
  extra=extra or {};reqs=(r.get('Requirements') or [])+(extra.get('Requirements') or []);display=(r.get('DisplayRequirements') or [])+(extra.get('DisplayRequirements') or [])
  locked=any(q['Type']=='MelvorBase:DemoLocked' for q in reqs)
  return {'id':r['Id'],'gameId':'MelvorBase:'+r['Id'],'name':r['DisplayName'],'requiredLevel':level(reqs,skill),'availability':'locked' if locked else 'conditional' if display else 'demo','conditions':conditions(reqs,display),'intervalSeconds':None,'intervalLabel':'','baseXp':r['BaseExperience'],'successChance':None,'xpPerHour':None,'itemsPerHour':None,'gpPerHour':None,'products':[],'sourcePointer':pointer,'notes':[]}
 def product(id,role,basis,p,q,rolls):
  sell=items[id]['sellsFor'];price=sell['Quantity'] if sell and sell['Currency']=='MelvorBase:GoldPieces' else None
  n=rolls*p*q
  return {'id':id,'name':itemname(id),'role':role,'basis':basis,'probability':p,'quantity':q,'itemsPerHour':n,'gpPerHour':n*price if price is not None else 0 if n==0 else None}
 def finish(r):
  r['itemsPerHour']=sum(p['itemsPerHour'] for p in r['products'] if p['role']=='primary')
  r['gpPerHour']=None if any(p['gpPerHour'] is None for p in r['products']) else sum(p['gpPerHour'] for p in r['products'])
  assert all(r[k] is None or math.isfinite(r[k]) and r[k]>=0 for k in ['intervalSeconds','xpPerHour','itemsPerHour','gpPerHour'])
  return r
 def table(skill,rows,notes):
  return {'id':skill,'gameVersion':'0.11.2-alpha.4','steamBuildId':'26074343','packageSha256':EXPECTED_PACKAGE,'checkedAt':'2026-10-25','method':'docs/BASE_SKILL_FORMULAS.md#'+skill,'rows':rows,'notes':notes}
 wood=[]
 for r in catalog['WoodcuttingRecipe']:
  out=row(r,'Woodcutting',r['sourceJsonPointer']);hit=r['BaseInterval']/1000;cycle=hit*r['BaseMaxHealth'];cuts=3600/cycle
  out.update(intervalSeconds=cycle,intervalLabel=str(r['BaseMaxHealth'])+' HP · '+str(hit)+'s / hit',successChance=1,xpPerHour=cuts*r['BaseExperience'])
  p=r['Product'];out['products'].append(product(p['Item'],'primary','full cut',1,p['Quantity'],cuts))
  for basis,key,freq in [('hit','RandomProductsPerHit',3600/hit),('full cut','RandomProductsPerCut',cuts)]:
   for p in r.get(key,[]):out['products'].append(product(p['Item'],'side',basis,p['Chance'],p['Quantity'],freq))
  out['notes']=['Base XP and primary product are awarded on a completed cut. One damage per hit; no bonus damage.']
  wood.append(finish(out))
 write('src/data/skills/woodcutting.json',table('woodcutting',wood,['A full cut requires the tree’s base health in hits. Per-hit and per-cut drops have separate roll frequencies.']))
 fish=[]
 for r in catalog['FishingRecipe']:
  loc=locations[r['Location']];out=row(r,'Fishing',r['sourceJsonPointer'],loc)
  mean=(r['BaseMinInterval']+r['BaseMaxInterval'])/2000;actions=3600/mean
  out.update(intervalSeconds=mean,intervalLabel=str(r['BaseMinInterval']/1000)+'–'+str(r['BaseMaxInterval']/1000)+'s · '+loc['DisplayName'],successChance=r['FishChance'],xpPerHour=actions*r['BaseExperience'])
  total=sum(p['Weight'] for p in r['RandomProducts']);assert total>0
  for p in r['RandomProducts']:
   out['products'].append(product(p['Item'],'primary','fishing action',r['FishChance']*p['Weight']/total,(p['MinQuantity']+p['MaxQuantity'])/2,actions))
  out['products'].append(product(r['JunkItem'],'junk','fishing action',1-r['FishChance'],1,actions))
  survival=1
  for p in sorted(r['SpecialProducts'],key=lambda p:p['Chance']):
   chance=p['Chance']*survival;out['products'].append(product(p['Item'],'side','first successful special roll',chance,p['Quantity'],actions));survival*=1-p['Chance']
  out['notes']=['Base XP is awarded on every fishing action, including junk. Primary items/hour counts fish only.','Special probabilities include the chance that earlier special rolls failed. No bait, priority selection or rerolls.']
  fish.append(finish(out))
 write('src/data/skills/fishing.json',table('fishing',fish,['Uniform interval: hourly rates use expected reward divided by mean duration, not the mean of inverse intervals.','All packaged interval bounds align to whole seconds; symmetric tick rounding preserves their mean.','Both action and location requirements are retained. Gross GP includes junk and listed special drops.']))
 mine=[]
 for r in catalog['MiningRecipe']:
  out=row(r,'Mining',r['sourceJsonPointer']);p=r['BaseProductChance'];assert 0<p<=1
  progress=0;cap=0
  while progress<.9999:progress+=p;cap+=1;assert cap<100000
  hits=sum((1-p)**k for k in range(cap));hit=r['BaseInterval']/1000;mean=hits*hit;breaks=3600/mean
  out.update(intervalSeconds=mean,intervalLabel=str(hit)+'s / hit · at most '+str(cap)+' hits',successChance=p,xpPerHour=breaks*r['BaseExperience'])
  primary=r['Product'];out['products'].append(product(primary['Item'],'primary','rock break',1,primary['Quantity'],breaks))
  for p2 in r.get('RandomProductsPerHit',[]):out['products'].append(product(p2['Item'],'side','mining hit',p2['Chance'],p2['Quantity'],3600/hit))
  out['notes']=['The base break chance is per hit. Failed hits accumulate prospecting progress; the cap forces a break.','Base XP is awarded only on a break. Bar/stone/essence bonus drops, shatter and early break modifiers are excluded.']
  mine.append(finish(out))
 write('src/data/skills/mining.json',table('mining',mine,['Base model includes the game’s built-in prospecting progress. A simple hits/hour × break chance would understate throughput.','Expected hits are the finite geometric sum up to the forced-break cap; starting prospecting is zero without modifiers.']))
 navigation={}
 for r in objects['LegacySkillNavigationOption']+objects['SkillNavigationOption']:
  key=r['Entity'].split(':')[1];conf=configs.get(r['Entity'],{})
  navigation[key]={'id':key.lower(),'gameId':r['Entity'],'name':r['DisplayName'],'requirements':r.get('Requirements') or [],'recipeIds':conf.get('Recipes',[]),'definitionCount':len(conf.get('Recipes',[])),'status':'ready' if key in ['Woodcutting','Fishing','Mining'] else 'planned','demoLocked':any(q['Type']=='MelvorBase:DemoLocked' for q in r.get('Requirements') or [])}
 write('src/data/skills/index.json',{'sourcePackageSha256':EXPECTED_PACKAGE,'gameVersion':'0.11.2-alpha.4','skills':list(navigation.values())})
 write('data/catalog/fishing-locations.json',{'sourcePackageSha256':EXPECTED_PACKAGE,'records':[{'id':id,'name':r['DisplayName'],'requirements':r.get('Requirements') or [],'displayRequirements':r.get('DisplayRequirements') or []} for id,r in locations.items()]})
 print(json.dumps({'woodcutting':len(wood),'fishing':len(fish),'mining':len(mine),'skills':len(navigation),'demoRows':{name:sum(r['availability']=='demo' for r in rows) for name,rows in [('woodcutting',wood),('fishing',fish),('mining',mine)]}},indent=2))
if __name__=='__main__':main()

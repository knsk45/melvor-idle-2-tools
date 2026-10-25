"""Read-only extraction of factual recipe/item metadata from a Godot PCK v4 PE section.
No game assembly is loaded/executed. No source game file is modified or copied.
Writes only normalized facts, identity, inventory and provenance inside the given output directory.
"""
import argparse, hashlib, json, struct
from pathlib import Path

DEFAULT_EXE=r'C:\Program Files (x86)\Steam\steamapps\common\Melvor Idle 2 Demo\Melvor2.exe'

def digest(b,kind='sha256'):return hashlib.new(kind,b).hexdigest()
def dump(path,value):path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--exe',default=DEFAULT_EXE);ap.add_argument('--output',default='_work/rea-20261025/package');args=ap.parse_args()
 out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
 p=Path(args.exe);b=p.read_bytes()
 if b[:2]!=b'MZ':raise ValueError('Not PE')
 pe=struct.unpack_from('<I',b,0x3c)[0]
 if b[pe:pe+4]!=b'PE\0\0':raise ValueError('Invalid PE signature')
 ns=struct.unpack_from('<H',b,pe+6)[0];os=struct.unpack_from('<H',b,pe+20)[0];sections=[]
 for i in range(ns):
  pos=pe+24+os+i*40;name=b[pos:pos+8].rstrip(b'\0').decode();vs,va,size,off=struct.unpack_from('<IIII',b,pos+8);sections.append(dict(name=name,offset=off,size=size))
 sec=next(s for s in sections if s['name']=='pck');base=sec['offset']
 if b[base:base+4]!=b'GDPC':raise ValueError('Not PCK')
 version,major,minor,patch,flags=struct.unpack_from('<IIIII',b,base+4)
 if version!=4 or flags!=2:raise ValueError('Unsupported PCK version/flags')
 file_base,dir_off=struct.unpack_from('<QQ',b,base+24);cursor=base+dir_off;count=struct.unpack_from('<I',b,cursor)[0];cursor+=4;entries=[]
 for i in range(count):
  plen=struct.unpack_from('<I',b,cursor)[0];cursor+=4
  if plen<=0 or plen>4096:raise ValueError('Invalid PCK pathname length')
  path=b[cursor:cursor+plen].rstrip(b'\0').decode();cursor+=plen
  off,size=struct.unpack_from('<QQ',b,cursor);cursor+=16;md5=b[cursor:cursor+16].hex();cursor+=16;eflags=struct.unpack_from('<I',b,cursor)[0];cursor+=4
  entries.append(dict(path=path,offset=off,size=size,md5=md5,flags=eflags))
 e=next(e for e in entries if e['path']=='Data/Packages/MelvorDemo.json')
 if e['flags']!=0:raise ValueError('Selected entry has unhandled flags')
 abs_off=base+file_base+e['offset'];data=b[abs_off:abs_off+e['size']]
 if len(data)!=e['size'] or digest(data,'md5')!=e['md5']:raise ValueError('Entry integrity failed')
 d=json.loads(data);objs=d['Objects'];namespace=d['Namespace']
 src=dict(path=str(p),exe_sha256=digest(b),exe_bytes=len(b),pe_section=sec,pck_version=version,pck_engine_version=f'{major}.{minor}.{patch}',pck_flags=flags,pck_file_base=file_base,pck_directory_relative_offset=dir_off,pck_file_count=count,resource='res://'+e['path'],resource_relative_offset=e['offset'],resource_absolute_file_offset=abs_off,resource_bytes=e['size'],resource_md5=e['md5'],resource_sha256=digest(data),namespace=namespace,method='Static read-only PE/PCK v4 directory parse, MD5 verification, UTF-8 JSON decode; no target execution.',scope='Facts in shipped demo package. Definition presence alone does not establish availability or released content.')
 dump(out/'source-manifest.json',src)
 dump(out/'pck-inventory.json',dict(path=str(p),base=base,file_base=file_base,directory_relative_offset=dir_off,count=count,entries=entries))
 dump(out/'object-counts.json',{k:len(v) for k,v in objs.items()})
 items={namespace+':'+r['Id']:r for r in objs['Item']}
 def itemfact(id):
  r=items.get(id)
  if r is None:return None
  return dict(id=id,name=r.get('DisplayName'),sellsFor=r.get('SellsFor'),ignoreCompletion=r.get('IgnoreCompletion'))
 def types(reqs):return [r.get('Type') for r in reqs or []]
 def availability(r):
  if namespace+':DemoLocked' in types(r.get('Requirements')):return 'demo-locked'
  if r.get('DisplayRequirements'):return 'conditional-display-requirements'
  return 'definition-without-demo-lock-or-display-condition'
 def strip_art(v):
  if isinstance(v,list):return [strip_art(x) for x in v]
  if isinstance(v,dict):return {k:strip_art(x) for k,x in v.items() if k not in {'Media','LeafMedia','Icon','InvertedMedia','Description','Sprite','StepAudio','Audio','Background','Tooltip','DisplayText','DescriptionTemplate','NameTemplate','Text','Body','TemplateString'} and not k.endswith('Media')}
  return v
 wood=[]
 for i,r in enumerate(objs['WoodcuttingRecipe']):
  reqs=r.get('Requirements') or [];levels=[q['Data'].get('Level') for q in reqs if q.get('Type')==namespace+':Level'];prod=r.get('Product')
  row=dict(sourceJsonPointer=f'/Objects/WoodcuttingRecipe/{i}',id=namespace+':'+r['Id'],name=r.get('DisplayName'),category=r.get('Category'),rawLevel=r.get('Level'),requirementLevels=levels,baseExperience=r.get('BaseExperience'),baseIntervalMilliseconds=r.get('BaseInterval'),baseMaxHealth=r.get('BaseMaxHealth'),product=prod,primaryItem=itemfact(prod['Item']) if prod else None,randomProductsPerHit=r.get('RandomProductsPerHit') or [],randomProductsPerCut=r.get('RandomProductsPerCut') or [],requirements=reqs,displayRequirements=r.get('DisplayRequirements'),showInMilestones=r.get('ShowInMilestones'),availabilityClassification=availability(r),relatedItemFacts=[])
  ids={x['Item'] for x in row['randomProductsPerHit']+row['randomProductsPerCut']}
  row['relatedItemFacts']=[itemfact(id) for id in sorted(ids)];wood.append(row)
 dump(out/'woodcutting-facts.json',dict(source=src,records=wood))
 dump(out/'item-facts.json',dict(source=src,records=[itemfact(id) for id in items]))
 recipe_types=[k for k in objs if k.endswith('Recipe')]
 recipes={k:[dict(sourceJsonPointer=f'/Objects/{k}/{i}',availabilityClassification=availability(r),**strip_art(r)) for i,r in enumerate(objs[k])] for k in recipe_types}
 dump(out/'recipe-facts.json',dict(source=src,recordCounts={k:len(v) for k,v in recipes.items()},tables=recipes))
 # Preserve numeric modifier declarations/capabilities separately. Descriptions/art omitted.
 mods={k:strip_art(objs[k]) for k in ['MasteryGuildRank','MasteryGuildBonus','ShopPurchase','ToolbeltSlotType']}
 dump(out/'modifier-facts.json',dict(source=src,tables=mods,itemCapabilities=[dict(id=namespace+':'+r['Id'],capabilities=strip_art(r.get('Capabilities'))) for r in objs['Item'] if r.get('Capabilities')]))
 summary=dict(source=src,woodcutting_count=len(wood),woodcutting_availability_counts={k:sum(r['availabilityClassification']==k for r in wood) for k in {r['availabilityClassification'] for r in wood}},object_counts={k:len(v) for k,v in objs.items()},recipe_counts={k:len(v) for k,v in recipes.items()},known_discrepancies=[{'id':'MelvorBase:OakTree','rawLevel':5,'requirementLevel':10,'note':'Use explicit requirement level for availability. UI unlock observed 10, not raw Level.'}])
 dump(out/'summary.json',summary)
 print(json.dumps({k:summary[k] for k in ['woodcutting_count','woodcutting_availability_counts','recipe_counts','known_discrepancies']},indent=2))
if __name__=='__main__':main()

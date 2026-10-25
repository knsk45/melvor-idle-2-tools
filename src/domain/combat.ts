export type CombatStyle='attack'|'strength'|'defence'|'ranged'|'magic';
export interface CombatScenario {
  id:string;
  name:string;
  style:CombatStyle;
  attackIntervalSeconds:number;
  hitChance:number;
  xpOnHit:number;
  xpOnKill:number;
  killsPerFight:number;
  lootPerKill:number;
  notes:string[];
}

export interface CombatRates {
  attacksPerHour:number;
  hitsPerHour:number;
  xpPerHour:number;
  killsPerHour:number;
  lootPerHour:number;
}

export function combatRates(s:CombatScenario):CombatRates {
  const attacksPerHour=3600/s.attackIntervalSeconds;
  const hitsPerHour=attacksPerHour*s.hitChance;
  const killsPerHour=s.killsPerFight>0?hitsPerHour/s.killsPerFight:0;
  return {attacksPerHour,hitsPerHour,xpPerHour:hitsPerHour*s.xpOnHit+killsPerHour*s.xpOnKill,killsPerHour,lootPerHour:killsPerHour*s.lootPerKill};
}

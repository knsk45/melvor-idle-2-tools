export type CombatStyle='attack'|'strength'|'defence'|'ranged'|'magic';

// Build-local base formulas; anchors and limitations: docs/COMBAT_TABLE_DESIGN.md.
// These do not establish damage distributions, survival or hourly rates.
const validLevel = (value: number) => Number.isFinite(value) && value >= 1;

export function baseAccuracyRating(level: number, stanceAttackBonus: number): number | null {
  if (!validLevel(level) || !Number.isFinite(stanceAttackBonus) || stanceAttackBonus < -64) return null;
  return Math.floor((level + 9) * (stanceAttackBonus + 64));
}

export function baseMeleeMaxHit(strengthLevel: number, strengthBonus: number): number | null {
  if (!validLevel(strengthLevel) || !Number.isFinite(strengthBonus)) return null;
  const value = Math.floor(22 + strengthLevel + (strengthLevel + 17) * strengthBonus / 64);
  return value >= 0 ? value : null;
}

export function baseHitChance(accuracy: number, evasion: number): number | null {
  if (!Number.isFinite(accuracy) || !Number.isFinite(evasion) || accuracy < 0 || evasion < 0) return null;
  // The all-zero division has no justified probability in the recovered body.
  if (accuracy === 0 && evasion === 0) return null;
  return accuracy < evasion ? accuracy / (2 * evasion) : 1 - evasion / (2 * accuracy);
}

export function baseAttackIntervalMs(interval: number): number | null {
  if (!Number.isFinite(interval) || interval <= 0) return null;
  return Math.max(250, Math.floor(interval));
}

export function baseMaxHitpoints(hitpointsLevel: number): number | null {
  return validLevel(hitpointsLevel) ? hitpointsLevel * 10 : null;
}

export interface DamageOutcome { damage: number; probability: number }

// Outgoing-only absorption model; retaliation and survival are separate.
export function expectedAttacksToDefeat(
  hitpoints: number, hitChance: number, outcomes: DamageOutcome[],
): number | null {
  if (!Number.isInteger(hitpoints) || hitpoints < 1 || hitpoints > 10000 ||
      !Number.isFinite(hitChance) || hitChance <= 0 || hitChance > 1 ||
      outcomes.length === 0 || outcomes.some(o => !Number.isInteger(o.damage) ||
        o.damage < 0 || !Number.isFinite(o.probability) || o.probability < 0) ||
      Math.abs(outcomes.reduce((sum, o) => sum + o.probability, 0) - 1) > 1e-10) return null;
  const positive = outcomes.filter(o => o.damage > 0);
  const progressChance = hitChance * positive.reduce((sum, o) => sum + o.probability, 0);
  if (progressChance <= 0) return null;
  const expected = new Array<number>(hitpoints + 1).fill(0);
  for (let hp = 1; hp <= hitpoints; hp++) {
    const remaining = positive.reduce((sum, o) =>
      sum + o.probability * expected[Math.max(0, hp - o.damage)], 0);
    expected[hp] = (1 + hitChance * remaining) / progressChance;
  }
  return Number.isFinite(expected[hitpoints]) ? expected[hitpoints] : null;
}

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

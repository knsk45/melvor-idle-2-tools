import { describe, expect, it } from 'vitest';
import facts from '../../data/catalog/combat-base.json';
import {
  baseAccuracyRating, baseAttackIntervalMs, baseHitChance,
  baseMaxHitpoints, baseMeleeMaxHit,
} from './combat';

describe('demo combat base formulas', () => {
  it('uses the freshly extracted Stone Sword and Golbin facts without claiming an hourly scenario', () => {
    const sword = facts.equipment[0];
    const stats = sword.equipment.Stats.Stats;
    const stat = (id: string) => stats.find(s => s.Stat === 'MelvorBase:' + id)!.Value;
    expect(sword.id).toBe('MelvorBase:StoneSword');
    expect(baseAccuracyRating(1, stat('StabAttackBonus'))).toBe(770);
    expect(baseMeleeMaxHit(1, stat('MeleeStrengthBonus'))).toBe(26);
    expect(baseAttackIntervalMs(stat('AttackInterval'))).toBe(2700);
    const golbin = facts.enemies.find(e => e.id === 'MelvorBase:Golbin')!;
    expect(baseMaxHitpoints(golbin.levels.find(l => l.Key === 'MelvorBase:Hitpoints')!.Value)).toBe(20);
    expect(facts.scenario.available).toBe(false);
    expect(facts.scenario.xpPerHour).toBeNull();
  });

  it('handles both recovered hit-chance branches and their shared boundary', () => {
    expect(baseHitChance(100, 200)).toBe(0.25);
    expect(baseHitChance(200, 100)).toBe(0.75);
    expect(baseHitChance(100, 100)).toBe(0.5);
    expect(baseHitChance(0, 100)).toBe(0);
    expect(baseHitChance(100, 0)).toBe(1);
  });

  it('keeps unknown and invalid inputs out of the verified arithmetic', () => {
    expect(baseHitChance(0, 0)).toBeNull();
    expect(baseHitChance(-1, 100)).toBeNull();
    expect(baseHitChance(Infinity, 100)).toBeNull();
    expect(baseAccuracyRating(0, 13)).toBeNull();
    expect(baseMeleeMaxHit(NaN, 12)).toBeNull();
    expect(baseMaxHitpoints(0)).toBeNull();
    expect(baseAttackIntervalMs(0)).toBeNull();
    expect(baseAttackIntervalMs(249.9)).toBe(250);
    expect(baseAttackIntervalMs(2700.9)).toBe(2700);
  });
});

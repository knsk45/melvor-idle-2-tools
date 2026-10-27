import { describe, expect, it } from 'vitest';
import example from '../data/combat/golbin.json';
import facts from '../../data/catalog/combat-base.json';
import { baseAccuracyRating, baseHitChance, expectedAttacksToDefeat } from './combat';

describe('Golbin per-kill reference', () => {
  it('matches the independently generated rational recurrence, including misses and overkill', () => {
    const o = example.offense;
    expect(baseAccuracyRating(1, 13)).toBe(o.accuracyRating);
    expect(baseHitChance(o.accuracyRating, example.enemy.evasionRating)).toBeCloseTo(43 / 77, 12);
    const attacks = expectedAttacksToDefeat(example.enemy.hitpoints, o.hitChance, o.damageOutcomes)!;
    expect(attacks).toBeCloseTo(example.offense.expectedAttacks, 12);
    expect(attacks).toBeCloseTo(3.90746880297334, 12);
    const mean = o.damageOutcomes.reduce((sum, d) => sum + d.damage * d.probability, 0);
    expect(attacks).toBeGreaterThan(example.enemy.hitpoints / (o.hitChance * mean));
  });

  it('preserves resistance truncation rather than assuming a uniform final damage range', () => {
    const outcomes = example.offense.damageOutcomes;
    expect(outcomes).toHaveLength(25);
    expect(outcomes[0]).toEqual({ damage: 1, probability: 2 / 26 });
    expect(outcomes.at(-1)).toEqual({ damage: 25, probability: 1 / 26 });
    expect(outcomes.reduce((sum, d) => sum + d.probability, 0)).toBeCloseTo(1, 14);
  });

  it('uses actual HP damage for XP and separates direct gold from sale revenue', () => {
    expect(example.perKill.attackXp).toBe(20 * 0.4);
    expect(example.perKill.hitpointsXp).toBe(2.66);
    expect(example.perKill.directGold).toBe(25);
    expect(example.perKill.grossGold).toBeCloseTo(27 + 119 / 23, 12);
    expect(example.perKill.items.find(i => i.id === 'MelvorBase:Bone')?.expectedQuantity).toBe(1);
    expect(example.perKill.items.filter(i => i.id !== 'MelvorBase:Bone').reduce((s, i) => s + i.probability, 0)).toBeCloseTo(1, 14);
    expect(example.packageSha256).toBe(facts.packageSha256);
    expect(example.hourly).toEqual({ xp: null, kills: null, gold: null });
  });
});

describe('outgoing attack-count model', () => {
  it('solves miss and zero-damage loops instead of dropping them', () => {
    expect(expectedAttacksToDefeat(10, 0.5, [{ damage: 5, probability: 1 }])).toBe(4);
    expect(expectedAttacksToDefeat(10, 0.5, [{ damage: 0, probability: 0.5 }, { damage: 5, probability: 0.5 }])).toBe(8);
    expect(expectedAttacksToDefeat(1, 0.5, [{ damage: 100, probability: 1 }])).toBe(2);
  });

  it('rejects invalid or nonterminating scenarios', () => {
    expect(expectedAttacksToDefeat(20, 0, [{ damage: 1, probability: 1 }])).toBeNull();
    expect(expectedAttacksToDefeat(20, 1, [{ damage: 0, probability: 1 }])).toBeNull();
    expect(expectedAttacksToDefeat(20, 1, [{ damage: 1, probability: 0.4 }])).toBeNull();
    expect(expectedAttacksToDefeat(20, 1, [{ damage: -1, probability: 1 }])).toBeNull();
    expect(expectedAttacksToDefeat(20, NaN, [{ damage: 1, probability: 1 }])).toBeNull();
    expect(expectedAttacksToDefeat(0, 1, [{ damage: 1, probability: 1 }])).toBeNull();
  });
});

import {describe,it,expect} from 'vitest';
import {combatRates,type CombatScenario} from './combat';
describe('combat baseline rates',()=>{it('separates hit and kill XP',()=>{const s:CombatScenario={id:'demo',name:'Demo target',style:'attack',attackIntervalSeconds:2,hitChance:.5,xpOnHit:10,xpOnKill:40,killsPerFight:5,lootPerKill:3,notes:[]};expect(combatRates(s)).toEqual({attacksPerHour:1800,hitsPerHour:900,xpPerHour:16200,killsPerHour:180,lootPerHour:540});});});

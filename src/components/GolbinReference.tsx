import golbin from '../data/combat/golbin.json';
import { combatMessages } from '../i18n/combat';
import './combat.css';

export function GolbinReference({ lang }: { lang: 'en' | 'ru' }) {
  const t = combatMessages[lang];
  const f = (n: number, digits = 4) => new Intl.NumberFormat(lang, { maximumFractionDigits: digits }).format(n);
  const offense = golbin.offense;
  const metrics = [
    [t.hp, f(golbin.enemy.hitpoints)], [t.accuracy, f(offense.accuracyRating)],
    [t.evasion, f(golbin.enemy.evasionRating)], [t.hitChance, f(offense.hitChance * 100) + '%'],
    [t.interval, f(offense.attackIntervalMs / 1000) + ' s'],
    [t.rawDamage, `${offense.rawMinHit}–${offense.rawMaxHit}`],
    [t.resistance, f(offense.resistance * 100) + '%'],
    [t.attacks, f(offense.expectedAttacks)], [t.spawn, f(golbin.baseSpawnIntervalMs / 1000) + ' s'],
  ];
  return <section className="workspace combat-example" aria-label={t.title}>
    <div className="workspace-heading"><strong>{t.title}</strong><span>◇ {t.example}</span></div>
    <p className="scenario-banner">{t.scenario}</p>
    <p>{t.boundary}</p>
    <dl className="combat-metrics">{metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <details><summary>{t.damage}</summary><p>{t.damageNote}</p>
      <div className="table-wrap" tabIndex={0} role="region" aria-label={t.damage}><table>
        <caption>{t.damage}</caption><thead><tr><th scope="col">{t.damage}</th><th scope="col">{t.chance}</th></tr></thead>
        <tbody>{offense.damageOutcomes.map(o => <tr key={o.damage}><th scope="row">{o.damage}</th><td>{f(o.probability * 100)}%</td></tr>)}</tbody>
      </table></div>
    </details>
    <h2>{t.rewards}</h2>
    <dl className="combat-metrics">{[
      [t.xp, f(golbin.perKill.attackXp)], [t.hpXp, f(golbin.perKill.hitpointsXp)],
      [t.gold, f(golbin.perKill.directGold)], [t.gross, f(golbin.perKill.grossGold)],
    ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <p>{t.goldNote}</p>
    <div className="table-wrap" tabIndex={0} role="region" aria-label={t.rewards}><table>
      <caption>{t.rewards}</caption><thead><tr>{[t.item, t.chance, t.quantity, t.mean, t.price].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
      <tbody>{golbin.perKill.items.map(item => <tr key={item.id}>
        <th scope="row">{item.name}</th><td>{f(item.probability * 100)}%</td><td>{f(item.quantity)}</td>
        <td>{f(item.expectedQuantity)}</td><td>{f(item.salePrice)}</td>
      </tr>)}</tbody>
    </table></div>
    <div className="workspace-foot"><strong>{t.hourly}</strong><p>{t.hourlyNote}</p></div>
    <details><summary>{t.source}</summary><p>{golbin.channel} {golbin.gameVersion} · {golbin.steamBuildId} · {t.checked}: {golbin.checkedAt}</p>
      <p>Golbin: {golbin.sourcePointer}<br/>Stone Sword: {golbin.weaponSourcePointer}</p>
      <p className="combat-digest">Package SHA-256: {golbin.packageSha256}<br/>DLL SHA-256: {golbin.dllSha256}</p>
      <p>{golbin.method}</p>
    </details>
  </section>;
}

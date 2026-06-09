import './Calculator.css';

function fmt(n) {
  return (n >= 0 ? '+' : '') + n.toFixed(2);
}

function evColor(ev) {
  if (ev > 0) return '#27ae60';
  if (ev < 0) return '#e94560';
  return '#aaa';
}

export default function Calculator({ stats, discardPileSize, active }) {
  if (!stats || !active) return null;

  const { currentScore, ev, bustChance, breakdown, deckSize, secondChanceActive } = stats;
  const hasCards = currentScore > 0 || breakdown.some(b => b.type === 'safe' || b.type === 'bust' || b.type === 'modifier');
  if (!hasCards) return null;

  const bustPct = Math.round(bustChance * 100);
  const bustHue = Math.round(120 - bustChance * 120);
  const bustColor = `hsl(${bustHue}, 80%, 50%)`;
  // With Second Chance held, EV is always >= 0 — always recommend draw
  const recommend = (secondChanceActive || ev > 0) ? 'draw' : 'stop';

  const numbers = [
    ...breakdown.filter(b => b.type === 'bust'),
    ...breakdown.filter(b => b.type === 'safe'),
  ].sort((a, b) => parseInt(b.label) - parseInt(a.label));
  const mods  = breakdown.filter(b => b.type === 'modifier');
  const acts  = breakdown.filter(b => b.type === 'action');

  return (
    <div className="calculator">
      <div className="calc-title">EV Calculator</div>

      {/* Recommendation banner */}
      <div className={`calc-rec calc-rec-${recommend}`}>
        <div>
          <span className="calc-rec-label">Recommendation</span>
          {secondChanceActive && <span className="calc-rec-sc"> 2nd chance</span>}
        </div>
        <span className="calc-rec-action">{recommend === 'draw' ? 'Hit' : 'Stay'}</span>
      </div>

      {/* Key numbers */}
      <div className="calc-numbers">
        <div className="calc-stat">
          <span className="calc-stat-label">Score if stop</span>
          <span className="calc-stat-value">{currentScore}</span>
        </div>
        <div className="calc-stat">
          <span className="calc-stat-label">EV of drawing</span>
          <span className="calc-stat-value" style={{ color: evColor(ev) }}>{fmt(ev)}</span>
        </div>
        <div className="calc-stat">
          <span className="calc-stat-label">Bust chance</span>
          <span className="calc-stat-value" style={{ color: bustColor }}>{bustPct}%</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="calc-breakdown">
        <div className="calc-breakdown-title">
          Deck: {deckSize} cards
          {discardPileSize > 0 && (
            <span className="calc-zone-rest"> · Discard: {discardPileSize}</span>
          )}
        </div>
        <table className="calc-table">
          <thead>
            <tr>
              <th>Card</th>
              <th>Count</th>
              <th>EV delta</th>
            </tr>
          </thead>
          <tbody>
            {numbers.map((row, i) => (
              <tr key={i} className={row.type === 'bust' ? 'calc-row-bust' : 'calc-row-safe'}>
                <td>{parseInt(row.label)}</td>
                <td>{row.count}</td>
                <td className={`calc-delta ${row.type === 'bust' ? 'neg' : 'pos'}`}>{fmt(row.delta)}</td>
              </tr>
            ))}
            {mods.length > 0 && (
              <>
                <tr className="calc-section-row"><td colSpan={3}>Modifiers</td></tr>
                {mods.map((row, i) => (
                  <tr key={i} className="calc-row-mod">
                    <td>{row.label}</td>
                    <td>{row.count}</td>
                    <td className="calc-delta pos">{fmt(row.delta)}</td>
                  </tr>
                ))}
              </>
            )}
            {acts.length > 0 && (
              <>
                <tr className="calc-section-row"><td colSpan={3}>Action cards</td></tr>
                {acts.map((row, i) => (
                  <tr key={i} className="calc-row-action">
                    <td>{row.label}</td>
                    <td>{row.count}</td>
                    <td className="calc-delta neutral">0</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

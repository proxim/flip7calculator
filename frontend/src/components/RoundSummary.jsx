import './RoundSummary.css';

const STATUS_LABEL = {
  active: 'Active',
  stopped: 'Stopped',
  frozen: 'Frozen',
  busted: 'Busted',
  flip7: 'FLIP 7!',
};

export default function RoundSummary({ summary, onNext }) {
  if (!summary) return null;

  const sorted = [...summary.players].sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  return (
    <div className="rs-overlay">
      <div className="rs-modal">
        <h2 className="rs-title">Round {summary.roundNumber} Complete</h2>
        <div className="rs-players">
          {sorted.map(p => (
            <div key={p.id} className={`rs-player rs-player-${p.status}`}>
              <div className="rs-player-left">
                <span className="rs-name">{p.name}</span>
                <span className={`rs-badge rs-badge-${p.status}`}>{STATUS_LABEL[p.status]}</span>
              </div>
              <div className="rs-cards">
                {p.numberCards.length === 0
                  ? <span className="rs-no-cards">—</span>
                  : p.numberCards.slice().sort((a, b) => a - b).map((v, i) => (
                      <span key={i} className="rs-chip rs-num">{v}</span>
                    ))
                }
                {p.hasX2 && <span className="rs-chip rs-mod rs-x2">×2</span>}
                {p.modifiers.map((v, i) => (
                  <span key={i} className="rs-chip rs-mod">+{v}</span>
                ))}
              </div>
              <div className="rs-player-right">
                <span className={`rs-round-score rs-round-${p.status === 'busted' ? 'bust' : 'ok'}`}>
                  {p.status === 'busted' ? 'Bust' : `+${p.roundScore}`}
                </span>
                <span className="rs-total">{p.cumulativeScore} pts</span>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-success rs-btn" onClick={onNext}>Next Round →</button>
      </div>
    </div>
  );
}

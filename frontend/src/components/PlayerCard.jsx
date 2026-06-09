import './PlayerCard.css';

const STATUS_LABEL = {
  active: 'Active',
  stopped: 'Stopped',
  frozen: 'Frozen',
  busted: 'Busted',
  flip7: 'FLIP 7!',
};

function calcEstimatedScore(player) {
  if (player.status === 'busted') return 0;
  const numSum = player.numberCards.reduce((a, b) => a + b, 0);
  const flip7Bonus = player.status === 'flip7' ? 15 : 0;
  const base = numSum + flip7Bonus;
  const afterX2 = player.hasX2 ? base * 2 : base;
  const flatBonus = player.modifiers.reduce((a, b) => a + b, 0);
  return afterX2 + flatBonus;
}

export default function PlayerCard({ player, isCurrent, isDrawing, isValidTarget, onTarget, targetScore }) {
  const estimatedScore = calcEstimatedScore(player);
  const toWin = Math.max(0, targetScore - player.cumulativeScore);

  return (
    <div
      className={[
        'player-card',
        `status-${player.status}`,
        isCurrent ? 'is-current' : '',
        isDrawing ? 'is-drawing' : '',
        isValidTarget ? 'is-target' : '',
      ].join(' ')}
      onClick={isValidTarget && onTarget ? onTarget : undefined}
    >
      <div className="pc-header">
        <span className="pc-name">{player.name}</span>
        <span className={`pc-status status-badge-${player.status}`}>
          {STATUS_LABEL[player.status]}
        </span>
      </div>

      <div className="pc-score">
        <span className="pc-score-est">{estimatedScore}</span>
        <span className="pc-score-label">
          {toWin > 0 ? `/ ${toWin} to win` : '/ won!'}
        </span>
      </div>

      <div className="pc-cards">
        {player.numberCards.length === 0 && player.bustCard == null
          ? <span className="pc-empty">No cards</span>
          : [
              ...player.numberCards.slice().sort((a, b) => a - b).map((v, i) => (
                <span key={`n${i}`} className="card-chip number-chip">{v}</span>
              )),
              player.bustCard != null && (
                <span key="bust" className="card-chip bust-chip">{player.bustCard}</span>
              ),
            ]
        }
      </div>

      <div className="pc-mods">
        {player.hasX2 && <span className="card-chip mod-chip x2">×2</span>}
        {player.modifiers.map((v, i) => (
          <span key={i} className="card-chip mod-chip">+{v}</span>
        ))}
        {player.hasSecondChance && <span className="card-chip sc-chip">2nd</span>}
      </div>

      {isValidTarget && (
        <div className="pc-target-hint">Click to target</div>
      )}
    </div>
  );
}

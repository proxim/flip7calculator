import './ActionPanel.css';

function BustMeter({ chance }) {
  const pct = Math.round(chance * 100);
  const hue = Math.round(120 - chance * 120);
  const color = `hsl(${hue}, 80%, 50%)`;
  return (
    <div className="bust-meter">
      <div className="bust-meter-header">
        <span className="bust-label">Bust chance</span>
        <span className="bust-pct" style={{ color }}>{pct}%</span>
      </div>
      <div className="bust-bar-track">
        <div className="bust-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function ActionPanel({ gs, drawingPlayer }) {
  const { phase, flipThreeState, pendingActionCard } = gs;
  const isPlaying = phase === 'playing';
  const isAwaiting = phase === 'awaitingAction';
  const isOver = phase === 'gameOver';

  let headline = '';
  let subline = '';

  if (isOver) {
    headline = 'Game Over';
    subline = `${gs.winner?.name} wins!`;
  } else if (isAwaiting) {
    const actionName = { freeze: 'Freeze', flipThree: 'Flip Three', secondChance: 'Second Chance' }[pendingActionCard?.action] ?? pendingActionCard?.action;
    headline = `${drawingPlayer?.name} drew ${actionName}`;
    subline = 'Click a player card above to choose the target.';
  } else if (flipThreeState) {
    const target = gs.players.find(p => p.id === flipThreeState.targetId);
    headline = `${target?.name}: ${flipThreeState.remaining} forced draws`;
    subline = 'Flip Three in effect.';
  } else if (isPlaying) {
    headline = `${drawingPlayer?.name}'s turn`;
  }

  const showBust = (isPlaying || isAwaiting) && !isOver && drawingPlayer?.numberCards?.length > 0;
  const bustChance = gs.stats?.bustChance ?? 0;

  return (
    <div className="action-panel">
      <div className="ap-headline">{headline}</div>
      {subline && <div className="ap-subline">{subline}</div>}
      {showBust && <BustMeter chance={bustChance} />}
      <div className="ap-deck-info">
        <span>Deck: <strong>{gs.deckSize}</strong> cards</span>
        {gs.discardPileSize > 0 && <span className="ap-known">({gs.discardPileSize} in discard)</span>}
      </div>
    </div>
  );
}

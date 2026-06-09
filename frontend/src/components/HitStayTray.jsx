import './HitStayTray.css';

export default function HitStayTray({ gs, drawingPlayer, loading, onDraw, onStop }) {
  const { phase, flipThreeState } = gs;
  const isPlaying = phase === 'playing';
  const isAwaiting = phase === 'awaitingAction';
  const isOver = phase === 'gameOver';

  if (isOver || (!isPlaying && !isAwaiting)) return null;

  const forced = !!flipThreeState;

  return (
    <div className="tray">
      <div className="tray-player">
        {isAwaiting
          ? `${drawingPlayer?.name} — choose a target`
          : forced
            ? `${drawingPlayer?.name} — must draw ${flipThreeState.remaining} more (Flip Three)`
            : `${drawingPlayer?.name}'s turn`}
      </div>
      {isPlaying && (
        <div className="tray-buttons">
          <button className="tray-btn tray-hit" onClick={onDraw} disabled={loading}>
            {loading ? '…' : forced ? `Hit (${flipThreeState.remaining})` : 'Hit'}
          </button>
          {!forced && (
            <button className="tray-btn tray-stay" onClick={onStop} disabled={loading}>
              Stay
            </button>
          )}
        </div>
      )}
    </div>
  );
}

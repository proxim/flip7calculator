import './Leaderboard.css';

export default function Leaderboard({ players, targetScore, drawingPlayerId }) {
  const sorted = [...players].sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  return (
    <div className="leaderboard">
      <div className="lb-title">Leaderboard</div>
      <div className="lb-rows">
        {sorted.map((p, rank) => {
          const toWin = Math.max(0, targetScore - p.cumulativeScore);
          const isDrawing = p.id === drawingPlayerId;
          return (
            <div key={p.id} className={`lb-row ${isDrawing ? 'lb-drawing' : ''} lb-status-${p.status}`}>
              <span className="lb-rank">#{rank + 1}</span>
              <span className="lb-name">{p.name}</span>
              <div className="lb-right">
                <span className="lb-score">{p.cumulativeScore}</span>
                <span className="lb-towin">{toWin > 0 ? `−${toWin}` : 'Won!'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

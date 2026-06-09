import { useState, useCallback } from 'react';
import { api } from '../api';
import PlayerCard from './PlayerCard';
import ActionPanel from './ActionPanel';
import HitStayTray from './HitStayTray';
import Calculator from './Calculator';
import Leaderboard from './Leaderboard';
import ErrorToast from './ErrorToast';
import Log from './Log';
import RoundSummary from './RoundSummary';
import ManualDraw from './ManualDraw';
import './Game.css';

export default function Game({ initialState, onNewGame }) {
  const [gs, setGs] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showManualDraw, setShowManualDraw] = useState(false);

  const call = useCallback(async (fn) => {
    setError('');
    setLoading(true);
    try {
      const next = await fn();
      setGs(next);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const currentPlayer = gs.players[gs.currentPlayerIndex];
  const isAwaitingAction = gs.phase === 'awaitingAction';
  const drawingPlayerId = gs.flipThreeState?.targetId ?? currentPlayer?.id;
  const drawingPlayer = gs.players.find(p => p.id === drawingPlayerId);

  return (
    <div className="game">
      <ErrorToast message={error} onDismiss={() => setError('')} />
      {gs.phase === 'roundEnd' && gs.roundSummary && (
        <RoundSummary
          summary={gs.roundSummary}
          onNext={() => call(() => api.nextRound())}
        />
      )}
      <header className="game-header">
        <span className="game-title">FLIP 7</span>
        <span className="game-info">
          Round {gs.round} &nbsp;|&nbsp; Deck: {gs.deckSize}
          {gs.discardPileSize > 0 && <> · Discard: {gs.discardPileSize}</>}
          &nbsp;|&nbsp; Target: {gs.targetScore}
        </span>
        <button className="btn-secondary" onClick={onNewGame}>New Game</button>
      </header>

      {gs.phase === 'gameOver' && (
        <div className="game-over-banner">
          {gs.winner.name} wins with {gs.winner.score} points!
          <button className="btn-primary" style={{ marginLeft: 16 }} onClick={onNewGame}>Play Again</button>
        </div>
      )}

      <div className="game-body">
        {/* Left sidebar: leaderboard + log */}
        <aside className="game-left">
          <Leaderboard
            players={gs.players}
            targetScore={gs.targetScore}
            drawingPlayerId={drawingPlayerId}
          />
          <Log entries={gs.log} />
        </aside>

        {/* Center: players grid + hit/stay tray */}
        <div className="game-center">
          <div className="players-grid">
            {gs.players.map((p, i) => (
              <PlayerCard
                key={p.id}
                player={p}
                isCurrent={i === gs.currentPlayerIndex}
                isDrawing={p.id === drawingPlayerId}
                isValidTarget={isAwaitingAction && gs.validTargets.includes(p.id)}
                onTarget={isAwaitingAction ? () => call(() => api.apply(p.id)) : null}
                targetScore={gs.targetScore}
              />
            ))}
          </div>

          <HitStayTray
            gs={gs}
            drawingPlayer={drawingPlayer}
            loading={loading}
            onDraw={() => call(() => api.draw())}
            onStop={() => call(() => api.stop())}
            showManualDraw={showManualDraw}
            onToggleManual={() => setShowManualDraw(v => !v)}
          />
          {gs.phase === 'playing' && showManualDraw && (
            <ManualDraw
              inventory={gs.deckInventory ?? {}}
              loading={loading}
              onClose={() => setShowManualDraw(false)}
              onDraw={async (cardSpec) => {
                setError('');
                setLoading(true);
                try {
                  const next = await api.manualDraw(cardSpec);
                  setGs(next);
                  setShowManualDraw(false);
                } catch (e) {
                  setError(e.message);
                } finally {
                  setLoading(false);
                }
              }}
            />
          )}
        </div>

        {/* Right sidebar: turn info + calculator */}
        <aside className="game-right">
          <ActionPanel gs={gs} drawingPlayer={drawingPlayer} />
          <Calculator
            stats={gs.stats}
            discardPileSize={gs.discardPileSize ?? 0}
            active={gs.phase === 'playing' || gs.phase === 'awaitingAction'}
          />
        </aside>
      </div>
    </div>
  );
}

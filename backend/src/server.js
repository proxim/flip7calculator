import express from 'express';
import cors from 'cors';
import { newGame, actionDraw, actionStop, actionApply, actionNextRound, getValidTargets } from './gameEngine.js';
import { calcStats } from './calculator.js';

const app = express();
app.use(cors());
app.use(express.json());

let state = null;

app.post('/api/game/start', (req, res) => {
  const { playerNames, targetScore } = req.body;
  if (!Array.isArray(playerNames) || playerNames.length < 3 || playerNames.length > 8) {
    return res.status(400).json({ error: 'Need 3–8 player names' });
  }
  state = newGame(playerNames, targetScore ?? 200);
  res.json(publicState(state));
});

app.get('/api/game/state', (req, res) => {
  if (!state) return res.status(404).json({ error: 'No active game' });
  res.json(publicState(state));
});

app.post('/api/game/draw', (req, res) => {
  if (!state) return res.status(404).json({ error: 'No active game' });
  const result = actionDraw(state);
  if (result.error) return res.status(400).json(result);
  state = result;
  res.json(publicState(state));
});

app.post('/api/game/stop', (req, res) => {
  if (!state) return res.status(404).json({ error: 'No active game' });
  const result = actionStop(state);
  if (result.error) return res.status(400).json(result);
  state = result;
  res.json(publicState(state));
});

app.post('/api/game/nextround', (req, res) => {
  if (!state) return res.status(404).json({ error: 'No active game' });
  const result = actionNextRound(state);
  if (result.error) return res.status(400).json(result);
  state = result;
  res.json(publicState(state));
});

app.post('/api/game/apply', (req, res) => {
  if (!state) return res.status(404).json({ error: 'No active game' });
  const { targetPlayerId } = req.body;
  const result = actionApply(state, targetPlayerId);
  if (result.error) return res.status(400).json(result);
  state = result;
  res.json(publicState(state));
});

function publicState(s) {
  const drawingPlayer = s.flipThreeState
    ? s.players.find(p => p.id === s.flipThreeState.targetId)
    : s.players[s.currentPlayerIndex];

  const stats = calcStats(s.deck, drawingPlayer);

  return {
    phase: s.phase,
    round: s.round,
    players: s.players.map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      numberCards: p.numberCards,
      modifiers: p.modifiers,
      hasX2: p.hasX2,
      hasSecondChance: p.hasSecondChance,
      cumulativeScore: p.cumulativeScore,
    })),
    currentPlayerIndex: s.currentPlayerIndex,
    deckSize: s.deck.length,
    discardPileSize: s.discardPile.length,
    pendingActionCard: s.pendingActionCard,
    validTargets: getValidTargets(s),
    flipThreeState: s.flipThreeState,
    targetScore: s.targetScore,
    winner: s.winner ? { id: s.winner.id, name: s.winner.name, score: s.winner.cumulativeScore } : null,
    log: s.log.slice(-20),
    stats,
    roundSummary: s.roundSummary ?? null,
  };
}

const PORT = 3001;
app.listen(PORT, () => console.log(`Flip7 backend running on http://localhost:${PORT}`));

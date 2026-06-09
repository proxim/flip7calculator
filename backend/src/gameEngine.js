import { createFreshDeck, shuffle } from './deck.js';
import { createPlayer, calcRoundScore, isInactive } from './player.js';

// ── State shape ──────────────────────────────────────────────────────────────
// {
//   phase: 'setup' | 'playing' | 'awaitingAction' | 'roundEnd' | 'gameOver'
//   round: number
//   players: Player[]
//   currentPlayerIndex: number        // who draws next
//   roundStartPlayerIndex: number     // first drawer this round
//   deck: Card[]                      // undrawn cards; top = index 0
//   discardPile: Card[]               // played cards; reshuffled into deck only when deck empties
//   flipThreeState: null | { targetId, remaining }
//   pendingActionCard: null | Card    // card awaiting target choice
//   pendingActionDrawerId: null | string  // who drew the pending action (null = currentPlayer)
//   pendingActionQueue: { card, drawerId }[]  // deferred actions from flip-three drawing phase
//   roundSummary: null | { roundNumber, players: [...] }  // set at roundEnd, cleared on advance
//   targetScore: number
//   winner: null | Player
//   log: string[]
// }

export function newGame(playerNames, targetScore = 200) {
  const players = playerNames.map((name, i) => createPlayer(String(i), name));
  const deck = createFreshDeck();
  return {
    phase: 'playing',
    round: 1,
    players,
    currentPlayerIndex: 0,
    roundStartPlayerIndex: 0,
    deck,
    discardPile: [],
    flipThreeState: null,
    pendingActionCard: null,
    pendingActionDrawerId: null,
    pendingActionQueue: [],
    roundSummary: null,
    targetScore,
    winner: null,
    log: ['Game started!'],
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function activePlayers(state) {
  return state.players.filter(p => !isInactive(p));
}

function advanceTurn(state) {
  const active = activePlayers(state);
  if (active.length === 0) return state;

  if (active.length === 1) {
    state.currentPlayerIndex = state.players.indexOf(active[0]);
    return state;
  }

  let idx = (state.currentPlayerIndex + 1) % state.players.length;
  while (isInactive(state.players[idx])) {
    idx = (idx + 1) % state.players.length;
  }
  state.currentPlayerIndex = idx;
  return state;
}

function drawCard(state) {
  if (state.deck.length === 0) {
    if (state.discardPile.length === 0) return null;
    state.deck = shuffle(state.discardPile);
    state.discardPile = [];
    state.log.push('Deck exhausted — discard pile shuffled back in.');
  }
  return state.deck.shift();
}

function applyCardToPlayer(state, card, player) {
  if (card.type === 'number' || card.type === 'modifier') {
    player.heldCards.push(card);
  }

  if (card.type === 'number') {
    if (player.numberCards.includes(card.value)) {
      if (player.hasSecondChance) {
        player.hasSecondChance = false;
        state.log.push(`${player.name} busted on ${card.value} but used Second Chance!`);
        return { busted: false, flip7: false, usedSecondChance: true };
      }
      player.status = 'busted';
      // Cards stay with player (facedown) until round end — do NOT clear here
      state.log.push(`${player.name} busted on ${card.value}!`);
      return { busted: true, flip7: false };
    }
    player.numberCards.push(card.value);
    if (player.numberCards.length === 7) {
      player.status = 'flip7';
      state.log.push(`${player.name} hit FLIP 7!`);
      return { busted: false, flip7: true };
    }
    return { busted: false, flip7: false };
  }

  if (card.type === 'modifier') {
    if (card.value === 'x2') {
      player.hasX2 = true;
    } else {
      player.modifiers.push(card.value);
    }
    state.log.push(`${player.name} drew modifier ${card.value === 'x2' ? '×2' : '+' + card.value}.`);
    return { busted: false, flip7: false };
  }

  return { busted: false, flip7: false };
}

// Start resolving the next queued action (from flip-three drawing phase), or advance turn.
function resolveNextQueuedAction(state) {
  if (state.pendingActionQueue.length === 0) {
    checkRoundOver(state);
    if (state.phase === 'playing') advanceTurn(state);
    return;
  }

  const { card, drawerId } = state.pendingActionQueue.shift();
  const drawer = state.players.find(p => p.id === drawerId);

  // Second Chance may auto-resolve without needing a target
  if (card.action === 'secondChance') {
    const eligibleTargets = state.players.filter(p => !isInactive(p) && !p.hasSecondChance);
    if (!drawer.hasSecondChance) {
      drawer.hasSecondChance = true;
      state.log.push(`${drawer.name} drew and kept Second Chance.`);
      resolveNextQueuedAction(state);
      return;
    } else if (eligibleTargets.length === 0) {
      state.log.push(`${drawer.name} drew Second Chance — no eligible targets, discarded.`);
      resolveNextQueuedAction(state);
      return;
    }
  }

  state.pendingActionCard = card;
  state.pendingActionDrawerId = drawerId;
  state.phase = 'awaitingAction';
}

// Scores players, captures round summary, sets phase to 'roundEnd' or 'gameOver'.
// The actual card/state reset happens in actionNextRound when the player advances.
function prepareRoundEnd(state) {
  const summary = { roundNumber: state.round, players: [] };

  for (const p of state.players) {
    const roundScore = p.status === 'busted' ? 0 : calcRoundScore(p);
    if (p.status !== 'busted') {
      p.cumulativeScore += roundScore;
      state.log.push(`${p.name} scores ${roundScore} (total: ${p.cumulativeScore})`);
    }
    summary.players.push({
      id: p.id, name: p.name, status: p.status,
      roundScore, cumulativeScore: p.cumulativeScore,
      numberCards: [...p.numberCards],
      modifiers: [...p.modifiers],
      hasX2: p.hasX2,
    });
    if (p.cumulativeScore >= state.targetScore && !state.winner) {
      state.winner = p;
    }
  }

  // Compute next round's starting player now while currentPlayerIndex is meaningful
  const nextStart = (state.currentPlayerIndex + 1) % state.players.length;
  state.roundStartPlayerIndex = nextStart;

  state.roundSummary = summary;
  state.flipThreeState = null;
  state.pendingActionCard = null;
  state.pendingActionDrawerId = null;
  state.pendingActionQueue = [];

  if (state.winner) {
    state.phase = 'gameOver';
    state.log.push(`${state.winner.name} wins with ${state.winner.cumulativeScore} points!`);
  } else {
    state.phase = 'roundEnd';
  }
}

function checkRoundOver(state) {
  if (activePlayers(state).length === 0) {
    prepareRoundEnd(state);
  }
}

// ── Public actions ────────────────────────────────────────────────────────────

export function actionStop(state) {
  if (state.phase !== 'playing') return { error: 'Not in playing phase' };
  if (state.flipThreeState) return { error: 'Cannot stop during Flip Three' };

  const player = state.players[state.currentPlayerIndex];
  if (isInactive(player)) return { error: 'Player is not active' };

  player.status = 'stopped';
  state.log.push(`${player.name} chose to stop.`);
  checkRoundOver(state);
  if (state.phase === 'playing') advanceTurn(state);
  return state;
}

export function actionDraw(state) {
  if (state.phase !== 'playing') return { error: 'Not in playing phase' };
  if (state.pendingActionCard) return { error: 'Must resolve pending action first' };

  const player = state.flipThreeState
    ? state.players.find(p => p.id === state.flipThreeState.targetId)
    : state.players[state.currentPlayerIndex];

  if (!player || isInactive(player)) return { error: 'Player is not active' };
  if (state.deck.length === 0 && state.discardPile.length === 0) return { error: 'No cards available' };

  const card = drawCard(state);
  if (!card) return { error: 'No cards available' };
  state.log.push(`${player.name} drew ${cardLabel(card)}.`);

  if (card.type === 'action') {
    state.discardPile.push(card); // action cards go to discard immediately

    if (state.flipThreeState) {
      // During flip-three drawing phase:
      // Second Chance may auto-resolve; Freeze and FlipThree are always deferred.
      if (card.action === 'secondChance') {
        const eligibleTargets = state.players.filter(p => !isInactive(p) && !p.hasSecondChance);
        if (!player.hasSecondChance) {
          player.hasSecondChance = true;
          state.log.push(`${player.name} drew and kept Second Chance.`);
          // auto-resolved, no deferral needed
        } else if (eligibleTargets.length === 0) {
          state.log.push(`${player.name} drew Second Chance — no eligible targets, discarded.`);
        } else {
          state.pendingActionQueue.push({ card, drawerId: player.id });
        }
      } else {
        state.pendingActionQueue.push({ card, drawerId: player.id });
      }

      state.flipThreeState.remaining--;
      if (state.flipThreeState.remaining <= 0) {
        state.flipThreeState = null;
        resolveNextQueuedAction(state);
      }
      return state;
    }

    // Not in flip-three: process action immediately
    if (card.action === 'secondChance') {
      const eligibleTargets = state.players.filter(p => !isInactive(p) && !p.hasSecondChance);
      if (!player.hasSecondChance) {
        player.hasSecondChance = true;
        state.log.push(`${player.name} drew and kept Second Chance.`);
        checkRoundOver(state);
        if (state.phase === 'playing') advanceTurn(state);
      } else if (eligibleTargets.length === 0) {
        state.log.push(`${player.name} drew Second Chance — no eligible targets, discarded.`);
        checkRoundOver(state);
        if (state.phase === 'playing') advanceTurn(state);
      } else {
        state.pendingActionCard = card;
        state.phase = 'awaitingAction';
      }
      return state;
    }

    state.pendingActionCard = card;
    state.phase = 'awaitingAction';
    return state;
  }

  const result = applyCardToPlayer(state, card, player);

  if (state.flipThreeState && state.flipThreeState.targetId === player.id) {
    if (result.busted || result.flip7) {
      // Bust/flip7 cancels remaining draws and discards all deferred actions
      state.pendingActionQueue = [];
      state.flipThreeState = null;
      checkRoundOver(state);
      if (state.phase === 'playing') advanceTurn(state);
    } else {
      state.flipThreeState.remaining--;
      if (state.flipThreeState.remaining <= 0) {
        state.flipThreeState = null;
        resolveNextQueuedAction(state);
      }
      // else: more cards to draw in this flip-three sequence
    }
    return state;
  }

  if (result.busted || result.flip7) {
    checkRoundOver(state);
    if (state.phase === 'playing') advanceTurn(state);
  } else {
    checkRoundOver(state);
    if (state.phase === 'playing') advanceTurn(state);
  }

  return state;
}

export function actionApply(state, targetPlayerId) {
  if (state.phase !== 'awaitingAction') return { error: 'No pending action' };

  const card = state.pendingActionCard;
  const target = state.players.find(p => p.id === targetPlayerId);

  if (!target) return { error: 'Invalid target' };
  if (isInactive(target)) return { error: 'Target is not active' };

  // Determine drawer: queued action → pendingActionDrawerId, otherwise current turn's drawer
  const drawer = state.pendingActionDrawerId
    ? state.players.find(p => p.id === state.pendingActionDrawerId)
    : state.flipThreeState
      ? state.players.find(p => p.id === state.flipThreeState.targetId)
      : state.players[state.currentPlayerIndex];

  if (card.action === 'secondChance' && target.hasSecondChance) {
    return { error: 'Target already has a Second Chance card' };
  }

  state.pendingActionCard = null;
  state.pendingActionDrawerId = null;
  state.phase = 'playing';

  if (card.action === 'freeze') {
    target.status = 'frozen';
    state.log.push(`${drawer.name} froze ${target.name}.`);
    if (state.flipThreeState?.targetId === target.id) {
      state.flipThreeState = null;
      state.pendingActionQueue = [];
    }
    checkRoundOver(state);
    if (state.phase === 'playing' && !state.flipThreeState) {
      resolveNextQueuedAction(state);
    }

  } else if (card.action === 'flipThree') {
    state.log.push(`${drawer.name} played Flip Three on ${target.name}.`);
    state.flipThreeState = { targetId: target.id, remaining: 3 };
    // Turn passes to the flip-three target; resolveNextQueuedAction will run when done

  } else if (card.action === 'secondChance') {
    target.hasSecondChance = true;
    state.log.push(`${drawer.name} gave Second Chance to ${target.name}.`);
    if (!state.flipThreeState) resolveNextQueuedAction(state);
  }

  return state;
}

export function actionNextRound(state) {
  if (state.phase !== 'roundEnd') return { error: 'Not in round end phase' };

  const nextStart = state.roundStartPlayerIndex;
  for (const p of state.players) {
    state.discardPile.push(...p.heldCards);
  }
  state.round++;
  for (const p of state.players) {
    p.status = 'active';
    p.numberCards = [];
    p.modifiers = [];
    p.hasX2 = false;
    p.hasSecondChance = false;
    p.heldCards = [];
  }
  state.currentPlayerIndex = nextStart;
  state.roundSummary = null;
  state.phase = 'playing';
  state.log.push(`--- Round ${state.round} begins ---`);
  return state;
}

function cardLabel(card) {
  if (card.type === 'number') return `number ${card.value}`;
  if (card.type === 'modifier') return card.value === 'x2' ? 'modifier ×2' : `modifier +${card.value}`;
  if (card.type === 'action') return `action: ${card.action}`;
  return 'unknown card';
}

export function getValidTargets(state) {
  if (state.phase !== 'awaitingAction') return [];
  const card = state.pendingActionCard;
  return state.players
    .filter(p => {
      if (isInactive(p)) return false;
      if (card?.action === 'secondChance' && p.hasSecondChance) return false;
      return true;
    })
    .map(p => p.id);
}

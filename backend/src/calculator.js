// EV of drawing the next card = E[score after draw] − current score.
// Uses only the current deck (undrawn cards). The discard pile is not reachable
// until the deck empties, so it doesn't affect the immediate draw probability.

export function calcStats(deck, player) {
  if (!player || player.status !== 'active') return null;

  const held = player.numberCards;
  const numSum = held.reduce((a, b) => a + b, 0);
  const flatBonus = player.modifiers.reduce((a, b) => a + b, 0);
  const mul = player.hasX2 ? 2 : 1;
  const hasSC = player.hasSecondChance;

  const currentScore = numSum * mul + flatBonus;
  const deckSize = deck.length;

  if (deckSize === 0) return { currentScore, ev: 0, bustChance: 0, breakdown: [], deckSize: 0, secondChanceActive: hasSC };

  let evNumerator = 0;
  let bustCount = 0;

  const dangerMap = {};
  const safeMap = {};

  for (const card of deck) {
    if (card.type === 'number') {
      if (held.includes(card.value)) {
        bustCount++;
        dangerMap[card.value] = (dangerMap[card.value] ?? 0) + 1;
        evNumerator += hasSC ? 0 : -currentScore;
      } else {
        safeMap[card.value] = (safeMap[card.value] ?? 0) + 1;
        const isFlip7 = held.length === 6;
        const delta = (card.value + (isFlip7 ? 15 : 0)) * mul;
        evNumerator += delta;
      }
    } else if (card.type === 'modifier') {
      if (card.value === 'x2') {
        evNumerator += player.hasX2 ? 0 : numSum;
      } else {
        evNumerator += card.value;
      }
    }
    // action cards → delta = 0
  }

  const ev = evNumerator / deckSize;
  const bustChance = bustCount / deckSize;

  const breakdown = [];

  for (const [val, count] of Object.entries(dangerMap)) {
    const delta = hasSC ? 0 : -currentScore;
    breakdown.push({ label: `${val} (bust)`, count, delta, type: 'bust' });
  }
  for (const [val, count] of Object.entries(safeMap)) {
    const isFlip7 = held.length === 6;
    const delta = (Number(val) + (isFlip7 ? 15 : 0)) * mul;
    breakdown.push({ label: String(val), count, delta, type: 'safe' });
  }

  const modCounts = {};
  for (const card of deck) {
    if (card.type === 'modifier') {
      const key = card.value === 'x2' ? 'x2' : `+${card.value}`;
      modCounts[key] = (modCounts[key] ?? 0) + 1;
    }
  }
  for (const [key, count] of Object.entries(modCounts)) {
    const delta = key === 'x2' ? (player.hasX2 ? 0 : numSum) : Number(key.slice(1));
    breakdown.push({ label: key, count, delta, type: 'modifier' });
  }

  const actionCounts = {};
  for (const card of deck) {
    if (card.type === 'action') {
      actionCounts[card.action] = (actionCounts[card.action] ?? 0) + 1;
    }
  }
  for (const [action, count] of Object.entries(actionCounts)) {
    breakdown.push({ label: action, count, delta: 0, type: 'action' });
  }

  breakdown.sort((a, b) => {
    const order = { bust: 0, safe: 1, modifier: 2, action: 3 };
    return (order[a.type] - order[b.type]) || b.delta - a.delta;
  });

  return { currentScore, ev, bustChance, breakdown, deckSize, secondChanceActive: hasSC };
}

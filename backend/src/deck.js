export function createFreshDeck() {
  const cards = [];

  // Number cards: 0 has 1 copy; N has N copies for N=1..12
  cards.push({ type: 'number', value: 0 });
  for (let n = 1; n <= 12; n++) {
    for (let i = 0; i < n; i++) {
      cards.push({ type: 'number', value: n });
    }
  }

  // Score modifiers
  for (const v of [2, 4, 6, 8, 8, 10]) {
    cards.push({ type: 'modifier', value: v });
  }
  cards.push({ type: 'modifier', value: 'x2' });

  // Action cards (3 of each)
  for (let i = 0; i < 3; i++) {
    cards.push({ type: 'action', action: 'freeze' });
    cards.push({ type: 'action', action: 'flipThree' });
    cards.push({ type: 'action', action: 'secondChance' });
  }

  return shuffle(cards);
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Called at round end: remaining known top stays, played cards shuffled beneath
export function reshuffleAfterRound(knownTop, playedThisRound) {
  return [...knownTop, ...shuffle(playedThisRound)];
}

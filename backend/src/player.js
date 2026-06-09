export function createPlayer(id, name) {
  return {
    id,
    name,
    status: 'active',       // active | stopped | frozen | busted | flip7
    numberCards: [],        // number values held
    modifiers: [],          // flat modifier values (numbers) held
    hasX2: false,
    hasSecondChance: false,
    bustCard: null,         // value of the duplicate card that caused a bust
    cumulativeScore: 0,
    heldCards: [],          // actual card objects held; moved to discardPile at round end
  };
}

export function calcRoundScore(player) {
  if (player.status === 'busted') return 0;

  const numSum = player.numberCards.reduce((a, b) => a + b, 0);
  const flip7Bonus = player.status === 'flip7' ? 15 : 0;
  const base = numSum + flip7Bonus;
  const afterX2 = player.hasX2 ? base * 2 : base;
  const flatBonus = player.modifiers.reduce((a, b) => a + b, 0);
  return afterX2 + flatBonus;
}

export function isInactive(player) {
  return player.status !== 'active';
}

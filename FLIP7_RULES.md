# Flip 7 — Complete Rules

## Overview

Flip 7 is a push-your-luck card game for 3–8 players. Players sit in a circle and take turns drawing one card at a time clockwise from a shared deck, trying to collect 7 unique number cards without going bust. The first player to reach 200 points wins.

---

## Components

**Total deck: 95 cards**

### Number Cards (79 total)

Each number N has exactly N copies in the deck, except 0 which has 1 copy.

| Value | Copies | Value | Copies |
|-------|--------|-------|--------|
| 0     | 1      | 7     | 7      |
| 1     | 1      | 8     | 8      |
| 2     | 2      | 9     | 9      |
| 3     | 3      | 10    | 10     |
| 4     | 4      | 11    | 11     |
| 5     | 5      | 12    | 12     |
| 6     | 6      |       |        |

### Score Modifier Cards (7 total)

| Card | Copies |
|------|--------|
| +2   | 1      |
| +4   | 1      |
| +6   | 1      |
| +8   | 2      |
| +10  | 1      |
| ×2   | 1      |

### Action Cards (9 total)

| Card          | Copies |
|---------------|--------|
| Freeze        | 3      |
| Flip Three    | 3      |
| Second Chance | 3      |

---

## Setup

1. Shuffle all 95 cards into one deck and place it face-down in the center.
2. All players start with 0 cumulative points.
3. Players sit in a circle. Determine the first player randomly.

---

## Round Structure

A round proceeds as follows:

1. All players begin the round **active**.
2. Starting with the first player, active players take turns drawing **one card** from the top of the deck, clockwise.
3. After resolving their card, the draw passes to the next active player clockwise.
4. A player who **busts**, **freezes**, **voluntarily stops**, or achieves a **Flip 7** becomes **inactive** and is skipped in future rotations.
5. **Exception:** If only one active player remains, that player may continue drawing cards on every turn (no need to pass).
6. The round ends when all players are inactive.

---

## On Your Draw

When it is your turn to draw, you may either:

- **Draw** the top card of the deck and resolve it, OR
- **Stop** voluntarily, locking in your current score (you become inactive).

> You may choose to stop voluntarily at any point when the draw reaches you — including after drawing a Score Modifier card on a previous turn.

---

## Resolving Cards

### Number Cards

- Place the card face-up in your area.
- **If you already have that number → BUST** (see Busting).
- **If you now have 7 unique numbers → FLIP 7** (see Flip 7).
- Otherwise, the draw passes to the next active player.

### Score Modifier Cards

- Place the card face-up in your area.
- It will be applied to your score at end of round.
- The draw passes to the next active player (you may have chosen to stop instead).

### Action Cards

When you draw an action card, you choose to apply it to **yourself or any other active player** (one who has not busted, frozen, or stopped).

| Card              | Effect when applied to a target |
|-------------------|----------------------------------|
| **Freeze**        | The target immediately becomes inactive and scores their current cards. They cannot choose to continue. |
| **Flip Three**    | The target must immediately draw 3 cards in a row (see Flip Three rules below). |
| **Second Chance** | The target receives a Second Chance card. A player may hold **at most one** Second Chance at a time; if the chosen target already holds one, a different eligible target must be chosen. |

You may always choose to apply an action card to yourself. After the action fully resolves, the draw passes to the next active player as normal.

---

## Flip Three

When a Flip Three card is played on a target:

1. The target draws **3 cards in a row** without being able to stop. Each card is applied as normal (numbers/modifiers update their hand; action cards are **collected but not resolved yet**).
2. After **all 3 cards have been drawn**, any action cards (Freeze, Flip Three) collected during the sequence are resolved one at a time in the order they were drawn. Each may require a target selection.
3. **If the target busts during the 3 draws**, the sequence ends immediately and any collected action cards are **discarded without effect**.
4. **Second Chance** drawn during a Flip Three sequence is auto-applied to the drawer immediately (if they don't already have one), or discarded if no eligible target exists. Only if a target selection is needed does it defer to the resolution phase.

---

## Busting

If you draw a number card you already have:

- You **bust** and become inactive.
- You score **0** for this round.
- Your cards remain face-down in front of you until the round ends, at which point they go to the **discard pile** (action cards are excluded as they are already discarded when drawn).
- If you hold a **Second Chance**, you may discard it to survive the bust. Discard the duplicate card and the Second Chance card. The draw passes to the next active player — you do **not** draw again immediately.

---

## Flip 7

If you collect exactly 7 unique number cards:

- You achieve a **Flip 7** and become inactive.
- Score your cards using the formula below, with the +15 bonus added before the ×2 modifier is applied.

---

## Scoring

When you become inactive (voluntarily stopped, frozen, or Flip 7):

1. **Sum** your number card values.
2. **Add +15** if you achieved a Flip 7.
3. **Apply ×2** (if you hold it), doubling the result so far.
4. **Add all flat modifiers** (+2, +4, +6, +8, +10) you hold.

| Outcome         | Formula                                              |
|-----------------|------------------------------------------------------|
| Stopped / Froze | (sum) × (×2 if held) + flat modifiers                |
| Flip 7          | (sum + **15**) × (×2 if held) + flat modifiers       |
| Bust            | **0** — cards stay face-down until round end         |

**Example:** You have numbers summing to 30, a Flip 7, a ×2, and a +8.
→ (30 + 15) × 2 + 8 = **98 points**

Add the final score to your cumulative total.

---

## Deck & Discard Pile

The deck is **not reshuffled between rounds**.

- Cards played during a round (drawn and resolved) go to a **discard pile**.
  - Number and modifier cards go to the discard pile when the **round ends** (even for busted players — their face-down cards go to discard at round end).
  - Action cards go to the discard pile **immediately** when drawn or played.
- The undrawn portion of the deck carries over into the next round untouched.
- **The discard pile is only shuffled back into the deck when the deck runs out of cards mid-game.** If the deck empties during a draw, the discard pile is immediately shuffled to form the new deck before that draw proceeds.

This means the composition of the current deck is always fully known (it is the original deck minus everything drawn so far). Tracking what has been played is strategically valuable.

---

## Turn Order Between Rounds

The player who would have drawn **next** at the moment the round ended is the **first to draw** in the following round. The clockwise rotation continues from there.

---

## Winning

The first player whose cumulative score reaches or exceeds **200 points** wins.

If multiple players cross 200 in the same round, the player with the **highest cumulative score** wins.

---

## Strategy Notes (for EV Calculator Reference)

- **Bust probability** on any given draw depends on how many of your currently held numbers remain in the undrawn deck — which is fully known since the deck is never reshuffled until empty.
- **Low numbers (0, 1) are extremely safe** — only 1 copy of each exists in the entire deck. Once you hold a 0 or 1, you can never bust on that value again.
- **High numbers (10–12) are risky** — many copies exist, and the deck skews toward them by count.
- **Modifiers (especially ×2)** dramatically raise EV. Because the +15 Flip 7 bonus is added before ×2 is applied, chasing a Flip 7 while holding ×2 is particularly powerful.
- **Flip Three on an opponent** is an offensive play that forces their risk exposure. Note that any action cards they draw during the sequence are resolved after all 3 cards are drawn.
- **Freeze on an opponent** can lock them in at a low score before they draw more cards.
- **Second Chance** raises your personal EV by absorbing one bust event; giving it to a player with a large hand also serves as a cooperative play.
- **Deck tracking** is a core skill: the deck composition is fully deterministic until the discard pile reshuffles in.

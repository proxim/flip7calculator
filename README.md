# Flip 7 Calculator

A live-game tracker and expected-value calculator for the push-your-luck card game **Flip 7** (3–8 players).

---

## Features

**Game tracking**
- Track a full game for 3–8 players with cumulative scores and a configurable target score
- All game mechanics implemented: number cards, score modifiers (+2/+4/+6/+8/+10/×2), and action cards (Freeze, Flip Three, Second Chance)
- Full Flip Three sequencing — action cards drawn during the sequence are queued and resolved after all 3 draws
- Round-end summary popup showing each player's cards, round score, and updated total before advancing

**EV Calculator** (right sidebar)
- Shows expected value of drawing vs. stopping based on the current deck composition
- Bust chance displayed as a percentage with a colour-coded bar
- Full card breakdown: numbers listed descending (bust cards highlighted red), modifiers, and action cards with deck counts
- Hit / Stay recommendation updated after every draw

**Manual Draw**
- Override the random draw with any specific card still in the deck
- Floating keypad grouped by type (numbers 0–12, modifiers, actions)
- Cards with a count of 0 are greyed out

**Visual polish**
- Card chips spring-pop onto the hand when drawn
- Current drawing player has a breathing glow
- Bust triggers a shake animation; Flip 7 triggers a scale pop and sustained gold pulse
- Newest log entry slides in on each event
- Round-summary and manual-draw panels slide in from below

---

## Running locally

The app has two independent processes. Run each in its own terminal.

**Backend** (Node.js + Express, port 3001)
```bash
cd backend
npm install
npm run dev
```

**Frontend** (React + Vite, port 5173)
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser. The Vite dev server proxies `/api` requests to the backend automatically.

---

## Deploying for free (Render)

The app runs as a single service — Express builds and serves the React app, so there is only one URL to share.

1. Push this repo to GitHub (already done).
2. Go to [render.com](https://render.com) → **New → Web Service** → connect your GitHub repo.
3. Set the following in the Render dashboard:

| Setting | Value |
|---|---|
| **Environment** | Node |
| **Build command** | `npm run build` |
| **Start command** | `npm start` |
| **Instance type** | Free |

4. Click **Deploy**. Render installs dependencies, builds the React app, and starts the server. First deploy takes ~2 minutes.

> **Note:** The free tier spins down after 15 minutes of inactivity. The first request after that takes ~30 seconds to cold-start. For active play sessions this is fine — it won't spin down mid-game.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite |
| Backend | Node.js, Express |
| State | In-memory (single shared game; restart server to reset) |
| Styling | Plain CSS with CSS custom properties and keyframe animations |

---

## Rules

See [FLIP7_RULES.md](./FLIP7_RULES.md) for the complete rules including scoring formula, Flip Three sequencing, deck/discard behaviour, and strategy notes.

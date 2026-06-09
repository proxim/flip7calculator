const BASE = 'http://localhost:3001/api/game';

async function req(path, method = 'GET', body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  return data;
}

export const api = {
  start: (playerNames, targetScore) => req('/start', 'POST', { playerNames, targetScore }),
  getState: () => req('/state'),
  draw: () => req('/draw', 'POST'),
  stop: () => req('/stop', 'POST'),
  apply: (targetPlayerId) => req('/apply', 'POST', { targetPlayerId }),
  nextRound: () => req('/nextround', 'POST'),
};

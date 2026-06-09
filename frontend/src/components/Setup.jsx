import { useState } from 'react';
import { api } from '../api';
import './Setup.css';

export default function Setup({ onStart }) {
  const [count, setCount] = useState(3);
  const [names, setNames] = useState(['', '', '', '', '', '', '', '']);
  const [target, setTarget] = useState(200);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function setName(i, val) {
    setNames(prev => { const n = [...prev]; n[i] = val; return n; });
  }

  async function handleStart() {
    const playerNames = names.slice(0, count).map((n, i) => n.trim() || `Player ${i + 1}`);
    setLoading(true);
    setError('');
    try {
      const state = await api.start(playerNames, target);
      onStart(state);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="setup">
      <h1 className="setup-title">FLIP 7</h1>
      <p className="setup-sub">Push your luck. Collect 7. Don't bust.</p>

      <div className="setup-card">
        <label className="setup-label">
          Number of Players
          <input
            type="number"
            min={3} max={8}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
          />
        </label>

        <div className="setup-names">
          {Array.from({ length: count }, (_, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Player ${i + 1}`}
              value={names[i]}
              onChange={e => setName(i, e.target.value)}
            />
          ))}
        </div>

        <label className="setup-label">
          Score Target
          <input
            type="number"
            min={50}
            value={target}
            onChange={e => setTarget(Number(e.target.value))}
          />
        </label>

        {error && <p className="setup-error">{error}</p>}

        <button className="btn-primary" onClick={handleStart} disabled={loading}>
          {loading ? 'Starting…' : 'Start Game'}
        </button>
      </div>
    </div>
  );
}

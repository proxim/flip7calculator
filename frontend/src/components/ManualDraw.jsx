import './ManualDraw.css';

const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const MODIFIERS = [
  { label: '+2',  key: 'm_2',  spec: { type: 'modifier', value: 2 } },
  { label: '+4',  key: 'm_4',  spec: { type: 'modifier', value: 4 } },
  { label: '+6',  key: 'm_6',  spec: { type: 'modifier', value: 6 } },
  { label: '+8',  key: 'm_8',  spec: { type: 'modifier', value: 8 } },
  { label: '+10', key: 'm_10', spec: { type: 'modifier', value: 10 } },
  { label: '×2',  key: 'm_x2', spec: { type: 'modifier', value: 'x2' } },
];

const ACTIONS = [
  { label: 'Freeze',     key: 'a_freeze',       spec: { type: 'action', action: 'freeze' } },
  { label: 'Flip Three', key: 'a_flipThree',     spec: { type: 'action', action: 'flipThree' } },
  { label: '2nd Chance', key: 'a_secondChance',  spec: { type: 'action', action: 'secondChance' } },
];

export default function ManualDraw({ inventory, onDraw, onClose, loading }) {
  return (
    <div className="md-panel">
      <div className="md-header">
        <span className="md-title">Manual Draw</span>
        <button className="md-close" onClick={onClose}>✕</button>
      </div>

      <div className="md-section">
        <span className="md-label">Numbers</span>
        <div className="md-grid md-numbers-grid">
          {NUMBERS.map(v => {
            const count = inventory[`n_${v}`] ?? 0;
            return (
              <button
                key={v}
                className={`md-card md-num${count === 0 ? ' md-gone' : ''}`}
                disabled={count === 0 || loading}
                onClick={() => onDraw({ type: 'number', value: v })}
              >
                <span className="md-val">{v}</span>
                <span className="md-count">×{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="md-section">
        <span className="md-label">Modifiers</span>
        <div className="md-grid md-mods-grid">
          {MODIFIERS.map(({ label, key, spec }) => {
            const count = inventory[key] ?? 0;
            return (
              <button
                key={key}
                className={`md-card md-mod${count === 0 ? ' md-gone' : ''}`}
                disabled={count === 0 || loading}
                onClick={() => onDraw(spec)}
              >
                <span className="md-val">{label}</span>
                <span className="md-count">×{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="md-section">
        <span className="md-label">Actions</span>
        <div className="md-grid md-actions-grid">
          {ACTIONS.map(({ label, key, spec }) => {
            const count = inventory[key] ?? 0;
            return (
              <button
                key={key}
                className={`md-card md-action${count === 0 ? ' md-gone' : ''}`}
                disabled={count === 0 || loading}
                onClick={() => onDraw(spec)}
              >
                <span className="md-val">{label}</span>
                <span className="md-count">×{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

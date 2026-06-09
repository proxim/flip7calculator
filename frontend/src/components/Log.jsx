import './Log.css';

export default function Log({ entries }) {
  return (
    <div className="log">
      <div className="log-title">Game Log</div>
      <div className="log-entries">
        {[...entries].reverse().map((entry, i) => (
          <div key={i} className="log-entry">{entry}</div>
        ))}
      </div>
    </div>
  );
}

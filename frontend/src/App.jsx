import { useState } from 'react';
import Setup from './components/Setup';
import Game from './components/Game';
import './App.css';

export default function App() {
  const [gameState, setGameState] = useState(null);

  return (
    <div className="app">
      {!gameState
        ? <Setup onStart={setGameState} />
        : <Game initialState={gameState} onNewGame={() => setGameState(null)} />}
    </div>
  );
}

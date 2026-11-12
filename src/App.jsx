import { useCallback, useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import GameScreen from './components/GameScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import { useAudio } from './hooks/useAudio.js';
import { loadHighScore, loadSoundEnabled, saveHighScore, saveSoundEnabled } from './utils/storage.js';

/** App 只負責畫面切換、音效設定與最高分；遊戲邏輯在 useGameEngine / gameLogic */
export default function App() {
  const [screen, setScreen] = useState('start');
  const [round, setRound] = useState(0);
  const [soundOn, setSoundOn] = useState(loadSoundEnabled);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [result, setResult] = useState(null);
  const audio = useAudio(soundOn);

  const toggleSound = useCallback(() => {
    const next = !soundOn;
    saveSoundEnabled(next);
    // 在使用者手勢中建立 / 解鎖 AudioContext
    if (next) audio.ensureContext();
    setSoundOn(next);
  }, [soundOn, audio]);

  const startGame = useCallback(() => {
    audio.unlock();
    setResult(null);
    setRound((r) => r + 1); // 以新的 key 重新掛載 GameScreen，完全清除上一局
    setScreen('game');
  }, [audio]);

  const finishGame = useCallback((res) => {
    const saved = saveHighScore(res.score);
    setHighScore(saved.highScore);
    setResult({ ...res, ...saved });
    setScreen('result');
  }, []);

  const goHome = useCallback(() => setScreen('start'), []);

  return (
    <main className="app-shell">
      <div className="game-frame">
        {screen === 'start' && (
          <StartScreen highScore={highScore} soundOn={soundOn} onToggleSound={toggleSound} onStart={startGame} />
        )}
        {screen === 'game' && (
          <GameScreen
            key={round}
            audio={audio}
            soundOn={soundOn}
            onToggleSound={toggleSound}
            onFinish={finishGame}
            onQuit={goHome}
          />
        )}
        {screen === 'result' && result && (
          <ResultScreen result={result} onRestart={startGame} onHome={goHome} />
        )}
      </div>
    </main>
  );
}

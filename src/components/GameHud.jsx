import { UiIcon } from './art/SceneArt.jsx';

/** 頂部資訊區：剩餘時間、分數、Combo */
export default function GameHud({ timeLeft, score, combo, rush, onPause }) {
  const seconds = Math.ceil(timeLeft);
  const low = seconds <= 10;
  return (
    <header className={`hud ${rush ? 'is-rush' : ''}`}>
      <div className={`hud-item hud-time ${low ? 'is-low' : ''}`} aria-label={`剩餘 ${seconds} 秒`}>
        <UiIcon name="clock" />
        <span className="hud-value" key={low ? seconds : 't'}>
          {seconds}
        </span>
        <small>秒</small>
      </div>
      <div className="hud-item hud-score" aria-label={`分數 ${score}`}>
        <small>分數</small>
        <span className="hud-value" key={score}>
          {score}
        </span>
      </div>
      <div className={`hud-item hud-combo ${combo >= 3 ? 'is-hot' : ''}`} aria-label={`連續 ${combo}`}>
        <small>Combo</small>
        <span className="hud-value" key={combo}>
          ×{combo}
        </span>
      </div>
      <button type="button" className="hud-pause" onClick={onPause} aria-label="暫停">
        <UiIcon name="pause" />
      </button>
    </header>
  );
}

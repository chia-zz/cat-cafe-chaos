import { UiIcon } from './art/SceneArt.jsx';
import { useI18n } from '../i18n/index.js';

/** 頂部資訊區：剩餘時間、分數、Combo */
export default function GameHud({ timeLeft, score, combo, rush, onPause }) {
  const { t } = useI18n();
  const seconds = Math.ceil(timeLeft);
  const low = seconds <= 10;
  return (
    <header className={`hud ${rush ? 'is-rush' : ''}`}>
      <div className={`hud-item hud-time ${low ? 'is-low' : ''}`} aria-label={t('hud.timeAria', { sec: seconds })}>
        <UiIcon name="clock" />
        <span className="hud-value" key={low ? seconds : 't'}>
          {seconds}
        </span>
        <small>{t('hud.sec')}</small>
      </div>
      <div className="hud-item hud-score" aria-label={t('hud.scoreAria', { n: score })}>
        <small>{t('hud.score')}</small>
        <span className="hud-value" key={score}>
          {score}
        </span>
      </div>
      <div className={`hud-item hud-combo ${combo >= 3 ? 'is-hot' : ''}`} aria-label={t('hud.comboAria', { n: combo })}>
        <small>{t('hud.combo')}</small>
        <span className="hud-value" key={combo}>
          ×{combo}
        </span>
      </div>
      <button type="button" className="hud-pause" onClick={onPause} aria-label={t('hud.pause')}>
        <UiIcon name="pause" />
      </button>
    </header>
  );
}

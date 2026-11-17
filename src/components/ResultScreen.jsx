import { useEffect, useState } from 'react';
import CatCharacter from './CatCharacter.jsx';
import { Sparkle, UiIcon } from './art/SceneArt.jsx';
import { useI18n } from '../i18n/index.js';

function useCountUp(target, duration = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || target <= 0) {
      setValue(target);
      return undefined;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

const CONFETTI = Array.from({ length: 10 }, (_, i) => ({
  left: `${8 + i * 9}%`,
  delay: `${(i % 5) * 0.18}s`,
  size: 12 + (i % 3) * 5,
}));

export default function ResultScreen({ result, onRestart, onHome }) {
  const { t } = useI18n();
  const score = useCountUp(result.score);
  const mood = result.score >= 1200 ? 'happy' : result.score >= 500 ? 'waiting' : 'impatient';

  return (
    <div className="result-screen">
      <div className="result-confetti" aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <Sparkle key={i} style={{ left: c.left, animationDelay: c.delay, width: c.size, height: c.size }} />
        ))}
      </div>

      <div className="result-hero">
        <CatCharacter catId="orange" mood={mood} className="result-cat" />
        <p className="result-caption">{t('result.caption')}</p>
      </div>

      <div className="result-card">
        <p className="result-label">{t('result.finalScore')}</p>
        <p className="result-score">{score}</p>
        {result.isNewRecord && result.score > 0 && <p className="new-record">{t('result.newRecord')}</p>}
        <p className="result-title">
          <span>{t('result.title')}</span>
          <strong>{t(`titles.${result.title}`)}</strong>
        </p>

        <dl className="result-stats">
          <div>
            <dt>{t('result.served')}</dt>
            <dd>{result.served}</dd>
          </div>
          <div>
            <dt>{t('result.failed')}</dt>
            <dd>{result.failed}</dd>
          </div>
          <div>
            <dt>{t('result.maxCombo')}</dt>
            <dd>{result.maxCombo}</dd>
          </div>
          <div>
            <dt>{t('result.best')}</dt>
            <dd>{result.highScore}</dd>
          </div>
        </dl>
      </div>

      <div className="result-actions">
        <button type="button" className="btn btn-primary" onClick={onRestart} autoFocus>
          {t('result.again')}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onHome}>
          <UiIcon name="paw" />
          {t('result.home')}
        </button>
      </div>
    </div>
  );
}

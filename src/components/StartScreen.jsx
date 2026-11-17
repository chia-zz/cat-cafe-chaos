import CatCharacter from './CatCharacter.jsx';
import IngredientIcon from './art/IngredientIcon.jsx';
import PlayerBadge from './PlayerBadge.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { CafeBackdrop, LogoMark, LuckyCatArt, UiIcon } from './art/SceneArt.jsx';
import { GAME_CONFIG } from '../utils/gameConfig.js';
import { useI18n } from '../i18n/index.js';

/** [前段, 粗體, 後段] → 文字 */
function Rich({ parts }) {
  const [before, bold, after] = parts;
  return (
    <span>
      {before}
      <b>{bold}</b>
      {after}
    </span>
  );
}

export default function StartScreen({ highScore, soundOn, onToggleSound, onStart }) {
  const { t } = useI18n();
  const subtitle = t('start.subtitle');
  return (
    <div className="start-screen">
      <button
        type="button"
        className="sound-toggle"
        onClick={onToggleSound}
        aria-pressed={soundOn}
        aria-label={t(soundOn ? 'start.turnSoundOff' : 'start.turnSoundOn')}
      >
        <UiIcon name={soundOn ? 'sound-on' : 'sound-off'} />
        <span>{t(soundOn ? 'start.soundOn' : 'start.soundOff')}</span>
      </button>

      <PlayerBadge className="start-player" />

      <div className="start-logo">
        <LogoMark />
        <h1>
          <span className="logo-line">{t('start.titleLine1')}</span>
          <span className="logo-line logo-chaos">{t('start.titleLine2')}</span>
        </h1>
        {subtitle && <p className="logo-en">{subtitle}</p>}
      </div>

      <div className="start-scene" aria-hidden="true">
        <CafeBackdrop />
        <div className="start-cats">
          <CatCharacter catId="calico" mood="waiting" />
          <CatCharacter catId="orange" mood="happy" />
          <CatCharacter catId="black" mood="waiting" />
          <CatCharacter catId="white" mood="happy" />
        </div>
      </div>

      <ul className="how-to">
        <li>
          <span className="how-icon">
            <UiIcon name="paw" />
          </span>
          <Rich parts={t('start.how1')} />
        </li>
        <li>
          <span className="how-icon">
            <IngredientIcon id="coffee" />
          </span>
          <Rich parts={t('start.how2', { pts: Math.abs(GAME_CONFIG.scoring.wrongIngredient) })} />
        </li>
        <li>
          <span className="how-icon">
            <LuckyCatArt />
          </span>
          <Rich parts={t('start.how3')} />
        </li>
      </ul>

      <div className="start-bottom">
        <p className="best-score">
          <UiIcon name="star" />
          {t('start.best')} <strong>{highScore}</strong>
        </p>
        <button type="button" className="btn btn-primary btn-start" onClick={onStart}>
          {t('start.start')}
        </button>
        <p className="start-note">{t('start.note', { sec: GAME_CONFIG.duration })}</p>
        <LanguageSwitcher />
      </div>
    </div>
  );
}

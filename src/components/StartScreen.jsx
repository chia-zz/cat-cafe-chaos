import CatCharacter from './CatCharacter.jsx';
import IngredientIcon from './art/IngredientIcon.jsx';
import PlayerBadge from './PlayerBadge.jsx';
import { CafeBackdrop, LogoMark, LuckyCatArt, UiIcon } from './art/SceneArt.jsx';

export default function StartScreen({ highScore, soundOn, onToggleSound, onStart }) {
  return (
    <div className="start-screen">
      <button
        type="button"
        className="sound-toggle"
        onClick={onToggleSound}
        aria-pressed={soundOn}
        aria-label={soundOn ? '關閉音效' : '開啟音效'}
      >
        <UiIcon name={soundOn ? 'sound-on' : 'sound-off'} />
        <span>{soundOn ? '音效開' : '音效關'}</span>
      </button>

      <PlayerBadge className="start-player" />

      <div className="start-logo">
        <LogoMark />
        <h1>
          <span className="logo-line">貓咪咖啡廳</span>
          <span className="logo-line logo-chaos">大混亂！</span>
        </h1>
        <p className="logo-en">Cat Café Chaos!</p>
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
          <span>點選貓咪訂單，<b>依序</b>點擊食材製作餐點</span>
        </li>
        <li>
          <span className="how-icon">
            <IngredientIcon id="coffee" />
          </span>
          <span>放錯材料會<b>扣 10 分</b>、進度歸零</span>
        </li>
        <li>
          <span className="how-icon">
            <LuckyCatArt />
          </span>
          <span>小心改單、打翻牛奶，把握<b>招財貓</b>加倍時間！</span>
        </li>
      </ul>

      <div className="start-bottom">
        <p className="best-score">
          <UiIcon name="star" />
          最高分 <strong>{highScore}</strong>
        </p>
        <button type="button" className="btn btn-primary btn-start" onClick={onStart}>
          開始營業
        </button>
        <p className="start-note">一局 90 秒・手機直式遊玩最佳</p>
      </div>
    </div>
  );
}

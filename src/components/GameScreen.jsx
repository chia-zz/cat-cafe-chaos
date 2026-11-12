import { useCallback, useEffect, useRef, useState } from 'react';
import GameHud from './GameHud.jsx';
import OrderBoard from './OrderBoard.jsx';
import CookingStation from './CookingStation.jsx';
import CatCharacter from './CatCharacter.jsx';
import PlayerBadge from './PlayerBadge.jsx';
import { EventBanner, EventBar } from './EventNotification.jsx';
import { UiIcon } from './art/SceneArt.jsx';
import { useGameEngine } from '../hooks/useGameEngine.js';
import { GAME_CONFIG } from '../utils/gameConfig.js';
import { getResult, isLuckyActive } from '../utils/gameLogic.js';

/** 遊戲效果 → 音效對照 */
const EFFECT_SOUNDS = {
  spawn: 'meow',
  select: 'click',
  blocked: 'click',
  wrong: 'wrong',
  timeout: 'angry',
  combo: 'combo',
  wipe: 'wipe',
  cleaned: 'correct',
  go: 'go',
  gameover: 'gameover',
};

export default function GameScreen({ audio, soundOn, onToggleSound, onFinish, onQuit }) {
  const [burst, setBurst] = useState(null);
  const [shake, setShake] = useState(null);
  const finishTimer = useRef(0);
  const counter = useRef(0);

  const handleEffects = useCallback(
    (effects, state) => {
      for (const fx of effects) {
        switch (fx.type) {
          case 'correct':
            counter.current += 1;
            setBurst({ id: fx.ingredientId, n: counter.current });
            audio.play(fx.ready ? 'serve' : 'correct');
            break;
          case 'wrong':
            counter.current += 1;
            setShake({ id: fx.ingredientId, n: counter.current });
            audio.play('wrong');
            break;
          case 'served':
            audio.play(fx.lucky ? 'lucky' : 'serve');
            break;
          case 'event':
            audio.play(fx.eventId === 'luckyCat' ? 'lucky' : fx.eventId === 'changeOrder' ? 'meow' : 'event');
            break;
          case 'phase':
            audio.play('event');
            break;
          case 'gameover': {
            audio.play('gameover');
            const result = getResult(state);
            window.clearTimeout(finishTimer.current);
            finishTimer.current = window.setTimeout(() => onFinish(result), 1700);
            break;
          }
          default:
            if (EFFECT_SOUNDS[fx.type]) audio.play(EFFECT_SOUNDS[fx.type]);
        }
      }
    },
    [audio, onFinish],
  );

  const { state, select, addIngredient, serve, clean, pause, resume } = useGameEngine({
    onEffects: handleEffects,
  });

  useEffect(() => () => window.clearTimeout(finishTimer.current), []);

  const phase = GAME_CONFIG.phases[state.phaseIndex];
  const lucky = isLuckyActive(state);
  const selected = state.orders.find((o) => o.id === state.selectedId && o.status === 'waiting') ?? null;
  const spill = state.event?.type === 'milkSpill' ? state.event : null;
  const playing = state.status === 'playing';

  const unlockAnd = (fn) => (arg) => {
    audio.unlock();
    fn(arg);
  };

  return (
    <div
      className={`game-screen phase-${phase.id} ${lucky ? 'is-lucky' : ''} ${state.status === 'paused' ? 'is-paused' : ''}`}
    >
      <GameHud
        timeLeft={GAME_CONFIG.duration - state.elapsed}
        score={state.score}
        combo={state.combo}
        rush={phase.rush}
        onPause={pause}
      />

      <OrderBoard
        orders={state.orders}
        selectedId={state.selectedId}
        lucky={lucky}
        elapsed={state.elapsed}
        floaters={state.floaters}
        onSelect={unlockAnd(select)}
      >
        <EventBanner banner={state.banner} />
      </OrderBoard>

      <EventBar event={state.event} elapsed={state.elapsed} rush={phase.rush} />

      <CookingStation
        order={selected}
        spill={spill}
        message={state.message}
        playing={playing}
        burst={burst}
        shake={shake}
        onIngredient={unlockAnd(addIngredient)}
        onServe={unlockAnd(serve)}
        onClean={unlockAnd(clean)}
      />

      {state.status === 'ready' && (
        <div className="overlay overlay-ready" aria-live="assertive">
          <span className="ready-count" key={Math.ceil(state.readyLeft)}>
            {Math.ceil(state.readyLeft)}
          </span>
          <span className="ready-text">開店準備中…</span>
        </div>
      )}

      {state.status === 'paused' && (
        <div className="overlay overlay-pause" role="dialog" aria-modal="true" aria-label="遊戲暫停">
          <div className="pause-card">
            <PlayerBadge className="pause-player" />
            <CatCharacter catId="white" mood="happy" className="pause-cat" />
            <h2>休息一下喵～</h2>
            <p>遊戲已暫停，準備好再繼續營業吧！</p>
            <button type="button" className="btn btn-primary" onClick={unlockAnd(resume)} autoFocus>
              繼續營業
            </button>
            <div className="pause-actions">
              <button type="button" className="btn btn-ghost" onClick={onToggleSound}>
                <UiIcon name={soundOn ? 'sound-on' : 'sound-off'} />
                音效：{soundOn ? '開' : '關'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={onQuit}>
                回到首頁
              </button>
            </div>
          </div>
        </div>
      )}

      {state.status === 'over' && (
        <div className="overlay overlay-over" aria-live="assertive">
          <span className="closing-sign">本日打烊囉！</span>
        </div>
      )}
    </div>
  );
}

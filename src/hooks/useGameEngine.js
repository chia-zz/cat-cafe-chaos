import { useCallback, useEffect, useRef, useState } from 'react';
import {
  addIngredient,
  cleanSpill,
  createInitialState,
  pauseGame,
  resumeGame,
  selectOrder,
  serveOrder,
  tick,
} from '../utils/gameLogic.js';

/**
 * 遊戲引擎 Hook。
 * - 以 requestAnimationFrame 驅動，依實際經過時間（performance.now）計算 dt，
 *   與 FPS 無關。
 * - 計時迴圈只在 ready / playing 狀態啟動，effect cleanup 會取消 rAF，
 *   因此 React Strict Mode 重複掛載也不會產生兩個計時器。
 * - 視窗失焦 / 切換分頁時自動暫停。
 * - 每次重新開始時由外層以 key 重新掛載，確保完全不殘留上一局狀態。
 */
export function useGameEngine({ onEffects } = {}) {
  const [state, setState] = useState(() => createInitialState());
  const stateRef = useRef(state);
  const onEffectsRef = useRef(onEffects);
  onEffectsRef.current = onEffects;

  const commit = useCallback((next) => {
    if (next === stateRef.current) return;
    let committed = next;
    if (next.effects.length) {
      const effects = next.effects;
      committed = { ...next, effects: [] };
      stateRef.current = committed;
      setState(committed);
      onEffectsRef.current?.(effects, committed);
      return;
    }
    stateRef.current = committed;
    setState(committed);
  }, []);

  const running = state.status === 'playing' || state.status === 'ready';

  useEffect(() => {
    if (!running) return undefined;
    let rafId = 0;
    let last = performance.now();
    const step = () => {
      const now = performance.now();
      const dt = Math.max(0, (now - last) / 1000);
      last = now;
      commit(tick(stateRef.current, dt));
    };
    const frame = () => {
      step();
      const status = stateRef.current.status;
      if (status === 'playing' || status === 'ready') {
        rafId = requestAnimationFrame(frame);
      }
    };
    rafId = requestAnimationFrame(frame);
    // 部分 WebView 會節流 rAF；若超過 150ms 沒有影格就由計時器補上
    const watchdog = window.setInterval(() => {
      if (performance.now() - last > 150) step();
    }, 100);
    return () => {
      cancelAnimationFrame(rafId);
      window.clearInterval(watchdog);
    };
  }, [running, commit]);

  // 視窗失焦或切到背景就暫停
  useEffect(() => {
    const pause = () => commit(pauseGame(stateRef.current));
    const onVisibility = () => {
      if (document.hidden) pause();
    };
    window.addEventListener('blur', pause);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', pause);
    return () => {
      window.removeEventListener('blur', pause);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', pause);
    };
  }, [commit]);

  const actions = {
    select: useCallback((id) => commit(selectOrder(stateRef.current, id)), [commit]),
    addIngredient: useCallback((id) => commit(addIngredient(stateRef.current, id)), [commit]),
    serve: useCallback(() => commit(serveOrder(stateRef.current)), [commit]),
    clean: useCallback(() => commit(cleanSpill(stateRef.current)), [commit]),
    pause: useCallback(() => commit(pauseGame(stateRef.current)), [commit]),
    resume: useCallback(() => commit(resumeGame(stateRef.current)), [commit]),
  };

  return { state, ...actions };
}

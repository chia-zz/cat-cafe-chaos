const HIGH_SCORE_KEY = 'catCafeChaos.highScore';
const SOUND_KEY = 'catCafeChaos.sound';

function getStore(store) {
  try {
    return store ?? globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadHighScore(store) {
  const s = getStore(store);
  if (!s) return 0;
  try {
    const value = Number.parseInt(s.getItem(HIGH_SCORE_KEY) ?? '0', 10);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

/** 若 score 比紀錄高就寫入；回傳 { highScore, isNewRecord } */
export function saveHighScore(score, store) {
  const previous = loadHighScore(store);
  if (score <= previous) return { highScore: previous, isNewRecord: false };
  const s = getStore(store);
  try {
    s?.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    /* 私密模式等情況寫入失敗時忽略 */
  }
  return { highScore: score, isNewRecord: true };
}

export function loadSoundEnabled(store) {
  const s = getStore(store);
  try {
    return s?.getItem(SOUND_KEY) === 'on';
  } catch {
    return false;
  }
}

export function saveSoundEnabled(enabled, store) {
  const s = getStore(store);
  try {
    s?.setItem(SOUND_KEY, enabled ? 'on' : 'off');
  } catch {
    /* ignore */
  }
}

export const STORAGE_KEYS = { HIGH_SCORE_KEY, SOUND_KEY };

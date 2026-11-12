import { describe, expect, it } from 'vitest';
import { loadHighScore, saveHighScore, loadSoundEnabled, saveSoundEnabled } from '../src/utils/storage.js';

function memoryStore() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
  };
}

describe('最高分儲存', () => {
  it('只在破紀錄時寫入', () => {
    const store = memoryStore();
    expect(loadHighScore(store)).toBe(0);
    expect(saveHighScore(800, store)).toEqual({ highScore: 800, isNewRecord: true });
    expect(saveHighScore(500, store)).toEqual({ highScore: 800, isNewRecord: false });
    expect(loadHighScore(store)).toBe(800);
  });

  it('壞掉的資料或無法存取時回傳 0', () => {
    const store = memoryStore();
    store.setItem('catCafeChaos.highScore', 'abc');
    expect(loadHighScore(store)).toBe(0);
    const broken = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); } };
    expect(loadHighScore(broken)).toBe(0);
    expect(() => saveHighScore(10, broken)).not.toThrow();
  });

  it('音效設定預設關閉', () => {
    const store = memoryStore();
    expect(loadSoundEnabled(store)).toBe(false);
    saveSoundEnabled(true, store);
    expect(loadSoundEnabled(store)).toBe(true);
  });
});

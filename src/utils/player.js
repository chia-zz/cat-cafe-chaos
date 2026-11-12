import { useSyncExternalStore } from 'react';

/**
 * 玩家身分：遊戲唯一讀取「目前玩家」的地方。
 * 目前預設為訪客；之後串接平台時，在 SDK 取得身分後呼叫 setPlayer() 即可，
 * 畫面上的玩家顯示區會自動更新。
 * 測試時可用網址參數 ?player=名字 帶入，確認顯示是否正確。
 */

export const PLAYER_NAME_MAX = 16;
export const GUEST_PLAYER = Object.freeze({ name: '訪客', source: 'guest' });

/** 去頭尾空白、合併連續空白、移除控制字元，超過上限截斷；無效時回傳 null */
export function normalizePlayerName(raw) {
  if (typeof raw !== 'string') return null;
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return null;
  return Array.from(cleaned).slice(0, PLAYER_NAME_MAX).join('');
}

/** 從網址參數讀取玩家（測試用），沒有就回傳訪客 */
export function playerFromSearch(search) {
  try {
    const name = normalizePlayerName(new URLSearchParams(search ?? '').get('player'));
    return name ? { name, source: 'url' } : GUEST_PLAYER;
  } catch {
    return GUEST_PLAYER;
  }
}

let current = playerFromSearch(globalThis.location?.search);
const listeners = new Set();

export function getPlayer() {
  return current;
}

/** 平台帶入身分時呼叫；name 無效時退回訪客 */
export function setPlayer({ name, source = 'platform' } = {}) {
  const normalized = normalizePlayerName(name);
  current = normalized ? { name: normalized, source } : GUEST_PLAYER;
  listeners.forEach((fn) => fn());
  return current;
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function usePlayer() {
  return useSyncExternalStore(subscribe, getPlayer, getPlayer);
}

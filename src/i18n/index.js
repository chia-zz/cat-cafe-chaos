import { useSyncExternalStore } from 'react';
import zhTW from './locales/zh-TW.js';
import en from './locales/en.js';
import th from './locales/th.js';
import { loadLanguage, saveLanguage } from '../utils/storage.js';

/**
 * 多語系：遊戲狀態只存「文字 key」，畫面渲染時才用 t() 轉成目前語言，
 * 因此遊戲進行中切換語言，訂單、對話、提示都會立刻換掉。
 * 新增語言：在 locales/ 加一個檔案（key 結構同 zh-TW.js），再加到 LANGUAGES。
 */
export const LANGUAGES = [
  { code: 'zh-TW', label: '繁中', dict: zhTW },
  { code: 'en', label: 'EN', dict: en },
  { code: 'th', label: 'ไทย', dict: th },
];

export const DEFAULT_LANGUAGE = 'zh-TW';
const DICTS = Object.fromEntries(LANGUAGES.map((l) => [l.code, l.dict]));

/** 把任意語言代碼（zh-Hant-TW、en-US、th-TH…）對應到支援的語言；不支援回傳 null */
export function matchLanguage(code) {
  if (typeof code !== 'string' || !code) return null;
  const lower = code.toLowerCase();
  if (DICTS[code]) return code;
  if (lower.startsWith('zh')) return 'zh-TW';
  if (lower.startsWith('th')) return 'th';
  if (lower.startsWith('en')) return 'en';
  return null;
}

/** 優先順序：網址 ?lang= → 上次選擇 → 瀏覽器語言 → 預設 */
export function detectLanguage({ search, saved, browser = [] } = {}) {
  let fromUrl = null;
  try {
    fromUrl = new URLSearchParams(search ?? '').get('lang');
  } catch {
    /* ignore */
  }
  for (const c of [fromUrl, saved, ...browser]) {
    const m = matchLanguage(c);
    if (m) return m;
  }
  return DEFAULT_LANGUAGE;
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict);
}

/** 取字串（或字串陣列）並代入 {參數}；找不到時退回繁中，再找不到回傳 key 本身 */
export function translate(lang, key, params) {
  let value = lookup(DICTS[lang] ?? DICTS[DEFAULT_LANGUAGE], key);
  if (value === undefined) value = lookup(DICTS[DEFAULT_LANGUAGE], key);
  if (value === undefined) return key;
  if (!params) return value;
  const fill = (str) => str.replace(/\{(\w+)\}/g, (m, k) => (params[k] ?? m));
  if (typeof value === 'string') return fill(value);
  if (Array.isArray(value)) return value.map((v) => (typeof v === 'string' ? fill(v) : v));
  return value;
}

/* ------------------------------------------------------------------ */
/* 目前語言（全域 store）                                               */
/* ------------------------------------------------------------------ */

let current = detectLanguage({
  search: globalThis.location?.search,
  saved: loadLanguage(),
  browser: globalThis.navigator?.languages ?? [globalThis.navigator?.language],
});
const listeners = new Set();

function applyDocument(lang) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = translate(lang, 'meta.htmlLang');
  document.title = translate(lang, 'meta.docTitle');
  document.querySelector('meta[name="description"]')?.setAttribute('content', translate(lang, 'meta.description'));
}
applyDocument(current);

export function getLanguage() {
  return current;
}

export function setLanguage(lang) {
  const next = matchLanguage(lang);
  if (!next || next === current) return current;
  current = next;
  saveLanguage(next);
  applyDocument(next);
  listeners.forEach((fn) => fn());
  return current;
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** 元件使用：const { t, lang, setLanguage } = useI18n(); */
export function useI18n() {
  const lang = useSyncExternalStore(subscribe, getLanguage, getLanguage);
  const t = (key, params) => translate(lang, key, params);
  return { lang, t, setLanguage };
}

/* ------------------------------------------------------------------ */
/* 遊戲文字的小工具                                                     */
/* ------------------------------------------------------------------ */

/** 貓咪台詞：speech = { catId, kind, roll }，roll 為 0～1 的亂數，各語言台詞數量可以不同 */
export function speechText(t, speech) {
  const list = t(`cats.${speech.catId}.lines.${speech.kind}`);
  if (!Array.isArray(list) || !list.length) return '';
  return list[Math.min(list.length - 1, Math.floor(speech.roll * list.length))];
}

/** 事件大型提示：banner = { key, params }；params 中的 catId / recipeId 會轉成名稱 */
export function bannerText(t, banner) {
  const p = { ...banner.params };
  if (p.catId) p.name = t(`cats.${p.catId}.name`);
  if (p.recipeId) p.recipe = t(`recipes.${p.recipeId}`);
  return { title: t(`banners.${banner.key}.title`, p), text: t(`banners.${banner.key}.text`, p) };
}

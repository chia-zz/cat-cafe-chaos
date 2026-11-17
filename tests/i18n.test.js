import { describe, expect, it } from 'vitest';
import { LANGUAGES, bannerText, detectLanguage, matchLanguage, speechText, translate } from '../src/i18n/index.js';
import { CATS } from '../src/data/cats.js';
import { INGREDIENTS, RECIPES } from '../src/data/recipes.js';
import { TITLES } from '../src/utils/gameConfig.js';

/** 列出所有 key 路徑；陣列視為葉節點（各語言台詞數量可以不同） */
function keyPaths(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? keyPaths(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe('i18n 語言包', () => {
  const base = LANGUAGES[0].dict;
  const baseKeys = keyPaths(base).sort();

  it.each(LANGUAGES.map((l) => [l.code, l.dict]))('%s 的 key 與繁中完全一致', (_, dict) => {
    expect(keyPaths(dict).sort()).toEqual(baseKeys);
  });

  it.each(LANGUAGES.map((l) => [l.code, l.dict]))('%s 涵蓋所有遊戲資料', (code) => {
    const ids = [
      ...Object.keys(CATS).flatMap((id) => [`cats.${id}.name`, `cats.${id}.title`]),
      ...Object.keys(INGREDIENTS).map((id) => `ingredients.${id}`),
      ...Object.keys(RECIPES).map((id) => `recipes.${id}`),
      ...TITLES.map((t) => `titles.${t.id}`),
    ];
    for (const key of ids) expect(translate(code, key), key).not.toBe(key);
  });

  it.each(LANGUAGES.map((l) => [l.code, l.dict]))('%s 每種台詞都有內容、how 段落為三段', (_, dict) => {
    for (const cat of Object.values(dict.cats)) {
      for (const list of Object.values(cat.lines)) {
        expect(list.length).toBeGreaterThan(0);
        list.forEach((line) => expect(line).toBeTruthy());
      }
    }
    ['how1', 'how2', 'how3'].forEach((k) => expect(dict.start[k]).toHaveLength(3));
  });

  it('代入參數，找不到 key 時退回 key', () => {
    expect(translate('en', 'hud.timeAria', { sec: 5 })).toBe('5 seconds left');
    expect(translate('th', 'start.how2', { pts: 10 })[1]).toBe('หัก 10 คะแนน');
    expect(translate('en', 'no.such.key')).toBe('no.such.key');
  });

  it('台詞與事件提示依語言轉換', () => {
    const t = (k, p) => translate('en', k, p);
    expect(speechText(t, { catId: 'black', kind: 'arrive', roll: 0 })).toBe('…The usual.');
    expect(speechText(t, { catId: 'black', kind: 'arrive', roll: 0.999 })).toBe('Take your time.');
    expect(bannerText(t, { key: 'changeOrder', params: { catId: 'calico', recipeId: 'latte' } }).text).toBe(
      'Calico now wants Latte!',
    );
  });

  it('語言偵測：網址 > 已存 > 瀏覽器 > 預設', () => {
    expect(matchLanguage('th-TH')).toBe('th');
    expect(matchLanguage('zh-Hant-TW')).toBe('zh-TW');
    expect(matchLanguage('ja')).toBeNull();
    expect(detectLanguage({ search: '?lang=en', saved: 'th', browser: ['zh-TW'] })).toBe('en');
    expect(detectLanguage({ saved: 'th', browser: ['en-US'] })).toBe('th');
    expect(detectLanguage({ browser: ['ja', 'en-US'] })).toBe('en');
    expect(detectLanguage({ browser: ['ja'] })).toBe('zh-TW');
  });
});

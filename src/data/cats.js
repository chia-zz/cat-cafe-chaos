/**
 * 貓咪角色資料。
 * - patienceSeconds：在倍率 1 時，耐心從 100% 掉到 0% 需要的秒數
 * - preferences：餐點類別權重倍率（越大越常點）
 * - canChangeOrder：是否會觸發「奧客改單」
 * - specialChance：進場時說出特殊對話（lines.special）的機率
 * 名字、稱號與台詞在 src/i18n/locales/*.js 的 cats.<id>
 */
export const CATS = {
  orange: {
    id: 'orange',
    patienceSeconds: 24,
    preferences: { dessert: 2.4, drink: 1.1, coffee: 0.6 },
    canChangeOrder: false,
  },
  calico: {
    id: 'calico',
    patienceSeconds: 18,
    preferences: { drink: 1.6, dessert: 1.3, coffee: 1 },
    canChangeOrder: true,
  },
  black: {
    id: 'black',
    patienceSeconds: 32,
    preferences: { coffee: 2.6, drink: 0.7, dessert: 0.6 },
    canChangeOrder: false,
  },
  white: {
    id: 'white',
    patienceSeconds: 24,
    preferences: { drink: 1.4, dessert: 1.2, coffee: 1 },
    canChangeOrder: false,
    specialChance: 0.45,
  },
};

export const CAT_LIST = Object.values(CATS);

/**
 * 隨機事件設定。
 * weight：同一次觸發時被抽中的相對機率。
 * 提示文字在 src/i18n/locales/*.js 的 banners.<id>
 */
export const EVENTS = {
  changeOrder: {
    id: 'changeOrder',
    weight: 0.4,
    /** 改單時補回的耐心（%） */
    patienceRefund: 15,
  },
  milkSpill: {
    id: 'milkSpill',
    weight: 0.3,
    cleanTaps: 3,
  },
  luckyCat: {
    id: 'luckyCat',
    weight: 0.3,
    duration: 10,
  },
};

export const EVENT_LIST = Object.values(EVENTS);

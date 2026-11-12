/**
 * 隨機事件設定。
 * weight：同一次觸發時被抽中的相對機率。
 */
export const EVENTS = {
  changeOrder: {
    id: 'changeOrder',
    name: '奧客改單',
    weight: 0.4,
    title: '奧客改單！',
    text: '三花大小姐改變心意了，重新做吧！',
    /** 改單時補回的耐心（%） */
    patienceRefund: 15,
  },
  milkSpill: {
    id: 'milkSpill',
    name: '貓咪打翻牛奶',
    weight: 0.3,
    title: '牛奶打翻了！',
    text: '點「擦乾淨」才能繼續做餐點',
    cleanTaps: 3,
  },
  luckyCat: {
    id: 'luckyCat',
    name: '幸運招財貓',
    weight: 0.3,
    title: '幸運招財貓降臨！',
    text: '10 秒內出餐，基礎分數加倍！',
    duration: 10,
  },
};

export const EVENT_LIST = Object.values(EVENTS);

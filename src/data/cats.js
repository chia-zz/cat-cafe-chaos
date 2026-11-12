/**
 * 貓咪角色資料。
 * - patienceSeconds：在倍率 1 時，耐心從 100% 掉到 0% 需要的秒數
 * - preferences：餐點類別權重倍率（越大越常點）
 * - canChangeOrder：是否會觸發「奧客改單」
 * - specialChance：進場時說出特殊對話的機率
 */
export const CATS = {
  orange: {
    id: 'orange',
    name: '橘貓',
    title: '貪吃鬼',
    patienceSeconds: 24,
    preferences: { dessert: 2.4, drink: 1.1, coffee: 0.6 },
    canChangeOrder: false,
    lines: {
      arrive: ['肚子好餓喵～', '甜的！我要甜的！', '今天也來報到了喵'],
      served: ['好吃到打滾！', '幸福喵～', '再來一份…才怪'],
      angry: ['餓扁了啦！', '哼！我去隔壁吃！'],
    },
  },
  calico: {
    id: 'calico',
    name: '三花貓',
    title: '大小姐',
    patienceSeconds: 18,
    preferences: { drink: 1.6, dessert: 1.3, coffee: 1 },
    canChangeOrder: true,
    lines: {
      arrive: ['本小姐要的呢？', '動作快一點喔～', '請用最好的杯子。'],
      served: ['嗯，勉強及格。', '還不錯嘛～', '賞你摸頭一次。'],
      angry: ['太慢了！本小姐不等了！', '哼！再也不來了！'],
      change: ['本小姐改變主意了！', '突然不想喝那個了～'],
    },
  },
  black: {
    id: 'black',
    name: '黑貓',
    title: '酷酷貓',
    patienceSeconds: 32,
    preferences: { coffee: 2.6, drink: 0.7, dessert: 0.6 },
    canChangeOrder: false,
    lines: {
      arrive: ['…老樣子。', '咖啡，不加糖。', '慢慢來，我不趕。'],
      served: ['…不錯。', '這杯有靈魂。', '嗯。'],
      angry: ['…耐心是有限的。', '算了。'],
    },
  },
  white: {
    id: 'white',
    name: '白貓',
    title: '迷糊貓',
    patienceSeconds: 24,
    preferences: { drink: 1.4, dessert: 1.2, coffee: 1 },
    canChangeOrder: false,
    specialChance: 0.45,
    lines: {
      arrive: ['我剛剛要點什麼？', '您好～', '喵？這裡是哪裡？'],
      special: ['我把尾巴當圍巾了', '追影子追了好久喵', '今天是星期喵嗎？', '我好像叫小白？'],
      served: ['哇！是我點的嗎？', '你是好人喵～', '好香～（發呆）'],
      angry: ['我忘記在等什麼了…', '咦？先走囉～'],
    },
  },
};

export const CAT_LIST = Object.values(CATS);

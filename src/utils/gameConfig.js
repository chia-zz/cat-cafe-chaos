/**
 * 遊戲平衡參數集中於此，調整難度只需要改這個檔案。
 * 時間單位一律為「秒」。
 */
export const GAME_CONFIG = {
  /** 單局時間 */
  duration: 90,
  /** 開局前的「預備～」倒數 */
  readyCountdown: 3,
  /** 同時存在的訂單上限 */
  maxOrders: 3,
  /** 第一位客人進門的時間 */
  firstOrderDelay: 0.4,
  /** 畫面上沒有等待中的訂單時，最晚多久會補一位客人 */
  emptyRespawnDelay: 1.2,
  /** 貓咪離開（出餐或生氣）的動畫時間；期間座位仍被佔用 */
  leaveDuration: 0.7,
  /** 單一影格最大 dt，避免卡頓後一次跳太多時間 */
  maxFrameDelta: 0.25,

  /** 三個難度階段，until 為該階段結束的秒數 */
  phases: [
    {
      id: 'warmup',
      name: '新手適應',
      until: 30,
      spawnInterval: [4.5, 6],
      patienceDrain: 0.8,
      stepWeights: { 2: 1, 3: 0 },
      eventChance: 0,
      rush: false,
    },
    {
      id: 'busy',
      name: '開始忙碌',
      until: 60,
      spawnInterval: [3.2, 4.6],
      patienceDrain: 1,
      stepWeights: { 2: 0.55, 3: 0.45 },
      eventChance: 0.12,
      rush: false,
    },
    {
      id: 'rush',
      name: '咖啡廳大混亂',
      until: 90,
      spawnInterval: [2.3, 3.4],
      patienceDrain: 1.3,
      stepWeights: { 2: 0.45, 3: 0.55 },
      eventChance: 0.2,
      rush: true,
    },
  ],

  /** 計分規則 */
  scoring: {
    wrongIngredient: -10,
    timeout: -30,
    /** 耐心剩餘 >= 此值（%）時有額外加分 */
    patienceBonusThreshold: 70,
    patienceBonus: 30,
    /** 每連續完成 N 張訂單給一次 Combo 加分 */
    comboEvery: 3,
    comboBonus: 50,
    /** 招財貓期間基礎分數倍率 */
    luckyMultiplier: 2,
  },

  /** 隨機事件排程 */
  events: {
    /** 每隔多久擲一次骰 */
    checkInterval: 1,
    /** 上一個事件結束後的冷卻時間 */
    cooldown: 8,
    /** 剩下幾秒時不再觸發事件 */
    quietLastSeconds: 5,
  },

  /** 耐心表情門檻（%） */
  mood: {
    happyAbove: 60,
    waitingAbove: 30,
  },

  /** 提示訊息顯示時間 */
  messageDuration: 1.4,
  bannerDuration: 2.6,
  floaterDuration: 1.1,
  speechDuration: 2.2,
};

/** 結算稱號，min 由小到大 */
export const TITLES = [
  { min: 0, name: '咖啡廳見習生' },
  { min: 500, name: '貓咪服務員' },
  { min: 1200, name: '人氣咖啡師' },
  { min: 2000, name: '貓咪店長' },
  { min: 3000, name: '傳說中的貓奴店長' },
];

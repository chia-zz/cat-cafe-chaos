import { describe, expect, it } from 'vitest';
import {
  addIngredient,
  calcOrderScore,
  cleanSpill,
  createInitialState,
  getMood,
  getPhaseIndex,
  getTitle,
  isCorrectIngredient,
  pauseGame,
  resumeGame,
  selectOrder,
  serveOrder,
  tick,
  triggerEvent,
} from '../src/utils/gameLogic.js';
import { GAME_CONFIG } from '../src/utils/gameConfig.js';
import { RECIPES, RECIPE_LIST } from '../src/data/recipes.js';

/** 可重現的亂數 */
function seeded(seed = 1) {
  let x = seed;
  return () => {
    x = (x * 1664525 + 1013904223) % 4294967296;
    return x / 4294967296;
  };
}

/** 讓狀態以小步長前進 seconds 秒 */
function advance(state, seconds, rng = seeded(7), step = 0.05) {
  let s = state;
  let t = 0;
  while (t < seconds - 1e-9) {
    const dt = Math.min(step, seconds - t);
    s = tick(s, dt, rng);
    s = { ...s, effects: [] };
    t += dt;
  }
  return s;
}

/** 跳過開局倒數，進入 playing */
function playingState() {
  return advance(createInitialState(), GAME_CONFIG.readyCountdown + 0.01);
}

function makeOrder(overrides = {}) {
  return {
    id: 100,
    slot: 0,
    catId: 'black',
    recipeId: 'latte',
    progress: 0,
    patience: 100,
    baseDrain: 100 / 32,
    status: 'waiting',
    leaveAt: null,
    changed: false,
    createdAt: 0,
    speech: null,
    ...overrides,
  };
}

/** 建立一個只有指定訂單、且不會自動生成新訂單的 playing 狀態 */
function stateWithOrders(orders, extra = {}) {
  return {
    ...createInitialState(),
    status: 'playing',
    readyLeft: 0,
    elapsed: 5,
    orders,
    selectedId: orders[0]?.id ?? null,
    nextOrderId: 999,
    nextSpawnAt: 9999,
    ...extra,
  };
}

function cook(state, recipeId) {
  let s = state;
  for (const ing of RECIPES[recipeId].steps) s = addIngredient(s, ing);
  return s;
}

describe('食譜判定', () => {
  it('五種餐點都能依正確順序製作並出餐', () => {
    for (const recipe of RECIPE_LIST) {
      const s0 = stateWithOrders([makeOrder({ recipeId: recipe.id })]);
      const s1 = cook(s0, recipe.id);
      expect(s1.orders[0].progress).toBe(recipe.steps.length);
      const s2 = serveOrder(s1);
      expect(s2.served).toBe(1);
      expect(s2.orders[0].status).toBe('served');
    }
  });

  it('isCorrectIngredient 只接受下一個步驟', () => {
    const r = RECIPES.pawPancake;
    expect(isCorrectIngredient(r, 0, 'batter')).toBe(true);
    expect(isCorrectIngredient(r, 0, 'bake')).toBe(false);
    expect(isCorrectIngredient(r, 1, 'bake')).toBe(true);
    expect(isCorrectIngredient(r, 3, 'honey')).toBe(false);
  });

  it('順序錯誤：扣 10 分、進度歸零、不影響其他訂單', () => {
    const a = makeOrder({ id: 1, recipeId: 'strawberryCake', progress: 2 });
    const b = makeOrder({ id: 2, slot: 1, recipeId: 'latte', progress: 1 });
    const s0 = stateWithOrders([a, b], { score: 200 });
    const s1 = addIngredient(s0, 'coffee');
    expect(s1.score).toBe(190);
    expect(s1.orders.find((o) => o.id === 1).progress).toBe(0);
    expect(s1.orders.find((o) => o.id === 2).progress).toBe(1);
    expect(s1.message.text).toBe('喵？！放錯材料了！');
    expect(s1.mistakes).toBe(1);
  });

  it('未完成的餐點不能出餐', () => {
    const s0 = stateWithOrders([makeOrder({ progress: 1 })]);
    const s1 = serveOrder(s0);
    expect(s1).toBe(s0);
    expect(s1.served).toBe(0);
  });

  it('切換訂單保留各自的進度', () => {
    const a = makeOrder({ id: 1, recipeId: 'pawPancake' });
    const b = makeOrder({ id: 2, slot: 1, recipeId: 'americano' });
    let s = stateWithOrders([a, b]);
    s = addIngredient(s, 'batter');
    s = addIngredient(s, 'bake');
    s = selectOrder(s, 2);
    s = addIngredient(s, 'coffee');
    s = selectOrder(s, 1);
    expect(s.orders.find((o) => o.id === 1).progress).toBe(2);
    expect(s.orders.find((o) => o.id === 2).progress).toBe(1);
    s = addIngredient(s, 'honey');
    expect(s.orders.find((o) => o.id === 1).progress).toBe(3);
  });
});

describe('計分', () => {
  it('基礎分數 + 耐心加分', () => {
    expect(calcOrderScore({ recipe: RECIPES.latte, patience: 80, comboAfter: 1, lucky: false }).total).toBe(150);
    expect(calcOrderScore({ recipe: RECIPES.latte, patience: 70, comboAfter: 1, lucky: false }).total).toBe(150);
    expect(calcOrderScore({ recipe: RECIPES.latte, patience: 69.9, comboAfter: 1, lucky: false }).total).toBe(120);
  });

  it('每連續 3 張給一次 Combo +50，且不重複計算', () => {
    const r = RECIPES.americano;
    const bonus = (n) => calcOrderScore({ recipe: r, patience: 10, comboAfter: n, lucky: false }).comboBonus;
    expect([1, 2, 3, 4, 5, 6, 7].map(bonus)).toEqual([0, 0, 50, 0, 0, 50, 0]);
  });

  it('招財貓只加倍基礎分數', () => {
    const p = calcOrderScore({ recipe: RECIPES.pawPancake, patience: 90, comboAfter: 3, lucky: true });
    expect(p).toEqual({ base: 360, patienceBonus: 30, comboBonus: 50, total: 440 });
  });

  it('連續出餐三張會累計 Combo 與最高 Combo', () => {
    const orders = [1, 2, 3].map((id, i) => makeOrder({ id, slot: i, recipeId: 'americano', patience: 50 }));
    let s = stateWithOrders(orders);
    for (const id of [1, 2, 3]) {
      s = selectOrder(s, id);
      s = cook(s, 'americano');
      s = serveOrder(s);
    }
    expect(s.combo).toBe(3);
    expect(s.maxCombo).toBe(3);
    expect(s.score).toBe(100 * 3 + 50);
  });

  it('招財貓期間出餐分數加倍', () => {
    let s = stateWithOrders([makeOrder({ recipeId: 'americano', patience: 50 })], { phaseIndex: 1 });
    s = triggerEvent(s, 'luckyCat');
    expect(s.event.type).toBe('luckyCat');
    s = serveOrder(cook(s, 'americano'));
    expect(s.score).toBe(200);
  });

  it('總分最低為 0', () => {
    const s0 = stateWithOrders([makeOrder({ recipeId: 'latte' })], { score: 5 });
    const s1 = addIngredient(s0, 'cake');
    expect(s1.score).toBe(0);
  });

  it('稱號門檻', () => {
    expect(getTitle(0)).toBe('咖啡廳見習生');
    expect(getTitle(499)).toBe('咖啡廳見習生');
    expect(getTitle(500)).toBe('貓咪服務員');
    expect(getTitle(1200)).toBe('人氣咖啡師');
    expect(getTitle(2999)).toBe('貓咪店長');
    expect(getTitle(3000)).toBe('傳說中的貓奴店長');
  });
});

describe('耐心與超時', () => {
  it('耐心依時間下降，與影格大小無關', () => {
    const s0 = stateWithOrders([makeOrder()]);
    const coarse = advance(s0, 2, seeded(1), 0.1);
    const fine = advance(s0, 2, seeded(1), 0.01);
    expect(coarse.orders[0].patience).toBeCloseTo(fine.orders[0].patience, 5);
    expect(coarse.orders[0].patience).toBeLessThan(100);
  });

  it('耐心歸零：扣 30 分、失敗 +1、Combo 歸零，隨後移除', () => {
    const s0 = stateWithOrders([makeOrder({ patience: 1, progress: 2, recipeId: 'strawberryCake' })], {
      score: 100,
      combo: 2,
    });
    const s1 = advance(s0, 1);
    const order = s1.orders.find((o) => o.id === 100);
    expect(order.status).toBe('angry');
    expect(s1.score).toBe(70);
    expect(s1.failed).toBe(1);
    expect(s1.combo).toBe(0);

    // 超時後不能再出餐
    const s2 = serveOrder(cook(s1, 'strawberryCake'));
    expect(s2.served).toBe(0);

    const s3 = advance(s1, GAME_CONFIG.leaveDuration + 0.1);
    expect(s3.orders.some((o) => o.id === 100)).toBe(false);
  });

  it('表情門檻', () => {
    expect(getMood(100)).toBe('happy');
    expect(getMood(61)).toBe('happy');
    expect(getMood(60)).toBe('waiting');
    expect(getMood(31)).toBe('waiting');
    expect(getMood(30)).toBe('impatient');
    expect(getMood(1)).toBe('impatient');
    expect(getMood(0)).toBe('angry');
  });
});

describe('遊戲流程', () => {
  it('開局倒數後才開始 90 秒計時', () => {
    const s0 = createInitialState();
    const s1 = advance(s0, 1);
    expect(s1.status).toBe('ready');
    expect(s1.elapsed).toBe(0);
    const s2 = playingState();
    expect(s2.status).toBe('playing');
  });

  it('同時最多 3 張訂單，且時間到後結束、不再生成訂單', () => {
    let s = playingState();
    let maxSeen = 0;
    const rng = seeded(42);
    while (s.status === 'playing') {
      s = { ...tick(s, 0.05, rng), effects: [] };
      maxSeen = Math.max(maxSeen, s.orders.length);
    }
    expect(maxSeen).toBeLessThanOrEqual(GAME_CONFIG.maxOrders);
    expect(maxSeen).toBe(3);
    expect(s.status).toBe('over');
    expect(s.elapsed).toBe(GAME_CONFIG.duration);

    const ids = s.orders.map((o) => o.id);
    const after = advance(s, 5);
    expect(after.orders.map((o) => o.id)).toEqual(ids);
    expect(after).toEqual(s);
    expect(tick(s, 0.05)).toBe(s);
    expect(addIngredient(s, 'coffee')).toBe(s);
  });

  it('階段切換', () => {
    expect(getPhaseIndex(0)).toBe(0);
    expect(getPhaseIndex(29.99)).toBe(0);
    expect(getPhaseIndex(30)).toBe(1);
    expect(getPhaseIndex(60)).toBe(2);
    expect(getPhaseIndex(90)).toBe(2);
  });

  it('暫停時時間與耐心都不前進，繼續後恢復', () => {
    const s0 = stateWithOrders([makeOrder()]);
    const paused = pauseGame(s0);
    expect(paused.status).toBe('paused');
    const still = advance(paused, 3);
    expect(still.elapsed).toBe(s0.elapsed);
    expect(still.orders[0].patience).toBe(100);
    expect(addIngredient(still, 'coffee')).toBe(still);
    const resumed = resumeGame(still);
    expect(resumed.status).toBe('playing');
  });

  it('重新開始會得到乾淨的初始狀態', () => {
    let s = playingState();
    s = advance(s, 20, seeded(3));
    s = { ...s, score: 999, combo: 4, served: 3, failed: 2 };
    const fresh = createInitialState();
    expect(fresh.score).toBe(0);
    expect(fresh.combo).toBe(0);
    expect(fresh.maxCombo).toBe(0);
    expect(fresh.served).toBe(0);
    expect(fresh.failed).toBe(0);
    expect(fresh.orders).toEqual([]);
    expect(fresh.event).toBeNull();
    expect(fresh.elapsed).toBe(0);
    expect(fresh.status).toBe('ready');
    // 初始狀態彼此獨立
    expect(createInitialState().orders).not.toBe(fresh.orders);
  });
});

describe('隨機事件', () => {
  it('打翻牛奶期間不能製作，擦 3 下後恢復', () => {
    let s = stateWithOrders([makeOrder({ recipeId: 'latte' })], { phaseIndex: 1 });
    s = triggerEvent(s, 'milkSpill');
    expect(s.event.type).toBe('milkSpill');
    const blocked = addIngredient(s, 'coffee');
    expect(blocked.orders[0].progress).toBe(0);
    s = cleanSpill(cleanSpill(cleanSpill(s)));
    expect(s.event).toBeNull();
    s = addIngredient(s, 'coffee');
    expect(s.orders[0].progress).toBe(1);
  });

  it('同時只會有一個事件', () => {
    let s = stateWithOrders([makeOrder()], { phaseIndex: 1 });
    s = triggerEvent(s, 'luckyCat');
    const s2 = triggerEvent(s, 'milkSpill');
    expect(s2).toBe(s);
    expect(s2.event.type).toBe('luckyCat');
  });

  it('招財貓 10 秒後結束', () => {
    let s = stateWithOrders([makeOrder({ patience: 100, baseDrain: 0 })], { phaseIndex: 1, elapsed: 35 });
    s = triggerEvent(s, 'luckyCat');
    s = advance(s, 10.2);
    expect(s.event).toBeNull();
  });

  it('三花貓改單：進度歸零、換成不同餐點、同一張只改一次', () => {
    const calico = makeOrder({ catId: 'calico', recipeId: 'latte', progress: 1, patience: 60 });
    let s = stateWithOrders([calico], { phaseIndex: 1 });
    s = triggerEvent(s, 'changeOrder', seeded(5));
    const o = s.orders[0];
    expect(o.changed).toBe(true);
    expect(o.progress).toBe(0);
    expect(o.recipeId).not.toBe('latte');
    expect(s.event).toBeNull();
    const again = triggerEvent(s, 'changeOrder', seeded(6));
    expect(again).toBe(s);
  });

  it('非三花貓不會被改單', () => {
    const s = stateWithOrders([makeOrder({ catId: 'black' })], { phaseIndex: 1 });
    expect(triggerEvent(s, 'changeOrder')).toBe(s);
  });

  it('長時間模擬整局（含事件）不會卡住', () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const rng = seeded(seed);
      let s = playingState();
      let guard = 0;
      while (s.status === 'playing' && guard < 5000) {
        s = { ...tick(s, 0.05, rng), effects: [] };
        // 模擬玩家：遇到打翻就擦、能出餐就出餐、否則加下一個正確食材
        if (s.event?.type === 'milkSpill') s = cleanSpill(s);
        const sel = s.orders.find((o) => o.id === s.selectedId);
        if (sel && sel.status === 'waiting' && rng() < 0.3) {
          const steps = RECIPES[sel.recipeId].steps;
          s = sel.progress >= steps.length ? serveOrder(s) : addIngredient(s, steps[sel.progress]);
        }
        s = { ...s, effects: [] };
        guard += 1;
      }
      expect(s.status).toBe('over');
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.served).toBeGreaterThan(5);
    }
  });
});

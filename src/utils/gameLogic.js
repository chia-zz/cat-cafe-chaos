/**
 * 遊戲核心邏輯（純函式，不依賴 React / DOM，方便測試）。
 *
 * 每個函式都接收目前 state 並回傳「新的」state；
 * 需要 UI 處理的副作用（音效等）會放在 state.effects 陣列，
 * 由 useGameEngine 取出後清空。
 */
import { GAME_CONFIG, TITLES } from './gameConfig.js';
import { RECIPES, RECIPE_LIST } from '../data/recipes.js';
import { CATS, CAT_LIST } from '../data/cats.js';
import { EVENTS } from '../data/events.js';

/* ------------------------------------------------------------------ */
/* 小工具                                                              */
/* ------------------------------------------------------------------ */

export function randRange(rng, [min, max]) {
  return min + (max - min) * rng();
}

export function pickRandom(rng, list) {
  return list[Math.floor(rng() * list.length) % list.length];
}

/** 依權重抽一個項目；items: [{ item, weight }] */
export function weightedPick(rng, items) {
  const valid = items.filter((it) => it.weight > 0);
  const total = valid.reduce((sum, it) => sum + it.weight, 0);
  if (total <= 0) return null;
  let roll = rng() * total;
  for (const it of valid) {
    roll -= it.weight;
    if (roll < 0) return it.item;
  }
  return valid[valid.length - 1].item;
}

export function getPhaseIndex(elapsed, config = GAME_CONFIG) {
  const idx = config.phases.findIndex((p) => elapsed < p.until);
  return idx === -1 ? config.phases.length - 1 : idx;
}

export function getPhase(elapsed, config = GAME_CONFIG) {
  return config.phases[getPhaseIndex(elapsed, config)];
}

export function getMood(patience, status = 'waiting', config = GAME_CONFIG) {
  if (status === 'served') return 'happy';
  if (status === 'angry' || patience <= 0) return 'angry';
  if (patience > config.mood.happyAbove) return 'happy';
  if (patience > config.mood.waitingAbove) return 'waiting';
  return 'impatient';
}

export function getTitle(score) {
  let title = TITLES[0].name;
  for (const t of TITLES) {
    if (score >= t.min) title = t.name;
  }
  return title;
}

export function clampScore(score) {
  return Math.max(0, Math.round(score));
}

/** 判斷某食材是否為這張訂單下一個正確步驟 */
export function isCorrectIngredient(recipe, progress, ingredientId) {
  return progress < recipe.steps.length && recipe.steps[progress] === ingredientId;
}

export function isOrderReady(order) {
  return order.progress >= RECIPES[order.recipeId].steps.length;
}

export function isLuckyActive(state) {
  return state.event?.type === 'luckyCat' && state.elapsed < state.event.endsAt;
}

export function isSpillActive(state) {
  return state.event?.type === 'milkSpill';
}

/**
 * 出餐分數計算。
 * @param {object} p
 * @param {object} p.recipe
 * @param {number} p.patience 出餐當下的耐心（%）
 * @param {number} p.comboAfter 這張出餐後的連續完成數
 * @param {boolean} p.lucky 是否在招財貓期間
 */
export function calcOrderScore({ recipe, patience, comboAfter, lucky }, config = GAME_CONFIG) {
  const s = config.scoring;
  const base = recipe.score * (lucky ? s.luckyMultiplier : 1);
  const patienceBonus = patience >= s.patienceBonusThreshold ? s.patienceBonus : 0;
  const comboBonus = comboAfter > 0 && comboAfter % s.comboEvery === 0 ? s.comboBonus : 0;
  return { base, patienceBonus, comboBonus, total: base + patienceBonus + comboBonus };
}

/* ------------------------------------------------------------------ */
/* 狀態建立                                                            */
/* ------------------------------------------------------------------ */

export function createInitialState(config = GAME_CONFIG) {
  return {
    status: 'ready',
    readyLeft: config.readyCountdown,
    resumeTo: null,
    elapsed: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    served: 0,
    failed: 0,
    mistakes: 0,
    orders: [],
    selectedId: null,
    nextOrderId: 1,
    nextFxId: 1,
    nextSpawnAt: config.firstOrderDelay,
    phaseIndex: 0,
    event: null,
    lastEventEndedAt: -999,
    nextEventCheckAt: 0,
    banner: null,
    message: null,
    floaters: [],
    effects: [],
  };
}

/** 複製一份可安全修改的 state（訂單物件也淺拷貝） */
function draft(state) {
  return {
    ...state,
    orders: state.orders.map((o) => ({ ...o })),
    floaters: [...state.floaters],
    effects: [],
  };
}

function fxId(s) {
  const id = s.nextFxId;
  s.nextFxId += 1;
  return id;
}

function addScore(s, delta) {
  s.score = clampScore(s.score + delta);
}

function setMessage(s, text, kind = 'info', config = GAME_CONFIG) {
  s.message = { id: fxId(s), text, kind, until: s.elapsed + config.messageDuration };
}

function setBanner(s, kind, title, text, config = GAME_CONFIG, duration = config.bannerDuration) {
  s.banner = { id: fxId(s), kind, title, text, until: s.elapsed + duration };
}

function addFloater(s, slot, text, kind, config = GAME_CONFIG) {
  s.floaters.push({ id: fxId(s), slot, text, kind, until: s.elapsed + config.floaterDuration });
}

function say(s, order, text, config = GAME_CONFIG) {
  order.speech = { id: fxId(s), text, until: s.elapsed + config.speechDuration };
}

function waitingOrders(s) {
  return s.orders.filter((o) => o.status === 'waiting');
}

/** 若目前選取的訂單已不可用，自動改選最早的等待中訂單 */
function ensureSelection(s) {
  const current = s.orders.find((o) => o.id === s.selectedId);
  if (current && current.status === 'waiting') return;
  const next = waitingOrders(s).sort((a, b) => a.createdAt - b.createdAt)[0];
  s.selectedId = next ? next.id : null;
}

/* ------------------------------------------------------------------ */
/* 訂單生成                                                            */
/* ------------------------------------------------------------------ */

export function pickRecipe(rng, cat, phase, excludeId = null) {
  const items = RECIPE_LIST.filter((r) => r.id !== excludeId).map((r) => ({
    item: r,
    weight: (phase.stepWeights[r.steps.length] ?? 0) * (cat.preferences[r.category] ?? 1),
  }));
  return weightedPick(rng, items) ?? RECIPE_LIST.find((r) => r.id !== excludeId);
}

export function pickCat(rng, presentCatIds) {
  const absent = CAT_LIST.filter((c) => !presentCatIds.includes(c.id));
  return pickRandom(rng, absent.length ? absent : CAT_LIST);
}

/** 建立一張新訂單（不會檢查座位，由呼叫端負責） */
export function createOrder(s, rng, slot, config = GAME_CONFIG) {
  const phase = config.phases[s.phaseIndex];
  const cat = pickCat(rng, waitingOrders(s).map((o) => o.catId));
  const recipe = pickRecipe(rng, cat, phase);
  const order = {
    id: s.nextOrderId,
    slot,
    catId: cat.id,
    recipeId: recipe.id,
    progress: 0,
    patience: 100,
    /** 每秒基礎耐心下降量（%），實際值會再乘上階段倍率 */
    baseDrain: 100 / (cat.patienceSeconds + recipe.extraPatience),
    status: 'waiting',
    leaveAt: null,
    changed: false,
    createdAt: s.elapsed,
    speech: null,
  };
  s.nextOrderId += 1;
  const useSpecial = cat.lines.special && rng() < (cat.specialChance ?? 0);
  say(s, order, pickRandom(rng, useSpecial ? cat.lines.special : cat.lines.arrive), config);
  return order;
}

function freeSlot(s, config) {
  for (let i = 0; i < config.maxOrders; i += 1) {
    if (!s.orders.some((o) => o.slot === i)) return i;
  }
  return -1;
}

function trySpawn(s, rng, config) {
  const waiting = waitingOrders(s).length;
  // 沒人在等時，不要讓玩家乾等太久
  if (waiting === 0 && s.nextSpawnAt > s.elapsed + config.emptyRespawnDelay) {
    s.nextSpawnAt = s.elapsed + config.emptyRespawnDelay;
  }
  if (s.elapsed < s.nextSpawnAt) return;
  const slot = freeSlot(s, config);
  if (slot === -1) return;

  const order = createOrder(s, rng, slot, config);
  s.orders.push(order);
  s.nextSpawnAt = s.elapsed + randRange(rng, config.phases[s.phaseIndex].spawnInterval);
  s.effects.push({ type: 'spawn', orderId: order.id });
  if (s.selectedId == null) s.selectedId = order.id;
}

/* ------------------------------------------------------------------ */
/* 隨機事件                                                            */
/* ------------------------------------------------------------------ */

function changeOrderCandidates(s) {
  return waitingOrders(s).filter(
    (o) => CATS[o.catId].canChangeOrder && !o.changed && o.patience > 25,
  );
}

/** 觸發指定事件；回傳是否成功 */
export function triggerEvent(state, eventId, rng = Math.random, config = GAME_CONFIG) {
  const s = draft(state);
  const ok = applyEvent(s, eventId, rng, config);
  return ok ? s : state;
}

function applyEvent(s, eventId, rng, config) {
  if (s.event) return false;
  const def = EVENTS[eventId];
  if (!def) return false;

  if (eventId === 'changeOrder') {
    const candidates = changeOrderCandidates(s);
    if (!candidates.length) return false;
    const order = pickRandom(rng, candidates);
    const cat = CATS[order.catId];
    const recipe = pickRecipe(rng, cat, config.phases[s.phaseIndex], order.recipeId);
    order.recipeId = recipe.id;
    order.progress = 0;
    order.changed = true;
    order.changedAt = s.elapsed;
    order.patience = Math.min(100, order.patience + def.patienceRefund);
    say(s, order, pickRandom(rng, cat.lines.change), config);
    // 改單是瞬間事件，直接進入冷卻
    s.lastEventEndedAt = s.elapsed;
    setBanner(s, 'change', def.title, `${cat.name}改點「${recipe.name}」了！`, config);
    s.effects.push({ type: 'event', eventId, orderId: order.id });
    return true;
  }

  if (eventId === 'milkSpill') {
    s.event = { type: 'milkSpill', cleaned: 0, required: def.cleanTaps, startedAt: s.elapsed };
    setBanner(s, 'spill', def.title, def.text, config);
    s.effects.push({ type: 'event', eventId });
    return true;
  }

  if (eventId === 'luckyCat') {
    s.event = { type: 'luckyCat', endsAt: s.elapsed + def.duration, startedAt: s.elapsed };
    setBanner(s, 'lucky', def.title, def.text, config);
    s.effects.push({ type: 'event', eventId });
    return true;
  }
  return false;
}

function updateEvents(s, rng, config) {
  // 招財貓到期
  if (s.event?.type === 'luckyCat' && s.elapsed >= s.event.endsAt) {
    s.event = null;
    s.lastEventEndedAt = s.elapsed;
    s.effects.push({ type: 'event-end', eventId: 'luckyCat' });
  }

  const phase = config.phases[s.phaseIndex];
  const ev = config.events;
  if (s.event || phase.eventChance <= 0 || s.elapsed < s.nextEventCheckAt) return;
  s.nextEventCheckAt = s.elapsed + ev.checkInterval;

  if (s.elapsed - s.lastEventEndedAt < ev.cooldown) return;
  if (config.duration - s.elapsed < ev.quietLastSeconds) return;
  if (rng() >= phase.eventChance) return;

  const items = Object.values(EVENTS)
    .filter((def) => def.id !== 'changeOrder' || changeOrderCandidates(s).length > 0)
    .map((def) => ({ item: def.id, weight: def.weight }));
  const picked = weightedPick(rng, items);
  if (picked) applyEvent(s, picked, rng, config);
}

/* ------------------------------------------------------------------ */
/* 時間推進                                                            */
/* ------------------------------------------------------------------ */

/**
 * 依實際經過時間 dt（秒）推進遊戲。
 * 只有 ready / playing 狀態會前進，暫停或結束時直接回傳原 state。
 */
export function tick(state, dt, rng = Math.random, config = GAME_CONFIG) {
  if (state.status !== 'playing' && state.status !== 'ready') return state;
  const step = Math.max(0, Math.min(dt, config.maxFrameDelta));
  if (step === 0) return state;
  const s = draft(state);

  if (s.status === 'ready') {
    s.readyLeft = Math.max(0, s.readyLeft - step);
    if (s.readyLeft <= 0) {
      s.status = 'playing';
      s.effects.push({ type: 'go' });
    }
    return s;
  }

  s.elapsed = Math.min(config.duration, s.elapsed + step);

  // 階段切換
  const phaseIndex = getPhaseIndex(s.elapsed, config);
  if (phaseIndex !== s.phaseIndex) {
    s.phaseIndex = phaseIndex;
    const phase = config.phases[phaseIndex];
    s.effects.push({ type: 'phase', phaseIndex });
    if (phase.rush) {
      setBanner(s, 'rush', '尖峰時段！', '客人變多了，貓咪也更沒耐心！', config);
    } else {
      setBanner(s, 'phase', phase.name, '開始出現三步驟的甜點囉！', config);
    }
  }

  // 耐心下降與超時
  const drainMul = config.phases[s.phaseIndex].patienceDrain;
  for (const order of s.orders) {
    if (order.status !== 'waiting') continue;
    order.patience = Math.max(0, order.patience - order.baseDrain * drainMul * step);
    if (order.patience <= 0) {
      order.status = 'angry';
      order.leaveAt = s.elapsed + config.leaveDuration;
      s.failed += 1;
      s.combo = 0;
      addScore(s, config.scoring.timeout);
      addFloater(s, order.slot, `${config.scoring.timeout}`, 'bad', config);
      say(s, order, pickRandom(rng, CATS[order.catId].lines.angry), config);
      s.effects.push({ type: 'timeout', orderId: order.id });
    }
  }

  // 移除已離場的貓咪
  s.orders = s.orders.filter((o) => o.status === 'waiting' || s.elapsed < o.leaveAt);
  ensureSelection(s);

  // 清掉過期的提示
  if (s.banner && s.elapsed >= s.banner.until) s.banner = null;
  if (s.message && s.elapsed >= s.message.until) s.message = null;
  s.floaters = s.floaters.filter((f) => s.elapsed < f.until);
  for (const o of s.orders) {
    if (o.speech && s.elapsed >= o.speech.until) o.speech = null;
  }

  // 結束判定：時間到就停止一切生成
  if (s.elapsed >= config.duration) {
    s.status = 'over';
    s.event = null;
    s.banner = null;
    s.effects.push({ type: 'gameover' });
    return s;
  }

  updateEvents(s, rng, config);
  trySpawn(s, rng, config);
  return s;
}

/* ------------------------------------------------------------------ */
/* 玩家操作                                                            */
/* ------------------------------------------------------------------ */

export function selectOrder(state, orderId) {
  if (state.status !== 'playing') return state;
  const order = state.orders.find((o) => o.id === orderId);
  if (!order || order.status !== 'waiting' || state.selectedId === orderId) return state;
  const s = draft(state);
  s.selectedId = orderId;
  s.effects.push({ type: 'select', orderId });
  return s;
}

export function addIngredient(state, ingredientId, config = GAME_CONFIG) {
  if (state.status !== 'playing') return state;
  const s = draft(state);

  if (isSpillActive(s)) {
    setMessage(s, '地上都是牛奶，先擦乾淨！', 'warn', config);
    s.effects.push({ type: 'blocked' });
    return s;
  }
  const order = s.orders.find((o) => o.id === s.selectedId && o.status === 'waiting');
  if (!order) {
    setMessage(s, '先點選一張訂單喔！', 'info', config);
    s.effects.push({ type: 'blocked' });
    return s;
  }
  const recipe = RECIPES[order.recipeId];
  if (order.progress >= recipe.steps.length) {
    setMessage(s, '餐點好了，快按「完成餐點」！', 'info', config);
    s.effects.push({ type: 'blocked' });
    return s;
  }

  if (isCorrectIngredient(recipe, order.progress, ingredientId)) {
    order.progress += 1;
    const ready = order.progress >= recipe.steps.length;
    s.effects.push({ type: 'correct', ingredientId, orderId: order.id, ready });
    if (ready) setMessage(s, '完成了！端給客人吧～', 'good', config);
    return s;
  }

  order.progress = 0;
  s.mistakes += 1;
  addScore(s, config.scoring.wrongIngredient);
  setMessage(s, '喵？！放錯材料了！', 'bad', config);
  s.effects.push({ type: 'wrong', ingredientId, orderId: order.id });
  return s;
}

export function serveOrder(state, orderId = state.selectedId, config = GAME_CONFIG) {
  if (state.status !== 'playing' || isSpillActive(state)) return state;
  const target = state.orders.find((o) => o.id === orderId);
  if (!target || target.status !== 'waiting' || !isOrderReady(target)) return state;

  const s = draft(state);
  const order = s.orders.find((o) => o.id === orderId);
  const recipe = RECIPES[order.recipeId];
  const lucky = isLuckyActive(s);
  const comboAfter = s.combo + 1;
  const points = calcOrderScore({ recipe, patience: order.patience, comboAfter, lucky }, config);

  s.combo = comboAfter;
  s.maxCombo = Math.max(s.maxCombo, s.combo);
  s.served += 1;
  addScore(s, points.total);

  order.status = 'served';
  order.leaveAt = s.elapsed + config.leaveDuration;
  order.servedPoints = points;
  say(s, order, pickRandom(Math.random, CATS[order.catId].lines.served), config);

  addFloater(s, order.slot, `+${points.base + points.patienceBonus}`, lucky ? 'gold' : 'good', config);
  if (points.comboBonus) {
    addFloater(s, order.slot, `Combo +${points.comboBonus}`, 'combo', config);
  }
  s.effects.push({ type: 'served', orderId, points, lucky, combo: s.combo });
  if (points.comboBonus) s.effects.push({ type: 'combo', combo: s.combo, bonus: points.comboBonus });

  ensureSelection(s);
  return s;
}

export function cleanSpill(state, config = GAME_CONFIG) {
  if (state.status !== 'playing' || !isSpillActive(state)) return state;
  const s = draft(state);
  s.event = { ...s.event, cleaned: s.event.cleaned + 1 };
  if (s.event.cleaned >= s.event.required) {
    s.event = null;
    s.lastEventEndedAt = s.elapsed;
    setMessage(s, '乾淨溜溜！繼續營業～', 'good', config);
    s.effects.push({ type: 'cleaned' });
  } else {
    s.effects.push({ type: 'wipe', cleaned: s.event.cleaned });
  }
  return s;
}

export function pauseGame(state) {
  if (state.status !== 'playing' && state.status !== 'ready') return state;
  return { ...state, status: 'paused', resumeTo: state.status, effects: [] };
}

export function resumeGame(state) {
  if (state.status !== 'paused') return state;
  return { ...state, status: state.resumeTo ?? 'playing', resumeTo: null, effects: [] };
}

/** 結算用統計 */
export function getResult(state) {
  return {
    score: state.score,
    served: state.served,
    failed: state.failed,
    maxCombo: state.maxCombo,
    mistakes: state.mistakes,
    title: getTitle(state.score),
  };
}

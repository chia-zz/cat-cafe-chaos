import { memo } from 'react';
import CatCharacter from './CatCharacter.jsx';
import DishIcon from './art/DishIcon.jsx';
import IngredientIcon from './art/IngredientIcon.jsx';
import { CATS } from '../data/cats.js';
import { INGREDIENTS, RECIPES } from '../data/recipes.js';
import { GAME_CONFIG } from '../utils/gameConfig.js';
import { getMood } from '../utils/gameLogic.js';

const MOOD_LABEL = {
  happy: '開心期待',
  waiting: '普通等待',
  impatient: '不耐煩',
  angry: '生氣',
};

function patienceLevel(p) {
  if (p > GAME_CONFIG.mood.happyAbove) return 'high';
  if (p > GAME_CONFIG.mood.waitingAbove) return 'mid';
  return 'low';
}

function OrderCard({ order, selected, lucky, elapsed, onSelect }) {
  const cat = CATS[order.catId];
  const recipe = RECIPES[order.recipeId];
  const mood = getMood(order.patience, order.status);
  const leaving = order.status !== 'waiting';
  const level = patienceLevel(order.patience);
  const justChanged = order.changed && elapsed - (order.changedAt ?? -99) < 2.5;
  const points = recipe.score * (lucky ? GAME_CONFIG.scoring.luckyMultiplier : 1);
  const ready = order.progress >= recipe.steps.length;

  const classes = [
    'order-card',
    `mood-${mood}`,
    selected && !leaving ? 'is-selected' : '',
    leaving ? `is-leaving leave-${order.status}` : '',
    !leaving && level === 'low' ? 'is-danger' : '',
    justChanged ? 'is-changed' : '',
    ready && !leaving ? 'is-ready' : '',
  ].join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={() => onSelect(order.id)}
      disabled={leaving}
      aria-pressed={selected}
      aria-label={`${cat.name}${cat.title}點了${recipe.name}，耐心 ${Math.ceil(order.patience)}%，${MOOD_LABEL[mood]}`}
    >
      {order.speech && (
        <span className="speech" key={order.speech.id}>
          {order.speech.text}
        </span>
      )}
      {justChanged && <span className="changed-stamp">改單！</span>}

      <span className="order-cat">
        <CatCharacter catId={order.catId} mood={mood} />
      </span>

      <span className="order-ticket">
        <span className="order-name">
          <DishIcon id={recipe.id} className="order-dish" />
          <span className="order-dish-name">{recipe.name}</span>
        </span>
        <span className="order-steps" aria-hidden="true">
          {recipe.steps.map((step, i) => (
            <span
              key={`${recipe.id}-${i}`}
              className={`mini-step ${i < order.progress ? 'is-done' : ''}`}
              title={INGREDIENTS[step].name}
            >
              <IngredientIcon id={step} />
            </span>
          ))}
        </span>
        <span className={`patience patience-${level}`} aria-hidden="true">
          <span className="patience-fill" style={{ transform: `scaleX(${order.patience / 100})` }} />
        </span>
        <span className="order-meta">
          <span className="order-cat-name">
            {cat.name}・{cat.title}
          </span>
          <span className={`order-points ${lucky ? 'is-lucky' : ''}`}>{points}</span>
        </span>
      </span>
    </button>
  );
}

export default memo(OrderCard);

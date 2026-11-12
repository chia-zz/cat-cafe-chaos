import { Fragment } from 'react';
import IngredientButton from './IngredientButton.jsx';
import IngredientIcon from './art/IngredientIcon.jsx';
import DishIcon from './art/DishIcon.jsx';
import { MilkSpillArt } from './art/SceneArt.jsx';
import { INGREDIENTS, INGREDIENT_ORDER, RECIPES } from '../data/recipes.js';
import { CATS } from '../data/cats.js';

/** 餐點製作區 */
export default function CookingStation({
  order,
  spill,
  message,
  playing,
  burst,
  shake,
  onIngredient,
  onServe,
  onClean,
}) {
  const recipe = order ? RECIPES[order.recipeId] : null;
  const cat = order ? CATS[order.catId] : null;
  const ready = !!recipe && order.progress >= recipe.steps.length;
  const blocked = !playing || !!spill;

  return (
    <section className={`station ${spill ? 'is-spilled' : ''}`} aria-label="餐點製作區">
      <div className="station-head">
        {recipe ? (
          <>
            <span className={`station-dish ${ready ? 'is-ready' : ''}`} key={`${order.id}-${recipe.id}-${ready}`}>
              <DishIcon id={recipe.id} />
            </span>
            <span className="station-title">
              <small>{ready ? '完成！端給' : '製作中・給'} {cat.name}</small>
              <strong>{recipe.name}</strong>
            </span>
            <ol className="step-track" aria-label="製作步驟">
              {recipe.steps.map((step, i) => {
                const state = i < order.progress ? 'done' : i === order.progress ? 'next' : 'todo';
                return (
                  <Fragment key={`${order.id}-${recipe.id}-${i}`}>
                    {i > 0 && <li className="step-arrow" aria-hidden="true">›</li>}
                    <li
                      className={`step-chip is-${state}`}
                      key={state === 'done' ? `done-${i}` : `s-${i}`}
                      aria-label={`${i + 1}. ${INGREDIENTS[step].name}${state === 'done' ? '（完成）' : ''}`}
                    >
                      <IngredientIcon id={step} />
                      <span>{INGREDIENTS[step].name}</span>
                    </li>
                  </Fragment>
                );
              })}
            </ol>
          </>
        ) : (
          <span className="station-empty">點選上方的貓咪訂單開始製作</span>
        )}
      </div>

      <div className="station-message-row" aria-live="polite">
        {message && (
          <span className={`station-message msg-${message.kind}`} key={message.id}>
            {message.text}
          </span>
        )}
      </div>

      <div className="ingredient-grid">
        {INGREDIENT_ORDER.map((id) => (
          <IngredientButton
            key={id}
            ingredient={INGREDIENTS[id]}
            onPick={onIngredient}
            disabled={blocked}
            burstKey={burst?.id === id ? burst.n : 0}
            shakeKey={shake?.id === id ? shake.n : 0}
          />
        ))}
      </div>

      <button
        type="button"
        className={`serve-btn ${ready ? 'is-ready' : ''}`}
        onClick={onServe}
        disabled={!ready || blocked}
      >
        {ready ? '完成餐點！出餐' : recipe ? `依序加入食材（${order.progress}/${recipe.steps.length}）` : '尚未選擇訂單'}
      </button>

      {spill && (
        <div className="spill-overlay" role="alertdialog" aria-label="牛奶打翻了">
          <MilkSpillArt />
          <p className="spill-title">喵嗚～牛奶打翻了！</p>
          <p className="spill-text">擦乾淨之前不能做餐點</p>
          <button type="button" className="clean-btn" onClick={onClean} key={spill.cleaned}>
            擦乾淨！
            <span className="clean-dots" aria-label={`${spill.cleaned}/${spill.required}`}>
              {Array.from({ length: spill.required }, (_, i) => (
                <span key={i} className={i < spill.cleaned ? 'is-on' : ''} />
              ))}
            </span>
          </button>
        </div>
      )}
    </section>
  );
}

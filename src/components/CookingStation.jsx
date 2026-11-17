import { Fragment } from 'react';
import IngredientButton from './IngredientButton.jsx';
import IngredientIcon from './art/IngredientIcon.jsx';
import DishIcon from './art/DishIcon.jsx';
import { MilkSpillArt } from './art/SceneArt.jsx';
import { INGREDIENTS, INGREDIENT_ORDER, RECIPES } from '../data/recipes.js';
import { useI18n } from '../i18n/index.js';

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
  const { t } = useI18n();
  const recipe = order ? RECIPES[order.recipeId] : null;
  const catName = order ? t(`cats.${order.catId}.name`) : '';
  const ready = !!recipe && order.progress >= recipe.steps.length;
  const blocked = !playing || !!spill;

  return (
    <section className={`station ${spill ? 'is-spilled' : ''}`} aria-label={t('station.aria')}>
      <div className="station-head">
        {recipe ? (
          <>
            <span className={`station-dish ${ready ? 'is-ready' : ''}`} key={`${order.id}-${recipe.id}-${ready}`}>
              <DishIcon id={recipe.id} />
            </span>
            <span className="station-title">
              <small>{t(ready ? 'station.readyFor' : 'station.makingFor', { name: catName })}</small>
              <strong>{t(`recipes.${recipe.id}`)}</strong>
            </span>
            <ol className="step-track" aria-label={t('station.stepsAria')}>
              {recipe.steps.map((step, i) => {
                const state = i < order.progress ? 'done' : i === order.progress ? 'next' : 'todo';
                return (
                  <Fragment key={`${order.id}-${recipe.id}-${i}`}>
                    {i > 0 && <li className="step-arrow" aria-hidden="true">›</li>}
                    <li
                      className={`step-chip is-${state}`}
                      key={state === 'done' ? `done-${i}` : `s-${i}`}
                      aria-label={`${i + 1}. ${t(`ingredients.${step}`)}${state === 'done' ? t('station.stepDone') : ''}`}
                    >
                      <IngredientIcon id={step} />
                      <span>{t(`ingredients.${step}`)}</span>
                    </li>
                  </Fragment>
                );
              })}
            </ol>
          </>
        ) : (
          <span className="station-empty">{t('station.empty')}</span>
        )}
      </div>

      <div className="station-message-row" aria-live="polite">
        {message && (
          <span className={`station-message msg-${message.kind}`} key={message.id}>
            {t(`messages.${message.key}`)}
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
        {ready
          ? t('station.serveReady')
          : recipe
            ? t('station.serveProgress', { n: order.progress, total: recipe.steps.length })
            : t('station.serveNone')}
      </button>

      {spill && (
        <div className="spill-overlay" role="alertdialog" aria-label={t('station.spillAria')}>
          <MilkSpillArt />
          <p className="spill-title">{t('station.spillTitle')}</p>
          <p className="spill-text">{t('station.spillText')}</p>
          <button type="button" className="clean-btn" onClick={onClean} key={spill.cleaned}>
            {t('station.clean')}
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

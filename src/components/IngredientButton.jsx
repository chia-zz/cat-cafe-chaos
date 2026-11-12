import { memo } from 'react';
import IngredientIcon from './art/IngredientIcon.jsx';
import { Sparkle } from './art/SceneArt.jsx';

const SPARKS = [
  { x: -26, y: -30, d: 0 },
  { x: 24, y: -34, d: 40 },
  { x: 32, y: 4, d: 80 },
  { x: -30, y: 6, d: 60 },
  { x: 0, y: -44, d: 20 },
];

/**
 * 食材按鈕：圖示 + 文字，不只依賴顏色辨識。
 * burstKey 改變時播放星星特效；shakeKey 改變時播放錯誤抖動。
 */
function IngredientButton({ ingredient, onPick, disabled, burstKey, shakeKey }) {
  return (
    <button
      type="button"
      className={`ingredient-btn ${shakeKey ? 'is-wrong' : ''}`}
      key={shakeKey ? `shake-${shakeKey}` : undefined}
      onClick={() => onPick(ingredient.id)}
      disabled={disabled}
      aria-label={`加入${ingredient.name}`}
    >
      <IngredientIcon id={ingredient.id} />
      <span className="ingredient-name">{ingredient.name}</span>
      {burstKey ? (
        <span className="spark-burst" key={burstKey} aria-hidden="true">
          {SPARKS.map((p, i) => (
            <Sparkle
              key={i}
              style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, animationDelay: `${p.d}ms` }}
            />
          ))}
        </span>
      ) : null}
    </button>
  );
}

export default memo(IngredientButton);

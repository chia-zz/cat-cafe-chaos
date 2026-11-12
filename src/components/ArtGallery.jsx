import CatCharacter from './CatCharacter.jsx';
import IngredientIcon from './art/IngredientIcon.jsx';
import DishIcon from './art/DishIcon.jsx';
import { LuckyCatArt, MilkSpillArt } from './art/SceneArt.jsx';
import { INGREDIENT_ORDER } from '../data/recipes.js';
import { RECIPE_LIST } from '../data/recipes.js';

/** 開發用：檢視所有美術素材（網址加上 ?gallery，僅在 dev 模式） */
export default function ArtGallery() {
  const moods = ['happy', 'waiting', 'impatient', 'angry'];
  return (
    <div style={{ padding: 12, overflow: 'auto', height: '100%', background: '#fff8ec' }}>
      {['orange', 'calico', 'black', 'white'].map((cat) => (
        <div key={cat} style={{ display: 'flex', gap: 4 }}>
          {moods.map((m) => (
            <CatCharacter key={m} catId={cat} mood={m} className="gallery-cat" />
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {INGREDIENT_ORDER.map((id) => (
          <div key={id} style={{ width: 52 }}>
            <IngredientIcon id={id} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {RECIPE_LIST.map((r) => (
          <div key={r.id} style={{ width: 64 }}>
            <DishIcon id={r.id} />
          </div>
        ))}
        <div style={{ width: 64 }}>
          <LuckyCatArt />
        </div>
        <div style={{ width: 120 }}>
          <MilkSpillArt />
        </div>
        <div style={{ width: 90 }}>
          <CatCharacter catId="orange" mood="happy" />
        </div>
      </div>
    </div>
  );
}

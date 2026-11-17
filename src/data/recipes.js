/** 食材清單（名稱在 src/i18n/locales/*.js 的 ingredients / recipes） */
export const INGREDIENTS = {
  coffee: { id: 'coffee' },
  hotWater: { id: 'hotWater' },
  milk: { id: 'milk' },
  batter: { id: 'batter' },
  bake: { id: 'bake' },
  honey: { id: 'honey' },
  cake: { id: 'cake' },
  cream: { id: 'cream' },
  strawberry: { id: 'strawberry' },
};

/** 食材按鈕在 3×3 格子中的排列順序 */
export const INGREDIENT_ORDER = [
  'coffee', 'hotWater', 'milk',
  'batter', 'bake', 'honey',
  'cake', 'cream', 'strawberry',
];

/**
 * 食譜。
 * - steps：必須依序點擊的食材
 * - score：基礎分數
 * - category：給貓咪偏好使用（coffee / drink / dessert）
 * - extraPatience：步驟較多的餐點，貓咪願意多等幾秒
 */
export const RECIPES = {
  americano: {
    id: 'americano',
    steps: ['coffee', 'hotWater'],
    score: 100,
    category: 'coffee',
    extraPatience: 0,
  },
  latte: {
    id: 'latte',
    steps: ['coffee', 'milk'],
    score: 120,
    category: 'coffee',
    extraPatience: 0,
  },
  strawberryMilk: {
    id: 'strawberryMilk',
    steps: ['milk', 'strawberry'],
    score: 120,
    category: 'drink',
    extraPatience: 0,
  },
  pawPancake: {
    id: 'pawPancake',
    steps: ['batter', 'bake', 'honey'],
    score: 180,
    category: 'dessert',
    extraPatience: 4,
  },
  strawberryCake: {
    id: 'strawberryCake',
    steps: ['cake', 'cream', 'strawberry'],
    score: 180,
    category: 'dessert',
    extraPatience: 4,
  },
};

export const RECIPE_LIST = Object.values(RECIPES);

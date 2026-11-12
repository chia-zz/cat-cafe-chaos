/** 食材清單 */
export const INGREDIENTS = {
  coffee: { id: 'coffee', name: '咖啡' },
  hotWater: { id: 'hotWater', name: '熱水' },
  milk: { id: 'milk', name: '牛奶' },
  batter: { id: 'batter', name: '麵糊' },
  bake: { id: 'bake', name: '烘烤' },
  honey: { id: 'honey', name: '蜂蜜' },
  cake: { id: 'cake', name: '蛋糕' },
  cream: { id: 'cream', name: '鮮奶油' },
  strawberry: { id: 'strawberry', name: '草莓' },
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
    name: '美式咖啡',
    steps: ['coffee', 'hotWater'],
    score: 100,
    category: 'coffee',
    extraPatience: 0,
  },
  latte: {
    id: 'latte',
    name: '拿鐵',
    steps: ['coffee', 'milk'],
    score: 120,
    category: 'coffee',
    extraPatience: 0,
  },
  strawberryMilk: {
    id: 'strawberryMilk',
    name: '草莓牛奶',
    steps: ['milk', 'strawberry'],
    score: 120,
    category: 'drink',
    extraPatience: 0,
  },
  pawPancake: {
    id: 'pawPancake',
    name: '貓掌鬆餅',
    steps: ['batter', 'bake', 'honey'],
    score: 180,
    category: 'dessert',
    extraPatience: 4,
  },
  strawberryCake: {
    id: 'strawberryCake',
    name: '草莓蛋糕',
    steps: ['cake', 'cream', 'strawberry'],
    score: 180,
    category: 'dessert',
    extraPatience: 4,
  },
};

export const RECIPE_LIST = Object.values(RECIPES);

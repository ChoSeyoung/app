/**
 * 수동 식재료 이미지 매핑 파일.
 *
 * 역할:
 * - 코어 식재료에만 실제 이미지를 연결한다.
 * - 이미지가 없는 식재료는 플레이스홀더를 유지한다.
 *
 * 유지보수 포인트:
 * - 코어 마스터에서 빠진 식재료 이미지는 이 파일에서도 제거한다.
 * - 새 파일을 추가할 때는 식재료 id와 실제 파일명이 맞는지 함께 확인한다.
 */

const INGREDIENT_IMAGE_SOURCES: Record<string, number> = {
  'seed-rice': require('../assets/images/ingredients/rice.png'),
  'seed-oatmeal': require('../assets/images/ingredients/oatmeal.png'),
  'seed-barley': require('../assets/images/ingredients/barley.png'),
  'seed-glutinous-rice': require('../assets/images/ingredients/glutinous-rice.png'),
  'seed-brown-rice': require('../assets/images/ingredients/brown-rice.png'),
  'seed-sweet-potato': require('../assets/images/ingredients/sweet-potato.png'),
  'seed-pumpkin': require('../assets/images/ingredients/pumpkin.png'),
  'seed-potato': require('../assets/images/ingredients/potato.png'),
  'seed-carrot': require('../assets/images/ingredients/carrot.png'),
  'seed-broccoli': require('../assets/images/ingredients/broccoli.png'),
  'seed-cauliflower': require('../assets/images/ingredients/cauliflower.png'),
  'seed-zucchini': require('../assets/images/ingredients/zucchini.png'),
  'seed-spinach': require('../assets/images/ingredients/spinach.png'),
  'seed-cabbage': require('../assets/images/ingredients/cabbage.png'),
  'seed-onion': require('../assets/images/ingredients/onion.png'),
  'seed-bok-choy': require('../assets/images/ingredients/bok-choy.png'),
  'seed-beet': require('../assets/images/ingredients/beet.png'),
  'seed-tomato': require('../assets/images/ingredients/tomato.png'),
  'seed-apple': require('../assets/images/ingredients/apple.png'),
  'seed-pear': require('../assets/images/ingredients/pear.png'),
  'seed-banana': require('../assets/images/ingredients/banana.png'),
  'seed-avocado': require('../assets/images/ingredients/avocado.png'),
  'seed-peach': require('../assets/images/ingredients/peach.png'),
  'seed-blueberry': require('../assets/images/ingredients/blueberry.png'),
  'seed-strawberry': require('../assets/images/ingredients/strawberry.png'),
  'seed-mango': require('../assets/images/ingredients/mango.png'),
  'seed-kiwi': require('../assets/images/ingredients/kiwi.png'),
  'seed-chicken': require('../assets/images/ingredients/chicken.png'),
  'seed-beef': require('../assets/images/ingredients/beef.png'),
  'seed-tofu': require('../assets/images/ingredients/tofu.png'),
  'seed-egg-yolk': require('../assets/images/ingredients/egg-yolk.png'),
  'seed-white-fish': require('../assets/images/ingredients/white-fish.png'),
  'seed-salmon': require('../assets/images/ingredients/salmon.png'),
  'seed-pork': require('../assets/images/ingredients/pork.png'),
  'seed-shrimp': require('../assets/images/ingredients/shrimp.png'),
  'seed-yogurt': require('../assets/images/ingredients/yogurt.png'),
  'seed-cheese': require('../assets/images/ingredients/cheese.png'),
};

export function getIngredientImageSource(ingredientId?: string): number | null {
  if (!ingredientId) return null;
  return INGREDIENT_IMAGE_SOURCES[ingredientId] ?? null;
}

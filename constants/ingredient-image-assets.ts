/**
 * 수동 식재료 이미지 매핑 파일.
 *
 * 역할:
 * - 프로젝트에 직접 추가한 식재료 이미지를 식재료 id와 연결한다.
 * - 자동 생성 파이프라인 없이도 일부 대표 식재료에 실제 이미지를 노출한다.
 *
 * 유지보수 포인트:
 * - 새 파일을 추가할 때는 식재료 id와 실제 이미지 파일명이 맞는지 함께 확인한다.
 * - 이미지가 없는 식재료는 null을 반환하고 기존 플레이스홀더를 유지한다.
 */

const INGREDIENT_IMAGE_SOURCES: Record<string, number> = {
  'seed-rice': require('../assets/images/ingredients/rice.png'),
  'seed-oatmeal': require('../assets/images/ingredients/oatmeal.png'),
  'seed-barley': require('../assets/images/ingredients/barley.png'),
  'seed-glutinous-rice': require('../assets/images/ingredients/glutinous-rice.png'),
  'seed-brown-rice': require('../assets/images/ingredients/brown-rice.png'),
  'seed-millet': require('../assets/images/ingredients/millet.png'),
  'seed-quinoa': require('../assets/images/ingredients/quinoa.png'),
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
  'seed-asparagus': require('../assets/images/ingredients/asparagus.png'),
  'seed-eggplant': require('../assets/images/ingredients/eggplant.png'),
  'seed-lotus-root': require('../assets/images/ingredients/lotus-root.png'),
  'seed-radish': require('../assets/images/ingredients/radish.png'),
  'seed-napa-cabbage': require('../assets/images/ingredients/napa-cabbage.png'),
  'seed-bell-pepper': require('../assets/images/ingredients/bell-pepper.png'),
  'seed-tomato': require('../assets/images/ingredients/tomato.png'),
  'seed-corn': require('../assets/images/ingredients/corn.png'),
  'seed-kale': require('../assets/images/ingredients/kale.png'),
  'seed-celery': require('../assets/images/ingredients/celery.png'),
  'seed-cucumber': require('../assets/images/ingredients/cucumber.png'),
  'seed-green-bean': require('../assets/images/ingredients/green-bean.png'),
  'seed-apple': require('../assets/images/ingredients/apple.png'),
  'seed-pear': require('../assets/images/ingredients/pear.png'),
  'seed-banana': require('../assets/images/ingredients/banana.png'),
  'seed-avocado': require('../assets/images/ingredients/avocado.png'),
  'seed-peach': require('../assets/images/ingredients/peach.png'),
  'seed-blueberry': require('../assets/images/ingredients/blueberry.png'),
  'seed-strawberry': require('../assets/images/ingredients/strawberry.png'),
  'seed-plum': require('../assets/images/ingredients/plum.png'),
  'seed-mango': require('../assets/images/ingredients/mango.png'),
  'seed-kiwi': require('../assets/images/ingredients/kiwi.png'),
  'seed-watermelon': require('../assets/images/ingredients/watermelon.png'),
  'seed-oriental-melon': require('../assets/images/ingredients/oriental-melon.png'),
  'seed-tangerine': require('../assets/images/ingredients/tangerine.png'),
  'seed-grape': require('../assets/images/ingredients/grape.png'),
  'seed-chicken': require('../assets/images/ingredients/chicken.png'),
  'seed-beef': require('../assets/images/ingredients/beef.png'),
  'seed-white-fish': require('../assets/images/ingredients/white-fish.png'),
  'seed-salmon': require('../assets/images/ingredients/salmon.png'),
  'seed-pork': require('../assets/images/ingredients/pork.png'),
  'seed-lentil': require('../assets/images/ingredients/lentil.png'),
  'seed-black-bean': require('../assets/images/ingredients/black-bean.png'),
};

export function getIngredientImageSource(ingredientId?: string): number | null {
  if (!ingredientId) return null;
  return INGREDIENT_IMAGE_SOURCES[ingredientId] ?? null;
}

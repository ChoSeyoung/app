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
  'seed-chicken': require('../assets/images/ingredients/chicken.png'),
};

export function getIngredientImageSource(ingredientId?: string): number | null {
  if (!ingredientId) return null;
  return INGREDIENT_IMAGE_SOURCES[ingredientId] ?? null;
}

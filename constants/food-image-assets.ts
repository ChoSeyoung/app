import { GENERATED_INGREDIENT_IMAGES, GENERATED_RECIPE_IMAGES } from '@/constants/generated-food-images';

export function getRecipeImageSource(recipeId?: string): number | null {
  if (!recipeId) return null;
  return GENERATED_RECIPE_IMAGES[recipeId] ?? null;
}

export function getIngredientImageSource(ingredientId?: string): number | null {
  if (!ingredientId) return null;
  return GENERATED_INGREDIENT_IMAGES[ingredientId] ?? null;
}

export type IngredientStatus = 'NOT_TRIED' | 'TRIED' | 'CAUTION' | 'ALLERGY';

export type IngredientCategory = 'GRAIN' | 'VEGETABLE' | 'FRUIT' | 'PROTEIN' | 'DAIRY' | 'OTHER';

export type IngredientBase = {
  id: string;
  name: string;
  category: IngredientCategory;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type MasterIngredient = IngredientBase & {
  source: 'seed' | 'custom';
  aliases?: string[];
  isCommon?: boolean;
  sortOrder?: number;
  imageUri?: string;
};

export type IngredientStatusEntry = {
  ingredientId: string;
  status: IngredientStatus;
  firstTriedDate?: string; // YYYY-MM-DD
  isFavorite?: boolean;
  updatedAt: string; // ISO
};

export type Ingredient = IngredientBase & {
  source: 'seed' | 'custom';
  status: IngredientStatus;
  firstTriedDate?: string; // YYYY-MM-DD
  isFavorite: boolean;
  imageUri?: string;
  latestNote?: string;
};

export type IngredientReactionType = 'NONE' | 'CAUTION' | 'ALLERGY' | 'OTHER';

export type IngredientReaction = {
  id: string;
  ingredientId: string;
  date: string; // YYYY-MM-DD
  reactionType: IngredientReactionType;
  note?: string;
};

export type MealIngredientRelation = {
  mealId: string;
  ingredientId: string;
};

const statusTransitions: Record<IngredientStatus, IngredientStatus[]> = {
  NOT_TRIED: ['TRIED'],
  TRIED: ['CAUTION', 'ALLERGY', 'NOT_TRIED'],
  CAUTION: ['ALLERGY', 'TRIED', 'NOT_TRIED'],
  ALLERGY: ['TRIED', 'CAUTION', 'NOT_TRIED'],
};

export function canTransitionIngredientStatus(
  from: IngredientStatus,
  to: IngredientStatus
): boolean {
  if (from === to) return true;
  return statusTransitions[from].includes(to);
}

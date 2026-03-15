import { t, tList } from '@/constants/i18n';

export type RecipeStage = 'INITIAL' | 'MIDDLE' | 'LATE';

type RecipeKey =
  | 'ricePumpkin'
  | 'oatApple'
  | 'beefBroccoli'
  | 'tofuZucchini'
  | 'riceBallTofuStick'
  | 'sweetPotatoFinger';

type RecipeDefinition = {
  id: RecipeKey;
  stage: RecipeStage;
};

type LocalizedRecipe = {
  id: RecipeKey;
  stage: RecipeStage;
  stageLabel: string;
  title: string;
  summary: string;
  ingredients: string[];
  steps: string[];
  isFavorite?: boolean;
};

const RECIPE_DEFINITIONS: RecipeDefinition[] = [
  { id: 'ricePumpkin', stage: 'INITIAL' },
  { id: 'oatApple', stage: 'INITIAL' },
  { id: 'beefBroccoli', stage: 'MIDDLE' },
  { id: 'tofuZucchini', stage: 'MIDDLE' },
  { id: 'riceBallTofuStick', stage: 'LATE' },
  { id: 'sweetPotatoFinger', stage: 'LATE' },
];

function stageLabel(stage: RecipeStage): string {
  switch (stage) {
    case 'INITIAL':
      return t('recipeScreen.stageInitial');
    case 'MIDDLE':
      return t('recipeScreen.stageMiddle');
    case 'LATE':
    default:
      return t('recipeScreen.stageLate');
  }
}

export function listWeaningRecipes(): LocalizedRecipe[] {
  return RECIPE_DEFINITIONS.map((item) => ({
    id: item.id,
    stage: item.stage,
    stageLabel: stageLabel(item.stage),
    title: t(`recipeScreen.${item.id}.title`),
    summary: t(`recipeScreen.${item.id}.summary`),
    ingredients: tList(`recipeScreen.${item.id}.ingredients`),
    steps: tList(`recipeScreen.${item.id}.steps`),
  }));
}

export function getWeaningRecipeById(recipeId?: string): LocalizedRecipe | undefined {
  return listWeaningRecipes().find((item) => item.id === recipeId);
}

export type WeaningRecipe = LocalizedRecipe;

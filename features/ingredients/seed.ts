import type {
  IngredientCategory,
  IngredientNutritionTag,
  IngredientRecipeId,
  MasterIngredient,
} from './model';

const seedCreatedAt = '2026-03-10T00:00:00.000Z';

type SeedIngredientInput = {
  id: string;
  name: string;
  category: IngredientCategory;
  aliases?: string[];
  isCommon?: boolean;
  sortOrder: number;
  minStage?: MasterIngredient['minStage'];
  allergyWatch?: boolean;
  observationDays?: number;
  nutritionTags?: IngredientNutritionTag[];
  relatedRecipeIds?: IngredientRecipeId[];
};

const CATEGORY_DEFAULTS: Record<
  IngredientCategory,
  Pick<MasterIngredient, 'minStage' | 'allergyWatch' | 'observationDays' | 'nutritionTags'>
> = {
  GRAIN: { minStage: 'INITIAL', allergyWatch: false, observationDays: 3, nutritionTags: ['CARB'] },
  VEGETABLE: { minStage: 'INITIAL', allergyWatch: false, observationDays: 3, nutritionTags: ['FIBER'] },
  FRUIT: { minStage: 'INITIAL', allergyWatch: false, observationDays: 3, nutritionTags: ['FIBER', 'VITAMIN_C'] },
  PROTEIN: { minStage: 'MIDDLE', allergyWatch: false, observationDays: 3, nutritionTags: ['PROTEIN', 'IRON'] },
  DAIRY: { minStage: 'MIDDLE', allergyWatch: true, observationDays: 3, nutritionTags: ['CALCIUM'] },
  OTHER: { minStage: 'MIDDLE', allergyWatch: false, observationDays: 3, nutritionTags: [] },
};

function seedIngredient(input: SeedIngredientInput): MasterIngredient {
  const defaults = CATEGORY_DEFAULTS[input.category];

  return {
    id: input.id,
    name: input.name,
    category: input.category,
    source: 'seed',
    aliases: input.aliases,
    isCommon: input.isCommon,
    sortOrder: input.sortOrder,
    minStage: input.minStage ?? defaults.minStage,
    allergyWatch: input.allergyWatch ?? defaults.allergyWatch,
    observationDays: input.observationDays ?? defaults.observationDays,
    nutritionTags: input.nutritionTags ?? defaults.nutritionTags,
    relatedRecipeIds: input.relatedRecipeIds,
    createdAt: seedCreatedAt,
    updatedAt: seedCreatedAt,
  };
}

export const SEED_INGREDIENTS: MasterIngredient[] = [
  seedIngredient({
    id: 'seed-rice',
    name: '쌀',
    category: 'GRAIN',
    aliases: ['쌀미음'],
    isCommon: true,
    sortOrder: 1,
    nutritionTags: ['CARB'],
    relatedRecipeIds: ['ricePumpkin', 'riceBallTofuStick'],
  }),
  seedIngredient({
    id: 'seed-oatmeal',
    name: '오트밀',
    category: 'GRAIN',
    isCommon: true,
    sortOrder: 2,
    nutritionTags: ['CARB', 'FIBER', 'IRON'],
    relatedRecipeIds: ['oatApple'],
  }),
  seedIngredient({
    id: 'seed-barley',
    name: '보리',
    category: 'GRAIN',
    isCommon: true,
    sortOrder: 3,
    nutritionTags: ['CARB', 'FIBER'],
  }),
  seedIngredient({
    id: 'seed-glutinous-rice',
    name: '찹쌀',
    category: 'GRAIN',
    isCommon: true,
    sortOrder: 4,
    nutritionTags: ['CARB'],
  }),
  seedIngredient({
    id: 'seed-brown-rice',
    name: '현미',
    category: 'GRAIN',
    isCommon: true,
    sortOrder: 5,
    nutritionTags: ['CARB', 'FIBER', 'IRON'],
  }),

  seedIngredient({
    id: 'seed-sweet-potato',
    name: '고구마',
    category: 'VEGETABLE',
    isCommon: true,
    sortOrder: 10,
    nutritionTags: ['CARB', 'FIBER', 'BETA_CAROTENE'],
    relatedRecipeIds: ['sweetPotatoFinger'],
  }),
  seedIngredient({
    id: 'seed-pumpkin',
    name: '단호박',
    category: 'VEGETABLE',
    aliases: ['호박'],
    isCommon: true,
    sortOrder: 11,
    nutritionTags: ['CARB', 'FIBER', 'BETA_CAROTENE'],
    relatedRecipeIds: ['ricePumpkin'],
  }),
  seedIngredient({
    id: 'seed-potato',
    name: '감자',
    category: 'VEGETABLE',
    isCommon: true,
    sortOrder: 12,
    nutritionTags: ['CARB', 'VITAMIN_C'],
  }),
  seedIngredient({
    id: 'seed-carrot',
    name: '당근',
    category: 'VEGETABLE',
    isCommon: true,
    sortOrder: 13,
    nutritionTags: ['FIBER', 'BETA_CAROTENE'],
  }),
  seedIngredient({
    id: 'seed-broccoli',
    name: '브로콜리',
    category: 'VEGETABLE',
    isCommon: true,
    sortOrder: 14,
    nutritionTags: ['FIBER', 'VITAMIN_C', 'IRON'],
    relatedRecipeIds: ['beefBroccoli'],
  }),
  seedIngredient({
    id: 'seed-cauliflower',
    name: '콜리플라워',
    category: 'VEGETABLE',
    isCommon: true,
    sortOrder: 15,
    nutritionTags: ['FIBER', 'VITAMIN_C'],
  }),
  seedIngredient({
    id: 'seed-zucchini',
    name: '애호박',
    category: 'VEGETABLE',
    isCommon: true,
    sortOrder: 16,
    nutritionTags: ['FIBER', 'VITAMIN_C'],
    relatedRecipeIds: ['tofuZucchini'],
  }),
  seedIngredient({
    id: 'seed-spinach',
    name: '시금치',
    category: 'VEGETABLE',
    isCommon: true,
    sortOrder: 17,
    nutritionTags: ['IRON', 'FIBER', 'BETA_CAROTENE'],
  }),
  seedIngredient({
    id: 'seed-cabbage',
    name: '양배추',
    category: 'VEGETABLE',
    isCommon: true,
    sortOrder: 18,
    nutritionTags: ['FIBER', 'VITAMIN_C'],
  }),
  seedIngredient({
    id: 'seed-onion',
    name: '양파',
    category: 'VEGETABLE',
    isCommon: true,
    sortOrder: 19,
    nutritionTags: ['FIBER'],
  }),
  seedIngredient({
    id: 'seed-bok-choy',
    name: '청경채',
    category: 'VEGETABLE',
    sortOrder: 20,
    nutritionTags: ['FIBER', 'CALCIUM', 'VITAMIN_C'],
  }),
  seedIngredient({
    id: 'seed-beet',
    name: '비트',
    category: 'VEGETABLE',
    sortOrder: 21,
    nutritionTags: ['FIBER', 'IRON'],
  }),
  seedIngredient({
    id: 'seed-tomato',
    name: '토마토',
    category: 'VEGETABLE',
    isCommon: true,
    sortOrder: 22,
    allergyWatch: true,
    nutritionTags: ['VITAMIN_C', 'FIBER'],
  }),

  seedIngredient({
    id: 'seed-apple',
    name: '사과',
    category: 'FRUIT',
    isCommon: true,
    sortOrder: 30,
    nutritionTags: ['FIBER', 'VITAMIN_C'],
    relatedRecipeIds: ['oatApple'],
  }),
  seedIngredient({
    id: 'seed-pear',
    name: '배',
    category: 'FRUIT',
    isCommon: true,
    sortOrder: 31,
    nutritionTags: ['FIBER', 'VITAMIN_C'],
  }),
  seedIngredient({
    id: 'seed-banana',
    name: '바나나',
    category: 'FRUIT',
    isCommon: true,
    sortOrder: 32,
    nutritionTags: ['CARB', 'FIBER'],
  }),
  seedIngredient({
    id: 'seed-avocado',
    name: '아보카도',
    category: 'FRUIT',
    isCommon: true,
    sortOrder: 33,
    nutritionTags: ['HEALTHY_FAT', 'FIBER'],
  }),
  seedIngredient({
    id: 'seed-peach',
    name: '복숭아',
    category: 'FRUIT',
    sortOrder: 34,
    nutritionTags: ['FIBER', 'VITAMIN_C'],
  }),
  seedIngredient({
    id: 'seed-blueberry',
    name: '블루베리',
    category: 'FRUIT',
    sortOrder: 35,
    nutritionTags: ['FIBER', 'VITAMIN_C'],
  }),
  seedIngredient({
    id: 'seed-strawberry',
    name: '딸기',
    category: 'FRUIT',
    sortOrder: 36,
    allergyWatch: true,
    nutritionTags: ['VITAMIN_C', 'FIBER'],
  }),
  seedIngredient({
    id: 'seed-mango',
    name: '망고',
    category: 'FRUIT',
    sortOrder: 37,
    nutritionTags: ['BETA_CAROTENE', 'VITAMIN_C'],
  }),
  seedIngredient({
    id: 'seed-kiwi',
    name: '키위',
    category: 'FRUIT',
    sortOrder: 38,
    allergyWatch: true,
    nutritionTags: ['VITAMIN_C', 'FIBER'],
  }),

  seedIngredient({
    id: 'seed-chicken',
    name: '닭고기',
    category: 'PROTEIN',
    isCommon: true,
    sortOrder: 40,
    nutritionTags: ['PROTEIN', 'IRON'],
  }),
  seedIngredient({
    id: 'seed-beef',
    name: '소고기',
    category: 'PROTEIN',
    aliases: ['쇠고기'],
    isCommon: true,
    sortOrder: 41,
    nutritionTags: ['PROTEIN', 'IRON'],
    relatedRecipeIds: ['beefBroccoli'],
  }),
  seedIngredient({
    id: 'seed-tofu',
    name: '두부',
    category: 'PROTEIN',
    isCommon: true,
    sortOrder: 42,
    nutritionTags: ['PROTEIN', 'CALCIUM'],
    relatedRecipeIds: ['tofuZucchini', 'riceBallTofuStick'],
  }),
  seedIngredient({
    id: 'seed-egg-yolk',
    name: '달걀노른자',
    category: 'PROTEIN',
    aliases: ['계란노른자'],
    isCommon: true,
    sortOrder: 43,
    allergyWatch: true,
    nutritionTags: ['PROTEIN', 'IRON', 'HEALTHY_FAT'],
  }),
  seedIngredient({
    id: 'seed-white-fish',
    name: '흰살생선',
    category: 'PROTEIN',
    isCommon: true,
    sortOrder: 44,
    allergyWatch: true,
    nutritionTags: ['PROTEIN'],
  }),
  seedIngredient({
    id: 'seed-salmon',
    name: '연어',
    category: 'PROTEIN',
    sortOrder: 45,
    minStage: 'LATE',
    allergyWatch: true,
    nutritionTags: ['PROTEIN', 'HEALTHY_FAT'],
  }),
  seedIngredient({
    id: 'seed-pork',
    name: '돼지고기',
    category: 'PROTEIN',
    sortOrder: 46,
    minStage: 'LATE',
    nutritionTags: ['PROTEIN', 'IRON'],
  }),
  seedIngredient({
    id: 'seed-shrimp',
    name: '새우',
    category: 'PROTEIN',
    sortOrder: 47,
    minStage: 'LATE',
    allergyWatch: true,
    nutritionTags: ['PROTEIN'],
  }),

  seedIngredient({
    id: 'seed-yogurt',
    name: '요거트',
    category: 'DAIRY',
    isCommon: true,
    sortOrder: 50,
    nutritionTags: ['CALCIUM', 'PROBIOTIC'],
  }),
  seedIngredient({
    id: 'seed-cheese',
    name: '치즈',
    category: 'DAIRY',
    isCommon: true,
    sortOrder: 51,
    nutritionTags: ['CALCIUM', 'PROTEIN'],
  }),
];

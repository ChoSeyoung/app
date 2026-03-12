export type FeedingStage = 'PREP' | 'INITIAL' | 'MIDDLE' | 'LATE' | 'COMPLETE';

export type FeedingMethod = 'TOPPING' | 'TRADITIONAL' | 'BLW_MIXED';

export const BABY_PROFILE_STORAGE_KEY = '@weaning-diary/baby-profile';

export type BabyProfile = {
  babyName: string;
  birthDate: string;
  photoUri?: string;
  feedingStartDate?: string;
  feedingStage?: FeedingStage;
  mealsPerDay?: 1 | 2 | 3;
  feedingMethod?: FeedingMethod;
  proteinStarted?: boolean;
  textureLevel?: string;
  blockedIngredientIds?: string[];
};

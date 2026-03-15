export type FeedingStage = 'PREP' | 'INITIAL' | 'MIDDLE' | 'LATE' | 'COMPLETE';

export type FeedingMethod = 'TOPPING' | 'TRADITIONAL' | 'BLW_MIXED';

export type TextureLevel = 'THIN_PORRIDGE' | 'SOFT_MASH' | 'SOFT_CHUNK' | 'FINGER_FOOD';

export type CaregiverGoal = 'VARIETY' | 'EASY' | 'FREEZER';

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
  textureLevel?: TextureLevel;
  caregiverGoal?: CaregiverGoal;
  blockedIngredientIds?: string[];
  preferredIngredientIds?: string[];
  dislikedIngredientIds?: string[];
  recentRefusedIngredientIds?: string[];
};

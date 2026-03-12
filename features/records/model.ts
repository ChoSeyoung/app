export type ID = string;

export type AmountType = 'GRAM' | 'LEVEL';

export type AmountLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ReactionType = 'NONE' | 'NORMAL' | 'FUSSY' | 'VOMIT' | 'RASH';

export type IngredientState = 'planned' | 'eaten' | 'skipped' | 'added';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Plan domain: what caregiver intended to feed on a date/slot.
export type PlannedMealItem = {
  ingredientId: ID;
  ingredientName: string;
  plannedAmountG?: number;
  note?: string;
};

export type PlannedMeal = {
  id: ID;
  date: string; // YYYY-MM-DD
  slot: MealSlot;
  items: PlannedMealItem[];
  templateId?: ID;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

// Record domain: what baby actually ate and what happened.
export type RecordedMealItem = {
  ingredientId?: ID;
  ingredientName: string;
  plannedItemRefId?: ID; // link to PlannedMealItem if sourced from plan
  amountG?: number;
  state: IngredientState;
};

export type Reaction = {
  id: ID;
  type: ReactionType;
  severity?: 1 | 2 | 3;
  memo?: string;
};

export type FeedingRecordIngredient = {
  id: ID;
  recordId: ID;
  ingredientId?: ID;
  ingredientName: string;
};

export type FeedingRecord = {
  id: ID;
  babyId: ID;
  dateTime: string; // ISO
  amountType: AmountType;
  amountGram?: number;
  amountLevel?: AmountLevel;
  reactionType: ReactionType;
  note?: string;
  photoUrl?: string;
  ingredients: FeedingRecordIngredient[];
  sourcePlanId?: ID;
  slot?: MealSlot;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type MealRecord = FeedingRecord;

// Draft produced from plan. User can edit before saving as MealRecord.
export type RecordDraft = {
  id: ID;
  date: string; // YYYY-MM-DD
  slot: MealSlot;
  plannedMealRefId?: ID;
  seededItems: RecordedMealItem[];
  seededTime?: string; // HH:mm
  createdAt: string; // ISO
};

import type { BabyProfile, FeedingMethod, FeedingStage } from '@/constants/baby-profile';
import type { Ingredient } from '@/features/ingredients/model';
import type { MealSlot } from '@/features/records/model';

export type MealPlanMeal = {
  slot: MealSlot;
  title: string;
  timeLabel: string;
  ingredientNames: string[];
  containsNewIngredient: boolean;
  noteType?: 'OBSERVE_NEW' | 'EXCLUDE_CAUTION';
};

export type MealPlanDay = {
  date: string;
  meals: MealPlanMeal[];
};

export type MealPlanSummary = {
  calendarAgeDays: number;
  feedingDays: number;
  feedingWeek: number;
  feedingStage: FeedingStage;
  mealsPerDay: 1 | 2 | 3;
  feedingMethod: FeedingMethod;
  proteinStarted: boolean;
};

export type MealPlanResult = {
  summary: MealPlanSummary;
  today: MealPlanDay;
  week: MealPlanDay[];
  blockedIngredientNames: string[];
  recommendationReasonKeys: Array<'BY_FEEDING_WEEK' | 'BY_MEAL_COUNT' | 'EXCLUDE_BLOCKED'>;
};

const SLOT_ORDER: MealSlot[] = ['breakfast', 'lunch', 'dinner'];

const SLOT_META: Record<MealSlot, { title: string; timeLabel: string }> = {
  breakfast: { title: '아침 이유식', timeLabel: '08:30' },
  lunch: { title: '점심 이유식', timeLabel: '12:00' },
  dinner: { title: '저녁 이유식', timeLabel: '17:30' },
  snack: { title: '간식', timeLabel: '15:00' },
};

function differenceInDays(start: Date, end: Date): number {
  const startOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.max(0, Math.floor((endOnly.getTime() - startOnly.getTime()) / (1000 * 60 * 60 * 24)));
}

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return next;
}

function isoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function deriveDefaultFeedingStartDate(birthDate: string): string {
  const base = new Date(`${birthDate}T00:00:00`);
  const derived = addDays(base, 180);
  const today = new Date();
  if (derived > today) {
    return isoDate(today);
  }
  return isoDate(derived);
}

function deriveStage(feedingDays: number): FeedingStage {
  if (feedingDays < 0) return 'PREP';
  if (feedingDays < 28) return 'INITIAL';
  if (feedingDays < 84) return 'MIDDLE';
  if (feedingDays < 168) return 'LATE';
  return 'COMPLETE';
}

function deriveMealsPerDay(stage: FeedingStage): 1 | 2 | 3 {
  switch (stage) {
    case 'PREP':
    case 'INITIAL':
      return 1;
    case 'MIDDLE':
      return 2;
    case 'LATE':
    case 'COMPLETE':
    default:
      return 3;
  }
}

function categoryOrder(name: string): number {
  switch (name) {
    case 'GRAIN':
      return 0;
    case 'VEGETABLE':
      return 1;
    case 'FRUIT':
      return 2;
    case 'PROTEIN':
      return 3;
    case 'DAIRY':
      return 4;
    default:
      return 5;
  }
}

export function generateMealPlan(
  profile: BabyProfile,
  ingredients: Ingredient[],
  selectedDate: Date,
  generationOffset = 0
): MealPlanResult {
  const today = new Date();
  const birthDate = new Date(`${profile.birthDate}T00:00:00`);
  const feedingStartDate = profile.feedingStartDate ?? deriveDefaultFeedingStartDate(profile.birthDate);
  const feedingStart = new Date(`${feedingStartDate}T00:00:00`);
  const calendarAgeDays = differenceInDays(birthDate, today);
  const feedingDays = differenceInDays(feedingStart, today);
  const feedingStage = profile.feedingStage ?? deriveStage(feedingDays);
  const mealsPerDay = profile.mealsPerDay ?? deriveMealsPerDay(feedingStage);
  const feedingMethod = profile.feedingMethod ?? 'TOPPING';
  const proteinStarted = profile.proteinStarted ?? feedingDays >= 21;

  const blockedIds = new Set([
    ...(profile.blockedIngredientIds ?? []),
    ...ingredients.filter((item) => item.status === 'ALLERGY').map((item) => item.id),
  ]);

  const safeIngredients = ingredients
    .filter((item) => item.status === 'TRIED' && !blockedIds.has(item.id))
    .sort((a, b) => categoryOrder(a.category) - categoryOrder(b.category) || a.name.localeCompare(b.name, 'ko'));

  const newIngredients = ingredients.filter(
    (item) =>
      item.status === 'NOT_TRIED' &&
      !blockedIds.has(item.id) &&
      item.category !== 'DAIRY' &&
      (proteinStarted || item.category !== 'PROTEIN')
  );

  const cautionIngredients = ingredients.filter((item) => item.status === 'CAUTION');
  const blockedIngredientNames = ingredients.filter((item) => blockedIds.has(item.id)).map((item) => item.name);

  const activeSlots = SLOT_ORDER.slice(0, mealsPerDay);
  const weekStartIndex = (selectedDate.getDay() + 6) % 7;
  const weekStart = addDays(selectedDate, -weekStartIndex);

  let safeIndex = 0;
  let newIndex = 0;

  const buildMeal = (slot: MealSlot, dayIndex: number): MealPlanMeal => {
    const grain = safeIngredients.find((item) => item.category === 'GRAIN') ?? safeIngredients[safeIndex % Math.max(safeIngredients.length, 1)];
    const rotatingSafe =
      safeIngredients[(safeIndex + dayIndex + generationOffset) % Math.max(safeIngredients.length, 1)];
    const nextNew = newIngredients[(newIndex + generationOffset) % Math.max(newIngredients.length, 1)];
    const shouldIntroduceNew = dayIndex < 3 && slot === activeSlots[0] && Boolean(nextNew);

    const ingredientNames = [grain?.name, rotatingSafe?.name]
      .filter((value): value is string => Boolean(value));

    if (shouldIntroduceNew && nextNew && !ingredientNames.includes(nextNew.name)) {
      ingredientNames.push(nextNew.name);
      newIndex += 1;
    } else if (proteinStarted) {
      const protein = safeIngredients.find((item) => item.category === 'PROTEIN');
      if (protein && !ingredientNames.includes(protein.name)) {
        ingredientNames.push(protein.name);
      }
    }

    safeIndex += 1;

    return {
      slot,
      title: SLOT_META[slot].title,
      timeLabel: SLOT_META[slot].timeLabel,
      ingredientNames,
      containsNewIngredient: shouldIntroduceNew && Boolean(nextNew),
      noteType: shouldIntroduceNew ? 'OBSERVE_NEW' : cautionIngredients.length > 0 ? 'EXCLUDE_CAUTION' : undefined,
    };
  };

  const week = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    return {
      date: isoDate(date),
      meals: activeSlots.map((slot) => buildMeal(slot, index)),
    };
  });

  const selectedDateIso = isoDate(selectedDate);
  const todayPlan = week.find((item) => item.date === selectedDateIso) ?? week[0];

  return {
    summary: {
      calendarAgeDays,
      feedingDays,
      feedingWeek: Math.max(1, Math.floor(feedingDays / 7) + 1),
      feedingStage,
      mealsPerDay,
      feedingMethod,
      proteinStarted,
    },
    today: todayPlan,
    week,
    blockedIngredientNames,
    recommendationReasonKeys: ['BY_FEEDING_WEEK', 'BY_MEAL_COUNT', 'EXCLUDE_BLOCKED'],
  };
}

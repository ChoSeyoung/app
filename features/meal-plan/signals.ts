import type { Ingredient } from '@/features/ingredients/model';
import type { FeedingRecord } from '@/features/records/model';

type MealPlanSignalsInput = {
  ingredients: Ingredient[];
  records: FeedingRecord[];
};

export type MealPlanSignals = {
  recentRiskIngredientIds: string[];
  recentRefusedIngredientIds: string[];
  observationIngredientIds: string[];
  recentMemoHints: string[];
  yesterdayRiskCount: number;
  todayObservationCount: number;
};

function daysBetween(isoDate: string): number {
  const target = new Date(`${isoDate}T00:00:00`);
  const today = new Date();
  const onlyTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const onlyToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.floor((onlyToday.getTime() - onlyTarget.getTime()) / (1000 * 60 * 60 * 24));
}

function recordAgeInDays(dateTime: string): number {
  const recordDate = new Date(dateTime);
  const now = new Date();
  return Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function deriveMealPlanSignals({ ingredients, records }: MealPlanSignalsInput): MealPlanSignals {
  const riskIds = new Set<string>();
  const refusedIds = new Set<string>();
  const memoHints: string[] = [];

  for (const record of records) {
    const age = recordAgeInDays(record.dateTime);
    if (age > 7) continue;

    if (record.note?.trim() && memoHints.length < 2) {
      memoHints.push(record.note.trim());
    }

    const ingredientIds = record.ingredients
      .map((item) => item.ingredientId)
      .filter((value): value is string => Boolean(value));

    if (record.reactionType === 'VOMIT' || record.reactionType === 'RASH') {
      ingredientIds.forEach((id) => riskIds.add(id));
      continue;
    }

    if (record.reactionType === 'FUSSY' || record.amountLevel === 'LOW') {
      ingredientIds.forEach((id) => refusedIds.add(id));
    }
  }

  const observationIngredientIds = ingredients
    .filter((item) => item.firstTriedDate && daysBetween(item.firstTriedDate) >= 0 && daysBetween(item.firstTriedDate) <= 2)
    .map((item) => item.id);

  const yesterdayRiskCount = records.filter((record) => {
    const age = recordAgeInDays(record.dateTime);
    return age === 1 && (record.reactionType === 'FUSSY' || record.reactionType === 'VOMIT' || record.reactionType === 'RASH');
  }).length;

  return {
    recentRiskIngredientIds: Array.from(riskIds),
    recentRefusedIngredientIds: Array.from(refusedIds),
    observationIngredientIds,
    recentMemoHints: memoHints,
    yesterdayRiskCount,
    todayObservationCount: observationIngredientIds.length,
  };
}

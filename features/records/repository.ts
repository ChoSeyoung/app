import type { MealIngredientRelation } from '@/features/ingredients/model';
import { safeGetItem, safeSetItem } from '@/lib/safe-storage';

import type { FeedingRecord } from './model';

const FEEDING_RECORDS_KEY = '@weaning-diary/feeding-records';
const MEAL_RECORDS_LEGACY_KEY = '@weaning-diary/meal-records';
const FEEDING_RECORD_INGREDIENT_RELATIONS_KEY = '@weaning-diary/feeding-record-ingredient-relations';
const MEAL_INGREDIENT_RELATIONS_LEGACY_KEY = '@weaning-diary/meal-ingredient-relations';

function isFeedingRecord(value: unknown): value is FeedingRecord {
  if (!value || typeof value !== 'object') return false;

  const casted = value as Partial<FeedingRecord>;
  return (
    typeof casted.id === 'string' &&
    typeof casted.babyId === 'string' &&
    typeof casted.dateTime === 'string' &&
    typeof casted.amountType === 'string' &&
    typeof casted.reactionType === 'string' &&
    Array.isArray(casted.ingredients) &&
    typeof casted.createdAt === 'string' &&
    typeof casted.updatedAt === 'string'
  );
}

async function readRecordsFromKey(key: string): Promise<FeedingRecord[]> {
  try {
    const raw = await safeGetItem(key);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isFeedingRecord);
  } catch {
    return [];
  }
}

async function readFeedingRecords(): Promise<FeedingRecord[]> {
  const current = await readRecordsFromKey(FEEDING_RECORDS_KEY);
  if (current.length > 0) return current;
  return readRecordsFromKey(MEAL_RECORDS_LEGACY_KEY);
}

async function writeFeedingRecords(next: FeedingRecord[]): Promise<void> {
  await safeSetItem(FEEDING_RECORDS_KEY, JSON.stringify(next));
}

async function readRelationsFromKey(key: string): Promise<MealIngredientRelation[]> {
  try {
    const raw = await safeGetItem(key);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is MealIngredientRelation => {
      if (!item || typeof item !== 'object') return false;
      const casted = item as Partial<MealIngredientRelation>;
      return typeof casted.mealId === 'string' && typeof casted.ingredientId === 'string';
    });
  } catch {
    return [];
  }
}

async function readIngredientRelations(): Promise<MealIngredientRelation[]> {
  const current = await readRelationsFromKey(FEEDING_RECORD_INGREDIENT_RELATIONS_KEY);
  if (current.length > 0) return current;
  return readRelationsFromKey(MEAL_INGREDIENT_RELATIONS_LEGACY_KEY);
}

async function writeIngredientRelations(next: MealIngredientRelation[]): Promise<void> {
  await safeSetItem(FEEDING_RECORD_INGREDIENT_RELATIONS_KEY, JSON.stringify(next));
}

async function syncIngredientRelations(records: FeedingRecord[]): Promise<void> {
  const relations = records.flatMap((record) =>
    Array.from(
      new Set(record.ingredients.map((ingredient) => ingredient.ingredientId).filter((id): id is string => Boolean(id)))
    ).map((ingredientId) => ({
      mealId: record.id,
      ingredientId,
    }))
  );

  await writeIngredientRelations(relations);
}

function sortByDateTimeDesc(records: FeedingRecord[]): FeedingRecord[] {
  return [...records].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
}

export async function listFeedingRecords(): Promise<FeedingRecord[]> {
  return sortByDateTimeDesc(await readFeedingRecords());
}

export async function getFeedingRecordById(recordId: string): Promise<FeedingRecord | null> {
  const records = await readFeedingRecords();
  return records.find((record) => record.id === recordId) ?? null;
}

export async function createFeedingRecord(record: FeedingRecord): Promise<void> {
  const current = await readFeedingRecords();
  const next = [record, ...current];
  await writeFeedingRecords(next);
  await syncIngredientRelations(next);
}

export async function updateFeedingRecord(record: FeedingRecord): Promise<void> {
  const current = await readFeedingRecords();
  const next = current.map((item) => (item.id === record.id ? record : item));
  await writeFeedingRecords(next);
  await syncIngredientRelations(next);
}

export async function deleteFeedingRecord(recordId: string): Promise<void> {
  const current = await readFeedingRecords();
  const next = current.filter((item) => item.id !== recordId);
  await writeFeedingRecords(next);
  await syncIngredientRelations(next);
}

export async function listRecentIngredientNames(limit = 8): Promise<string[]> {
  const records = await listFeedingRecords();
  const names: string[] = [];
  const seen = new Set<string>();

  for (const record of records) {
    for (const ingredient of record.ingredients) {
      const normalized = ingredient.ingredientName.trim().toLowerCase();
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      names.push(ingredient.ingredientName);
      if (names.length >= limit) {
        return names;
      }
    }
  }

  return names;
}

export async function listFeedingRecordsByIngredientId(ingredientId: string): Promise<FeedingRecord[]> {
  const [relations, records] = await Promise.all([readIngredientRelations(), readFeedingRecords()]);
  const recordIds = new Set(
    relations.filter((relation) => relation.ingredientId === ingredientId).map((relation) => relation.mealId)
  );

  return sortByDateTimeDesc(records.filter((record) => recordIds.has(record.id)));
}

export async function listMealRecordsByIngredientId(ingredientId: string): Promise<FeedingRecord[]> {
  return listFeedingRecordsByIngredientId(ingredientId);
}

export async function createMealRecord(record: FeedingRecord): Promise<void> {
  return createFeedingRecord(record);
}

import { getDatabase } from '@/lib/database';
import { readLegacyStorageItem } from '@/lib/legacy-storage';

import type { FeedingRecord, FeedingRecordIngredient } from './model';

const FEEDING_RECORDS_KEY = '@weaning-diary/feeding-records';
const MEAL_RECORDS_LEGACY_KEY = '@weaning-diary/meal-records';

type FeedingRecordRow = {
  id: string;
  baby_id: string;
  date_time: string;
  amount_type: FeedingRecord['amountType'];
  amount_gram: number | null;
  amount_level: FeedingRecord['amountLevel'] | null;
  reaction_type: FeedingRecord['reactionType'];
  note: string | null;
  photo_url: string | null;
  source_plan_id: string | null;
  slot: FeedingRecord['slot'] | null;
  created_at: string;
  updated_at: string;
};

type FeedingRecordIngredientRow = {
  id: string;
  record_id: string;
  ingredient_id: string | null;
  ingredient_name: string;
};

let recordsMigrationPromise: Promise<void> | null = null;

function isFeedingRecordIngredient(value: unknown): value is FeedingRecordIngredient {
  if (!value || typeof value !== 'object') return false;

  const casted = value as Partial<FeedingRecordIngredient>;
  return (
    typeof casted.id === 'string' &&
    typeof casted.recordId === 'string' &&
    typeof casted.ingredientName === 'string'
  );
}

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
    casted.ingredients.every(isFeedingRecordIngredient) &&
    typeof casted.createdAt === 'string' &&
    typeof casted.updatedAt === 'string'
  );
}

function mapRecordRow(row: FeedingRecordRow, ingredients: FeedingRecordIngredient[]): FeedingRecord {
  return {
    id: row.id,
    babyId: row.baby_id,
    dateTime: row.date_time,
    amountType: row.amount_type,
    amountGram: row.amount_gram ?? undefined,
    amountLevel: row.amount_level ?? undefined,
    reactionType: row.reaction_type,
    note: row.note ?? undefined,
    photoUrl: row.photo_url ?? undefined,
    ingredients,
    sourcePlanId: row.source_plan_id ?? undefined,
    slot: row.slot ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapIngredientRow(row: FeedingRecordIngredientRow): FeedingRecordIngredient {
  return {
    id: row.id,
    recordId: row.record_id,
    ingredientId: row.ingredient_id ?? undefined,
    ingredientName: row.ingredient_name,
  };
}

async function readLegacyRecordsFromKey(key: string): Promise<FeedingRecord[]> {
  try {
    const raw = await readLegacyStorageItem(key);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isFeedingRecord);
  } catch {
    return [];
  }
}

async function ensureRecordsMigrated(): Promise<void> {
  if (!recordsMigrationPromise) {
    recordsMigrationPromise = (async () => {
      const db = await getDatabase();
      const existing = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM feeding_records');

      if ((existing?.count ?? 0) > 0) {
        return;
      }

      const current = await readLegacyRecordsFromKey(FEEDING_RECORDS_KEY);
      const legacy = current.length > 0 ? current : await readLegacyRecordsFromKey(MEAL_RECORDS_LEGACY_KEY);

      if (legacy.length === 0) {
        return;
      }

      await db.withTransactionAsync(async () => {
        for (const record of legacy) {
          await db.runAsync(
            `
              INSERT OR REPLACE INTO feeding_records (
                id, baby_id, date_time, amount_type, amount_gram, amount_level,
                reaction_type, note, photo_url, source_plan_id, slot, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            record.id,
            record.babyId,
            record.dateTime,
            record.amountType,
            record.amountGram ?? null,
            record.amountLevel ?? null,
            record.reactionType,
            record.note ?? null,
            record.photoUrl ?? null,
            record.sourcePlanId ?? null,
            record.slot ?? null,
            record.createdAt,
            record.updatedAt
          );

          for (const ingredient of record.ingredients) {
            await db.runAsync(
              `
                INSERT OR REPLACE INTO feeding_record_ingredients (
                  id, record_id, ingredient_id, ingredient_name
                ) VALUES (?, ?, ?, ?)
              `,
              ingredient.id,
              record.id,
              ingredient.ingredientId ?? null,
              ingredient.ingredientName
            );
          }
        }
      });
    })();
  }

  await recordsMigrationPromise;
}

async function readIngredientRows(recordIds?: string[]): Promise<Map<string, FeedingRecordIngredient[]>> {
  const db = await getDatabase();
  await ensureRecordsMigrated();

  let rows: FeedingRecordIngredientRow[];
  if (!recordIds || recordIds.length === 0) {
    rows = await db.getAllAsync<FeedingRecordIngredientRow>(
      'SELECT id, record_id, ingredient_id, ingredient_name FROM feeding_record_ingredients'
    );
  } else {
    const placeholders = recordIds.map(() => '?').join(', ');
    rows = await db.getAllAsync<FeedingRecordIngredientRow>(
      `
        SELECT id, record_id, ingredient_id, ingredient_name
        FROM feeding_record_ingredients
        WHERE record_id IN (${placeholders})
        ORDER BY rowid ASC
      `,
      ...recordIds
    );
  }

  const grouped = new Map<string, FeedingRecordIngredient[]>();

  for (const row of rows) {
    const current = grouped.get(row.record_id) ?? [];
    current.push(mapIngredientRow(row));
    grouped.set(row.record_id, current);
  }

  return grouped;
}

async function readRecordRowsByQuery(
  source: string,
  params: (string | number)[] = []
): Promise<FeedingRecord[]> {
  const db = await getDatabase();
  await ensureRecordsMigrated();

  const rows = await db.getAllAsync<FeedingRecordRow>(source, ...params);
  if (rows.length === 0) {
    return [];
  }

  const ingredientMap = await readIngredientRows(rows.map((row) => row.id));

  return rows.map((row) => mapRecordRow(row, ingredientMap.get(row.id) ?? []));
}

async function writeFeedingRecord(record: FeedingRecord): Promise<void> {
  const db = await getDatabase();
  await ensureRecordsMigrated();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `
        INSERT OR REPLACE INTO feeding_records (
          id, baby_id, date_time, amount_type, amount_gram, amount_level,
          reaction_type, note, photo_url, source_plan_id, slot, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      record.id,
      record.babyId,
      record.dateTime,
      record.amountType,
      record.amountGram ?? null,
      record.amountLevel ?? null,
      record.reactionType,
      record.note ?? null,
      record.photoUrl ?? null,
      record.sourcePlanId ?? null,
      record.slot ?? null,
      record.createdAt,
      record.updatedAt
    );

    await db.runAsync('DELETE FROM feeding_record_ingredients WHERE record_id = ?', record.id);

    for (const ingredient of record.ingredients) {
      await db.runAsync(
        `
          INSERT INTO feeding_record_ingredients (id, record_id, ingredient_id, ingredient_name)
          VALUES (?, ?, ?, ?)
        `,
        ingredient.id,
        record.id,
        ingredient.ingredientId ?? null,
        ingredient.ingredientName
      );
    }
  });
}

export async function listFeedingRecords(): Promise<FeedingRecord[]> {
  return readRecordRowsByQuery(`
    SELECT
      id,
      baby_id,
      date_time,
      amount_type,
      amount_gram,
      amount_level,
      reaction_type,
      note,
      photo_url,
      source_plan_id,
      slot,
      created_at,
      updated_at
    FROM feeding_records
    ORDER BY date_time DESC
  `);
}

export async function getFeedingRecordById(recordId: string): Promise<FeedingRecord | null> {
  const records = await readRecordRowsByQuery(
    `
      SELECT
        id,
        baby_id,
        date_time,
        amount_type,
        amount_gram,
        amount_level,
        reaction_type,
        note,
        photo_url,
        source_plan_id,
        slot,
        created_at,
        updated_at
      FROM feeding_records
      WHERE id = ?
    `,
    [recordId]
  );

  return records[0] ?? null;
}

export async function createFeedingRecord(record: FeedingRecord): Promise<void> {
  await writeFeedingRecord(record);
}

export async function updateFeedingRecord(record: FeedingRecord): Promise<void> {
  await writeFeedingRecord(record);
}

export async function deleteFeedingRecord(recordId: string): Promise<void> {
  const db = await getDatabase();
  await ensureRecordsMigrated();
  await db.runAsync('DELETE FROM feeding_records WHERE id = ?', recordId);
}

export async function listRecentIngredientNames(limit = 8): Promise<string[]> {
  const db = await getDatabase();
  await ensureRecordsMigrated();

  const rows = await db.getAllAsync<{ ingredient_name: string }>(
    `
      SELECT fri.ingredient_name
      FROM feeding_record_ingredients fri
      INNER JOIN feeding_records fr ON fr.id = fri.record_id
      ORDER BY fr.date_time DESC, fri.rowid ASC
    `
  );

  const names: string[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const normalized = row.ingredient_name.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;

    seen.add(normalized);
    names.push(row.ingredient_name);

    if (names.length >= limit) {
      break;
    }
  }

  return names;
}

export async function listFeedingRecordsByIngredientId(ingredientId: string): Promise<FeedingRecord[]> {
  return readRecordRowsByQuery(
    `
      SELECT DISTINCT
        fr.id,
        fr.baby_id,
        fr.date_time,
        fr.amount_type,
        fr.amount_gram,
        fr.amount_level,
        fr.reaction_type,
        fr.note,
        fr.photo_url,
        fr.source_plan_id,
        fr.slot,
        fr.created_at,
        fr.updated_at
      FROM feeding_records fr
      INNER JOIN feeding_record_ingredients fri ON fri.record_id = fr.id
      WHERE fri.ingredient_id = ?
      ORDER BY fr.date_time DESC
    `,
    [ingredientId]
  );
}

export async function listMealRecordsByIngredientId(ingredientId: string): Promise<FeedingRecord[]> {
  return listFeedingRecordsByIngredientId(ingredientId);
}

export async function createMealRecord(record: FeedingRecord): Promise<void> {
  return createFeedingRecord(record);
}

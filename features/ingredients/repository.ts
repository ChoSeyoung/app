import { getDatabase } from '@/lib/database';
import { readLegacyStorageItem } from '@/lib/legacy-storage';

import {
  canTransitionIngredientStatus,
  type Ingredient,
  type IngredientBase,
  type IngredientCategory,
  type IngredientReaction,
  type IngredientReactionType,
  type IngredientStatus,
  type IngredientStatusEntry,
  type MasterIngredient,
} from './model';
import { SEED_INGREDIENTS } from './seed';

const LEGACY_INGREDIENTS_KEY = '@weaning-diary/ingredients';
const CUSTOM_INGREDIENTS_KEY = '@weaning-diary/custom-ingredients';
const INGREDIENT_STATUSES_KEY = '@weaning-diary/ingredient-statuses';
const INGREDIENT_REACTIONS_KEY = '@weaning-diary/ingredient-reactions';

const DEFAULT_DEMO_STATUSES: IngredientStatusEntry[] = [
  {
    ingredientId: 'seed-pumpkin',
    status: 'TRIED',
    firstTriedDate: '2026-03-08',
    isFavorite: false,
    updatedAt: '2026-03-08T09:00:00.000Z',
  },
  {
    ingredientId: 'seed-broccoli',
    status: 'CAUTION',
    firstTriedDate: '2026-03-09',
    isFavorite: false,
    updatedAt: '2026-03-09T09:00:00.000Z',
  },
  {
    ingredientId: 'seed-egg-yolk',
    status: 'ALLERGY',
    firstTriedDate: '2026-03-10',
    isFavorite: false,
    updatedAt: '2026-03-10T09:00:00.000Z',
  },
];

type IngredientCreateInput = {
  name: string;
  category: IngredientCategory;
};

type IngredientUpdateInput = {
  name?: string;
  category?: IngredientCategory;
};

type EnsureIngredientRecordedInput = {
  ingredientId?: string;
  ingredientName: string;
  triedDate: string;
};

type LegacyIngredient = IngredientBase & {
  status: IngredientStatus;
  firstTriedDate?: string;
};

type CustomIngredientRow = {
  id: string;
  name: string;
  category: IngredientCategory;
  source: 'custom';
  image_uri: string | null;
  created_at: string;
  updated_at: string;
};

type IngredientStatusRow = {
  ingredient_id: string;
  status: IngredientStatus;
  first_tried_date: string | null;
  is_favorite: number;
  updated_at: string;
};

type IngredientReactionRow = {
  id: string;
  ingredient_id: string;
  date: string;
  reaction_type: IngredientReactionType;
  note: string | null;
};

let ingredientsMigrationPromise: Promise<void> | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function id(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}

function isLegacyIngredient(value: unknown): value is LegacyIngredient {
  if (!value || typeof value !== 'object') return false;
  const casted = value as Partial<LegacyIngredient>;
  return (
    typeof casted.id === 'string' &&
    typeof casted.name === 'string' &&
    typeof casted.category === 'string' &&
    typeof casted.status === 'string' &&
    typeof casted.createdAt === 'string' &&
    typeof casted.updatedAt === 'string'
  );
}

function isMasterIngredient(value: unknown): value is MasterIngredient {
  if (!value || typeof value !== 'object') return false;
  const casted = value as Partial<MasterIngredient>;
  return (
    typeof casted.id === 'string' &&
    typeof casted.name === 'string' &&
    typeof casted.category === 'string' &&
    typeof casted.source === 'string' &&
    typeof casted.createdAt === 'string' &&
    typeof casted.updatedAt === 'string'
  );
}

function isIngredientStatusEntry(value: unknown): value is IngredientStatusEntry {
  if (!value || typeof value !== 'object') return false;
  const casted = value as Partial<IngredientStatusEntry>;
  return (
    typeof casted.ingredientId === 'string' &&
    typeof casted.status === 'string' &&
    typeof casted.updatedAt === 'string'
  );
}

function isIngredientReaction(value: unknown): value is IngredientReaction {
  if (!value || typeof value !== 'object') return false;
  const casted = value as Partial<IngredientReaction>;
  return (
    typeof casted.id === 'string' &&
    typeof casted.ingredientId === 'string' &&
    typeof casted.date === 'string' &&
    typeof casted.reactionType === 'string'
  );
}

async function readLegacyParsedArray<T>(
  key: string,
  guard: (value: unknown) => value is T
): Promise<T[]> {
  try {
    const raw = await readLegacyStorageItem(key);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(guard);
  } catch {
    return [];
  }
}

function mapCustomIngredientRow(row: CustomIngredientRow): MasterIngredient {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    source: row.source,
    imageUri: row.image_uri ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapIngredientStatusRow(row: IngredientStatusRow): IngredientStatusEntry {
  return {
    ingredientId: row.ingredient_id,
    status: row.status,
    firstTriedDate: row.first_tried_date ?? undefined,
    isFavorite: Boolean(row.is_favorite),
    updatedAt: row.updated_at,
  };
}

function mapReactionRow(row: IngredientReactionRow): IngredientReaction {
  return {
    id: row.id,
    ingredientId: row.ingredient_id,
    date: row.date,
    reactionType: row.reaction_type,
    note: row.note ?? undefined,
  };
}

async function readCustomIngredients(): Promise<MasterIngredient[]> {
  const db = await getDatabase();
  await ensureIngredientsStorageMigrated();

  const rows = await db.getAllAsync<CustomIngredientRow>(
    `
      SELECT id, name, category, source, image_uri, created_at, updated_at
      FROM custom_ingredients
      ORDER BY created_at ASC
    `
  );

  return rows.map(mapCustomIngredientRow);
}

async function readIngredientStatuses(): Promise<IngredientStatusEntry[]> {
  const db = await getDatabase();
  await ensureIngredientsStorageMigrated();

  const rows = await db.getAllAsync<IngredientStatusRow>(
    `
      SELECT ingredient_id, status, first_tried_date, is_favorite, updated_at
      FROM ingredient_statuses
    `
  );

  return rows.map(mapIngredientStatusRow);
}

async function readIngredientReactions(): Promise<IngredientReaction[]> {
  const db = await getDatabase();
  await ensureIngredientsStorageMigrated();

  const rows = await db.getAllAsync<IngredientReactionRow>(
    `
      SELECT id, ingredient_id, date, reaction_type, note
      FROM ingredient_reactions
      ORDER BY date DESC, rowid DESC
    `
  );

  return rows.map(mapReactionRow);
}

async function writeCustomIngredient(item: MasterIngredient): Promise<void> {
  const db = await getDatabase();
  await ensureIngredientsStorageMigrated();

  await db.runAsync(
    `
      INSERT OR REPLACE INTO custom_ingredients (
        id, name, normalized_name, category, source, image_uri, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    item.id,
    item.name,
    normalizeName(item.name),
    item.category,
    item.source,
    item.imageUri ?? null,
    item.createdAt,
    item.updatedAt
  );
}

async function writeIngredientStatus(item: IngredientStatusEntry): Promise<void> {
  const db = await getDatabase();
  await ensureIngredientsStorageMigrated();

  await db.runAsync(
    `
      INSERT OR REPLACE INTO ingredient_statuses (
        ingredient_id, status, first_tried_date, is_favorite, updated_at
      ) VALUES (?, ?, ?, ?, ?)
    `,
    item.ingredientId,
    item.status,
    item.firstTriedDate ?? null,
    item.isFavorite ? 1 : 0,
    item.updatedAt
  );
}

async function ensureIngredientsStorageMigrated(): Promise<void> {
  if (!ingredientsMigrationPromise) {
    ingredientsMigrationPromise = (async () => {
      const db = await getDatabase();
      const [customCount, statusCount, reactionCount] = await Promise.all([
        db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM custom_ingredients'),
        db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM ingredient_statuses'),
        db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM ingredient_reactions'),
      ]);

      const shouldMigrateCustom = (customCount?.count ?? 0) === 0 && (statusCount?.count ?? 0) === 0;
      const shouldMigrateReactions = (reactionCount?.count ?? 0) === 0;

      if (shouldMigrateCustom) {
        const legacyIngredients = await readLegacyParsedArray(LEGACY_INGREDIENTS_KEY, isLegacyIngredient);
        const customIngredients =
          legacyIngredients.length > 0
            ? legacyIngredients.map<MasterIngredient>((item) => ({
                id: item.id,
                name: item.name,
                category: item.category,
                source: 'custom',
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              }))
            : await readLegacyParsedArray(CUSTOM_INGREDIENTS_KEY, isMasterIngredient);

        const statuses =
          legacyIngredients.length > 0
            ? legacyIngredients
                .filter((item) => item.status !== 'NOT_TRIED' || item.firstTriedDate)
                .map<IngredientStatusEntry>((item) => ({
                  ingredientId: item.id,
                  status: item.status,
                  firstTriedDate: item.firstTriedDate,
                  isFavorite: false,
                  updatedAt: item.updatedAt,
                }))
            : await readLegacyParsedArray(INGREDIENT_STATUSES_KEY, isIngredientStatusEntry);

        await db.withTransactionAsync(async () => {
          for (const item of customIngredients) {
            await db.runAsync(
              `
                INSERT OR REPLACE INTO custom_ingredients (
                  id, name, normalized_name, category, source, image_uri, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `,
              item.id,
              item.name,
              normalizeName(item.name),
              item.category,
              item.source,
              item.imageUri ?? null,
              item.createdAt,
              item.updatedAt
            );
          }

          for (const status of statuses) {
            await db.runAsync(
              `
                INSERT OR REPLACE INTO ingredient_statuses (
                  ingredient_id, status, first_tried_date, is_favorite, updated_at
                ) VALUES (?, ?, ?, ?, ?)
              `,
              status.ingredientId,
              status.status,
              status.firstTriedDate ?? null,
              status.isFavorite ? 1 : 0,
              status.updatedAt
            );
          }
        });
      }

      if (shouldMigrateReactions) {
        const legacyReactions = await readLegacyParsedArray(INGREDIENT_REACTIONS_KEY, isIngredientReaction);

        if (legacyReactions.length > 0) {
          await db.withTransactionAsync(async () => {
            for (const reaction of legacyReactions) {
              await db.runAsync(
                `
                  INSERT OR REPLACE INTO ingredient_reactions (
                    id, ingredient_id, date, reaction_type, note
                  ) VALUES (?, ?, ?, ?, ?)
                `,
                reaction.id,
                reaction.ingredientId,
                reaction.date,
                reaction.reactionType,
                reaction.note ?? null
              );
            }
          });
        }
      }

      const currentStatuses = await db.getAllAsync<{ ingredient_id: string }>(
        'SELECT ingredient_id FROM ingredient_statuses'
      );
      const existingIds = new Set(currentStatuses.map((item) => item.ingredient_id));

      for (const defaultStatus of DEFAULT_DEMO_STATUSES) {
        if (existingIds.has(defaultStatus.ingredientId)) continue;

        await db.runAsync(
          `
            INSERT OR REPLACE INTO ingredient_statuses (
              ingredient_id, status, first_tried_date, is_favorite, updated_at
            ) VALUES (?, ?, ?, ?, ?)
          `,
          defaultStatus.ingredientId,
          defaultStatus.status,
          defaultStatus.firstTriedDate ?? null,
          defaultStatus.isFavorite ? 1 : 0,
          defaultStatus.updatedAt
        );
      }
    })();
  }

  await ingredientsMigrationPromise;
}

function composeIngredients(
  masterIngredients: MasterIngredient[],
  statuses: IngredientStatusEntry[],
  reactions: IngredientReaction[]
): Ingredient[] {
  const statusMap = new Map(statuses.map((item) => [item.ingredientId, item] as const));
  const latestNoteMap = new Map<string, string>();

  [...reactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach((item) => {
      if (!item.note?.trim()) return;
      if (!latestNoteMap.has(item.ingredientId)) {
        latestNoteMap.set(item.ingredientId, item.note.trim());
      }
    });

  return masterIngredients
    .map((item) => {
      const statusEntry = statusMap.get(item.id);
      return {
        id: item.id,
        name: item.name,
        category: item.category,
        source: item.source,
        status: statusEntry?.status ?? 'NOT_TRIED',
        firstTriedDate: statusEntry?.firstTriedDate,
        isFavorite: statusEntry?.isFavorite ?? false,
        imageUri: item.imageUri,
        latestNote: latestNoteMap.get(item.id),
        createdAt: item.createdAt,
        updatedAt: statusEntry?.updatedAt ?? item.updatedAt,
      } satisfies Ingredient;
    })
    .sort((a, b) => {
      const aSeed = SEED_INGREDIENTS.find((item) => item.id === a.id);
      const bSeed = SEED_INGREDIENTS.find((item) => item.id === b.id);
      const orderDiff =
        (aSeed?.sortOrder ?? Number.MAX_SAFE_INTEGER) - (bSeed?.sortOrder ?? Number.MAX_SAFE_INTEGER);
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name, 'ko');
    });
}

async function readIngredientCatalog(): Promise<MasterIngredient[]> {
  const customIngredients = await readCustomIngredients();
  const customNames = new Set(customIngredients.map((item) => normalizeName(item.name)));
  const visibleSeedIngredients = SEED_INGREDIENTS.filter(
    (item) => !customNames.has(normalizeName(item.name))
  );

  return [...visibleSeedIngredients, ...customIngredients];
}

async function readCombinedIngredients(): Promise<Ingredient[]> {
  const [catalog, statuses, reactions] = await Promise.all([
    readIngredientCatalog(),
    readIngredientStatuses(),
    readIngredientReactions(),
  ]);

  return composeIngredients(catalog, statuses, reactions);
}

async function upsertIngredientStatus(
  ingredientId: string,
  nextStatus: IngredientStatus,
  triedDate?: string
): Promise<IngredientStatusEntry> {
  const current = await readIngredientStatuses();
  const before = current.find((item) => item.ingredientId === ingredientId) ?? null;
  const fromStatus = before?.status ?? 'NOT_TRIED';

  if (!canTransitionIngredientStatus(fromStatus, nextStatus)) {
    throw new Error('INGREDIENT_STATUS_TRANSITION_NOT_ALLOWED');
  }

  const updated: IngredientStatusEntry = {
    ingredientId,
    status: nextStatus,
    firstTriedDate:
      nextStatus === 'TRIED'
        ? before?.firstTriedDate ?? triedDate ?? todayIsoDate()
        : before?.firstTriedDate,
    isFavorite: before?.isFavorite ?? false,
    updatedAt: nowIso(),
  };

  await writeIngredientStatus(updated);
  return updated;
}

async function getMasterIngredientById(ingredientId: string): Promise<MasterIngredient | null> {
  const items = await readIngredientCatalog();
  return items.find((item) => item.id === ingredientId) ?? null;
}

export async function listIngredients(): Promise<Ingredient[]> {
  return readCombinedIngredients();
}

export async function getIngredientById(ingredientId: string): Promise<Ingredient | null> {
  const items = await readCombinedIngredients();
  return items.find((item) => item.id === ingredientId) ?? null;
}

export async function findIngredientByName(name: string): Promise<Ingredient | null> {
  const normalized = normalizeName(name);
  const items = await readCombinedIngredients();

  return (
    items.find((item) => normalizeName(item.name) === normalized) ??
    items.find((item) => {
      const seedItem = SEED_INGREDIENTS.find((seed) => seed.id === item.id);
      return seedItem?.aliases?.some((alias) => normalizeName(alias) === normalized) ?? false;
    }) ??
    null
  );
}

export async function createIngredient(input: IngredientCreateInput): Promise<Ingredient> {
  const trimmed = input.name.trim();
  if (!trimmed) {
    throw new Error('INGREDIENT_NAME_REQUIRED');
  }

  const current = await readCombinedIngredients();
  const exists = current.some((item) => normalizeName(item.name) === normalizeName(trimmed));
  if (exists) {
    throw new Error('INGREDIENT_NAME_DUPLICATED');
  }

  const createdAt = nowIso();
  const nextIngredient: MasterIngredient = {
    id: id('ingredient'),
    name: trimmed,
    category: input.category,
    source: 'custom',
    createdAt,
    updatedAt: createdAt,
  };

  await writeCustomIngredient(nextIngredient);

  return {
    ...nextIngredient,
    status: 'NOT_TRIED',
    isFavorite: false,
  };
}

export async function updateIngredient(
  ingredientId: string,
  input: IngredientUpdateInput
): Promise<Ingredient> {
  const customIngredients = await readCustomIngredients();
  const before = customIngredients.find((item) => item.id === ingredientId);
  if (!before) {
    throw new Error('INGREDIENT_NOT_FOUND');
  }

  const nextName = input.name?.trim() ?? before.name;
  if (!nextName) {
    throw new Error('INGREDIENT_NAME_REQUIRED');
  }

  const allIngredients = await readCombinedIngredients();
  const duplicated = allIngredients.some(
    (item) => item.id !== ingredientId && normalizeName(item.name) === normalizeName(nextName)
  );
  if (duplicated) {
    throw new Error('INGREDIENT_NAME_DUPLICATED');
  }

  const updatedMaster: MasterIngredient = {
    ...before,
    name: nextName,
    category: input.category ?? before.category,
    updatedAt: nowIso(),
  };

  await writeCustomIngredient(updatedMaster);

  const statusEntry = (await readIngredientStatuses()).find((item) => item.ingredientId === ingredientId);
  return {
    ...updatedMaster,
    status: statusEntry?.status ?? 'NOT_TRIED',
    firstTriedDate: statusEntry?.firstTriedDate,
    isFavorite: statusEntry?.isFavorite ?? false,
    imageUri: updatedMaster.imageUri,
    updatedAt: statusEntry?.updatedAt ?? updatedMaster.updatedAt,
  };
}

export async function updateIngredientStatus(
  ingredientId: string,
  nextStatus: IngredientStatus
): Promise<Ingredient> {
  return updateIngredientStatusWithDate(ingredientId, nextStatus, todayIsoDate());
}

async function updateIngredientStatusWithDate(
  ingredientId: string,
  nextStatus: IngredientStatus,
  triedDate: string
): Promise<Ingredient> {
  const masterIngredient = await getMasterIngredientById(ingredientId);
  if (!masterIngredient) {
    throw new Error('INGREDIENT_NOT_FOUND');
  }

  const updatedStatus = await upsertIngredientStatus(ingredientId, nextStatus, triedDate);
  return {
    ...masterIngredient,
    status: updatedStatus.status,
    firstTriedDate: updatedStatus.firstTriedDate,
    isFavorite: updatedStatus.isFavorite ?? false,
    imageUri: masterIngredient.imageUri,
    updatedAt: updatedStatus.updatedAt,
  };
}

export async function toggleIngredientFavorite(ingredientId: string): Promise<Ingredient> {
  const ingredient = await getIngredientById(ingredientId);
  if (!ingredient) {
    throw new Error('INGREDIENT_NOT_FOUND');
  }

  const currentStatuses = await readIngredientStatuses();
  const existing = currentStatuses.find((item) => item.ingredientId === ingredientId);
  const nextEntry: IngredientStatusEntry = {
    ingredientId,
    status: existing?.status ?? ingredient.status,
    firstTriedDate: existing?.firstTriedDate ?? ingredient.firstTriedDate,
    isFavorite: !(existing?.isFavorite ?? ingredient.isFavorite),
    updatedAt: nowIso(),
  };

  await writeIngredientStatus(nextEntry);

  return {
    ...ingredient,
    isFavorite: nextEntry.isFavorite ?? false,
    updatedAt: nextEntry.updatedAt,
  };
}

export async function addIngredientReaction(input: {
  ingredientId: string;
  reactionType: IngredientReactionType;
  note?: string;
  date?: string;
}): Promise<IngredientReaction> {
  const ingredient = await getIngredientById(input.ingredientId);
  if (!ingredient) {
    throw new Error('INGREDIENT_NOT_FOUND');
  }

  const next: IngredientReaction = {
    id: id('ingredient-reaction'),
    ingredientId: input.ingredientId,
    date: input.date ?? todayIsoDate(),
    reactionType: input.reactionType,
    note: input.note?.trim() || undefined,
  };

  const db = await getDatabase();
  await ensureIngredientsStorageMigrated();
  await db.runAsync(
    `
      INSERT INTO ingredient_reactions (id, ingredient_id, date, reaction_type, note)
      VALUES (?, ?, ?, ?, ?)
    `,
    next.id,
    next.ingredientId,
    next.date,
    next.reactionType,
    next.note ?? null
  );

  return next;
}

export async function listIngredientReactionsByIngredientId(
  ingredientId: string
): Promise<IngredientReaction[]> {
  const current = await readIngredientReactions();
  return current
    .filter((item) => item.ingredientId === ingredientId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function ensureIngredientTriedByName(ingredientName: string): Promise<Ingredient | null> {
  const found = await findIngredientByName(ingredientName);
  if (!found) return null;

  if (found.status === 'NOT_TRIED') {
    return updateIngredientStatus(found.id, 'TRIED');
  }

  return found;
}

export async function ensureIngredientRecorded(
  input: EnsureIngredientRecordedInput
): Promise<Ingredient> {
  const trimmedName = input.ingredientName.trim();
  if (!trimmedName) {
    throw new Error('INGREDIENT_NAME_REQUIRED');
  }

  const foundById = input.ingredientId ? await getIngredientById(input.ingredientId) : null;
  const foundByName = foundById ?? (await findIngredientByName(trimmedName));
  const existing =
    foundByName ??
    (await createIngredient({
      name: trimmedName,
      category: 'OTHER',
    }));

  if (existing.status === 'NOT_TRIED') {
    return updateIngredientStatusWithDate(existing.id, 'TRIED', input.triedDate);
  }

  return existing;
}

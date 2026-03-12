import { safeGetItem, safeSetItem } from '@/lib/safe-storage';

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

async function readParsedArray<T>(
  key: string,
  guard: (value: unknown) => value is T
): Promise<T[]> {
  try {
    const raw = await safeGetItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(guard);
  } catch {
    return [];
  }
}

async function writeCustomIngredients(next: MasterIngredient[]): Promise<void> {
  await safeSetItem(CUSTOM_INGREDIENTS_KEY, JSON.stringify(next));
}

async function writeIngredientStatuses(next: IngredientStatusEntry[]): Promise<void> {
  await safeSetItem(INGREDIENT_STATUSES_KEY, JSON.stringify(next));
}

async function readLegacyIngredients(): Promise<LegacyIngredient[]> {
  return readParsedArray(LEGACY_INGREDIENTS_KEY, isLegacyIngredient);
}

async function readCustomIngredients(): Promise<MasterIngredient[]> {
  return readParsedArray(CUSTOM_INGREDIENTS_KEY, isMasterIngredient);
}

async function readIngredientStatuses(): Promise<IngredientStatusEntry[]> {
  return readParsedArray(INGREDIENT_STATUSES_KEY, isIngredientStatusEntry);
}

async function ensureIngredientsStorageMigrated(): Promise<void> {
  const [customIngredients, statuses] = await Promise.all([
    readCustomIngredients(),
    readIngredientStatuses(),
  ]);
  if (customIngredients.length > 0 || statuses.length > 0) {
    return;
  }

  const legacyIngredients = await readLegacyIngredients();
  if (legacyIngredients.length === 0) {
    return;
  }

  const nextCustomIngredients: MasterIngredient[] = [];
  const nextStatuses: IngredientStatusEntry[] = [];

  for (const item of legacyIngredients) {
    nextCustomIngredients.push({
      id: item.id,
      name: item.name,
      category: item.category,
      source: 'custom',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });

    if (item.status !== 'NOT_TRIED' || item.firstTriedDate) {
      nextStatuses.push({
        ingredientId: item.id,
        status: item.status,
        firstTriedDate: item.firstTriedDate,
        updatedAt: item.updatedAt,
      });
    }
  }

  await Promise.all([writeCustomIngredients(nextCustomIngredients), writeIngredientStatuses(nextStatuses)]);
}

async function ensureDefaultDemoStatuses(): Promise<void> {
  await ensureIngredientsStorageMigrated();
  const currentStatuses = await readIngredientStatuses();
  const existingIds = new Set(currentStatuses.map((item) => item.ingredientId));
  const missingDefaults = DEFAULT_DEMO_STATUSES.filter((item) => !existingIds.has(item.ingredientId));

  if (missingDefaults.length === 0) {
    return;
  }

  await writeIngredientStatuses([...currentStatuses, ...missingDefaults]);
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
      const orderDiff = (aSeed?.sortOrder ?? Number.MAX_SAFE_INTEGER) - (bSeed?.sortOrder ?? Number.MAX_SAFE_INTEGER);
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name, 'ko');
    });
}

async function readIngredientCatalog(): Promise<MasterIngredient[]> {
  await ensureDefaultDemoStatuses();
  const customIngredients = await readCustomIngredients();
  const customNames = new Set(customIngredients.map((item) => normalizeName(item.name)));
  const visibleSeedIngredients = SEED_INGREDIENTS.filter((item) => !customNames.has(normalizeName(item.name)));
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

async function readIngredientReactions(): Promise<IngredientReaction[]> {
  return readParsedArray(INGREDIENT_REACTIONS_KEY, (item): item is IngredientReaction => {
    if (!item || typeof item !== 'object') return false;
    const casted = item as Partial<IngredientReaction>;
    return (
      typeof casted.id === 'string' &&
      typeof casted.ingredientId === 'string' &&
      typeof casted.date === 'string' &&
      typeof casted.reactionType === 'string'
    );
  });
}

async function writeIngredientReactions(next: IngredientReaction[]): Promise<void> {
  await safeSetItem(INGREDIENT_REACTIONS_KEY, JSON.stringify(next));
}

async function upsertIngredientStatus(
  ingredientId: string,
  nextStatus: IngredientStatus,
  triedDate?: string
): Promise<IngredientStatusEntry> {
  const current = await readIngredientStatuses();
  const index = current.findIndex((item) => item.ingredientId === ingredientId);
  const before = index >= 0 ? current[index] : null;
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

  const next =
    index >= 0 ? current.map((item, itemIndex) => (itemIndex === index ? updated : item)) : [...current, updated];
  await writeIngredientStatuses(next);
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

  const customIngredients = await readCustomIngredients();
  await writeCustomIngredients([...customIngredients, nextIngredient]);

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
  const index = customIngredients.findIndex((item) => item.id === ingredientId);
  if (index < 0) {
    throw new Error('INGREDIENT_NOT_FOUND');
  }

  const before = customIngredients[index];
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

  const next = [...customIngredients];
  next[index] = updatedMaster;
  await writeCustomIngredients(next);

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
  const nextStatuses = existing
    ? currentStatuses.map((item) => (item.ingredientId === ingredientId ? nextEntry : item))
    : [...currentStatuses, nextEntry];
  await writeIngredientStatuses(nextStatuses);

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

  const current = await readIngredientReactions();
  const next: IngredientReaction = {
    id: id('ingredient-reaction'),
    ingredientId: input.ingredientId,
    date: input.date ?? todayIsoDate(),
    reactionType: input.reactionType,
    note: input.note?.trim() || undefined,
  };

  await writeIngredientReactions([...current, next]);
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

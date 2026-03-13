import { getDatabase } from '@/lib/database';
import { readLegacyStorageItem } from '@/lib/legacy-storage';

const memoryStore = new Map<string, string>();

type KeyValueRow = {
  value: string;
};

async function persistValue(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `
      INSERT INTO app_kv (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = excluded.updated_at
    `,
    key,
    value,
    new Date().toISOString()
  );
}

export async function safeGetItem(key: string): Promise<string | null> {
  const inMemory = memoryStore.get(key);
  if (inMemory !== undefined) {
    return inMemory;
  }

  const db = await getDatabase();
  const stored = await db.getFirstAsync<KeyValueRow>('SELECT value FROM app_kv WHERE key = ?', key);
  if (stored) {
    memoryStore.set(key, stored.value);
    return stored.value;
  }

  const legacyValue = await readLegacyStorageItem(key);
  if (legacyValue !== null) {
    memoryStore.set(key, legacyValue);
    await persistValue(key, legacyValue);
    return legacyValue;
  }

  return null;
}

export async function safeSetItem(key: string, value: string): Promise<void> {
  memoryStore.set(key, value);
  await persistValue(key, value);
}

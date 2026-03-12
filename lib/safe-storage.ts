import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

const memoryStore = new Map<string, string>();
const storageFile = new File(Paths.document, 'safe-storage.json');

async function readFileStore(): Promise<Record<string, string>> {
  try {
    if (!storageFile.exists) return {};
    const raw = await storageFile.text();
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    );
  } catch {
    return {};
  }
}

async function writeFileStore(next: Record<string, string>): Promise<void> {
  try {
    if (!storageFile.exists) {
      storageFile.create({ overwrite: true, intermediates: true });
    }
    storageFile.write(JSON.stringify(next));
  } catch {
    // Ignore write errors and continue fallback chain
  }
}

export async function safeGetItem(key: string): Promise<string | null> {
  const inMemory = memoryStore.get(key);
  if (inMemory !== undefined) {
    return inMemory;
  }

  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) return value;
  } catch {
    // Continue fallback chain
  }

  try {
    const value = await SecureStore.getItemAsync(key);
    if (value !== null) return value;
  } catch {
    // Continue fallback chain
  }

  const fileStore = await readFileStore();
  if (key in fileStore) {
    return fileStore[key] ?? null;
  }

  if (typeof globalThis.localStorage !== 'undefined') {
    return globalThis.localStorage.getItem(key);
  }

  return memoryStore.get(key) ?? null;
}

export async function safeSetItem(key: string, value: string): Promise<void> {
  // Keep in-memory cache in sync to avoid stale reads across hook instances.
  memoryStore.set(key, value);

  let hasStored = false;

  try {
    await AsyncStorage.setItem(key, value);
    hasStored = true;
  } catch {
    // Continue fallback chain
  }

  try {
    await SecureStore.setItemAsync(key, value);
    hasStored = true;
  } catch {
    // Continue fallback chain
  }

  try {
    const current = await readFileStore();
    current[key] = value;
    await writeFileStore(current);
    hasStored = true;
  } catch {
    try {
      if (typeof globalThis.localStorage !== 'undefined') {
        globalThis.localStorage.setItem(key, value);
        hasStored = true;
      }
    } catch {
      // Ignore and continue
    }
  }

  if (!hasStored) return;
}

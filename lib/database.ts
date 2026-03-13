import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

const DATABASE_NAME = 'weaning-diary.db';
const DATABASE_VERSION = 1;

let databasePromise: Promise<SQLiteDatabase> | null = null;
let initializationPromise: Promise<void> | null = null;

async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');
  await db.execAsync('PRAGMA journal_mode = WAL;');

  const versionRow = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = versionRow?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_kv (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS custom_ingredients (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      normalized_name TEXT NOT NULL,
      category TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'custom',
      image_uri TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_custom_ingredients_normalized_name
      ON custom_ingredients(normalized_name);

    CREATE TABLE IF NOT EXISTS ingredient_statuses (
      ingredient_id TEXT PRIMARY KEY NOT NULL,
      status TEXT NOT NULL,
      first_tried_date TEXT,
      is_favorite INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ingredient_reactions (
      id TEXT PRIMARY KEY NOT NULL,
      ingredient_id TEXT NOT NULL,
      date TEXT NOT NULL,
      reaction_type TEXT NOT NULL,
      note TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_ingredient_reactions_ingredient_id_date
      ON ingredient_reactions(ingredient_id, date DESC);

    CREATE TABLE IF NOT EXISTS feeding_records (
      id TEXT PRIMARY KEY NOT NULL,
      baby_id TEXT NOT NULL,
      date_time TEXT NOT NULL,
      amount_type TEXT NOT NULL,
      amount_gram REAL,
      amount_level TEXT,
      reaction_type TEXT NOT NULL,
      note TEXT,
      photo_url TEXT,
      source_plan_id TEXT,
      slot TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_feeding_records_date_time
      ON feeding_records(date_time DESC);

    CREATE TABLE IF NOT EXISTS feeding_record_ingredients (
      id TEXT PRIMARY KEY NOT NULL,
      record_id TEXT NOT NULL,
      ingredient_id TEXT,
      ingredient_name TEXT NOT NULL,
      FOREIGN KEY (record_id) REFERENCES feeding_records(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_feeding_record_ingredients_record_id
      ON feeding_record_ingredients(record_id);

    CREATE INDEX IF NOT EXISTS idx_feeding_record_ingredients_ingredient_id
      ON feeding_record_ingredients(ingredient_id);

    PRAGMA user_version = ${DATABASE_VERSION};
  `);
}

export async function getDatabase(): Promise<SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = openDatabaseAsync(DATABASE_NAME);
  }

  const db = await databasePromise;

  if (!initializationPromise) {
    initializationPromise = migrateDatabase(db);
  }

  await initializationPromise;
  return db;
}

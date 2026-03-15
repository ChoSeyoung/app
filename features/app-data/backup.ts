import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { BABY_PROFILE_STORAGE_KEY, type BabyProfile } from '@/constants/baby-profile';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  NOTIFICATION_SETTINGS_STORAGE_KEY,
  type NotificationSettings,
} from '@/constants/notification-settings';
import {
  DEFAULT_STARTER_GUIDE_PROGRESS,
  STARTER_GUIDE_PROGRESS_STORAGE_KEY,
  type StarterGuideProgress,
} from '@/constants/starter-guide';
import {
  exportIngredientData,
  restoreIngredientData,
} from '@/features/ingredients/repository';
import { listFeedingRecords, restoreFeedingRecords } from '@/features/records/repository';
import { syncNotificationSchedules } from '@/lib/notifications';
import { safeGetItem, safeSetItem } from '@/lib/safe-storage';

export type AppBackupPayload = {
  version: 1;
  exportedAt: string;
  profile: BabyProfile | null;
  notificationSettings: NotificationSettings;
  starterGuideProgress: StarterGuideProgress;
  ingredientData: Awaited<ReturnType<typeof exportIngredientData>>;
  feedingRecords: Awaited<ReturnType<typeof listFeedingRecords>>;
};

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function buildBackupPayload(): Promise<AppBackupPayload> {
  const [profileRaw, notificationRaw, starterGuideRaw, ingredientData, feedingRecords] =
    await Promise.all([
      safeGetItem(BABY_PROFILE_STORAGE_KEY),
      safeGetItem(NOTIFICATION_SETTINGS_STORAGE_KEY),
      safeGetItem(STARTER_GUIDE_PROGRESS_STORAGE_KEY),
      exportIngredientData(),
      listFeedingRecords(),
    ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: parseJson<BabyProfile | null>(profileRaw, null),
    notificationSettings: parseJson<NotificationSettings>(notificationRaw, DEFAULT_NOTIFICATION_SETTINGS),
    starterGuideProgress: parseJson<StarterGuideProgress>(
      starterGuideRaw,
      DEFAULT_STARTER_GUIDE_PROGRESS
    ),
    ingredientData,
    feedingRecords,
  };
}

export async function exportAppBackup(): Promise<void> {
  const payload = await buildBackupPayload();
  const baseDirectory = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!baseDirectory) {
    throw new Error('BACKUP_DIRECTORY_UNAVAILABLE');
  }

  const filename = `weaning-diary-backup-${payload.exportedAt.slice(0, 10)}.json`;
  const fileUri = `${baseDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('SHARING_NOT_AVAILABLE');
  }

  await Sharing.shareAsync(fileUri, {
    mimeType: 'application/json',
    dialogTitle: filename,
  });
}

export async function importAppBackup(): Promise<void> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/json', 'text/json'],
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled || !result.assets[0]?.uri) {
    throw new Error('BACKUP_IMPORT_CANCELLED');
  }

  const raw = await FileSystem.readAsStringAsync(result.assets[0].uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  const payload = JSON.parse(raw) as AppBackupPayload;

  await Promise.all([
    safeSetItem(BABY_PROFILE_STORAGE_KEY, JSON.stringify(payload.profile)),
    safeSetItem(
      NOTIFICATION_SETTINGS_STORAGE_KEY,
      JSON.stringify(payload.notificationSettings ?? DEFAULT_NOTIFICATION_SETTINGS)
    ),
    safeSetItem(
      STARTER_GUIDE_PROGRESS_STORAGE_KEY,
      JSON.stringify(payload.starterGuideProgress ?? DEFAULT_STARTER_GUIDE_PROGRESS)
    ),
  ]);

  await restoreIngredientData(payload.ingredientData ?? {});
  await restoreFeedingRecords(payload.feedingRecords ?? []);
  await syncNotificationSchedules(payload.notificationSettings ?? DEFAULT_NOTIFICATION_SETTINGS);
}

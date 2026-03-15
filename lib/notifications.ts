import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { BABY_PROFILE_STORAGE_KEY, type BabyProfile } from '@/constants/baby-profile';
import { t } from '@/constants/i18n';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  NOTIFICATION_SETTINGS_STORAGE_KEY,
  type NotificationSettings,
} from '@/constants/notification-settings';
import { listIngredients } from '@/features/ingredients/repository';
import { generateMealPlan } from '@/features/meal-plan/engine';
import { deriveMealPlanSignals } from '@/features/meal-plan/signals';
import { listFeedingRecords } from '@/features/records/repository';
import { safeGetItem, safeSetItem } from '@/lib/safe-storage';

const NOTIFICATION_ID_STORAGE_KEY = '@weaning-diary/notification-ids';
const ANDROID_CHANNEL_ID = 'daily-reminders';
const NOTIFICATIONS_UNSUPPORTED_IN_EXPO_GO = Constants.appOwnership === 'expo';

type ScheduledNotificationMap = Record<string, string>;

type NotificationsModule = typeof import('expo-notifications');

let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;
let notificationHandlerInitialized = false;

function isBabyProfile(value: unknown): value is BabyProfile {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<BabyProfile>;
  return typeof candidate.babyName === 'string' && typeof candidate.birthDate === 'string';
}

function isNotificationMap(value: unknown): value is ScheduledNotificationMap {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    Object.values(value as Record<string, unknown>).every((item) => typeof item === 'string')
  );
}

export function isNotificationRuntimeSupported(): boolean {
  return !NOTIFICATIONS_UNSUPPORTED_IN_EXPO_GO;
}

async function getNotificationsModule(): Promise<NotificationsModule | null> {
  if (NOTIFICATIONS_UNSUPPORTED_IN_EXPO_GO) {
    return null;
  }

  if (!notificationsModulePromise) {
    notificationsModulePromise = import('expo-notifications')
      .then((module) => {
        if (!notificationHandlerInitialized) {
          module.setNotificationHandler({
            handleNotification: async () => ({
              shouldPlaySound: true,
              shouldSetBadge: false,
              shouldShowBanner: true,
              shouldShowList: true,
            }),
          });
          notificationHandlerInitialized = true;
        }

        return module;
      })
      .catch(() => null);
  }

  return notificationsModulePromise;
}

async function readStoredNotificationIds(): Promise<ScheduledNotificationMap> {
  try {
    const raw = await safeGetItem(NOTIFICATION_ID_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return isNotificationMap(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

async function writeStoredNotificationIds(next: ScheduledNotificationMap): Promise<void> {
  await safeSetItem(NOTIFICATION_ID_STORAGE_KEY, JSON.stringify(next));
}

async function loadProfile(): Promise<BabyProfile | null> {
  try {
    const raw = await safeGetItem(BABY_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isBabyProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function loadNotificationSettings(): Promise<NotificationSettings> {
  try {
    const raw = await safeGetItem(NOTIFICATION_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...(JSON.parse(raw) as NotificationSettings),
    };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

function resolveScheduleTime(
  hour: number,
  minute: number,
  quietHours: boolean,
  fallback: { hour: number; minute: number }
): { hour: number; minute: number } {
  if (!quietHours) {
    return { hour, minute };
  }

  const isQuietRange = hour >= 21 || hour < 8;
  if (!isQuietRange) {
    return { hour, minute };
  }

  return fallback;
}

async function ensurePermissions(notifications: NotificationsModule): Promise<boolean> {
  const current = await notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const requested = await notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  return requested.granted || requested.ios?.status === notifications.IosAuthorizationStatus.PROVISIONAL;
}

async function ensureChannel(notifications: NotificationsModule): Promise<void> {
  if (Platform.OS !== 'android') return;

  await notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Daily reminders',
    importance: notifications.AndroidImportance.DEFAULT,
    lightColor: '#F1A977',
  });
}

async function cancelScheduledNotifications(notifications: NotificationsModule): Promise<void> {
  const current = await readStoredNotificationIds();
  await Promise.all(
    Object.values(current).map(async (id) => {
      try {
        await notifications.cancelScheduledNotificationAsync(id);
      } catch {
        // Ignore missing identifiers after reinstall or refresh.
      }
    })
  );
  await writeStoredNotificationIds({});
}

async function scheduleDailyNotification(
  notifications: NotificationsModule,
  content: {
    title: string;
    body: string;
  },
  time: { hour: number; minute: number }
): Promise<string> {
  return notifications.scheduleNotificationAsync({
    content: {
      ...content,
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
    trigger: {
      type: notifications.SchedulableTriggerInputTypes.DAILY,
      hour: time.hour,
      minute: time.minute,
    } as never,
  });
}

export async function syncNotificationSchedules(
  explicitSettings?: NotificationSettings
): Promise<void> {
  const notifications = await getNotificationsModule();
  if (!notifications) {
    return;
  }

  const settings = explicitSettings ?? (await loadNotificationSettings());
  await ensureChannel(notifications);
  await cancelScheduledNotifications(notifications);

  const shouldRequestPermission =
    settings.mealPlanMorning ||
    settings.feedingRecordReminder ||
    settings.cautionReactionAlert ||
    settings.newIngredientObservation;

  if (!shouldRequestPermission) {
    return;
  }

  const granted = await ensurePermissions(notifications);
  if (!granted) {
    return;
  }

  const profile = await loadProfile();
  if (!profile) {
    return;
  }

  const [ingredients, records] = await Promise.all([listIngredients(), listFeedingRecords()]);
  const signals = deriveMealPlanSignals({ ingredients, records });
  const plan = profile.feedingStartDate
    ? generateMealPlan(profile, ingredients, new Date(), 0, signals)
    : null;

  const nextIds: ScheduledNotificationMap = {};

  if (settings.mealPlanMorning && plan?.today.meals[0]) {
    nextIds.mealPlanMorning = await scheduleDailyNotification(
      notifications,
      {
        title: t('notificationSettingsScreen.mealPlanMorningTitle'),
        body: t('notificationSettingsScreen.mealPlanMorningToast', {
          meal: `${plan.today.meals[0].timeLabel} · ${plan.today.meals[0].ingredientNames.join(', ')}`,
        }),
      },
      resolveScheduleTime(8, 30, settings.quietHours, { hour: 8, minute: 30 })
    );
  }

  if (settings.feedingRecordReminder) {
    nextIds.feedingRecordReminder = await scheduleDailyNotification(
      notifications,
      {
        title: t('notificationSettingsScreen.feedingRecordReminderTitle'),
        body: t('notificationSettingsScreen.feedingRecordReminderToast'),
      },
      resolveScheduleTime(19, 30, settings.quietHours, { hour: 19, minute: 30 })
    );
  }

  if (settings.cautionReactionAlert && signals.yesterdayRiskCount > 0) {
    nextIds.cautionReactionAlert = await scheduleDailyNotification(
      notifications,
      {
        title: t('notificationSettingsScreen.cautionReactionAlertTitle'),
        body: t('notificationSettingsScreen.cautionReactionAlertToast', {
          count: signals.yesterdayRiskCount,
        }),
      },
      resolveScheduleTime(21, 0, settings.quietHours, { hour: 8, minute: 5 })
    );
  }

  if (settings.newIngredientObservation && signals.observationIngredientIds.length > 0) {
    nextIds.newIngredientObservation = await scheduleDailyNotification(
      notifications,
      {
        title: t('notificationSettingsScreen.newIngredientObservationTitle'),
        body: t('notificationSettingsScreen.newIngredientObservationToast', {
          count: signals.todayObservationCount,
        }),
      },
      resolveScheduleTime(21, 10, settings.quietHours, { hour: 8, minute: 10 })
    );
  }

  await writeStoredNotificationIds(nextIds);
}

import { useCallback, useEffect, useState } from 'react';

import {
  DEFAULT_NOTIFICATION_SETTINGS,
  NOTIFICATION_SETTINGS_STORAGE_KEY,
  type NotificationSettings,
} from '@/constants/notification-settings';
import { syncNotificationSchedules } from '@/lib/notifications';
import { safeGetItem, safeSetItem } from '@/lib/safe-storage';

type NotificationSettingsListener = (next: NotificationSettings) => void;

let notificationSettingsCache: NotificationSettings | undefined;
const listeners = new Set<NotificationSettingsListener>();

function publishNotificationSettings(next: NotificationSettings): void {
  notificationSettingsCache = next;
  listeners.forEach((listener) => {
    listener(next);
  });
}

function isNotificationSettings(value: unknown): value is NotificationSettings {
  if (!value || typeof value !== 'object') return false;
  const casted = value as Partial<NotificationSettings>;

  return (
    typeof casted.mealPlanMorning === 'boolean' &&
    typeof casted.feedingRecordReminder === 'boolean' &&
    typeof casted.cautionReactionAlert === 'boolean' &&
    typeof casted.newIngredientObservation === 'boolean' &&
    typeof casted.emailUpdates === 'boolean' &&
    typeof casted.quietHours === 'boolean'
  );
}

export function useNotificationSettings(): {
  settings: NotificationSettings;
  isLoading: boolean;
  updateSettings: (next: NotificationSettings) => Promise<void>;
} {
  const [settings, setSettings] = useState(notificationSettingsCache ?? DEFAULT_NOTIFICATION_SETTINGS);
  const [isLoading, setIsLoading] = useState(notificationSettingsCache === undefined);

  useEffect(() => {
    let isMounted = true;
    const listener: NotificationSettingsListener = (next) => {
      if (isMounted) {
        setSettings(next);
      }
    };

    listeners.add(listener);

    const load = async () => {
      if (notificationSettingsCache !== undefined) {
        if (isMounted) {
          setSettings(notificationSettingsCache);
          setIsLoading(false);
        }
        return;
      }

      try {
        const raw = await safeGetItem(NOTIFICATION_SETTINGS_STORAGE_KEY);
        if (!raw) {
          publishNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
          return;
        }

        const parsed = JSON.parse(raw) as unknown;
        publishNotificationSettings(
          isNotificationSettings(parsed) ? parsed : DEFAULT_NOTIFICATION_SETTINGS
        );
      } catch {
        publishNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
      listeners.delete(listener);
    };
  }, []);

  const updateSettings = useCallback(async (next: NotificationSettings) => {
    await safeSetItem(NOTIFICATION_SETTINGS_STORAGE_KEY, JSON.stringify(next));
    publishNotificationSettings(next);
    await syncNotificationSchedules(next);
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
  };
}

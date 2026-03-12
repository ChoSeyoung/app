export const NOTIFICATION_SETTINGS_STORAGE_KEY = '@weaning-diary/notification-settings';

export type NotificationSettings = {
  mealPlanMorning: boolean;
  feedingRecordReminder: boolean;
  cautionReactionAlert: boolean;
  newIngredientObservation: boolean;
  emailUpdates: boolean;
  quietHours: boolean;
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  mealPlanMorning: true,
  feedingRecordReminder: true,
  cautionReactionAlert: true,
  newIngredientObservation: true,
  emailUpdates: false,
  quietHours: true,
};

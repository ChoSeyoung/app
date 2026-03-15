/**
 * 알림 수신 설정 화면.
 *
 * 역할:
 * - 기록, 식단, 관찰, 야간 알림처럼 서비스 알림 카테고리를 토글로 관리한다.
 * - 사용자가 값을 바꾸면 로컬 저장과 실제 알림 스케줄 동기화가 이어진다.
 *
 * 유지보수 포인트:
 * - 새 알림 종류를 추가할 때는 UI 토글, 저장 타입, 스케줄링 로직을 항상 같이 수정해야 한다.
 */
import { useRouter } from 'expo-router';
import { Animated, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNotificationSettings } from '@/hooks/use-notification-settings';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';

type SettingItemProps = {
  title: string;
  body: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  theme: (typeof Colors)['light'];
  disabled?: boolean;
};

function SettingItem({ title, body, value, onValueChange, theme, disabled = false }: SettingItemProps) {
  return (
    <View style={[styles.settingRow, disabled ? styles.settingRowDisabled : null]}>
      <View style={styles.settingTextWrap}>
        <Text style={[styles.settingTitle, { color: disabled ? theme.tabIconDefault : theme.text }]}>{title}</Text>
        <Text style={[styles.settingBody, { color: disabled ? theme.tabIconDefault : theme.icon }]}>{body}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#D7D3CE', true: '#F1A977' }}
        thumbColor={value ? '#FFFDF8' : '#F7F4EF'}
        ios_backgroundColor="#D7D3CE"
      />
    </View>
  );
}

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
  };
  const { settings, updateSettings } = useNotificationSettings();

  const patchSettings = async (patch: Partial<typeof settings>) => {
    await updateSettings({ ...settings, ...patch });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[topStyle, styles.cardStack]}>
          <HeroHeaderCard
            title={t('notificationSettingsScreen.title')}
            subtitle={t('notificationSettingsScreen.subtitle')}
            onBack={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }
              router.replace('/(tabs)/more');
            }}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />
        </Animated.View>

        <Animated.View style={[sectionsStyle, styles.cardStack]}>
        <View style={[styles.sectionCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
          <View style={[styles.decorBubble, styles.sectionBubble, { backgroundColor: tones.cream }]} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('notificationSettingsScreen.sectionActivity')}</Text>
          <SettingItem
            title={t('notificationSettingsScreen.mealPlanMorningTitle')}
            body={t('notificationSettingsScreen.mealPlanMorningBody')}
            value={settings.mealPlanMorning}
            onValueChange={(value) => void patchSettings({ mealPlanMorning: value })}
            theme={theme}
          />
          <SettingItem
            title={t('notificationSettingsScreen.feedingRecordReminderTitle')}
            body={t('notificationSettingsScreen.feedingRecordReminderBody')}
            value={settings.feedingRecordReminder}
            onValueChange={(value) => void patchSettings({ feedingRecordReminder: value })}
            theme={theme}
          />
        </View>

        <View style={[styles.sectionCard, styles.decorativeCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
          <View style={[styles.decorBubble, styles.sectionBubble, { backgroundColor: tones.paper }]} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('notificationSettingsScreen.sectionSafety')}</Text>
          <SettingItem
            title={t('notificationSettingsScreen.cautionReactionAlertTitle')}
            body={t('notificationSettingsScreen.cautionReactionAlertBody')}
            value={settings.cautionReactionAlert}
            onValueChange={(value) => void patchSettings({ cautionReactionAlert: value })}
            theme={theme}
          />
          <SettingItem
            title={t('notificationSettingsScreen.newIngredientObservationTitle')}
            body={t('notificationSettingsScreen.newIngredientObservationBody')}
            value={settings.newIngredientObservation}
            onValueChange={(value) => void patchSettings({ newIngredientObservation: value })}
            theme={theme}
          />
        </View>

        <View style={[styles.sectionCard, styles.decorativeCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
          <View style={[styles.decorBubble, styles.sectionBubble, { backgroundColor: tones.paper }]} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('notificationSettingsScreen.sectionMessage')}</Text>
          <SettingItem
            title={t('notificationSettingsScreen.emailUpdatesTitle')}
            body={t('notificationSettingsScreen.emailUpdatesBody')}
            value={settings.emailUpdates}
            onValueChange={(value) => void patchSettings({ emailUpdates: value })}
            theme={theme}
          />
        </View>

        <View style={[styles.sectionCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
          <View style={[styles.decorBubble, styles.sectionBubble, { backgroundColor: tones.lavender }]} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('notificationSettingsScreen.sectionQuiet')}</Text>
          <SettingItem
            title={t('notificationSettingsScreen.quietHoursTitle')}
            body={t('notificationSettingsScreen.quietHoursBody')}
            value={settings.quietHours}
            onValueChange={(value) => void patchSettings({ quietHours: value })}
            theme={theme}
          />
        </View>

        <Text style={[styles.footerText, { color: theme.icon }]}>{t('notificationSettingsScreen.footer')}</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.screenTopPadding,
    paddingBottom: Spacing.screenBottomPadding,
    gap: Spacing.cardStackGap,
  },
  cardStack: {
    gap: Spacing.cardStackGap,
  },
  decorativeCard: {
    overflow: 'hidden',
    shadowColor: '#C9B8A4',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  decorBubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.82,
  },
  sectionBubble: {
    width: 82,
    height: 82,
    right: -18,
    top: -20,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.cardPadding,
    gap: 14,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
  },
  settingRow: {
    minHeight: 84,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E1D8',
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  settingRowDisabled: {
    opacity: 0.52,
  },
  settingTextWrap: {
    flex: 1,
    gap: 6,
  },
  settingTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  settingBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  footerText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
});

/**
 * 더보기 탭 화면.
 *
 * 역할:
 * - 설정, 데이터 관리, 앱 정보, 가이드 진입점을 모아두는 보조 허브 역할을 한다.
 * - 바텀 탭 안에서 서비스성 기능과 문서성 기능을 분리해 연결한다.
 *
 * 유지보수 포인트:
 * - 더보기는 목록 허브에 집중하고, 실제 상세 설정은 반드시 개별 페이지로 분리한다.
 */
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageBackground } from '@/components/design-system/page-background';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SUPPORT_EMAIL } from '@/constants/app-info';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';

export default function MoreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
  };

  const openSupportEmail = async () => {
    const subject = t('profileScreen.contactDeveloperSubject');
    const body = `${t('profileScreen.contactDeveloperBodyTemplate')}\n- Email: ${SUPPORT_EMAIL}\n- App version: ${appVersion}\n`;
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const openBuyMeACoffee = async () => {
    const url = 'https://buymeacoffee.com/choseyoung';
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[topStyle, styles.cardStack]}>
        <View style={[styles.heroCard, styles.decorativeCard, { backgroundColor: tones.lavender, borderColor: theme.border }]}>
          <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: tones.paper }]} />
          <View style={[styles.decorBubble, styles.decorBubbleBottomLeft, { backgroundColor: tones.blush }]} />
          <Text style={[styles.title, { color: theme.text }]}>{t('moreScreen.title')}</Text>
          <Text style={[styles.subtitle, { color: theme.icon }]}>{t('moreScreen.subtitle')}</Text>
        </View>
        </Animated.View>

        <Animated.View style={[sectionsStyle, styles.cardStack]}>
        <View
          style={[
            styles.card,
            styles.decorativeCard,
            { backgroundColor: tones.cream, borderColor: theme.border },
          ]}>
          <View style={[styles.decorBubble, styles.cardDecorBubble, { backgroundColor: tones.paper }]} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>{t('moreScreen.weaningStartGuide')}</Text>
          <Text style={[styles.cardBody, { color: theme.icon }]}>{t('moreScreen.weaningStartGuideBody')}</Text>
          <Pressable
            onPress={() => router.push('/weaning-start-guide')}
            style={[styles.menuItem, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <Text style={[styles.menuText, { color: theme.text }]}>{t('moreScreen.weaningStartGuideAction')}</Text>
            <IconSymbol name="chevron.right" size={20} color={theme.icon} />
          </Pressable>
        </View>

        <View style={[styles.card, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
          <View style={[styles.decorBubble, styles.cardDecorBubble, { backgroundColor: tones.cream }]} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>{t('moreScreen.settingsTitle')}</Text>
          <Text style={[styles.cardBody, { color: theme.icon }]}>{t('moreScreen.settingsBody')}</Text>
          <View style={styles.menuList}>
            <Pressable
              onPress={() => router.push('/profile-editor')}
              style={[styles.menuItem, { backgroundColor: tones.cream, borderColor: theme.border }]}>
              <Text style={[styles.menuText, { color: theme.text }]}>{t('profileScreen.editProfile')}</Text>
              <IconSymbol name="chevron.right" size={20} color={theme.icon} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/notification-settings')}
              style={[styles.menuItem, { backgroundColor: tones.cream, borderColor: theme.border }]}>
              <Text style={[styles.menuText, { color: theme.text }]}>{t('profileScreen.notificationSettings')}</Text>
              <IconSymbol name="chevron.right" size={20} color={theme.icon} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/meal-plan-preferences')}
              style={[styles.menuItem, { backgroundColor: tones.cream, borderColor: theme.border }]}>
              <Text style={[styles.menuText, { color: theme.text }]}>{t('moreScreen.mealPreferences')}</Text>
              <IconSymbol name="chevron.right" size={20} color={theme.icon} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/weekly-insights')}
              style={[styles.menuItem, { backgroundColor: tones.cream, borderColor: theme.border }]}>
              <Text style={[styles.menuText, { color: theme.text }]}>{t('moreScreen.weeklyInsights')}</Text>
              <IconSymbol name="chevron.right" size={20} color={theme.icon} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/data-management')}
              style={[styles.menuItem, { backgroundColor: tones.cream, borderColor: theme.border }]}>
              <Text style={[styles.menuText, { color: theme.text }]}>{t('profileScreen.dataManagement')}</Text>
              <IconSymbol name="chevron.right" size={20} color={theme.icon} />
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.card,
            styles.decorativeCard,
            styles.appInfoCard,
            { backgroundColor: tones.blush, borderColor: theme.border },
          ]}>
          <View style={[styles.decorBubble, styles.cardDecorBubble, { backgroundColor: tones.paper }]} />
          <Text style={[styles.cardTitle, { color: theme.text }]}>{t('moreScreen.appInfoTitle')}</Text>
          <View style={[styles.versionRow, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <Text style={[styles.menuText, { color: theme.text }]}>{t('profileScreen.appVersion')}</Text>
            <View style={[styles.versionPill, { backgroundColor: theme.accentSoft }]}>
              <Text style={[styles.versionPillText, { color: theme.text }]}>{appVersion}</Text>
            </View>
          </View>
          <View style={styles.menuList}>
            <Pressable
              onPress={() => router.push('/open-source-licenses')}
              style={[styles.menuItem, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <Text style={[styles.menuText, { color: theme.text }]}>{t('profileScreen.openSourceLicense')}</Text>
              <IconSymbol name="chevron.right" size={20} color={theme.icon} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/terms-of-service')}
              style={[styles.menuItem, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <Text style={[styles.menuText, { color: theme.text }]}>{t('profileScreen.termsOfService')}</Text>
              <IconSymbol name="chevron.right" size={20} color={theme.icon} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/privacy-policy')}
              style={[styles.menuItem, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <Text style={[styles.menuText, { color: theme.text }]}>{t('profileScreen.privacyPolicy')}</Text>
              <IconSymbol name="chevron.right" size={20} color={theme.icon} />
            </Pressable>
            <Pressable
              onPress={() => void openSupportEmail()}
              style={[styles.menuItem, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <Text style={[styles.menuText, { color: theme.text }]}>{t('profileScreen.contactDeveloper')}</Text>
              <IconSymbol name="chevron.right" size={20} color={theme.icon} />
            </Pressable>
            <Pressable
              onPress={() => void openBuyMeACoffee()}
              style={[styles.menuItem, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <Text style={[styles.menuText, { color: theme.text }]}>{t('profileScreen.buyCoffee')}</Text>
              <IconSymbol name="chevron.right" size={20} color={theme.icon} />
            </Pressable>
          </View>
        </View>
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
    paddingBottom: Spacing.tabScreenBottomPadding,
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
  decorBubbleTopRight: {
    width: 110,
    height: 110,
    right: -30,
    top: -24,
  },
  decorBubbleBottomLeft: {
    width: 76,
    height: 76,
    left: -20,
    bottom: -24,
  },
  cardDecorBubble: {
    width: 86,
    height: 86,
    right: -18,
    top: -22,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.cardPadding,
    gap: 6,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.cardPadding,
    gap: Spacing.fieldGap,
  },
  cardTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  cardBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLabelWrap: {
    flex: 1,
    gap: 3,
    paddingRight: 8,
  },
  menuText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  menuCaption: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 17,
  },
  versionRow: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  versionPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  versionPillText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
});

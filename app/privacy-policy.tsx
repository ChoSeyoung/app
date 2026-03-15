/**
 * 개인정보 처리방침 화면.
 *
 * 역할:
 * - 앱이 어떤 데이터를 어떻게 다루는지 보호자에게 안내한다.
 * - 서비스 이용약관과 함께 더보기의 앱 정보 영역에서 접근한다.
 *
 * 유지보수 포인트:
 * - 저장 데이터 범위나 외부 SDK가 바뀌면 가장 먼저 이 문서를 점검해야 한다.
 */
import { useRouter } from 'expo-router';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { PRIVACY_POLICY_SECTIONS } from '@/constants/legal-documents';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';

export default function PrivacyPolicyScreen() {
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

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={topStyle}>
          <HeroHeaderCard
            title={t('privacyScreen.title')}
            subtitle={t('privacyScreen.subtitle')}
            onBack={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }
              router.replace('/(tabs)/more');
            }}
            theme={theme}
            backgroundColor={tones.blush}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.cream}
          />
        </Animated.View>

        <Animated.View style={sectionsStyle}>
        <View style={styles.listWrap}>
          {PRIVACY_POLICY_SECTIONS.map((section, index) => (
            <View
              key={section.title}
              style={[
                styles.sectionCard,
                styles.decorativeCard,
                {
                  backgroundColor: index % 3 === 0 ? tones.paper : index % 3 === 1 ? tones.cream : tones.lavender,
                  borderColor: theme.border,
                },
              ]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
              <Text style={[styles.sectionBody, { color: theme.icon }]}>{section.body}</Text>
            </View>
          ))}
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
    paddingBottom: Spacing.screenBottomPadding,
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
  listWrap: {
    gap: 12,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.cardPadding,
    gap: 10,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: '700',
  },
  sectionBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
  },
});

/**
 * 오픈소스 라이선스 고지 화면.
 *
 * 역할:
 * - 앱이 직접 사용하는 패키지의 이름, 버전, 라이선스를 목록으로 보여준다.
 * - 더보기의 앱 정보 메뉴에서 접근하는 법적 고지 성격의 화면이다.
 *
 * 유지보수 포인트:
 * - 패키지나 버전 표시 방식은 실제 notices 데이터와 같이 갱신해야 한다.
 */
import { useRouter } from 'expo-router';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { OPEN_SOURCE_NOTICES } from '@/constants/open-source-notices';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';

export default function OpenSourceLicensesScreen() {
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
            title={t('openSourceScreen.title')}
            subtitle={t('openSourceScreen.subtitle')}
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
        <Animated.View style={sectionsStyle}>
        <View style={styles.listWrap}>
          {OPEN_SOURCE_NOTICES.map((item, index) => (
            <View
              key={`${item.name}-${item.version}`}
              style={[
                styles.licenseCard,
                styles.decorativeCard,
                {
                  backgroundColor: index % 3 === 0 ? tones.paper : index % 3 === 1 ? tones.cream : tones.blush,
                  borderColor: theme.border,
                },
              ]}>
              <Text style={[styles.packageName, { color: theme.text }]}>{item.name}</Text>
              <View style={styles.metaRow}>
                <View style={[styles.metaPill, { backgroundColor: tones.lavender }]}>
                  <Text style={[styles.metaPillText, { color: theme.text }]}>{item.version}</Text>
                </View>
                <View style={[styles.metaPill, { backgroundColor: theme.accentSoft }]}>
                  <Text style={[styles.metaPillText, { color: theme.text }]}>{item.license}</Text>
                </View>
              </View>
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
  licenseCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.cardPadding,
    gap: 10,
  },
  packageName: {
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaPill: {
    borderRadius: 999,
    paddingHorizontal: Spacing.chipHorizontal,
    paddingVertical: 6,
  },
  metaPillText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
});

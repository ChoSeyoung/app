/**
 * 주간 인사이트 화면.
 *
 * 역할:
 * - 최근 7일 기록을 요약해 기록 수, 새 식재료, 주의 반응 같은 회고 정보를 보여준다.
 * - 기록이 쌓인 뒤 보호자가 패턴을 돌아보게 만드는 분석 진입점이다.
 *
 * 유지보수 포인트:
 * - 통계 정의를 바꿀 때는 홈 요약 카드나 식단 제약과 의미가 충돌하지 않도록 확인한다.
 */
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import type { FeedingRecord } from '@/features/records/model';
import { listFeedingRecords } from '@/features/records/repository';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useIngredients } from '@/hooks/use-ingredients';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';

function withinDays(dateTime: string, days: number): boolean {
  const target = new Date(dateTime);
  return Date.now() - target.getTime() <= days * 24 * 60 * 60 * 1000;
}

export default function WeeklyInsightsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { ingredients } = useIngredients();
  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
  };

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        setRecords(await listFeedingRecords());
      })();
    }, [])
  );

  const summary = useMemo(() => {
    const weeklyRecords = records.filter((record) => withinDays(record.dateTime, 7));
    const ingredientFrequency = new Map<string, number>();
    weeklyRecords.forEach((record) => {
      record.ingredients.forEach((item) => {
        ingredientFrequency.set(item.ingredientName, (ingredientFrequency.get(item.ingredientName) ?? 0) + 1);
      });
    });

    const topIngredient = Array.from(ingredientFrequency.entries()).sort((a, b) => b[1] - a[1])[0];
    const newIngredients = ingredients.filter((item) => item.firstTriedDate && withinDays(`${item.firstTriedDate}T00:00:00`, 7)).length;
    const cautionCount = weeklyRecords.filter((item) => item.reactionType === 'FUSSY' || item.reactionType === 'VOMIT' || item.reactionType === 'RASH').length;
    const completionRate = Math.min(100, Math.round((weeklyRecords.length / 7) * 100));

    return {
      weeklyRecords: weeklyRecords.length,
      newIngredients,
      topIngredientName: topIngredient?.[0] ?? t('weeklyInsightsScreen.emptyValue'),
      topIngredientCount: topIngredient?.[1] ?? 0,
      cautionCount,
      completionRate,
    };
  }, [ingredients, records]);

  const cards = [
    { tone: tones.paper, title: t('weeklyInsightsScreen.recordsTitle'), value: `${summary.weeklyRecords}${t('weeklyInsightsScreen.recordsUnit')}` },
    { tone: tones.cream, title: t('weeklyInsightsScreen.newIngredientsTitle'), value: `${summary.newIngredients}${t('weeklyInsightsScreen.itemsUnit')}` },
    {
      tone: tones.blush,
      title: t('weeklyInsightsScreen.topIngredientTitle'),
      value:
        summary.topIngredientCount > 0
          ? `${summary.topIngredientName} · ${summary.topIngredientCount}${t('weeklyInsightsScreen.timesUnit')}`
          : summary.topIngredientName,
    },
    { tone: tones.lavender, title: t('weeklyInsightsScreen.cautionTitle'), value: `${summary.cautionCount}${t('weeklyInsightsScreen.itemsUnit')}` },
    { tone: tones.paper, title: t('weeklyInsightsScreen.completionTitle'), value: `${summary.completionRate}%` },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={topStyle}>
          <HeroHeaderCard
            title={t('weeklyInsightsScreen.title')}
            subtitle={t('weeklyInsightsScreen.subtitle')}
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

        <Animated.View style={[sectionsStyle, styles.grid]}>
          {cards.map((card) => (
            <View key={card.title} style={[styles.card, { backgroundColor: card.tone, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{card.title}</Text>
              <Text style={[styles.cardValue, { color: theme.text }]}>{card.value}</Text>
            </View>
          ))}
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
  grid: {
    gap: Spacing.cardStackGap,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.cardPadding,
    gap: 8,
    shadowColor: '#C9B8A4',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  cardTitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  cardValue: {
    fontFamily: Fonts.rounded,
    fontSize: 28,
    fontWeight: '700',
  },
});

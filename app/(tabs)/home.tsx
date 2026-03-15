/**
 * 홈 탭 메인 화면.
 *
 * 역할:
 * - 오늘 식단, 오늘 기록 현황, 빠른 행동 카드, 주간 캘린더를 한 번에 보여준다.
 * - 기록과 식단 엔진에서 가져온 신호를 바탕으로 오늘 해야 할 일을 가장 먼저 제안한다.
 *
 * 유지보수 포인트:
 * - 홈 카드가 늘어나더라도 사용자의 첫 행동 유도 흐름이 흐려지지 않도록 우선순위를 유지한다.
 */
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuickCard } from '@/components/design-system/quick-card';
import { PageBackground } from '@/components/design-system/page-background';
import { SectionHeader } from '@/components/design-system/section-header';
import { WeekCalendar } from '@/components/design-system/week-calendar';
import { getLocale, t, tList } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, DecorativeTones, Fonts } from '@/constants/theme';
import type { Ingredient } from '@/features/ingredients/model';
import { generateMealPlan } from '@/features/meal-plan/engine';
import { deriveMealPlanSignals } from '@/features/meal-plan/signals';
import type { FeedingRecord } from '@/features/records/model';
import { listFeedingRecords } from '@/features/records/repository';
import { useBabyProfile } from '@/hooks/use-baby-profile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useIngredients } from '@/hooks/use-ingredients';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';
import { formatDisplayDate } from '@/utils/date';

const defaultBabyAvatar = require('../../assets/images/default-baby-avatar.png');

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameDayString(dateTime: string, target: Date): boolean {
  const date = new Date(dateTime);
  return isSameDate(date, target);
}

function formatTimeLabel(dateTime: string): string {
  const date = new Date(dateTime);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function isWithinDays(dateTime: string, days: number): boolean {
  const target = new Date(dateTime);
  const now = new Date();
  const diff = now.getTime() - target.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

function reactionLabel(value: FeedingRecord['reactionType']): string {
  switch (value) {
    case 'FUSSY':
      return t('journeyScreen.reactionTypeFussy');
    case 'VOMIT':
      return t('journeyScreen.reactionTypeVomit');
    case 'RASH':
      return t('journeyScreen.reactionTypeRash');
    case 'NORMAL':
      return t('journeyScreen.reactionTypeNormal');
    case 'NONE':
    default:
      return t('journeyScreen.reactionTypeNone');
  }
}

type CautionAlertItem = {
  id: string;
  title: string;
  body: string;
};

type FocusActionCard = {
  title: string;
  body: string;
  action: string;
  route: '/(tabs)/meal-plan' | '/(tabs)/journey' | '/(tabs)/ingredients';
  tone: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const tones = DecorativeTones;
  const { profile, isLoading } = useBabyProfile();
  const { ingredients } = useIngredients();
  const [todayFeedingRecords, setTodayFeedingRecords] = useState<FeedingRecord[]>([]);
  const [allFeedingRecords, setAllFeedingRecords] = useState<FeedingRecord[]>([]);
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        const today = new Date();
        const records = await listFeedingRecords();
        setAllFeedingRecords(records);
        setTodayFeedingRecords(records.filter((record) => isSameDayString(record.dateTime, today)));
      })();
    }, [])
  );

  const weekdays = tList('home.weekdays');
  const week = useMemo(() => {
    const today = new Date();
    const mondayBasedIndex = (today.getDay() + 6) % 7; // mon:0 ... sun:6
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - mondayBasedIndex);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);

      return {
        key: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        dayLabel: weekdays[index] ?? '',
        dateLabel: date.getDate(),
        isActive: isSameDate(date, today),
      };
    });
  }, [weekdays]);

  const mealPlanSignals = useMemo(
    () => deriveMealPlanSignals({ ingredients, records: allFeedingRecords }),
    [allFeedingRecords, ingredients]
  );
  const todayMealPlan = useMemo(() => {
    if (!profile) return null;
    return generateMealPlan(profile, ingredients, new Date(), 0, mealPlanSignals).today;
  }, [ingredients, mealPlanSignals, profile]);
  const latestTodayRecord = todayFeedingRecords[0] ?? null;
  const quickCards = useMemo(() => {
    const cards = [];

    if (mealPlanSignals.observationIngredientIds.length > 0) {
      const names = ingredients
        .filter((item) => mealPlanSignals.observationIngredientIds.includes(item.id))
        .slice(0, 2)
        .map((item) => item.name);
      cards.push({
        title: t('home.actions.observationTitle'),
        body: t('home.actions.observationBody', { ingredients: names.join(', ') || t('home.actions.noneFallback') }),
        tone: '#DCD4F3',
        chip: t('home.actions.observationChip'),
        route: '/(tabs)/meal-plan',
      });
    }

    if (mealPlanSignals.yesterdayRiskCount > 0) {
      cards.push({
        title: t('home.actions.riskTitle'),
        body: t('home.actions.riskBody', { count: mealPlanSignals.yesterdayRiskCount }),
        tone: '#F4D7D0',
        chip: t('home.actions.riskChip'),
        route: '/(tabs)/journey',
      });
    }

    if (!latestTodayRecord) {
      cards.push({
        title: t('home.actions.recordTitle'),
        body: t('home.actions.recordBody'),
        tone: '#EEEAD6',
        chip: t('home.actions.recordChip'),
        route: '/(tabs)/journey',
      });
    }

    if (cards.length === 0) {
      cards.push({
        title: t('home.actions.defaultTitle'),
        body: t('home.actions.defaultBody'),
        tone: '#EEEAD6',
        chip: t('home.actions.defaultChip'),
        route: '/(tabs)/meal-plan',
      });
    }

    return cards;
  }, [ingredients, latestTodayRecord, mealPlanSignals]);
  const cautionAlerts = useMemo<CautionAlertItem[]>(() => {
    const recordAlerts = allFeedingRecords
      .filter(
        (record) =>
          isWithinDays(record.dateTime, 7) &&
          (record.reactionType === 'FUSSY' || record.reactionType === 'VOMIT' || record.reactionType === 'RASH')
      )
      .slice(0, 2)
      .map((record) => ({
        id: `record-${record.id}`,
        title: `${formatDisplayDate(record.dateTime)} · ${reactionLabel(record.reactionType)}`,
        body: record.ingredients.map((item) => item.ingredientName).join(', '),
      }));

    const ingredientAlerts = ingredients
      .filter((item) => item.status === 'CAUTION' || item.status === 'ALLERGY')
      .slice(0, Math.max(0, 2 - recordAlerts.length))
      .map((item: Ingredient) => {
        const parts = [
          item.firstTriedDate ? formatDisplayDate(item.firstTriedDate) : '',
          item.latestNote?.trim() ?? '',
        ].filter(Boolean);

        return {
          id: `ingredient-${item.id}`,
          title: `${item.name} · ${item.status === 'ALLERGY' ? t('ingredientScreen.statusAllergy') : t('ingredientScreen.statusCaution')}`,
          body: parts.length > 0 ? parts.join(' · ') : t('home.cautionAlertFallback'),
        };
      });

    return [...recordAlerts, ...ingredientAlerts];
  }, [allFeedingRecords, ingredients]);
  const focusAction = useMemo<FocusActionCard>(() => {
    if (mealPlanSignals.observationIngredientIds.length > 0) {
      const names = ingredients
        .filter((item) => mealPlanSignals.observationIngredientIds.includes(item.id))
        .slice(0, 2)
        .map((item) => item.name)
        .join(', ');

      return {
        title: t('home.focusActionObservationTitle'),
        body: t('home.focusActionObservationBody', {
          ingredients: names || t('home.actions.noneFallback'),
        }),
        action: t('home.focusActionObservationAction'),
        route: '/(tabs)/journey',
        tone: '#EEEAD6',
      };
    }

    if (cautionAlerts.length > 0) {
      return {
        title: t('home.focusActionRiskTitle'),
        body: t('home.focusActionRiskBody', { count: cautionAlerts.length }),
        action: t('home.focusActionRiskAction'),
        route: '/(tabs)/journey',
        tone: '#F4D7D0',
      };
    }

    if (!latestTodayRecord) {
      return {
        title: t('home.focusActionRecordTitle'),
        body: t('home.focusActionRecordBody'),
        action: t('home.focusActionRecordAction'),
        route: '/(tabs)/journey',
        tone: '#DCD4F3',
      };
    }

    if (todayMealPlan?.meals[0]) {
      return {
        title: t('home.focusActionMealTitle'),
        body: t('home.focusActionMealBody', {
          meal: `${todayMealPlan.meals[0].timeLabel} · ${todayMealPlan.meals[0].ingredientNames.join(', ')}`,
        }),
        action: t('home.focusActionMealAction'),
        route: '/(tabs)/meal-plan',
        tone: '#EEEAD6',
      };
    }

    return {
      title: t('home.focusActionDefaultTitle'),
      body: t('home.focusActionDefaultBody'),
      action: t('home.focusActionDefaultAction'),
      route: '/(tabs)/meal-plan',
      tone: '#EEEAD6',
    };
  }, [cautionAlerts.length, ingredients, latestTodayRecord, mealPlanSignals.observationIngredientIds, todayMealPlan]);

  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.page, styles.loadingPage, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.loadingText, { color: theme.icon }]}>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.page, styles.emptyPage, { backgroundColor: theme.background }]}>
        <View style={[styles.emptyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('home.profileRequiredTitle')}</Text>
          <Text style={[styles.emptyBody, { color: theme.icon }]}>{t('home.profileRequiredBody')}</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/intro')}
            style={[styles.emptyButton, { backgroundColor: theme.accent }]}>
            <Text style={styles.emptyButtonText}>{t('home.profileRequiredAction')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const welcomeLine1 =
    getLocale() === 'en' ? `${profile.babyName} caregiver,` : `${profile.babyName} 보호자님,`;
  const welcomeLine2 = t('home.welcomeSuffix');
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}> 
      <PageBackground />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={topStyle}>
          <View style={[styles.heroShell, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: tones.lavender }]} />
            <View style={[styles.decorBubble, styles.decorBubbleBottomLeft, { backgroundColor: tones.blush }]} />
            <View style={styles.headerRow}>
              <View style={styles.greetingWrap}>
                <View style={[styles.greetingBadge, { backgroundColor: theme.accentSoft }]}>
                  <Text style={[styles.greetingBadgeText, { color: theme.text }]}>{t('common.today')}</Text>
                </View>
                <Text style={[styles.greeting, { color: theme.text }]}>{welcomeLine1}</Text>
                <Text style={[styles.greetingSub, { color: theme.text }]}>{welcomeLine2}</Text>
              </View>

              <View style={[styles.avatarWrap, { borderColor: theme.border }]}>
                <Image
                  source={profile.photoUri ? { uri: profile.photoUri } : defaultBabyAvatar}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              </View>
            </View>

            <View style={[styles.calendarCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
              <WeekCalendar items={week} accentColor={theme.accent} dayColor={theme.icon} />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={sectionsStyle}>
          <View style={styles.sectionBlock}>
            <SectionHeader title={t('home.focusActionSectionTitle')} />
            <Pressable
              onPress={() => router.push(focusAction.route)}
              style={[styles.focusCard, styles.decorativeCard, { backgroundColor: focusAction.tone, borderColor: theme.border }]}>
              <View style={[styles.decorBubble, styles.cardBubbleCorner, { backgroundColor: tones.paper }]} />
              <Text style={[styles.focusTitle, { color: theme.text }]}>{focusAction.title}</Text>
              <Text style={[styles.focusBody, { color: theme.icon }]}>{focusAction.body}</Text>
              <View style={[styles.focusActionChip, { backgroundColor: theme.accentSoft }]}>
                <Text style={[styles.focusActionChipText, { color: theme.text }]}>{focusAction.action}</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.sectionBlock}>
            <SectionHeader title={t('home.todayMealCardTitle')} />

            <View style={styles.heroRow}>
              <View style={[styles.heroCard, styles.decorativeCard, { backgroundColor: tones.butter, borderColor: '#E3B94D' }]}> 
                <View style={[styles.decorBubble, styles.heroBubbleTop, { backgroundColor: '#FFEABA' }]} />
                <View style={[styles.decorBubble, styles.heroBubbleBottom, { backgroundColor: tones.paper }]} />
                <View style={styles.heroTopRow}>
                  <View style={[styles.heroMiniPill, { backgroundColor: '#FFEABA' }]}>
                    <Text style={styles.heroMiniPillText}>{t('mealPlanScreen.todayEyebrow')}</Text>
                  </View>
                  <Text style={styles.heroGraphic}>☀️</Text>
                </View>
                <Text style={styles.heroTitle}>
                  {todayMealPlan?.meals[0]?.title ?? t('home.heroTitle')}
                </Text>
                <Text style={styles.heroBody}>
                  {todayMealPlan?.meals[0]
                    ? `${todayMealPlan.meals[0].timeLabel} · ${todayMealPlan.meals[0].ingredientNames.join(', ')}`
                    : t('home.heroBody')}
                </Text>
                <View style={styles.heroFooterRow}>
                  <View style={[styles.heroInfoPill, { backgroundColor: tones.paper }]}>
                    <Text style={styles.heroInfoPillText}>
                      {todayMealPlan?.meals[0]
                        ? todayMealPlan.meals.length > 1
                          ? t('home.mealsRecommendedCount', { count: todayMealPlan.meals.length })
                          : todayMealPlan.meals[0].containsNewIngredient
                            ? t('home.todayMealChipNewIngredient')
                            : t('home.todayMealChipRecommended')
                        : latestTodayRecord
                          ? `${formatTimeLabel(latestTodayRecord.dateTime)} ${t('home.todayRecordStatusView')}`
                          : t('home.todayRecordStatusEmptyAction')}
                    </Text>
                  </View>
                </View>
                {todayMealPlan && todayMealPlan.meals.length > 1 ? (
                  <View style={styles.heroMealList}>
                    {todayMealPlan.meals.slice(1).map((meal) => (
                      <View key={`${meal.slot}-${meal.timeLabel}`} style={[styles.heroMealChip, { backgroundColor: tones.paper }]}>
                        <Text style={styles.heroMealChipText}>{`${meal.title} · ${meal.ingredientNames.join(', ')}`}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionHeader title={t('home.todayRecordStatusTitle')} />
            <View style={[styles.statusCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <View style={[styles.decorBubble, styles.cardBubbleCorner, { backgroundColor: tones.lavender }]} />
              <View style={[styles.softEyebrow, { backgroundColor: tones.blush }]}>
                <Text style={[styles.softEyebrowText, { color: theme.text }]}>{t('common.today')}</Text>
              </View>
              {latestTodayRecord ? (
                <>
                  <Text style={[styles.statusHeadline, { color: theme.text }]}>
                    {t('home.todayRecordStatusDone', { count: todayFeedingRecords.length })}
                  </Text>
                  <Text style={[styles.statusBody, { color: theme.icon }]}>
                    {t('home.todayRecordStatusLatest', {
                      time: formatTimeLabel(latestTodayRecord.dateTime),
                      ingredients:
                        latestTodayRecord.ingredients.map((item) => item.ingredientName).join(', ') || t('home.todayRecordStatusEmptyAction'),
                    })}
                  </Text>
                  <Pressable onPress={() => router.push('/(tabs)/journey')} style={styles.inlineStatusAction}>
                    <Text style={[styles.inlineStatusActionText, { color: theme.text }]}>{t('home.todayRecordStatusView')}</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={[styles.statusHeadline, { color: theme.text }]}>{t('home.todayRecordStatusEmptyTitle')}</Text>
                  <Text style={[styles.statusBody, { color: theme.icon }]}>{t('home.todayRecordStatusBody')}</Text>
                  <Pressable
                    onPress={() => router.push('/(tabs)/journey')}
                    style={[styles.statusPrimaryAction, { backgroundColor: theme.accentSoft }]}>
                    <Text style={styles.statusPrimaryActionText}>{t('home.todayRecordStatusEmptyAction')}</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionHeader title={t('home.quickJournal')} />

            <View style={[styles.quickRailShell, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <View style={[styles.decorBubble, styles.quickRailBubble, { backgroundColor: tones.cream }]} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
                {quickCards.map((card) => (
                  <QuickCard
                    key={card.title}
                    title={card.title}
                    body={card.body}
                    toneColor={card.tone}
                    chipLabel={card.chip}
                    onPress={() => router.push(card.route)}
                  />
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionHeader title={t('home.cautionAlertTitle')} />
            <View style={[styles.cautionCard, styles.decorativeCard, { borderColor: '#E9C88A', backgroundColor: '#FFF4DE' }]}>
              <View style={[styles.decorBubble, styles.cardBubbleCorner, { backgroundColor: '#FFE8BD' }]} />
              {cautionAlerts.length > 0 ? (
                <View style={styles.cautionList}>
                  {cautionAlerts.map((alert) => (
                    <View key={alert.id} style={[styles.cautionItem, { backgroundColor: '#FFFAF0', borderColor: '#F2DDAD' }]}>
                      <Text style={styles.cautionItemTitle}>{alert.title}</Text>
                      <Text style={styles.cautionBody}>{alert.body}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.cautionBody}>{t('home.cautionAlertBody')}</Text>
              )}
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
  loadingPage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPage: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
  },
  emptyCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.cardPadding,
    gap: Spacing.fieldGap,
  },
  emptyTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '600',
  },
  emptyBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 8,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Spacing.primaryButtonMinHeight,
  },
  emptyButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  loadingText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  content: {
    paddingTop: Spacing.screenTopPadding,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.tabScreenBottomPadding,
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
    right: -28,
    top: -26,
  },
  decorBubbleBottomLeft: {
    width: 86,
    height: 86,
    left: -22,
    bottom: -24,
  },
  heroBubbleTop: {
    width: 120,
    height: 120,
    right: -26,
    top: -30,
  },
  heroBubbleBottom: {
    width: 88,
    height: 88,
    left: -20,
    bottom: -26,
  },
  cardBubbleCorner: {
    width: 72,
    height: 72,
    right: -16,
    top: -20,
  },
  sectionBlock: {
    gap: Spacing.cardStackGap,
    marginTop: Spacing.sectionHeaderMarginTop,
    marginBottom: Spacing.sectionHeaderMarginBottom,
  },
  heroShell: {
    borderWidth: 1,
    borderRadius: 26,
    padding: Spacing.cardPadding,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  greetingWrap: {
    flex: 1,
    gap: 6,
  },
  greetingBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  greetingBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  greeting: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    lineHeight: 29,
    letterSpacing: -0.2,
    fontWeight: '700',
  },
  greetingSub: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
  },
  avatarWrap: {
    width: 58,
    height: 58,
    borderWidth: 1,
    borderRadius: 22,
    padding: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  calendarCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  heroRow: {
    flexDirection: 'column',
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    minHeight: 196,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroMiniPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroMiniPillText: {
    color: '#56422E',
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#1A1A1A',
    fontFamily: Fonts.rounded,
    fontSize: 27,
    fontWeight: '700',
  },
  heroBody: {
    color: '#24211D',
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  heroGraphic: {
    fontSize: 34,
  },
  heroFooterRow: {
    marginTop: 16,
    flexDirection: 'row',
  },
  heroMealList: {
    gap: 8,
    marginTop: 12,
  },
  heroMealChip: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  heroMealChipText: {
    color: '#4D3B29',
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  heroInfoPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroInfoPillText: {
    color: '#4D3B29',
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  quickRow: {
    gap: 12,
    paddingBottom: 8,
  },
  quickRailShell: {
    borderWidth: 1,
    borderRadius: 22,
    paddingVertical: 14,
    paddingLeft: 14,
  },
  quickRailBubble: {
    width: 84,
    height: 84,
    left: -18,
    bottom: -20,
  },
  statusCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.cardPadding,
  },
  softEyebrow: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  softEyebrowText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  statusHeadline: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  statusPrimaryAction: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: Spacing.compactButtonRadius,
    paddingHorizontal: 14,
    paddingVertical: Spacing.chipVertical,
  },
  statusPrimaryActionText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  inlineStatusAction: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  inlineStatusActionText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  cautionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.cardPadding,
  },
  focusCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.cardPadding,
    gap: 10,
  },
  focusTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  focusBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  focusActionChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  focusActionChipText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  cautionList: {
    gap: 12,
  },
  cautionItem: {
    gap: 4,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  cautionItemTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
    color: '#7a5300',
  },
  cautionBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: '#7a5300',
    fontWeight: '500',
  },
});

import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageBackground } from '@/components/design-system/page-background';
import type { BabyProfile, FeedingMethod, FeedingStage } from '@/constants/baby-profile';
import { t, tList } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { generateMealPlan } from '@/features/meal-plan/engine';
import type { RecordDraft, RecordedMealItem } from '@/features/records/model';
import { setLatestRecordDraft } from '@/features/records/record-draft-store';
import { useBabyProfile } from '@/hooks/use-baby-profile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useIngredients } from '@/hooks/use-ingredients';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';
import { useToast } from '@/hooks/use-toast';
import { formatDisplayDate } from '@/utils/date';

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getWeekDates(base: Date): Date[] {
  const sundayIndex = base.getDay();
  const weekStart = new Date(base);
  weekStart.setDate(base.getDate() - sundayIndex);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + index);
    return day;
  });
}

function getMonthGridDates(base: Date): Date[] {
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const last = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  const sundayIndex = first.getDay();
  const saturdayIndex = 6 - last.getDay();
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - sundayIndex);
  const gridEnd = new Date(last);
  gridEnd.setDate(last.getDate() + saturdayIndex);
  const days = Math.floor((gridEnd.getTime() - gridStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function formatMonthLabel(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function normalizeDateInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8);
}

function toIsoDate(value: string): string {
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function isValidDateInput(value: string): boolean {
  if (!/^\d{8}$/.test(value)) return false;
  const iso = toIsoDate(value);
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const [year, month, day] = [value.slice(0, 4), value.slice(4, 6), value.slice(6, 8)].map(Number);
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

function stageLabel(value: FeedingStage): string {
  switch (value) {
    case 'PREP':
      return t('mealPlanScreen.stagePrep');
    case 'INITIAL':
      return t('mealPlanScreen.stageInitial');
    case 'MIDDLE':
      return t('mealPlanScreen.stageMiddle');
    case 'LATE':
      return t('mealPlanScreen.stageLate');
    case 'COMPLETE':
    default:
      return t('mealPlanScreen.stageComplete');
  }
}

function methodLabel(value: FeedingMethod): string {
  switch (value) {
    case 'TRADITIONAL':
      return t('mealPlanScreen.methodTraditional');
    case 'BLW_MIXED':
      return t('mealPlanScreen.methodBlwMixed');
    case 'TOPPING':
    default:
      return t('mealPlanScreen.methodTopping');
  }
}

function mealNoteLabel(noteType?: 'OBSERVE_NEW' | 'EXCLUDE_CAUTION'): string {
  switch (noteType) {
    case 'OBSERVE_NEW':
      return t('mealPlanScreen.noteObserveNew');
    case 'EXCLUDE_CAUTION':
      return t('mealPlanScreen.noteExcludeCaution');
    default:
      return t('mealPlanScreen.noneLabel');
  }
}

function reasonLabel(key: 'BY_FEEDING_WEEK' | 'BY_MEAL_COUNT' | 'EXCLUDE_BLOCKED'): string {
  switch (key) {
    case 'BY_FEEDING_WEEK':
      return t('mealPlanScreen.reasonFeedingWeek');
    case 'BY_MEAL_COUNT':
      return t('mealPlanScreen.reasonMealCount');
    case 'EXCLUDE_BLOCKED':
    default:
      return t('mealPlanScreen.reasonBlocked');
  }
}

function buildBabyInfoSummary(
  calendarAgeDays: number,
  feedingWeek: number,
  profile: BabyProfile
): string {
  const parts = [`생후 ${calendarAgeDays}일`, `이유식 ${feedingWeek}주차`];

  if (profile.feedingStage) {
    parts.push(stageLabel(profile.feedingStage));
  }

  if (profile.mealsPerDay) {
    parts.push(`${profile.mealsPerDay}식`);
  }

  if (profile.feedingMethod) {
    parts.push(methodLabel(profile.feedingMethod));
  }

  return parts.join(' · ');
}

export default function MealPlanScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const weekdays = tList('home.weekdays');
  const { profile, saveProfile } = useBabyProfile();
  const { ingredients } = useIngredients();
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
  };
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [feedingStartDateInput, setFeedingStartDateInput] = useState('');
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
  const monthDates = useMemo(() => getMonthGridDates(displayedMonth), [displayedMonth]);

  const plan = useMemo(() => {
    if (!profile?.feedingStartDate) return null;
    return generateMealPlan(profile, ingredients, selectedDate);
  }, [ingredients, profile, selectedDate]);
  const planDateSet = useMemo(() => new Set(plan?.week.map((item) => item.date) ?? []), [plan]);

  const handleFedFromPlan = (date: string, slot: 'breakfast' | 'lunch' | 'dinner', ingredientNames: string[], timeLabel: string) => {
    const seededItems: RecordedMealItem[] = ingredientNames.map((name, index) => ({
      ingredientName: name,
      state: 'planned',
      plannedItemRefId: `${date}-${slot}-${index}`,
    }));

    const draft: RecordDraft = {
      id: `draft-${Date.now()}`,
      date,
      slot,
      plannedMealRefId: `plan-${date}-${slot}`,
      seededItems,
      seededTime: timeLabel,
      createdAt: new Date().toISOString(),
    };

    setLatestRecordDraft(draft);
    router.push('/record-editor');
  };

  const selectedDateIso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedDayPlan = plan?.week.find((item) => item.date === selectedDateIso) ?? plan?.today ?? null;

  const handleSaveFeedingStartDate = async () => {
    if (!profile) return;
    const normalized = normalizeDateInput(feedingStartDateInput);
    if (!isValidDateInput(normalized)) {
      showToast({
        message: t('mealPlanScreen.startDateValidation'),
        variant: 'error',
      });
      return;
    }

    await saveProfile({
      ...profile,
      feedingStartDate: toIsoDate(normalized),
    });
    setFeedingStartDateInput('');
    showToast({
      message: t('mealPlanScreen.startDateSaveSuccess'),
      variant: 'success',
    });
  };

  const shiftMonth = (direction: -1 | 1) => {
    const nextMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + direction, 1);
    setDisplayedMonth(nextMonth);
    setIsCalendarExpanded(true);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E1D7F6" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[topStyle, styles.cardStack]}>
          {!profile ? (
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{t('home.profileRequiredTitle')}</Text>
              <Text style={[styles.cardBody, { color: theme.icon }]}>{t('mealPlanScreen.profileFallback')}</Text>
            </View>
          ) : null}

          {profile && !profile.feedingStartDate ? (
            <View style={[styles.card, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: theme.accentSoft }]} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>{t('mealPlanScreen.startDateSetupTitle')}</Text>
              <Text style={[styles.cardBody, { color: theme.icon }]}>{t('mealPlanScreen.startDateSetupBody')}</Text>
              <Text style={[styles.inputLabel, { color: theme.icon }]}>{t('mealPlanScreen.startDateInputLabel')}</Text>
              <TextInput
                value={feedingStartDateInput}
                onChangeText={(value) => setFeedingStartDateInput(normalizeDateInput(value))}
                placeholder={t('mealPlanScreen.startDateInputPlaceholder')}
                placeholderTextColor="#9a9a9a"
                keyboardType="number-pad"
                maxLength={8}
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: '#fffef9' }]}
              />
              <Pressable onPress={() => void handleSaveFeedingStartDate()} style={[styles.primaryButton, { backgroundColor: theme.accent }]}>
                <Text style={styles.primaryButtonText}>{t('mealPlanScreen.startDateSaveButton')}</Text>
              </Pressable>
            </View>
          ) : null}

          {plan ? (
            <View style={[styles.heroCard, styles.decorativeCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
              <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: tones.paper }]} />
              <View style={[styles.decorBubble, styles.decorBubbleBottomLeft, { backgroundColor: theme.accentSoft }]} />
              <View style={styles.heroTopRow}>
                <View style={styles.heroTextWrap}>
                  <View style={[styles.eyebrowChip, { backgroundColor: tones.paper }]}>
                    <Text style={[styles.eyebrowChipText, { color: theme.text }]}>{t('mealPlanScreen.babyStatusEyebrow')}</Text>
                  </View>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>{t('mealPlanScreen.babyInfoTitle')}</Text>
                  <Text style={[styles.cardBody, { color: theme.icon }]}>
                    {buildBabyInfoSummary(plan.summary.calendarAgeDays, plan.summary.feedingWeek, profile)}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </Animated.View>

        <Animated.View style={[sectionsStyle, styles.cardStack]}>
          {plan ? (
          <View style={[styles.card, styles.decorativeCard, { backgroundColor: tones.lavender, borderColor: theme.border }]}>
            <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: tones.paper }]} />
            <View style={[styles.decorBubble, styles.decorBubbleBottomLeft, { backgroundColor: '#f0e8ff' }]} />
            <View style={[styles.eyebrowChip, { backgroundColor: tones.paper }]}>
              <Text style={[styles.eyebrowChipText, { color: theme.text }]}>{t('mealPlanScreen.todayEyebrow')}</Text>
            </View>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{t('mealPlanScreen.todayGuideTitle')}</Text>
            <Text style={[styles.cardBody, { color: theme.icon }]}>{t('mealPlanScreen.todayHint')}</Text>
            {plan.today.meals.length ? (
              <View style={styles.todaySummaryList}>
                {plan.today.meals.map((meal) => (
                  <View
                    key={`today-${meal.slot}`}
                    style={[styles.todaySummaryItem, { backgroundColor: '#F6F0FF', borderColor: theme.border }]}>
                    <View style={styles.todaySummaryTopRow}>
                      <Text style={[styles.todaySummaryTitle, { color: theme.text }]}>{meal.title}</Text>
                      <View style={[styles.timePill, { backgroundColor: theme.accentSoft }]}>
                        <Text style={[styles.todaySummaryTime, { color: theme.text }]}>{meal.timeLabel}</Text>
                      </View>
                    </View>
                    <Text style={[styles.todaySummaryIngredients, { color: theme.text }]}>
                      {meal.ingredientNames.join(' + ') || t('mealPlanScreen.todayEmpty')}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[styles.cardBody, { color: theme.icon }]}>{t('mealPlanScreen.todayEmpty')}</Text>
            )}
          </View>
        ) : null}

        <View style={[styles.card, styles.decorativeCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
          <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: tones.paper }]} />
          <View style={styles.calendarHeader}>
            <View style={[styles.calendarMonthChip, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <Text style={[styles.calendarMonthText, { color: theme.text }]}>{formatMonthLabel(displayedMonth)}</Text>
            </View>
            <View style={styles.calendarArrowGroup}>
              <Pressable
                onPress={() => shiftMonth(-1)}
                style={[styles.calendarArrow, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                <Text style={[styles.calendarArrowText, { color: theme.text }]}>{'‹'}</Text>
              </Pressable>
              <Pressable
                onPress={() => shiftMonth(1)}
                style={[styles.calendarArrow, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                <Text style={[styles.calendarArrowText, { color: theme.text }]}>{'›'}</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.weekdayRow}>
            {weekdays.map((label) => (
              <Text key={label} style={[styles.weekdayText, { color: theme.icon }]}>
                {label}
              </Text>
            ))}
          </View>

          {isCalendarExpanded ? (
            <View style={styles.monthGrid}>
              {monthDates.map((date) => {
                const isCurrentMonth = date.getMonth() === displayedMonth.getMonth();
                const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const hasPlan = planDateSet.has(isoDate);
                return (
                  <Pressable
                    key={`month-${date.toISOString()}`}
                    onPress={() => {
                      setSelectedDate(date);
                      setDisplayedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                    }}
                    style={styles.monthCell}>
                    <View
                      style={[
                        styles.dayBubble,
                        isCurrentMonth ? null : styles.dayBubbleMuted,
                        isSameDate(date, selectedDate) ? styles.dayBubbleActive : null,
                      ]}>
                      <Text
                        style={[
                          styles.dayText,
                          { color: isSameDate(date, selectedDate) ? '#ffffff' : isCurrentMonth ? theme.text : '#b9b2aa' },
                        ]}>
                        {date.getDate()}
                      </Text>
                      <View style={[styles.dayDot, styles.dayDotInBubble, { backgroundColor: hasPlan ? '#D9A86C' : 'transparent' }]} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.weekGrid}>
              {weekDates.map((date) => (
                (() => {
                  const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  const hasPlan = planDateSet.has(isoDate);
                  return (
                    <Pressable
                      key={`week-${date.toISOString()}`}
                      onPress={() => {
                        setSelectedDate(date);
                        setDisplayedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                      }}
                      style={styles.dayCell}>
                      <View style={[styles.dayBubble, isSameDate(date, selectedDate) ? styles.dayBubbleActive : null]}>
                        <Text style={[styles.dayText, { color: isSameDate(date, selectedDate) ? '#ffffff' : theme.text }]}>
                          {date.getDate()}
                        </Text>
                        <View style={[styles.dayDot, styles.dayDotInBubble, { backgroundColor: hasPlan ? '#D9A86C' : 'transparent' }]} />
                      </View>
                    </Pressable>
                  );
                })()
              ))}
            </View>
          )}
          <Pressable
            onPress={() => setIsCalendarExpanded((value) => !value)}
            style={[styles.calendarExpandButton, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <MaterialIcons
              name={isCalendarExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={18}
              color={theme.text}
            />
            <Text style={[styles.calendarExpandButtonText, { color: theme.text }]}>
              {isCalendarExpanded ? t('mealPlanScreen.foldButton') : t('mealPlanScreen.expandButton')}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
          <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: theme.accentSoft }]} />
          <View style={[styles.eyebrowChip, { backgroundColor: theme.accentSoft }]}>
            <Text style={[styles.eyebrowChipText, { color: theme.text }]}>{t('mealPlanScreen.selectedDayEyebrow')}</Text>
          </View>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{formatDisplayDate(selectedDate)}</Text>
          {selectedDayPlan ? (
            <View style={styles.mealList}>
              {selectedDayPlan.meals.map((meal, index) => (
                <View
                  key={`${selectedDayPlan.date}-${meal.slot}`}
                  style={[
                    styles.mealCard,
                    {
                      borderColor: theme.border,
                      backgroundColor: index % 2 === 0 ? '#fff7df' : '#fff4ef',
                    },
                  ]}>
                  <View style={styles.mealHeaderRow}>
                    <View style={styles.mealHeaderTextWrap}>
                      <Text style={[styles.mealTitle, { color: theme.text }]}>{meal.title}</Text>
                      <Text style={[styles.mealTime, { color: theme.icon }]}>{meal.timeLabel}</Text>
                    </View>
                    {meal.containsNewIngredient ? (
                      <View style={[styles.newBadge, { backgroundColor: theme.accentSoft }]}>
                        <Text style={[styles.newBadgeText, { color: theme.text }]}>{t('mealPlanScreen.newIngredientBadge')}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.mealIngredients, { color: theme.text }]}>{meal.ingredientNames.join(' + ') || t('mealPlanScreen.todayEmpty')}</Text>
                  <Text style={[styles.mealNote, { color: theme.icon }]}>
                    {t('mealPlanScreen.noteLabel')}: {mealNoteLabel(meal.noteType)}
                  </Text>
                  <View style={styles.actionRow}>
                    <Pressable
                      onPress={() => handleFedFromPlan(selectedDayPlan.date, meal.slot, meal.ingredientNames, meal.timeLabel)}
                      style={[styles.actionButton, { backgroundColor: theme.accent }]}>
                      <Text style={styles.actionButtonText}>{t('mealPlanScreen.fedButton')}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleFedFromPlan(selectedDayPlan.date, meal.slot, meal.ingredientNames, meal.timeLabel)}
                      style={[styles.actionButton, { backgroundColor: tones.lavender }]}>
                      <Text style={styles.actionButtonText}>{t('mealPlanScreen.switchToRecordButton')}</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.cardBody, { color: theme.icon }]}>{t('mealPlanScreen.todayEmpty')}</Text>
          )}
        </View>

        {plan ? (
          <>
            <View style={[styles.card, styles.decorativeCard, { backgroundColor: '#fff7ec', borderColor: theme.border }]}>
              <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: tones.blush }]} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>{t('mealPlanScreen.weekPlanTitle')}</Text>
              <View style={styles.weekPlanList}>
                {plan.week.map((day) => (
                  <View key={day.date} style={[styles.weekPlanRow, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.weekPlanDate, { color: theme.text }]}>{formatDisplayDate(day.date)}</Text>
                    <View style={styles.weekPlanMeals}>
                      {day.meals.map((meal) => (
                        <Text key={`${day.date}-${meal.slot}`} style={[styles.weekPlanMeal, { color: theme.icon }]}>
                          {meal.title} · {meal.ingredientNames.join(' + ')}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.card, styles.decorativeCard, { backgroundColor: '#f7f1ff', borderColor: theme.border }]}>
              <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: tones.paper }]} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>{t('mealPlanScreen.insightTitle')}</Text>
              <View style={styles.reasonList}>
                {plan.recommendationReasonKeys.map((reasonKey) => (
                  <Text key={reasonKey} style={[styles.reasonItem, { color: theme.icon }]}>
                    - {reasonLabel(reasonKey)}
                  </Text>
                ))}
              </View>
            </View>
          </>
        ) : null}
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
  heroCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 14,
  },
  decorBubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.8,
  },
  decorBubbleTopRight: {
    width: 110,
    height: 110,
    right: -28,
    top: -24,
  },
  decorBubbleBottomLeft: {
    width: 88,
    height: 88,
    left: -24,
    bottom: -26,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroTextWrap: {
    flex: 1,
    gap: 6,
  },
  eyebrowChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 2,
  },
  eyebrowChipText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 12,
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
  inputLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    minHeight: Spacing.formControlMinHeight,
    borderRadius: Spacing.formControlRadius,
    paddingHorizontal: Spacing.formControlHorizontal,
    paddingVertical: Spacing.formControlVertical,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  primaryButton: {
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  calendarMonthChip: {
    minHeight: 38,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  calendarMonthText: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  calendarArrowGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  calendarArrow: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarArrowText: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '700',
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  weekGrid: {
    flexDirection: 'row',
    gap: 2,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
  },
  dayCell: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCell: {
    width: '14.28%',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBubble: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1ef',
    position: 'relative',
  },
  dayBubbleMuted: {
    opacity: 0.5,
  },
  dayBubbleActive: {
    backgroundColor: '#f57c4a',
  },
  calendarExpandButton: {
    alignSelf: 'center',
    minHeight: Spacing.compactButtonMinHeight,
    borderRadius: Spacing.chipRadius,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  calendarExpandButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  dayText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
  },
  dayDotInBubble: {
    position: 'absolute',
    bottom: 4,
    alignSelf: 'center',
  },
  mealList: {
    gap: 10,
  },
  todaySummaryList: {
    gap: 10,
  },
  todaySummaryItem: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 6,
  },
  todaySummaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  todaySummaryTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
  },
  todaySummaryTime: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  timePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  todaySummaryIngredients: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  mealCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 10,
  },
  mealHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  mealHeaderTextWrap: {
    gap: 2,
  },
  mealTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  mealTime: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  newBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  newBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  mealIngredients: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  mealNote: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  weekPlanList: {
    gap: 2,
  },
  weekPlanRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 6,
  },
  weekPlanDate: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
  },
  weekPlanMeals: {
    gap: 4,
  },
  weekPlanMeal: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  reasonList: {
    gap: 6,
  },
  reasonItem: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
});

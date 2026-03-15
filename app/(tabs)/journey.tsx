/**
 * 기록 탭 메인 화면.
 *
 * 역할:
 * - 주간/월간 달력과 날짜별 이유식 기록 목록, 상세 팝업을 제공한다.
 * - 빠른 조회와 수정 진입이 핵심인 기록 허브 화면이다.
 *
 * 유지보수 포인트:
 * - 달력 선택 상태와 기록 필터 상태는 항상 같은 날짜 소스를 바라보게 유지해야 한다.
 */
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageBackground } from '@/components/design-system/page-background';
import { t, tList } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, DecorativeTones, Fonts } from '@/constants/theme';
import type {
  FeedingRecord,
  ReactionType,
} from '@/features/records/model';
import {
  deleteFeedingRecord,
  listFeedingRecords,
} from '@/features/records/repository';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';
import { useToast } from '@/hooks/use-toast';
import { formatDisplayDate, formatDisplayDateWithWeekday } from '@/utils/date';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function formatDateLabel(dateTime: string): string {
  const parsed = new Date(dateTime);
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatTimeLabel(dateTime: string): string {
  const parsed = new Date(dateTime);
  return `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
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

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMonthLabel(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function formatSelectedDateMeta(date: Date): string {
  return formatDisplayDateWithWeekday(date);
}

function isTodayDate(date: Date): boolean {
  return isSameDate(date, new Date());
}

function reactionLabel(value: ReactionType): string {
  switch (value) {
    case 'NONE':
      return t('journeyScreen.reactionTypeNone');
    case 'NORMAL':
      return t('journeyScreen.reactionTypeNormal');
    case 'FUSSY':
      return t('journeyScreen.reactionTypeFussy');
    case 'VOMIT':
      return t('journeyScreen.reactionTypeVomit');
    case 'RASH':
      return t('journeyScreen.reactionTypeRash');
  }
}

function amountSummary(record: FeedingRecord): string {
  if (record.amountType === 'GRAM') {
    return record.amountGram ? `${record.amountGram}g` : t('journeyScreen.amountSummaryNone');
  }

  switch (record.amountLevel) {
    case 'HIGH':
      return t('journeyScreen.amountLevelHigh');
    case 'LOW':
      return t('journeyScreen.amountLevelLow');
    case 'MEDIUM':
    default:
      return t('journeyScreen.amountLevelMedium');
  }
}

function ingredientSummary(record: FeedingRecord): string {
  if (record.ingredients.length === 0) return '';
  if (record.ingredients.length === 1) return record.ingredients[0]?.ingredientName ?? '';
  return `${record.ingredients[0]?.ingredientName ?? ''} + ${record.ingredients.length - 1}`;
}

export default function JourneyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { showToast } = useToast();
  const tones = DecorativeTones;
  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<FeedingRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayedMonth, setDisplayedMonth] = useState(new Date());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();

  const loadRecords = useCallback(async () => {
    const nextRecords = await listFeedingRecords();
    setRecords(nextRecords);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadRecords();
    }, [loadRecords])
  );

  const selectedDateIso = useMemo(() => toIsoDate(selectedDate), [selectedDate]);
  const selectedDateRecords = useMemo(
    () => records.filter((record) => formatDateLabel(record.dateTime) === selectedDateIso),
    [records, selectedDateIso]
  );
  const monthGridDates = useMemo(() => getMonthGridDates(displayedMonth), [displayedMonth]);
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
  const weekdays = tList('home.weekdays');
  const recordDateSet = useMemo(
    () => new Set(records.map((record) => formatDateLabel(record.dateTime))),
    [records]
  );

  const openCreate = () => {
    setSelectedRecord(null);
    router.push('/record-editor');
  };

  const openEdit = (record: FeedingRecord) => {
    setSelectedRecord(null);
    router.push({ pathname: '/record-editor', params: { recordId: record.id } });
  };

  const handleDelete = (record: FeedingRecord) => {
    Alert.alert(t('journeyScreen.deleteConfirmTitle'), t('journeyScreen.deleteConfirmMessage'), [
      { text: t('journeyScreen.cancel'), style: 'cancel' },
      {
        text: t('journeyScreen.deleteConfirmAction'),
        style: 'destructive',
        onPress: () => {
          void (async () => {
            await deleteFeedingRecord(record.id);
            await loadRecords();
            setSelectedRecord(null);
            showToast({
              message: t('journeyScreen.deleteSuccess'),
              variant: 'success',
            });
          })();
        },
      },
    ]);
  };

  const shiftMonth = (direction: -1 | 1) => {
    const nextMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + direction, 1);
    setDisplayedMonth(nextMonth);
    setIsCalendarExpanded(true);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F2DDD4" middleColor="#E4DCF6" bottomColor="#F3EBD6" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[topStyle, styles.topStack]}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextWrap}>
              <Text style={[styles.screenTitle, { color: theme.text }]}>{t('journeyScreen.title')}</Text>
              <Text style={[styles.screenSubtitle, { color: theme.icon }]}>{t('journeyScreen.subtitle')}</Text>
            </View>
            <Pressable onPress={openCreate} style={[styles.primaryButton, { backgroundColor: theme.accent }]}>
              <Text style={styles.primaryButtonText}>{t('journeyScreen.addButton')}</Text>
            </Pressable>
          </View>
          <View style={[styles.calendarCard, styles.decorativeCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
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

            <View style={styles.calendarWeekdayRow}>
              {weekdays.map((label, index) => (
                <Text key={`${label}-${index}`} style={[styles.calendarWeekdayText, { color: theme.icon }]}>
                  {label}
                </Text>
              ))}
            </View>

            <View style={isCalendarExpanded ? styles.calendarMonthGrid : styles.calendarWeekRow}>
              {(isCalendarExpanded ? monthGridDates : weekDates).map((date) => {
                const iso = toIsoDate(date);
                const isSelected = isSameDate(date, selectedDate);
                const isCurrentMonth = date.getMonth() === displayedMonth.getMonth();
                const hasRecord = recordDateSet.has(iso);

                return (
                  <Pressable
                    key={iso}
                    onPress={() => {
                      setSelectedDate(date);
                      setDisplayedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                    }}
                    style={[
                      styles.calendarDayCell,
                      isCalendarExpanded ? styles.calendarDayCellMonth : styles.calendarDayCellWeek,
                    ]}>
                    <View
                      style={[
                        styles.calendarDayBubble,
                        !isCurrentMonth && isCalendarExpanded ? styles.calendarDayBubbleMuted : null,
                        isSelected ? styles.calendarDayBubbleActive : null,
                      ]}>
                      <Text
                        style={[
                          styles.calendarDayText,
                          {
                            color: isSelected ? '#ffffff' : isCurrentMonth ? theme.text : theme.tabIconDefault,
                          },
                        ]}>
                        {date.getDate()}
                      </Text>
                      <View
                        style={[
                          styles.calendarDot,
                          styles.calendarDotInBubble,
                          { backgroundColor: hasRecord ? '#59d6d0' : 'transparent' },
                        ]}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Animated.View>

        <Animated.View style={sectionsStyle}>
        <View style={[styles.sectionCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
          <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: theme.accentSoft }]} />
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDateWrap}>
              <Text style={[styles.sectionDateNumber, { color: theme.text }]}>{selectedDate.getDate()}</Text>
              <View style={styles.sectionDateMetaWrap}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {isTodayDate(selectedDate) ? t('journeyScreen.todayLabel') : formatSelectedDateMeta(selectedDate)}
                </Text>
                <Text style={[styles.sectionSubText, { color: theme.icon }]}>
                  {selectedDateRecords.length === 0
                    ? t('journeyScreen.emptyBody')
                    : t('journeyScreen.recordCount', { count: selectedDateRecords.length })}
                </Text>
              </View>
            </View>
          </View>

          {selectedDateRecords.length === 0 ? (
            <View style={[styles.emptyWrap, styles.emptyCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('journeyScreen.emptyTitle')}</Text>
              <Text style={[styles.emptyBody, { color: theme.icon }]}>{t('journeyScreen.emptyBody')}</Text>
              <Pressable onPress={openCreate} style={[styles.emptyButton, { backgroundColor: theme.accentSoft }]}>
                <Text style={styles.emptyButtonText}>{t('journeyScreen.emptyAction')}</Text>
              </Pressable>
            </View>
          ) : (
            selectedDateRecords.map((record) => (
              <Pressable
                key={record.id}
                onPress={() => setSelectedRecord(record)}
                style={[
                  styles.recordItem,
                  styles.decorativeCard,
                  {
                    borderColor: theme.border,
                    backgroundColor: record.reactionType === 'NONE' ? '#fff7df' : '#fff1eb',
                  },
                ]}>
                <View
                  style={[
                    styles.decorBubble,
                    styles.recordDecorBubble,
                    { backgroundColor: record.reactionType === 'NONE' ? tones.paper : tones.blush },
                  ]}
                />
                <View style={styles.recordTopRow}>
                  <Text style={[styles.recordTime, { color: theme.text }]}>{formatTimeLabel(record.dateTime)}</Text>
                  <View style={[styles.reactionBadge, { backgroundColor: theme.accentSoft }]}>
                    <Text style={[styles.reactionBadgeText, { color: theme.text }]}>
                      {reactionLabel(record.reactionType)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.recordIngredients, { color: theme.text }]}>{ingredientSummary(record)}</Text>
                <Text style={[styles.recordMeta, { color: theme.icon }]}>{amountSummary(record)}</Text>
              </Pressable>
            ))
          )}
        </View>
        </Animated.View>
      </ScrollView>

      <Modal visible={selectedRecord !== null} transparent animationType="fade" onRequestClose={() => setSelectedRecord(null)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.detailCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            {selectedRecord ? (
              <>
                <View style={[styles.decorBubble, styles.detailDecorBubble, { backgroundColor: tones.lavender }]} />
                <View style={styles.detailHeader}>
                  <View style={styles.detailHeaderTextWrap}>
                    <View style={[styles.eyebrowChip, { backgroundColor: theme.accentSoft }]}>
                      <Text style={[styles.eyebrowChipText, { color: theme.text }]}>{t('journeyScreen.detailTitle')}</Text>
                    </View>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>
                      {selectedRecord.ingredients.map((item) => item.ingredientName).join(', ')}
                    </Text>
                  </View>
                  <View style={[styles.reactionBadge, { backgroundColor: theme.accentSoft }]}>
                    <Text style={[styles.reactionBadgeText, { color: theme.text }]}>
                      {reactionLabel(selectedRecord.reactionType)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.detailSummaryCard, { backgroundColor: '#FFF7EA', borderColor: '#F0D7AE' }]}>
                  <Text style={[styles.detailSummaryText, { color: theme.text }]}>
                    {formatDisplayDate(selectedRecord.dateTime)} · {formatTimeLabel(selectedRecord.dateTime)}
                  </Text>
                  <Text style={[styles.detailSummarySubtext, { color: theme.icon }]}>{amountSummary(selectedRecord)}</Text>
                </View>

                <View style={styles.detailMetaGrid}>
                  <View style={[styles.detailMetaCard, { backgroundColor: '#FFFDFC', borderColor: theme.border }]}>
                    <Text style={[styles.detailMetaLabel, { color: theme.icon }]}>{t('journeyScreen.dateLabel')}</Text>
                    <Text style={[styles.detailMetaValue, { color: theme.text }]}>{formatDisplayDate(selectedRecord.dateTime)}</Text>
                  </View>
                  <View style={[styles.detailMetaCard, { backgroundColor: '#FFFDFC', borderColor: theme.border }]}>
                    <Text style={[styles.detailMetaLabel, { color: theme.icon }]}>{t('journeyScreen.timeLabel')}</Text>
                    <Text style={[styles.detailMetaValue, { color: theme.text }]}>{formatTimeLabel(selectedRecord.dateTime)}</Text>
                  </View>
                  <View style={[styles.detailMetaCard, { backgroundColor: '#FFFDFC', borderColor: theme.border }]}>
                    <Text style={[styles.detailMetaLabel, { color: theme.icon }]}>{t('journeyScreen.ingredientsLabel')}</Text>
                    <Text style={[styles.detailMetaValue, { color: theme.text }]} numberOfLines={2}>
                      {selectedRecord.ingredients.map((item) => item.ingredientName).join(', ')}
                    </Text>
                  </View>
                  <View style={[styles.detailMetaCard, { backgroundColor: '#FFFDFC', borderColor: theme.border }]}>
                    <Text style={[styles.detailMetaLabel, { color: theme.icon }]}>{t('journeyScreen.amountLabel')}</Text>
                    <Text style={[styles.detailMetaValue, { color: theme.text }]}>{amountSummary(selectedRecord)}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailSectionLabel, { color: theme.icon }]}>{t('journeyScreen.noteLabel')}</Text>
                  <View style={[styles.detailNoteCard, { backgroundColor: '#FFFDFC', borderColor: theme.border }]}>
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      {selectedRecord.note || '-'}
                    </Text>
                  </View>
                </View>

                {selectedRecord.photoUrl ? (
                  <View style={styles.detailSection}>
                    <Text style={[styles.detailSectionLabel, { color: theme.icon }]}>{t('journeyScreen.photoLabel')}</Text>
                    <Image source={{ uri: selectedRecord.photoUrl }} style={styles.detailPhoto} contentFit="cover" />
                  </View>
                ) : (
                  <Text style={[styles.helperText, { color: theme.icon }]}>{t('journeyScreen.noPhoto')}</Text>
                )}

                <View style={styles.detailActions}>
                  <Pressable onPress={() => openEdit(selectedRecord)} style={[styles.detailIconAction, { backgroundColor: theme.accentSoft }]}>
                    <MaterialIcons name="edit" size={20} color={theme.text} />
                  </Pressable>
                  <Pressable onPress={() => handleDelete(selectedRecord)} style={[styles.detailIconAction, { backgroundColor: '#f4d7d0' }]}>
                    <MaterialIcons name="delete-outline" size={20} color={theme.text} />
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => setSelectedRecord(null)}
                  style={[styles.detailCloseButton, { backgroundColor: '#FFF7EA', borderColor: theme.border }]}>
                  <Text style={[styles.detailCloseButtonText, { color: theme.text }]}>{t('journeyScreen.cancel')}</Text>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
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
    opacity: 0.8,
  },
  decorBubbleTopRight: {
    width: 110,
    height: 110,
    right: -28,
    top: -24,
  },
  recordDecorBubble: {
    width: 78,
    height: 78,
    right: -16,
    top: -22,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  topStack: {
    gap: Spacing.cardStackGap,
  },
  headerTextWrap: {
    flex: 1,
    gap: 6,
  },
  screenTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 28,
    fontWeight: '700',
  },
  screenSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  bannerCard: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bannerText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  calendarCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 14,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarMonthChip: {
    minHeight: 38,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
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
  calendarMonthText: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  calendarWeekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: 2,
  },
  calendarWeekdayText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  calendarWeekRow: {
    flexDirection: 'row',
    gap: 2,
  },
  calendarMonthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
  },
  calendarDayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  calendarDayCellWeek: {
    flex: 1,
  },
  calendarDayCellMonth: {
    width: '14.28%',
  },
  calendarDayBubble: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1ef',
    position: 'relative',
  },
  calendarDayBubbleMuted: {
    opacity: 0.5,
  },
  calendarDayBubbleActive: {
    backgroundColor: '#f57c4a',
  },
  calendarDayText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: 999,
  },
  calendarDotInBubble: {
    position: 'absolute',
    bottom: 4,
    alignSelf: 'center',
  },
  sectionHeader: {
    paddingBottom: 4,
  },
  sectionDateWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionDateNumber: {
    fontFamily: Fonts.rounded,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '700',
    minWidth: 34,
  },
  sectionDateMetaWrap: {
    flex: 1,
    gap: 2,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: Spacing.sectionGap,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyWrap: {
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 8,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  emptyTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 6,
    borderRadius: Spacing.compactButtonRadius,
    paddingHorizontal: 14,
    paddingVertical: Spacing.chipVertical,
  },
  emptyButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  recordItem: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 8,
  },
  recordTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordTime: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  reactionBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  reactionBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  recordIngredients: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  recordMeta: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  modalPage: {
    flex: 1,
  },
  modalContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 60,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
  },
  modalCloseText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfField: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  subLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  helperText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  noteInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  fieldBlock: {
    gap: 8,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
  photoButton: {
    minHeight: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 18,
  },
  saveButton: {
    marginTop: 8,
    minHeight: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 28, 28, 0.28)',
    justifyContent: 'center',
    padding: Spacing.screenHorizontal,
  },
  detailCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: Spacing.fieldGap,
  },
  detailDecorBubble: {
    width: 88,
    height: 88,
    right: -18,
    top: -20,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailHeaderTextWrap: {
    flex: 1,
    gap: 8,
  },
  detailSummaryCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  detailSummaryText: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  detailSummarySubtext: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  detailMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailMetaCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  detailMetaLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  detailMetaValue: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  detailSection: {
    gap: 8,
  },
  detailSectionLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  detailNoteCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  detailText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  detailPhoto: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    marginTop: 4,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  detailIconAction: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCloseButton: {
    minHeight: Spacing.compactButtonMinHeight,
    borderWidth: 1,
    borderRadius: Spacing.compactButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  detailCloseButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
});

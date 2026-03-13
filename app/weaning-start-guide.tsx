import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdSlotCard } from '@/components/design-system/ad-slot-card';
import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import {
  STARTER_GUIDE_PARTS,
  type StarterGuideChapterDefinition,
  type StarterGuidePartDefinition,
} from '@/constants/starter-guide';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useBabyProfile } from '@/hooks/use-baby-profile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';
import { useStarterGuideReadiness } from '@/hooks/use-starter-guide-readiness';
import { useStarterGuideProgress } from '@/hooks/use-starter-guide-progress';

type GuideChapter = StarterGuideChapterDefinition & {
  title: string;
  summary: string;
  bullets: string[];
  note: string;
};

type GuidePart = Omit<StarterGuidePartDefinition, 'chapters'> & {
  title: string;
  description: string;
  chapters: GuideChapter[];
};

function findPartByChapterId(parts: GuidePart[], chapterId?: string): GuidePart | undefined {
  return parts.find((part) => part.chapters.some((chapter) => chapter.id === chapterId));
}

function findChapterById(parts: GuidePart[], chapterId?: string): GuideChapter | undefined {
  return parts.flatMap((part) => part.chapters).find((chapter) => chapter.id === chapterId);
}

function getChapterOrder(parts: GuidePart[]): GuideChapter[] {
  return parts.flatMap((part) => part.chapters);
}

export default function WeaningStartGuideScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();
  const { profile, isLoading: isProfileLoading } = useBabyProfile();
  const { progress, isLoading, toggleBookmark, toggleRead, setLastChapter } = useStarterGuideProgress();
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
    peach: '#FFF1E5',
  };

  const parts = useMemo<GuidePart[]>(
    () =>
      STARTER_GUIDE_PARTS.map((part) => ({
        ...part,
        title: t(part.titleKey),
        description: t(part.descriptionKey),
        chapters: part.chapters.map((chapter) => ({
          ...chapter,
          title: t(chapter.titleKey),
          summary: t(chapter.summaryKey),
          bullets: chapter.bulletKeys.map((key) => t(key)),
          note: t(chapter.noteKey),
        })),
      })),
    []
  );

  const allChapters = useMemo(() => getChapterOrder(parts), [parts]);
  const initialChapter = useMemo(
    () => findChapterById(parts, progress.lastChapterId) ?? parts[0]?.chapters[0],
    [parts, progress.lastChapterId]
  );

  const [selectedPartId, setSelectedPartId] = useState(parts[0]?.id ?? '');
  const [selectedChapterId, setSelectedChapterId] = useState(initialChapter?.id ?? '');

  useEffect(() => {
    if (!initialChapter) return;

    setSelectedChapterId((current) => current || initialChapter.id);
    setSelectedPartId((current) => current || findPartByChapterId(parts, initialChapter.id)?.id || parts[0]?.id || '');
  }, [initialChapter, parts]);

  const selectedPart: GuidePart | undefined = parts.find((part) => part.id === selectedPartId) ?? parts[0];
  const selectedChapter: GuideChapter | undefined =
    selectedPart?.chapters.find((chapter) => chapter.id === selectedChapterId) ??
    findChapterById(parts, selectedChapterId) ??
    selectedPart?.chapters[0];

  useEffect(() => {
    if (!selectedChapter) return;
    void setLastChapter(selectedChapter.id);
  }, [selectedChapter, setLastChapter]);

  const bookmarkedChapters = useMemo(
    () => allChapters.filter((chapter) => progress.bookmarkedChapterIds.includes(chapter.id)),
    [allChapters, progress.bookmarkedChapterIds]
  );

  const readCount = progress.readChapterIds.length;
  const totalCount = allChapters.length;
  const currentIndex = selectedChapter ? allChapters.findIndex((chapter) => chapter.id === selectedChapter.id) : -1;
  const nextChapter = currentIndex >= 0 ? allChapters[currentIndex + 1] : undefined;
  const isCurrentRead = selectedChapter ? progress.readChapterIds.includes(selectedChapter.id) : false;
  const isCurrentBookmarked = selectedChapter ? progress.bookmarkedChapterIds.includes(selectedChapter.id) : false;
  const {
    ageInMonths,
    isReadinessChecklistComplete,
    positiveChecklistCount,
    readinessItems,
    readinessStatus,
    readinessStatusCopy,
  } = useStarterGuideReadiness({
    birthDate: profile?.birthDate,
    readinessCheckedIds: progress.readinessCheckedIds,
  });
  const readinessStatusTone = useMemo(() => {
    switch (readinessStatus) {
      case 'ready':
        return tones.cream;
      case 'almost':
        return tones.peach;
      case 'wait':
        return tones.blush;
      case 'unknown':
      default:
        return tones.lavender;
    }
  }, [readinessStatus, tones.blush, tones.cream, tones.lavender, tones.peach]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/more');
  };

  const handleOpenReadinessChecklist = () => {
    if (isProfileLoading) return;

    if (!profile?.birthDate) {
      router.push({
        pathname: '/profile-editor',
        params: { returnTo: '/weaning-readiness-checklist' },
      });
      return;
    }

    router.push('/weaning-readiness-checklist');
  };

  const handleSelectPart = (partId: string) => {
    setSelectedPartId(partId);
    const part = parts.find((item) => item.id === partId);
    if (!part) return;

    const bookmarkedInPart = part.chapters.find((chapter) => progress.bookmarkedChapterIds.includes(chapter.id));
    const readInPart = part.chapters.find((chapter) => progress.readChapterIds.includes(chapter.id));
    const next = bookmarkedInPart ?? readInPart ?? part.chapters[0];
    if (next) {
      setSelectedChapterId(next.id);
      void setLastChapter(next.id);
    }
  };

  const handleSelectChapter = (chapter: GuideChapter) => {
    setSelectedChapterId(chapter.id);
    const part = findPartByChapterId(parts, chapter.id);
    if (part) {
      setSelectedPartId(part.id);
    }
    void setLastChapter(chapter.id);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[topStyle, styles.cardStack]}>
          <HeroHeaderCard
            title={t('starterGuideScreen.title')}
            subtitle={t('starterGuideScreen.subtitle')}
            eyebrow={t('starterGuideScreen.eyebrow')}
            onBack={goBack}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />

          <View style={[styles.readinessCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <View style={[styles.decorBubble, styles.readinessBubbleTop, { backgroundColor: tones.cream }]} />
            <View style={[styles.decorBubble, styles.readinessBubbleBottom, { backgroundColor: tones.lavender }]} />

            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.readinessTitle')}</Text>
              <Text style={[styles.sectionBody, { color: theme.icon }]}>{t('starterGuideScreen.readinessSummaryBody')}</Text>
            </View>

            <View style={[styles.readinessStatusCard, { backgroundColor: readinessStatusTone, borderColor: theme.border }]}>
              <View style={styles.readinessStatusHeader}>
                <View style={styles.readinessStatusTitleWrap}>
                  <Text style={[styles.readinessStatusTitle, { color: theme.text }]}>{readinessStatusCopy.title}</Text>
                  <Text style={[styles.readinessStatusBody, { color: theme.icon }]}>{readinessStatusCopy.body}</Text>
                </View>
                <View style={[styles.progressBadge, { backgroundColor: theme.accentSoft }]}>
                  <Text style={[styles.progressBadgeText, { color: theme.text }]}>
                    {t('starterGuideScreen.readinessSignalsLabel', {
                      count: positiveChecklistCount,
                      total: readinessItems.length,
                    })}
                  </Text>
                </View>
              </View>

              <View style={styles.readinessMetaRow}>
                <View style={[styles.readinessMetaCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                  <Text style={[styles.metaLabel, { color: theme.icon }]}>{t('starterGuideScreen.readinessAutoBadge')}</Text>
                  <Text style={[styles.readinessMetaValue, { color: theme.text }]}>
                    {ageInMonths === null
                      ? t('starterGuideScreen.readinessAgeUnknown')
                      : t('starterGuideScreen.readinessAgeKnown', { months: ageInMonths })}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailFooter}>
              <Pressable
                onPress={handleOpenReadinessChecklist}
                style={[styles.primaryAction, { backgroundColor: theme.accent }]}>
                <Text style={styles.primaryActionText}>
                  {isReadinessChecklistComplete
                    ? t('starterGuideScreen.readinessReopenAction')
                    : t('starterGuideScreen.readinessOpenAction')}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.overviewCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <View style={[styles.decorBubble, styles.overviewBubble, { backgroundColor: tones.cream }]} />
            <View style={styles.overviewHeader}>
              <View>
                <Text style={[styles.overviewTitle, { color: theme.text }]}>{t('starterGuideScreen.progressTitle')}</Text>
                <Text style={[styles.overviewBody, { color: theme.icon }]}>
                  {isLoading
                    ? t('starterGuideScreen.loadingBody')
                    : t('starterGuideScreen.progressBody', { read: readCount, total: totalCount })}
                </Text>
              </View>
              <View style={[styles.progressBadge, { backgroundColor: theme.accentSoft }]}>
                <Text style={[styles.progressBadgeText, { color: theme.text }]}>
                  {t('starterGuideScreen.progressBadge', { percent: Math.round((readCount / Math.max(totalCount, 1)) * 100) })}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={[styles.metaCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                <Text style={[styles.metaLabel, { color: theme.icon }]}>{t('starterGuideScreen.readCountLabel')}</Text>
                <Text style={[styles.metaValue, { color: theme.text }]}>{readCount}</Text>
              </View>
              <View style={[styles.metaCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
                <Text style={[styles.metaLabel, { color: theme.icon }]}>{t('starterGuideScreen.bookmarkCountLabel')}</Text>
                <Text style={[styles.metaValue, { color: theme.text }]}>{progress.bookmarkedChapterIds.length}</Text>
              </View>
              <View style={[styles.metaCard, { backgroundColor: tones.peach, borderColor: theme.border }]}>
                <Text style={[styles.metaLabel, { color: theme.icon }]}>{t('starterGuideScreen.partCountLabel')}</Text>
                <Text style={[styles.metaValue, { color: theme.text }]}>{parts.length}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[sectionsStyle, styles.cardStack]}>
          {bookmarkedChapters.length > 0 ? (
            <View style={[styles.bookmarkCard, styles.decorativeCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.bookmarkTitle')}</Text>
              <Text style={[styles.sectionBody, { color: theme.icon }]}>{t('starterGuideScreen.bookmarkBody')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookmarkList}>
                {bookmarkedChapters.map((chapter) => (
                  <Pressable
                    key={chapter.id}
                    onPress={() => handleSelectChapter(chapter)}
                    style={[styles.bookmarkChip, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                    <MaterialIcons name="bookmark" size={16} color="#EA7A34" />
                    <Text style={[styles.bookmarkChipText, { color: theme.text }]} numberOfLines={1}>
                      {chapter.title}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View style={[styles.partCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.partTitle')}</Text>
                <Text style={[styles.sectionBody, { color: theme.icon }]}>{t('starterGuideScreen.partBody')}</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.partList}>
              {parts.map((part) => {
                const partReadCount = part.chapters.filter((chapter) => progress.readChapterIds.includes(chapter.id)).length;
                const selected = part.id === selectedPart?.id;

                return (
                  <Pressable
                    key={part.id}
                    onPress={() => handleSelectPart(part.id)}
                    style={[
                      styles.partChip,
                      {
                        backgroundColor: selected ? '#EA7A34' : tones.cream,
                        borderColor: selected ? '#EA7A34' : theme.border,
                      },
                    ]}>
                    <Text style={[styles.partChipTitle, { color: selected ? '#FFFDF8' : theme.text }]}>{part.title}</Text>
                    <Text style={[styles.partChipMeta, { color: selected ? '#FFFDF8' : theme.icon }]}>
                      {t('starterGuideScreen.partChipMeta', { read: partReadCount, total: part.chapters.length })}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={[styles.chapterRailCard, styles.decorativeCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{selectedPart?.title}</Text>
                <Text style={[styles.sectionBody, { color: theme.icon }]}>{selectedPart?.description}</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chapterRail}>
              {selectedPart?.chapters.map((chapter, index) => {
                const isSelected = chapter.id === selectedChapter?.id;
                const isRead = progress.readChapterIds.includes(chapter.id);
                const isBookmarked = progress.bookmarkedChapterIds.includes(chapter.id);

                return (
                  <Pressable
                    key={chapter.id}
                    onPress={() => handleSelectChapter(chapter)}
                    style={[
                      styles.chapterCard,
                      {
                        backgroundColor: isSelected ? tones.paper : '#FFF8EF',
                        borderColor: isSelected ? '#EA7A34' : theme.border,
                      },
                    ]}>
                    <View style={styles.chapterCardTop}>
                      <Text style={[styles.chapterIndex, { color: theme.icon }]}>{t('starterGuideScreen.chapterIndex', { index: index + 1 })}</Text>
                      <View style={styles.chapterStatusRow}>
                        {isRead ? <MaterialIcons name="check-circle" size={16} color="#4B9C68" /> : null}
                        {isBookmarked ? <MaterialIcons name="bookmark" size={16} color="#EA7A34" /> : null}
                      </View>
                    </View>
                    <Text style={[styles.chapterTitle, { color: theme.text }]} numberOfLines={2}>
                      {chapter.title}
                    </Text>
                    <Text style={[styles.chapterSummary, { color: theme.icon }]} numberOfLines={3}>
                      {chapter.summary}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {selectedChapter ? (
            <View style={[styles.chapterDetailCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <View style={styles.chapterDetailHeader}>
                <View style={styles.chapterDetailTextWrap}>
                  <Text style={[styles.chapterDetailEyebrow, { color: theme.icon }]}>{t('starterGuideScreen.chapterDetailEyebrow')}</Text>
                  <Text style={[styles.chapterDetailTitle, { color: theme.text }]}>{selectedChapter.title}</Text>
                  <Text style={[styles.chapterDetailSummary, { color: theme.icon }]}>{selectedChapter.summary}</Text>
                </View>
                <View style={styles.detailActionRow}>
                  <Pressable
                    onPress={() => void toggleBookmark(selectedChapter.id)}
                    style={[
                      styles.iconAction,
                      { backgroundColor: isCurrentBookmarked ? theme.accentSoft : tones.cream, borderColor: theme.border },
                    ]}>
                    <MaterialIcons
                      name={isCurrentBookmarked ? 'bookmark' : 'bookmark-border'}
                      size={18}
                      color={theme.text}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => void toggleRead(selectedChapter.id)}
                    style={[
                      styles.iconAction,
                      { backgroundColor: isCurrentRead ? '#DDEFD8' : tones.cream, borderColor: theme.border },
                    ]}>
                    <MaterialIcons
                      name={isCurrentRead ? 'check-circle' : 'radio-button-unchecked'}
                      size={18}
                      color={isCurrentRead ? '#4B9C68' : theme.text}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.lessonList}>
                {selectedChapter.bullets.map((item, index) => (
                  <View key={`${selectedChapter.id}-${index}`} style={[styles.lessonRow, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                    <View style={[styles.lessonBadge, { backgroundColor: theme.accentSoft }]}>
                      <Text style={[styles.lessonBadgeText, { color: theme.text }]}>{index + 1}</Text>
                    </View>
                    <Text style={[styles.lessonText, { color: theme.text }]}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.noteCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
                <Text style={[styles.noteLabel, { color: theme.text }]}>{t('starterGuideScreen.noteTitle')}</Text>
                <Text style={[styles.noteText, { color: theme.icon }]}>{selectedChapter.note}</Text>
              </View>

              <View style={styles.detailFooter}>
                <Pressable
                  onPress={() => void toggleRead(selectedChapter.id)}
                  style={[styles.primaryAction, { backgroundColor: theme.accent }]}>
                  <Text style={styles.primaryActionText}>
                    {isCurrentRead ? t('starterGuideScreen.markUnread') : t('starterGuideScreen.markRead')}
                  </Text>
                </Pressable>
                {nextChapter ? (
                  <Pressable
                    onPress={() => handleSelectChapter(nextChapter)}
                    style={[styles.secondaryAction, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                    <Text style={[styles.secondaryActionText, { color: theme.text }]}>{t('starterGuideScreen.nextChapter')}</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ) : null}

          <AdSlotCard tone="lavender" />
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
    opacity: 0.8,
  },
  overviewBubble: {
    width: 98,
    height: 98,
    right: -24,
    top: -18,
  },
  readinessBubbleTop: {
    width: 126,
    height: 126,
    top: -30,
    right: -24,
  },
  readinessBubbleBottom: {
    width: 140,
    height: 140,
    bottom: -42,
    left: -34,
    opacity: 0.56,
  },
  overviewCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 14,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  overviewTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  overviewBody: {
    marginTop: 4,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  progressBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  progressBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metaCard: {
    flex: 1,
    minHeight: 76,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 16,
  },
  metaValue: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
  },
  readinessCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 14,
  },
  readinessStatusCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  readinessStatusHeader: {
    gap: 10,
  },
  readinessStatusTitleWrap: {
    gap: 4,
  },
  readinessStatusTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  readinessStatusBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  readinessMetaRow: {
    gap: 10,
  },
  readinessMetaCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  readinessMetaValue: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  profileActionChip: {
    minHeight: Spacing.compactButtonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.compactButtonRadius,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  profileActionChipText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  readinessList: {
    gap: 10,
  },
  readinessItemCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  readinessItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  readinessItemTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  readinessItemTitle: {
    flex: 1,
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  readinessModeChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  readinessModeChipText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  readinessItemBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  readinessSourceRow: {
    gap: 8,
  },
  readinessSourceLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  readinessSourceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  readinessSourceChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  readinessSourceChipText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  cautionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  cautionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cautionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  cautionBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  referenceCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 12,
  },
  referenceList: {
    gap: 10,
  },
  referenceItemCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  referenceItemHeader: {
    gap: 12,
  },
  referenceItemTextWrap: {
    gap: 4,
  },
  referenceOrg: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  referenceTitleText: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  referenceSummary: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  referenceAction: {
    alignSelf: 'flex-start',
    minHeight: Spacing.compactButtonMinHeight,
    borderWidth: 1,
    borderRadius: Spacing.compactButtonRadius,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  referenceActionText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  bookmarkCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.cardPadding,
    gap: 10,
  },
  sectionHeaderRow: {
    gap: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  sectionBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  bookmarkList: {
    gap: 8,
  },
  bookmarkChip: {
    maxWidth: 220,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookmarkChipText: {
    flexShrink: 1,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  partCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.cardPadding,
    gap: 12,
  },
  partList: {
    gap: 10,
  },
  partChip: {
    width: 142,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  partChipTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  partChipMeta: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 16,
  },
  chapterRailCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.cardPadding,
    gap: 12,
  },
  chapterRail: {
    gap: 10,
  },
  chapterCard: {
    width: 196,
    minHeight: 156,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 8,
  },
  chapterCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  chapterStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chapterIndex: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  chapterTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  chapterSummary: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  chapterDetailCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 16,
  },
  chapterDetailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  chapterDetailTextWrap: {
    flex: 1,
    gap: 6,
  },
  chapterDetailEyebrow: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  chapterDetailTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 24,
    fontWeight: '700',
  },
  chapterDetailSummary: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  detailActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconAction: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonList: {
    gap: 10,
  },
  lessonRow: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lessonBadge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  lessonText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  noteCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  noteLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  noteText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  detailFooter: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryAction: {
    flex: 1,
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryActionText: {
    color: '#1C1C1C',
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryAction: {
    minWidth: 112,
    borderWidth: 1,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  secondaryActionText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
});

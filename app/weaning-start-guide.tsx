/**
 * 이유식 시작하기 허브 화면.
 *
 * 역할:
 * - 체크리스트, 학습 현황, 파트 목록, FAQ 미리보기를 한 곳에 모은다.
 * - 긴 학습 콘텐츠로 들어가기 전 사용자가 현재 필요한 진입점을 빠르게 고르게 한다.
 *
 * 유지보수 포인트:
 * - 허브에는 요약 정보만 남기고, 세부 내용은 전용 상세 화면으로 넘기는 구조를 유지한다.
 * - FAQ, 책갈피, 파트 진입 동선이 중복되지 않도록 카드 역할을 명확히 나눠야 한다.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdSlotCard } from '@/components/design-system/ad-slot-card';
import { FoldableCard } from '@/components/design-system/foldable-card';
import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useBabyProfile } from '@/hooks/use-baby-profile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';
import { useStarterGuideContent } from '@/hooks/use-starter-guide-content';
import { useStarterGuideFaq } from '@/hooks/use-starter-guide-faq';
import { useStarterGuideProgress } from '@/hooks/use-starter-guide-progress';
import { useStarterGuideReadiness } from '@/hooks/use-starter-guide-readiness';
import { useStarterGuideSupplies } from '@/hooks/use-starter-guide-supplies';

export default function WeaningStartGuideScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();
  const { profile, isLoading: isProfileLoading } = useBabyProfile();
  const { progress, isLoading } = useStarterGuideProgress();
  const { checkedSuppliesCount, isSuppliesChecklistComplete, suppliesItems } = useStarterGuideSupplies(
    progress.suppliesCheckedIds
  );
  const { isReadinessChecklistComplete, positiveChecklistCount, readinessItems } = useStarterGuideReadiness({
    birthDate: profile?.birthDate,
    readinessCheckedIds: progress.readinessCheckedIds,
  });
  const parts = useStarterGuideContent();
  const { items: faqItems } = useStarterGuideFaq();
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
    peach: '#FFF1E5',
  };

  const allChapters = parts.flatMap((part) => part.chapters);
  const faqPreview = faqItems.slice(0, 5);
  const readCount = progress.readChapterIds.length;
  const totalCount = allChapters.length;
  const isAllChecklistsComplete = isReadinessChecklistComplete && isSuppliesChecklistComplete;
  const recommendedPart =
    profile?.feedingStage === 'MIDDLE'
      ? parts[1]
      : profile?.feedingStage === 'LATE' || profile?.feedingStage === 'COMPLETE'
        ? parts[2]
        : parts[0];
  const recommendedChapters = recommendedPart?.chapters.slice(0, 2) ?? [];

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

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[topStyle, styles.cardStack]}>
          <HeroHeaderCard
            title={t('starterGuideScreen.title')}
            subtitle={t('starterGuideScreen.subtitle')}
            onBack={goBack}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />

          <FoldableCard
            title={t('starterGuideScreen.checklistTitle')}
            theme={theme}
            backgroundColor={tones.paper}
            borderColor={theme.border}
            iconName={isAllChecklistsComplete ? 'check-circle' : 'info-outline'}
            defaultExpanded={!isAllChecklistsComplete}
            style={[styles.decorativeCard, styles.readinessFoldable]}>
            <View style={styles.readinessFoldableContent}>
              <View style={styles.checklistActionCardWrap}>
                <View style={[styles.checklistActionCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                  <View style={[styles.inlineDecorBubble, styles.checklistCardBubble, { backgroundColor: tones.paper }]} />
                  <View style={styles.checklistActionHeader}>
                    <View style={styles.checklistTitleRow}>
                      <View style={[styles.miniIconBadge, { backgroundColor: tones.paper }]}>
                        <MaterialIcons name="wb-twilight" size={16} color={theme.text} />
                      </View>
                      <Text style={[styles.checklistActionTitle, { color: theme.text }]}>
                        {t('starterGuideScreen.readinessChecklistTitle')}
                      </Text>
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
                  <Text style={[styles.sectionBody, { color: theme.icon }]}>{t('starterGuideScreen.readinessSummaryBody')}</Text>
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

                <View style={[styles.checklistActionCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
                  <View style={[styles.inlineDecorBubble, styles.checklistCardBubble, { backgroundColor: tones.paper }]} />
                  <View style={styles.checklistActionHeader}>
                    <View style={styles.checklistTitleRow}>
                      <View style={[styles.miniIconBadge, { backgroundColor: tones.paper }]}>
                        <MaterialIcons name="inventory-2" size={16} color={theme.text} />
                      </View>
                      <Text style={[styles.checklistActionTitle, { color: theme.text }]}>
                        {t('starterGuideScreen.suppliesChecklistTitle')}
                      </Text>
                    </View>
                    <View style={[styles.progressBadge, { backgroundColor: theme.accentSoft }]}>
                      <Text style={[styles.progressBadgeText, { color: theme.text }]}>
                        {t('starterGuideScreen.suppliesProgressLabel', {
                          count: checkedSuppliesCount,
                          total: suppliesItems.length,
                        })}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.sectionBody, { color: theme.icon }]}>
                    {t('starterGuideScreen.suppliesChecklistBody')}
                  </Text>
                  <View style={styles.detailFooter}>
                    <Pressable
                      onPress={() => router.push('/weaning-supplies-checklist')}
                      style={[styles.primaryAction, { backgroundColor: theme.accent }]}>
                      <Text style={styles.primaryActionText}>
                        {isSuppliesChecklistComplete
                          ? t('starterGuideScreen.suppliesReopenAction')
                          : t('starterGuideScreen.suppliesOpenAction')}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </FoldableCard>

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
              <Pressable
                onPress={() => router.push('/weaning-bookmarks')}
                style={[styles.metaCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
                <Text style={[styles.metaLabel, { color: theme.icon }]}>{t('starterGuideScreen.bookmarkCountLabel')}</Text>
                <Text style={[styles.metaValue, { color: theme.text }]}>{progress.bookmarkedChapterIds.length}</Text>
              </Pressable>
              <View style={[styles.metaCard, { backgroundColor: tones.peach, borderColor: theme.border }]}>
                <Text style={[styles.metaLabel, { color: theme.icon }]}>{t('starterGuideScreen.partCountLabel')}</Text>
                <Text style={[styles.metaValue, { color: theme.text }]}>{parts.length}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[sectionsStyle, styles.cardStack]}>
          {recommendedPart ? (
            <View style={[styles.partCard, styles.decorativeCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.recommendedTitle')}</Text>
              <Text style={[styles.sectionBody, { color: theme.icon }]}>
                {t('starterGuideScreen.recommendedBody', { part: recommendedPart.title })}
              </Text>
              <View style={styles.partList}>
                {recommendedChapters.map((chapter) => (
                  <Pressable
                    key={chapter.id}
                    onPress={() => router.push({ pathname: '/weaning-chapter', params: { chapterId: chapter.id } })}
                    style={[styles.partCardItem, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                    <View style={styles.partCardHeader}>
                      <View style={styles.partTextWrap}>
                        <Text style={[styles.partCardTitle, { color: theme.text }]}>{chapter.title}</Text>
                        <Text style={[styles.partCardBody, { color: theme.icon }]}>{chapter.summary}</Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={22} color={theme.icon} />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          <View style={[styles.partCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <View style={[styles.decorBubble, styles.partBubble, { backgroundColor: tones.blush }]} />
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.partTitle')}</Text>
                <Text style={[styles.sectionBody, { color: theme.icon }]}>{t('starterGuideScreen.partBody')}</Text>
              </View>
            </View>

            <View style={styles.partList}>
              {parts.map((part) => {
                const partReadCount = part.chapters.filter((chapter) => progress.readChapterIds.includes(chapter.id)).length;
                return (
                  <Pressable
                    key={part.id}
                    onPress={() => router.push({ pathname: '/weaning-part-guide', params: { partId: part.id } })}
                    style={[styles.partCardItem, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                    <View style={styles.partCardHeader}>
                      <View style={styles.partTextWrap}>
                        <Text style={[styles.partCardTitle, { color: theme.text }]}>{part.title}</Text>
                        <Text style={[styles.partCardBody, { color: theme.icon }]}>{part.description}</Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={22} color={theme.icon} />
                    </View>
                    <Text style={[styles.partCardMeta, { color: theme.icon }]}>
                      {t('starterGuideScreen.partChipMeta', { read: partReadCount, total: part.chapters.length })}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={[styles.faqCard, styles.decorativeCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
            <View style={[styles.decorBubble, styles.faqBubble, { backgroundColor: tones.paper }]} />
            <View style={styles.faqHeader}>
              <View style={[styles.sectionEyebrow, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                <MaterialIcons name="forum" size={14} color={theme.text} />
                <Text style={[styles.sectionEyebrowText, { color: theme.text }]}>FAQ</Text>
              </View>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.faqTitle')}</Text>
                <Text style={[styles.sectionBody, { color: theme.icon }]}>{t('starterGuideScreen.faqBody')}</Text>
              </View>
            </View>

            <View style={styles.faqPreviewList}>
              {faqPreview.map((item) => (
                <FoldableCard
                  key={item.id}
                  title={item.title}
                  theme={theme}
                  backgroundColor={tones.paper}
                  borderColor={theme.border}
                  style={styles.faqPreviewItem}>
                  <Text style={[styles.faqPreviewBody, { color: theme.icon }]}>{item.body}</Text>
                </FoldableCard>
              ))}
            </View>

            <Pressable
              onPress={() => router.push('/weaning-faq')}
              style={[styles.secondaryAction, styles.faqSeeAllAction, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <Text style={[styles.secondaryActionText, { color: theme.text }]}>{t('common.seeAll')}</Text>
            </Pressable>
          </View>

          <AdSlotCard tone="lavender" />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.screenTopPadding,
    paddingBottom: Spacing.screenBottomPadding,
    gap: Spacing.cardStackGap,
  },
  cardStack: { gap: Spacing.cardStackGap },
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
  bookmarkBubble: {
    width: 84,
    height: 84,
    right: -18,
    top: -18,
  },
  partBubble: {
    width: 118,
    height: 118,
    right: -34,
    top: -26,
  },
  faqBubble: {
    width: 96,
    height: 96,
    right: -24,
    top: -24,
  },
  inlineDecorBubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.72,
  },
  checklistCardBubble: {
    width: 76,
    height: 76,
    top: -20,
    right: -12,
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
  readinessFoldable: {
    shadowColor: '#C9B8A4',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  readinessFoldableContent: {
    gap: 12,
  },
  checklistActionCardWrap: {
    gap: 10,
  },
  checklistActionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  checklistActionHeader: {
    gap: 8,
  },
  checklistTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistActionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    gap: 8,
  },
  sectionEyebrow: {
    alignSelf: 'flex-start',
    minHeight: 30,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionEyebrowText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
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
  partCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 12,
  },
  partList: {
    gap: 10,
  },
  partCardItem: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  partCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  partTextWrap: {
    flex: 1,
    gap: 4,
  },
  partCardTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  partCardBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  partCardMeta: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  faqCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 12,
  },
  faqHeader: {
    gap: 4,
  },
  faqPreviewList: {
    gap: 10,
  },
  faqPreviewItem: {
    shadowColor: '#C9B8A4',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  faqPreviewBody: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  detailFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryAction: {
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    color: '#1c1c1c',
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryAction: {
    minHeight: Spacing.compactButtonMinHeight,
    borderWidth: 1,
    borderRadius: Spacing.compactButtonRadius,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  faqSeeAllAction: {
    alignSelf: 'stretch',
  },
});

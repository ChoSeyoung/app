import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStarterGuideContent } from '@/hooks/use-starter-guide-content';
import { useStarterGuideProgress } from '@/hooks/use-starter-guide-progress';

export default function WeaningBookmarksScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const parts = useStarterGuideContent();
  const { progress } = useStarterGuideProgress();
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
  };

  const bookmarkedItems = parts.flatMap((part) =>
    part.chapters
      .filter((chapter) => progress.bookmarkedChapterIds.includes(chapter.id))
      .map((chapter, index) => ({
        partId: part.id,
        partTitle: part.title,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        chapterSummary: chapter.summary,
        chapterIndex: index + 1,
      }))
  );

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/weaning-start-guide');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardStack}>
          <HeroHeaderCard
            title={t('starterGuideScreen.bookmarkTitle')}
            subtitle={t('starterGuideScreen.bookmarkBody')}
            onBack={goBack}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />

          {bookmarkedItems.length > 0 ? (
            bookmarkedItems.map((item) => (
              <Pressable
                key={item.chapterId}
                onPress={() =>
                  router.push({
                    pathname: '/weaning-chapter',
                    params: { partId: item.partId, chapterId: item.chapterId },
                  })
                }
                style={[styles.bookmarkCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                <View style={styles.bookmarkHeader}>
                  <View style={styles.bookmarkTextWrap}>
                    <Text style={[styles.bookmarkPart, { color: theme.icon }]}>{item.partTitle}</Text>
                    <Text style={[styles.bookmarkTitle, { color: theme.text }]}>{item.chapterTitle}</Text>
                    <Text style={[styles.bookmarkSummary, { color: theme.icon }]}>{item.chapterSummary}</Text>
                  </View>
                  <View style={[styles.bookmarkArrowWrap, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                    <MaterialIcons name="chevron-right" size={20} color={theme.icon} />
                  </View>
                </View>

                <View style={styles.bookmarkMetaRow}>
                  <View style={[styles.bookmarkMetaChip, { backgroundColor: tones.blush, borderColor: theme.border }]}>
                    <MaterialIcons name="bookmark" size={14} color="#EA7A34" />
                    <Text style={[styles.bookmarkMetaText, { color: theme.text }]}>
                      {t('starterGuideScreen.chapterIndex', { index: item.chapterIndex })}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={[styles.emptyCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('starterGuideScreen.bookmarkEmptyTitle')}</Text>
              <Text style={[styles.emptyBody, { color: theme.icon }]}>{t('starterGuideScreen.bookmarkEmptyBody')}</Text>
            </View>
          )}
        </View>
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
  bookmarkCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 12,
  },
  bookmarkHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  bookmarkTextWrap: {
    flex: 1,
    gap: 4,
  },
  bookmarkPart: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  bookmarkTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  bookmarkSummary: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  bookmarkArrowWrap: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkMetaRow: {
    alignItems: 'flex-start',
  },
  bookmarkMetaChip: {
    minHeight: 30,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookmarkMetaText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  emptyBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
});

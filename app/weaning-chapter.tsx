/**
 * 이유식 가이드 챕터 상세 화면.
 *
 * 역할:
 * - 특정 챕터의 요약, 세부 포인트, 메모성 안내를 읽기 좋은 구조로 보여준다.
 * - 읽음 처리와 책갈피 같은 학습 상태를 직접 바꾸는 최종 읽기 화면이다.
 *
 * 유지보수 포인트:
 * - 챕터 데이터 구조가 바뀌면 이 화면의 섹션 배치와 진행 상태 액션도 함께 검토해야 한다.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, DecorativeTones, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStarterGuideContent } from '@/hooks/use-starter-guide-content';
import { useStarterGuideProgress } from '@/hooks/use-starter-guide-progress';

export default function WeaningChapterScreen() {
  const { partId, chapterId } = useLocalSearchParams<{ partId?: string; chapterId?: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const parts = useStarterGuideContent();
  const { progress, toggleBookmark, toggleRead } = useStarterGuideProgress();
  const tones = DecorativeTones;

  const part = parts.find((item) => item.id === partId) ?? parts[0];
  const chapter = part?.chapters.find((item) => item.id === chapterId) ?? part?.chapters[0];
  const chapterIndex = part?.chapters.findIndex((item) => item.id === chapter?.id) ?? 0;
  const isRead = chapter ? progress.readChapterIds.includes(chapter.id) : false;
  const isBookmarked = chapter ? progress.bookmarkedChapterIds.includes(chapter.id) : false;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({
      pathname: '/weaning-part-guide',
      params: { partId: part?.id },
    });
  };

  if (!part || !chapter) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
        <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardStack}>
          <HeroHeaderCard
            title={chapter.title}
            subtitle={chapter.summary}
            onBack={goBack}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />

          <View style={[styles.metaCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <View style={styles.metaHeader}>
              <View>
                <Text style={[styles.chapterIndex, { color: theme.icon }]}>
                  {t('starterGuideScreen.chapterIndex', { index: chapterIndex + 1 })}
                </Text>
                <Text style={[styles.partLabel, { color: theme.text }]}>{part.title}</Text>
              </View>
              <View style={styles.iconActionRow}>
                <Pressable
                  onPress={() => void toggleBookmark(chapter.id)}
                  style={[
                    styles.iconAction,
                    { backgroundColor: isBookmarked ? theme.accentSoft : tones.cream, borderColor: theme.border },
                  ]}>
                  <MaterialIcons name={isBookmarked ? 'bookmark' : 'bookmark-border'} size={18} color={theme.text} />
                </Pressable>
                <Pressable
                  onPress={() => void toggleRead(chapter.id)}
                  style={[
                    styles.iconAction,
                    { backgroundColor: isRead ? '#DDEFD8' : tones.cream, borderColor: theme.border },
                  ]}>
                  <MaterialIcons
                    name={isRead ? 'check-circle' : 'radio-button-unchecked'}
                    size={18}
                    color={isRead ? '#4B9C68' : theme.text}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={[styles.lessonCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <View style={[styles.decorBubble, styles.lessonBubble, { backgroundColor: tones.peach }]} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.chapterPointsTitle')}</Text>
            <View style={styles.lessonList}>
              {chapter.bullets.map((item, bulletIndex) => (
                <View
                  key={`${chapter.id}-${bulletIndex}`}
                  style={[styles.lessonRow, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                  <View style={[styles.lessonBadge, { backgroundColor: theme.accentSoft }]}>
                    <Text style={[styles.lessonBadgeText, { color: theme.text }]}>{bulletIndex + 1}</Text>
                  </View>
                  <Text style={[styles.lessonText, { color: theme.text }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.noteCard, styles.decorativeCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.noteTitle')}</Text>
            <Text style={[styles.noteText, { color: theme.icon }]}>{chapter.note}</Text>
          </View>
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
  metaCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
  },
  metaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  chapterIndex: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  partLabel: {
    marginTop: 4,
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  iconActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconAction: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 12,
  },
  decorBubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.72,
  },
  lessonBubble: {
    width: 96,
    height: 96,
    right: -24,
    top: -24,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  lessonList: {
    gap: 10,
  },
  lessonRow: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
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
  },
  noteCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 8,
  },
  noteText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
});

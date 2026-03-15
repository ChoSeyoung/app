import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function WeaningPartGuideScreen() {
  const { partId } = useLocalSearchParams<{ partId?: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const parts = useStarterGuideContent();
  const { progress, toggleBookmark, toggleRead } = useStarterGuideProgress();
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
    peach: '#FFF1E5',
  };

  const part = parts.find((item) => item.id === partId) ?? parts[0];

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/weaning-start-guide');
  };

  if (!part) {
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
            title={part.title}
            subtitle={part.description}
            onBack={goBack}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />

          {part.chapters.map((chapter, index) => {
            const isRead = progress.readChapterIds.includes(chapter.id);
            const isBookmarked = progress.bookmarkedChapterIds.includes(chapter.id);

            return (
              <Pressable
                key={chapter.id}
                onPress={() =>
                  router.push({
                    pathname: '/weaning-chapter',
                    params: { partId: part.id, chapterId: chapter.id },
                  })
                }
                style={[styles.chapterCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                <View style={styles.chapterHeader}>
                  <View style={styles.chapterHeaderTextWrap}>
                    <Text style={[styles.chapterIndex, { color: theme.icon }]}>
                      {t('starterGuideScreen.chapterIndex', { index: index + 1 })}
                    </Text>
                    <Text style={[styles.chapterTitle, { color: theme.text }]}>{chapter.title}</Text>
                    <Text style={[styles.chapterSummary, { color: theme.icon }]}>{chapter.summary}</Text>
                  </View>
                  <View style={styles.iconActionRow}>
                    <Pressable
                      onPress={() => void toggleBookmark(chapter.id)}
                      style={[
                        styles.iconAction,
                        { backgroundColor: isBookmarked ? theme.accentSoft : tones.cream, borderColor: theme.border },
                      ]}>
                      <MaterialIcons
                        name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                        size={18}
                        color={theme.text}
                      />
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
              </Pressable>
            );
          })}
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
  chapterCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 10,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  chapterHeaderTextWrap: {
    flex: 1,
    gap: 4,
  },
  chapterIndex: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  chapterTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
  },
  chapterSummary: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
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
});

/**
 * 이유식 시작 FAQ 전체 목록 화면.
 *
 * 역할:
 * - 카테고리 필터와 검색으로 FAQ를 빠르게 탐색하게 한다.
 * - 메인 허브의 5개 미리보기보다 더 깊은 탐색 전용 화면이다.
 *
 * 유지보수 포인트:
 * - FAQ 데이터는 계속 늘어날 수 있으므로 화면은 데이터 소스 변경에 최대한 얇게 유지한다.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FoldableCard } from '@/components/design-system/foldable-card';
import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, DecorativeTones, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStarterGuideFaq } from '@/hooks/use-starter-guide-faq';

export default function WeaningFaqScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { categories, items } = useStarterGuideFaq();
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const tones = DecorativeTones;

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const passCategory = query.trim() ? true : item.categoryId === selectedCategoryId;
        const passQuery = query.trim()
          ? `${item.title} ${item.body}`.toLowerCase().includes(query.trim().toLowerCase())
          : true;
        return passCategory && passQuery;
      }),
    [items, query, selectedCategoryId]
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
            title={t('starterGuideScreen.faqTitle')}
            subtitle={t('starterGuideScreen.faqBody')}
            onBack={goBack}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />

          <View style={[styles.categoryCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.faqCategoryTitle')}</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('starterGuideScreen.faqSearchPlaceholder')}
              placeholderTextColor="#9a9a9a"
              style={[styles.searchInput, { borderColor: theme.border, color: theme.text, backgroundColor: tones.cream }]}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
              {categories.map((category) => {
                const selected = category.id === selectedCategoryId;
                return (
                  <Text
                    key={category.id}
                    onPress={() => setSelectedCategoryId(category.id)}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: selected ? '#EA7A34' : tones.cream,
                        borderColor: selected ? '#EA7A34' : theme.border,
                        color: selected ? '#FFFDF8' : theme.text,
                      },
                    ]}>
                    {category.title}
                  </Text>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.faqList}>
            {filteredItems.length ? (
              filteredItems.map((item) => (
                <FoldableCard
                  key={item.id}
                  title={item.title}
                  theme={theme}
                  backgroundColor={tones.paper}
                  borderColor={theme.border}
                  style={styles.decorativeCard}>
                  <Text style={[styles.faqBodyText, { color: theme.icon }]}>{item.body}</Text>
                </FoldableCard>
              ))
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                <Text style={[styles.faqBodyText, { color: theme.icon }]}>{t('starterGuideScreen.faqSearchEmpty')}</Text>
              </View>
            )}
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
  categoryCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  categoryList: {
    gap: 8,
  },
  searchInput: {
    minHeight: Spacing.formControlMinHeight,
    borderWidth: 1,
    borderRadius: Spacing.formControlRadius,
    paddingHorizontal: Spacing.formControlHorizontal,
    paddingVertical: Spacing.formControlVertical,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  categoryChip: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  faqList: {
    gap: 10,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.cardPadding,
  },
  faqBodyText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
});

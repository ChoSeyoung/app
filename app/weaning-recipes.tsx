/**
 * 이유식 레시피 목록 화면.
 *
 * 역할:
 * - 카드형 레시피 목록을 2열 그리드로 보여주고, 사용자가 음식명을 눌러 상세 레시피로 이동하게 한다.
 * - 각 카드에서 완성된 음식 비주얼과 언제 먹기 좋은지 단계 배지를 함께 보여준다.
 *
 * 유지보수 포인트:
 * - 목록 화면에는 요약만 두고, 재료와 순서는 상세 화면으로 넘기는 구조를 유지한다.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { RecipePreview } from '@/components/design-system/recipe-preview';
import { useToast } from '@/components/design-system/toast-provider';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, DecorativeTones, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWeaningRecipes } from '@/hooks/use-weaning-recipes';

export default function WeaningRecipesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const tones = DecorativeTones;
  const { showToast } = useToast();
  const { recipes, toggleFavorite } = useWeaningRecipes();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/more');
  };

  const handleToggleFavorite = async (recipeId: string) => {
    await toggleFavorite(recipeId);
    showToast({
      message: t('recipeScreen.savedMessage'),
      level: 'success',
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.columnWrap}
        ListHeaderComponent={
          <View style={styles.cardStack}>
            <HeroHeaderCard
              title={t('recipeScreen.title')}
              subtitle={t('recipeScreen.subtitle')}
              onBack={goBack}
              theme={theme}
              backgroundColor={tones.lavender}
              borderColor={theme.border}
              backButtonColor={tones.paper}
              topBubbleColor={tones.paper}
              bottomBubbleColor={tones.blush}
            />
          </View>
        }
        renderItem={({ item, index }) => {
          const cardTone = index % 3 === 0 ? tones.paper : index % 3 === 1 ? tones.cream : tones.blush;

          return (
            <Pressable
              onPress={() => router.push({ pathname: '/weaning-recipe-detail', params: { recipeId: item.id } })}
              style={[styles.recipeCard, styles.decorativeCard, { backgroundColor: cardTone, borderColor: theme.border }]}>
              <RecipePreview recipeId={item.id} />
              <View style={styles.recipeBodyWrap}>
                <Pressable
                  onPress={(event) => {
                    event.stopPropagation();
                    void handleToggleFavorite(item.id);
                  }}
                  hitSlop={8}
                  style={styles.favoriteButton}>
                  <MaterialIcons
                    name={item.isFavorite ? 'favorite' : 'favorite-border'}
                    size={22}
                    color={item.isFavorite ? '#B03A2E' : theme.text}
                  />
                </Pressable>
                <Text style={[styles.recipeTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.recipeBody, { color: theme.icon }]}>{item.summary}</Text>
                <View style={[styles.badge, { backgroundColor: theme.accentSoft }]}>
                  <Text style={[styles.badgeText, { color: theme.text }]}>{item.stageLabel}</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
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
  columnWrap: {
    gap: 12,
    marginTop: Spacing.cardStackGap,
    marginBottom: 12,
  },
  decorativeCard: {
    overflow: 'hidden',
    shadowColor: '#C9B8A4',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  recipeCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    maxWidth: '48.5%',
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  recipeTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  recipeBodyWrap: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 7,
  },
  favoriteButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
  },
  recipeBody: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 18,
  },
});

/**
 * 이유식 레시피 상세 화면.
 *
 * 역할:
 * - 선택한 음식 카드의 재료와 간단한 조리 순서를 보여준다.
 * - 목록 화면에서는 숨겨둔 상세 내용을 읽기 좋게 풀어주는 역할이다.
 *
 * 유지보수 포인트:
 * - 레시피가 늘어나더라도 상세 화면 레이아웃은 공통으로 유지하고, 데이터만 늘리는 편이 관리에 유리하다.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
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

export default function WeaningRecipeDetailScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId?: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const tones = DecorativeTones;
  const { showToast } = useToast();
  const { recipes, toggleFavorite } = useWeaningRecipes();
  const recipe = recipes.find((item) => item.id === recipeId);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/weaning-recipes');
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;

    await toggleFavorite(recipe.id);
    showToast({
      message: t('recipeScreen.savedMessage'),
      level: 'success',
    });
  };

  if (!recipe) {
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
            title={recipe.title}
            subtitle={recipe.summary}
            onBack={goBack}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />

          <RecipePreview recipeId={recipe.id} size="detail" />

          <View style={[styles.metaCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <View style={styles.metaHeader}>
              <View style={[styles.badge, { backgroundColor: theme.accentSoft }]}>
                <Text style={[styles.badgeText, { color: theme.text }]}>{recipe.stageLabel}</Text>
              </View>
              <Pressable
                onPress={() => void handleToggleFavorite()}
                hitSlop={8}
                style={[styles.favoriteButton, { backgroundColor: recipe.isFavorite ? '#F4D7D0' : tones.cream, borderColor: theme.border }]}>
                <MaterialIcons
                  name={recipe.isFavorite ? 'favorite' : 'favorite-border'}
                  size={20}
                  color={recipe.isFavorite ? '#B03A2E' : theme.text}
                />
              </Pressable>
            </View>
            <Text style={[styles.metaBody, { color: theme.icon }]}>{t('recipeScreen.cardHint')}</Text>
          </View>

          <View style={[styles.sectionCard, styles.decorativeCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('recipeScreen.ingredientsTitle')}</Text>
            <View style={styles.listWrap}>
              {recipe.ingredients.map((item) => (
                <View key={item} style={[styles.rowChip, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                  <Text style={[styles.rowText, { color: theme.text }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.sectionCard, styles.decorativeCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('recipeScreen.stepsTitle')}</Text>
            <View style={styles.stepList}>
              {recipe.steps.map((step, index) => (
                <View key={`${recipe.id}-${index + 1}`} style={[styles.stepRow, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                  <View style={[styles.stepBadge, { backgroundColor: theme.accentSoft }]}>
                    <Text style={[styles.stepBadgeText, { color: theme.text }]}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, { color: theme.text }]}>{step}</Text>
                </View>
              ))}
            </View>
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
    borderRadius: 20,
    padding: Spacing.cardPadding,
    gap: 8,
  },
  metaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  favoriteButton: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  metaBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  listWrap: {
    gap: 8,
  },
  rowChip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  stepList: {
    gap: 10,
  },
  stepRow: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
});

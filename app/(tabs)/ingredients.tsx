/**
 * 식재료 탭 메인 화면.
 *
 * 역할:
 * - 식재료 카드 목록, 상태 필터, 즐겨찾기, 상세 바텀시트를 제공한다.
 * - 기록 기반 상태와 메모를 식재료 중심으로 다시 관리하는 화면이다.
 *
 * 유지보수 포인트:
 * - 상태 필터와 저장소에서 합성하는 overlay 데이터가 항상 같은 의미를 써야 한다.
 */
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageBackground } from '@/components/design-system/page-background';
import { getIngredientImageSource } from '@/constants/food-image-assets';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import type {
  IngredientCategory,
  Ingredient,
  IngredientStatus,
} from '@/features/ingredients/model';
import { Colors, DecorativeTones, Fonts } from '@/constants/theme';
import { useIngredients } from '@/hooks/use-ingredients';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';
import { useToast } from '@/hooks/use-toast';
import { formatDisplayDate } from '@/utils/date';

type IngredientFilter = 'ALL' | 'TRIED' | 'NOT_TRIED' | 'RISK' | 'RETRY';

type CategoryOption = {
  value: IngredientCategory;
  label: string;
};

function statusLabel(status: IngredientStatus): string {
  switch (status) {
    case 'NOT_TRIED':
      return t('ingredientScreen.statusNotTried');
    case 'TRIED':
      return t('ingredientScreen.statusTried');
    case 'CAUTION':
      return t('ingredientScreen.statusCaution');
    case 'ALLERGY':
      return t('ingredientScreen.statusAllergy');
  }
}

function statusTone(status: IngredientStatus): { bg: string; fg: string } {
  switch (status) {
    case 'TRIED':
      return { bg: '#e8f6e8', fg: '#287a3f' };
    case 'CAUTION':
      return { bg: '#fff2dc', fg: '#8e5b00' };
    case 'ALLERGY':
      return { bg: '#ffe5e5', fg: '#9f1d1d' };
    case 'NOT_TRIED':
    default:
      return { bg: '#ece8e3', fg: '#595551' };
  }
}

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function categoryVisual(category: IngredientCategory): { emoji: string; bg: string } {
  switch (category) {
    case 'GRAIN':
      return { emoji: '🌾', bg: '#EEEAD6' };
    case 'VEGETABLE':
      return { emoji: '🥦', bg: '#DCE8D0' };
    case 'FRUIT':
      return { emoji: '🍎', bg: '#F4D7D0' };
    case 'PROTEIN':
      return { emoji: '🥚', bg: '#E6DDD1' };
    case 'DAIRY':
      return { emoji: '🥛', bg: '#E7E2F4' };
    case 'OTHER':
    default:
      return { emoji: '🍽️', bg: '#E3DDD5' };
  }
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'GRAIN', label: t('ingredientScreen.categoryGrain') },
  { value: 'VEGETABLE', label: t('ingredientScreen.categoryVegetable') },
  { value: 'FRUIT', label: t('ingredientScreen.categoryFruit') },
  { value: 'PROTEIN', label: t('ingredientScreen.categoryProtein') },
  { value: 'DAIRY', label: t('ingredientScreen.categoryDairy') },
  { value: 'OTHER', label: t('ingredientScreen.categoryOther') },
];

export default function IngredientsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const tones = DecorativeTones;
  const { height: windowHeight } = useWindowDimensions();
  const { ingredients, isLoading, refresh, setStatus, toggleFavorite, addReaction } =
    useIngredients();
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<IngredientFilter>('ALL');
  const [query, setQuery] = useState('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [memoNote, setMemoNote] = useState('');
  const sheetTranslateY = useRef(new Animated.Value(0)).current;
  const closeThreshold = 72;
  const sheetHeight = Math.round(windowHeight * 0.5);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const selectedIngredient = useMemo(
    () => ingredients.find((item) => item.id === selectedId) ?? null,
    [ingredients, selectedId]
  );

  const filteredIngredients = useMemo(() => {
    const normalized = normalizeName(query);

    return ingredients.filter((item) => {
      const passFilter =
        filter === 'ALL'
          ? true
          : filter === 'TRIED'
            ? item.status === 'TRIED'
            : filter === 'NOT_TRIED'
              ? item.status === 'NOT_TRIED'
              : filter === 'RETRY'
                ? item.retrySuggested === true
              : item.status === 'CAUTION' || item.status === 'ALLERGY';

      const passQuery = normalized ? normalizeName(item.name).includes(normalized) : true;
      return passFilter && passQuery;
    });
  }, [filter, ingredients, query]);

  const openIngredientDetail = useCallback(
    async (ingredient: Ingredient) => {
      setSelectedId(ingredient.id);
      setMemoNote(ingredient.latestNote ?? '');
    },
    []
  );

  const closeIngredientDetail = () => {
    setSelectedId(null);
    setMemoNote('');
  };

  const animateCloseIngredientDetail = useCallback(() => {
    Animated.timing(sheetTranslateY, {
      toValue: sheetHeight,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      closeIngredientDetail();
    });
  }, [sheetHeight, sheetTranslateY]);

  useEffect(() => {
    if (!selectedId) return;

    sheetTranslateY.setValue(sheetHeight);
    Animated.timing(sheetTranslateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [selectedId, sheetHeight, sheetTranslateY]);

  const sheetPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && gestureState.dy > 3,
        onPanResponderMove: (_, gestureState) => {
          sheetTranslateY.setValue(Math.max(0, gestureState.dy));
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > closeThreshold || gestureState.vy > 1.1) {
            animateCloseIngredientDetail();
            return;
          }

          Animated.spring(sheetTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(sheetTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        },
      }),
    [animateCloseIngredientDetail, sheetTranslateY]
  );

  const handleSetIngredientStatus = async (status: IngredientStatus) => {
    if (!selectedIngredient) return;

    try {
      await setStatus(selectedIngredient.id, status);
      await refresh();
      showToast({
        message: t('ingredientScreen.savedMessage'),
        level: 'success',
      });
    } catch {
      showToast({
        message: t('ingredientScreen.saveFailedMessage'),
        level: 'error',
      });
    }
  };

  const handleToggleFavorite = useCallback(
    async (ingredientId: string) => {
      await toggleFavorite(ingredientId);
    },
    [toggleFavorite]
  );

  const handleSaveMemo = async () => {
    if (!selectedIngredient) return;

    await addReaction({
      ingredientId: selectedIngredient.id,
      reactionType: 'OTHER',
      note: memoNote,
    });
    await refresh();
    showToast({
      message: t('ingredientScreen.savedMessage'),
      variant: 'success',
    });
  };

  const renderIngredientCard = useCallback(
    ({ item }: { item: Ingredient }) => {
      const tone = statusTone(item.status);
      const visual = categoryVisual(item.category);
      const imageSource = item.imageUri ? { uri: item.imageUri } : getIngredientImageSource(item.id);
      const cardTone =
        item.status === 'ALLERGY'
          ? '#fff1eb'
          : item.status === 'CAUTION'
            ? '#fff7e4'
            : item.isFavorite
              ? tones.blush
              : tones.paper;

      return (
        <Pressable
          onPress={() => void openIngredientDetail(item)}
          style={[styles.cardItem, styles.decorativeCard, { borderColor: theme.border, backgroundColor: cardTone }]}>
          <View
            style={[
              styles.decorBubble,
              styles.cardDecorBubble,
              { backgroundColor: item.isFavorite ? tones.paper : tones.cream },
            ]}
          />
          <View style={[styles.cardImageWrap, { backgroundColor: visual.bg }]}>
            {imageSource ? (
              <Image source={imageSource} style={styles.cardImage} contentFit="cover" />
            ) : (
              <Text style={styles.cardEmoji}>{visual.emoji}</Text>
            )}
            {item.status === 'CAUTION' || item.status === 'ALLERGY' ? (
              <View style={[styles.cardBadge, { backgroundColor: tone.bg }]}>
                <Text style={[styles.cardBadgeText, { color: tone.fg }]}>{statusLabel(item.status)}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.cardBody}>
            <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.cardMetaRow}>
              <Text style={[styles.itemMeta, { color: theme.icon }]}>
                {item.firstTriedDate ? formatDisplayDate(item.firstTriedDate) : t('ingredientScreen.firstTriedPending')}
              </Text>
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
            </View>
            {item.latestNote ? (
              <Text style={[styles.notePreview, { color: theme.icon }]} numberOfLines={1} ellipsizeMode="tail">
                {item.latestNote}
              </Text>
            ) : null}
            {item.retrySuggested ? (
              <Text style={[styles.retryPreview, { color: theme.text }]} numberOfLines={1}>
                {t('ingredientScreen.retrySuggested')}
              </Text>
            ) : null}
          </View>
        </Pressable>
      );
    },
    [handleToggleFavorite, openIngredientDetail, theme.border, theme.icon, theme.text, tones.blush, tones.cream, tones.paper]
  );

  const listHeader = (
    <Animated.View style={topStyle}>
    <View style={styles.listHeader}>
      <View style={styles.headerRow}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>{t('tabs.ingredients')}</Text>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('ingredientScreen.searchPlaceholder')}
        placeholderTextColor="#9a9a9a"
        style={[styles.searchInput, styles.decorativeCard, { borderColor: theme.border, color: theme.text, backgroundColor: tones.paper }]}
      />

      <View style={styles.filterRow}>
        {([
          ['ALL', t('ingredientScreen.filterAll')],
          ['TRIED', t('ingredientScreen.filterTried')],
          ['NOT_TRIED', t('ingredientScreen.filterNotTried')],
          ['RISK', t('ingredientScreen.filterRisk')],
          ['RETRY', t('ingredientScreen.filterRetry')],
        ] as const).map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => setFilter(value)}
            style={[
              styles.filterChip,
              {
                borderColor: theme.border,
                backgroundColor:
                  filter === value
                    ? theme.accentSoft
                    : value === 'TRIED'
                      ? '#f7f2ff'
                      : value === 'RISK'
                        ? '#fff4ea'
                        : value === 'RETRY'
                          ? '#eef7dd'
                        : tones.paper,
              },
            ]}>
            <Text style={[styles.filterChipText, { color: theme.text }]}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
    </Animated.View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E5DCF6" bottomColor="#F4ECD6" />
      <Animated.View style={[styles.listMotionWrap, sectionsStyle]}>
      <FlatList
        data={isLoading ? [] : filteredIngredients}
        keyExtractor={(item) => item.id}
        renderItem={renderIngredientCard}
        numColumns={2}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          isLoading ? (
            <Text style={[styles.loadingText, { color: theme.icon }]}>{t('common.loading')}</Text>
          ) : (
            <View style={[styles.listCard, styles.emptyWrap, styles.decorativeCard, { backgroundColor: tones.lavender, borderColor: theme.border }]}>
              <View style={[styles.decorBubble, styles.emptyDecorBubble, { backgroundColor: tones.paper }]} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>{t('ingredientScreen.emptyTitle')}</Text>
              <Text style={[styles.emptyBody, { color: theme.icon }]}>{t('ingredientScreen.emptyBody')}</Text>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
      />
      </Animated.View>

      <Modal
        visible={Boolean(selectedIngredient)}
        transparent
        onRequestClose={closeIngredientDetail}>
        <View style={styles.sheetBackdrop}>
          <Pressable style={styles.sheetScrim} onPress={animateCloseIngredientDetail} />
          <Animated.View
            style={[
              styles.detailCard,
              {
                backgroundColor: tones.paper,
                borderColor: theme.border,
                height: sheetHeight,
                transform: [{ translateY: sheetTranslateY }],
              },
            ]}>
            <SafeAreaView edges={['bottom']} style={styles.detailSafeArea}>
              <View style={styles.sheetHandleArea} {...sheetPanResponder.panHandlers}>
                <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
              </View>
            <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
              {selectedIngredient ? (
                <>
                  <View style={[styles.decorBubble, styles.sheetDecorBubble, { backgroundColor: tones.blush }]} />
                  <View style={styles.detailHero}>
                    <View style={[styles.detailThumb, { backgroundColor: categoryVisual(selectedIngredient.category).bg }]}>
                      {(selectedIngredient.imageUri
                        ? { uri: selectedIngredient.imageUri }
                        : getIngredientImageSource(selectedIngredient.id)) ? (
                        <Image
                          source={
                            selectedIngredient.imageUri
                              ? { uri: selectedIngredient.imageUri }
                              : getIngredientImageSource(selectedIngredient.id)
                          }
                          style={styles.cardImage}
                          contentFit="cover"
                        />
                      ) : (
                        <Text style={styles.detailEmoji}>{categoryVisual(selectedIngredient.category).emoji}</Text>
                      )}
                    </View>
                    <View style={styles.detailHeroBody}>
                      <Text style={[styles.detailName, { color: theme.text }]}>{selectedIngredient.name}</Text>
                      <Text style={[styles.detailMeta, { color: theme.icon }]}>
                        {CATEGORY_OPTIONS.find((item) => item.value === selectedIngredient.category)?.label ?? selectedIngredient.category}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.detailMeta, { color: theme.icon }]}>
                    {selectedIngredient.firstTriedDate
                      ? formatDisplayDate(selectedIngredient.firstTriedDate)
                      : t('ingredientScreen.firstTriedPending')}
                  </Text>
                  <Pressable
                    onPress={() => void handleToggleFavorite(selectedIngredient.id)}
                    style={[styles.favoriteToggle, { backgroundColor: selectedIngredient.isFavorite ? '#F4D7D0' : '#ece8e3' }]}>
                    <MaterialIcons
                      name={selectedIngredient.isFavorite ? 'favorite' : 'favorite-border'}
                      size={18}
                      color={selectedIngredient.isFavorite ? '#B03A2E' : theme.text}
                    />
                    <Text style={styles.favoriteToggleText}>{t('ingredientScreen.actionToggleFavorite')}</Text>
                  </Pressable>

                  <View style={styles.statusActionRow}>
                    <Pressable
                      onPress={() => void handleSetIngredientStatus('TRIED')}
                      style={[styles.statusAction, { backgroundColor: '#e8f6e8' }]}>
                      <Text style={styles.statusActionText}>{t('ingredientScreen.actionSetTried')}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => void handleSetIngredientStatus('CAUTION')}
                      style={[styles.statusAction, { backgroundColor: '#fff2dc' }]}>
                      <Text style={styles.statusActionText}>{t('ingredientScreen.actionSetCaution')}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => void handleSetIngredientStatus('ALLERGY')}
                      style={[styles.statusAction, { backgroundColor: '#ffe5e5' }]}>
                      <Text style={styles.statusActionText}>{t('ingredientScreen.actionSetAllergy')}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => void handleSetIngredientStatus('NOT_TRIED')}
                      style={[styles.statusAction, { backgroundColor: '#ece8e3' }]}>
                      <Text style={styles.statusActionText}>{t('ingredientScreen.actionReset')}</Text>
                    </Pressable>
                  </View>

                  <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('ingredientScreen.memoTitle')}</Text>
                  <TextInput
                    value={memoNote}
                    onChangeText={setMemoNote}
                    placeholder={t('ingredientScreen.reactionNotePlaceholder')}
                    placeholderTextColor="#9a9a9a"
                    style={[styles.reactionInput, { borderColor: theme.border, color: theme.text, backgroundColor: '#fffef9' }]}
                    multiline
                  />
                  <Pressable
                    onPress={() => void handleSaveMemo()}
                    style={[styles.primaryButton, { backgroundColor: '#ffb928' }]}>
                    <Text style={styles.primaryButtonText}>{t('ingredientScreen.memoSaveButton')}</Text>
                  </Pressable>
                </>
              ) : null}

              <Pressable onPress={animateCloseIngredientDetail} style={[styles.closeButton, { backgroundColor: '#ece8e3' }]}> 
                <Text style={styles.closeButtonText}>{t('ingredientScreen.addCancel')}</Text>
              </Pressable>
            </ScrollView>
            </SafeAreaView>
          </Animated.View>
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
  cardDecorBubble: {
    width: 76,
    height: 76,
    right: -18,
    top: -22,
  },
  emptyDecorBubble: {
    width: 96,
    height: 96,
    right: -20,
    top: -20,
  },
  sheetDecorBubble: {
    width: 120,
    height: 120,
    right: -28,
    top: -24,
  },
  listHeader: {
    gap: Spacing.cardStackGap,
    marginBottom: Spacing.cardStackGap,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 24,
    fontWeight: '600',
  },
  addButton: {
    minHeight: Spacing.compactButtonMinHeight,
    paddingHorizontal: 14,
    borderRadius: Spacing.compactButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  searchInput: {
    borderWidth: 1,
    minHeight: Spacing.formControlMinHeight,
    borderRadius: Spacing.formControlRadius,
    paddingHorizontal: Spacing.formControlHorizontal,
    paddingVertical: Spacing.formControlVertical,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: Spacing.chipRadius,
    paddingHorizontal: Spacing.chipHorizontal,
    paddingVertical: Spacing.chipVertical,
  },
  filterChipText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  listCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  loadingText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    paddingVertical: 14,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6,
  },
  emptyTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyBody: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 8,
    borderRadius: Spacing.compactButtonRadius,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  emptyButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardItem: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    maxWidth: '48.5%',
  },
  cardImageWrap: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardEmoji: {
    fontSize: 42,
  },
  favoriteButton: {
    marginLeft: 8,
  },
  cardBadge: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 7,
  },
  itemName: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  itemMeta: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 18,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  notePreview: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 18,
  },
  retryPreview: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: Spacing.screenHorizontal,
    justifyContent: 'center',
  },
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  detailCard: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  detailSafeArea: {
    flex: 1,
  },
  sheetHandleArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
  },
  detailContent: {
    paddingHorizontal: Spacing.cardPadding,
    paddingBottom: 24,
    gap: Spacing.fieldGap,
  },
  modalTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '600',
  },
  inputLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryChipText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  modalAction: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  detailName: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '600',
  },
  detailHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailThumb: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailEmoji: {
    fontSize: 28,
  },
  detailHeroBody: {
    flex: 1,
    gap: 4,
  },
  detailMeta: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  favoriteToggle: {
    marginTop: 4,
    alignSelf: 'flex-start',
    minHeight: Spacing.compactButtonMinHeight,
    paddingHorizontal: Spacing.chipHorizontal,
    borderRadius: Spacing.chipRadius,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  favoriteToggleText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  statusActionRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusAction: {
    minWidth: 72,
    borderRadius: Spacing.formControlRadius,
    paddingHorizontal: Spacing.formControlHorizontal,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statusActionText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  sectionTitle: {
    marginTop: 10,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  reactionTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reactionTypeChip: {
    borderWidth: 1,
    borderRadius: Spacing.chipRadius,
    paddingHorizontal: Spacing.chipHorizontal,
    paddingVertical: Spacing.chipVertical,
  },
  reactionTypeText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  reactionInput: {
    borderWidth: 1,
    borderRadius: Spacing.formControlRadius,
    minHeight: 74,
    paddingHorizontal: Spacing.formControlHorizontal,
    paddingVertical: 10,
    fontFamily: Fonts.sans,
    fontSize: 14,
    textAlignVertical: 'top',
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
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ece6dd',
    gap: 2,
  },
  historyDate: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  historyBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 19,
  },
  closeButton: {
    marginTop: 10,
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: '#1c1c1c',
  },
});

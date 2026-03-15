/**
 * 식단 개인화 기준 편집 화면.
 *
 * 역할:
 * - 이유식 단계, 식사 수, 선호/비선호 식재료, 제외 식재료 등 추천 엔진 입력값을 수정한다.
 * - 식단 탭에서 추천 품질을 올리기 위한 프로필 보강 흐름을 담당한다.
 *
 * 유지보수 포인트:
 * - 추천 엔진이 새로운 제약을 쓰기 시작하면 이 화면의 입력 항목도 함께 확장해야 한다.
 * - 선택형 칩 상태는 프로필 저장 구조와 이름을 맞춰야 후속 리팩터링 비용이 줄어든다.
 */
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import type { BabyProfile, CaregiverGoal, FeedingMethod, FeedingStage, TextureLevel } from '@/constants/baby-profile';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useBabyProfile } from '@/hooks/use-baby-profile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useIngredients } from '@/hooks/use-ingredients';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';
import { useToast } from '@/hooks/use-toast';

type ChipOption<T extends string | number | boolean> = {
  value: T;
  label: string;
};

function ChoiceChip({
  label,
  selected,
  onPress,
  theme,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  theme: (typeof Colors)['light'];
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.choiceChip,
        {
          backgroundColor: selected ? theme.accent : '#FFF8F1',
          borderColor: selected ? theme.accent : theme.border,
        },
      ]}>
      <Text style={[styles.choiceChipText, { color: selected ? '#FFFFFF' : theme.text }]}>{label}</Text>
    </Pressable>
  );
}

function Section<T extends string | number | boolean>({
  title,
  body,
  options,
  selectedValue,
  onSelect,
  theme,
}: {
  title: string;
  body: string;
  options: ChipOption<T>[];
  selectedValue?: T;
  onSelect: (value: T) => void;
  theme: (typeof Colors)['light'];
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.sectionBody, { color: theme.icon }]}>{body}</Text>
      <View style={styles.chipWrap}>
        {options.map((option) => (
          <ChoiceChip
            key={String(option.value)}
            label={option.label}
            selected={selectedValue === option.value}
            onPress={() => onSelect(option.value)}
            theme={theme}
          />
        ))}
      </View>
    </View>
  );
}

function MultiSection({
  title,
  body,
  items,
  selectedIds,
  onToggle,
  theme,
}: {
  title: string;
  body: string;
  items: { id: string; name: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  theme: (typeof Colors)['light'];
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.sectionBody, { color: theme.icon }]}>{body}</Text>
      <View style={styles.chipWrap}>
        {items.map((item) => (
          <ChoiceChip
            key={item.id}
            label={item.name}
            selected={selectedIds.includes(item.id)}
            onPress={() => onToggle(item.id)}
            theme={theme}
          />
        ))}
      </View>
    </View>
  );
}

export default function MealPlanPreferencesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();
  const { profile, saveProfile } = useBabyProfile();
  const { ingredients } = useIngredients();
  const { showToast } = useToast();
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
  };

  const [draft, setDraft] = useState<Partial<BabyProfile>>({});

  useEffect(() => {
    if (!profile) return;
    setDraft(profile);
  }, [profile]);

  const ingredientOptions = useMemo(
    () =>
      ingredients
        .filter((item) => item.status !== 'ALLERGY')
        .slice(0, 18)
        .map((item) => ({ id: item.id, name: item.name })),
    [ingredients]
  );

  const updateList = (key: 'blockedIngredientIds' | 'preferredIngredientIds' | 'dislikedIngredientIds' | 'recentRefusedIngredientIds', value: string) => {
    setDraft((current) => {
      const currentList = current[key] ?? [];
      const nextList = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];

      return {
        ...current,
        [key]: nextList,
      };
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    const nextProfile: BabyProfile = {
      ...profile,
      ...draft,
    };

    await saveProfile(nextProfile);
    showToast({
      message: t('mealPlanPreferencesScreen.saveSuccess'),
      level: 'success',
    });
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={topStyle}>
          <HeroHeaderCard
            title={t('mealPlanPreferencesScreen.title')}
            subtitle={t('mealPlanPreferencesScreen.subtitle')}
            onBack={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }
              router.replace('/(tabs)/meal-plan');
            }}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />
        </Animated.View>

        <Animated.View style={sectionsStyle}>
          {!profile ? (
            <View style={[styles.card, { backgroundColor: tones.paper, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.profileRequiredTitle')}</Text>
              <Text style={[styles.sectionBody, { color: theme.icon }]}>{t('home.profileRequiredBody')}</Text>
            </View>
          ) : (
          <View style={[styles.card, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <Section<FeedingStage>
              title={t('mealPlanPreferencesScreen.stageTitle')}
              body={t('mealPlanPreferencesScreen.stageBody')}
              options={[
                { value: 'PREP', label: t('mealPlanScreen.stagePrep') },
                { value: 'INITIAL', label: t('mealPlanScreen.stageInitial') },
                { value: 'MIDDLE', label: t('mealPlanScreen.stageMiddle') },
                { value: 'LATE', label: t('mealPlanScreen.stageLate') },
                { value: 'COMPLETE', label: t('mealPlanScreen.stageComplete') },
              ]}
              selectedValue={draft.feedingStage}
              onSelect={(value) => setDraft((current) => ({ ...current, feedingStage: value }))}
              theme={theme}
            />

            <Section<1 | 2 | 3>
              title={t('mealPlanPreferencesScreen.mealsTitle')}
              body={t('mealPlanPreferencesScreen.mealsBody')}
              options={[
                { value: 1, label: '1식' },
                { value: 2, label: '2식' },
                { value: 3, label: '3식' },
              ]}
              selectedValue={draft.mealsPerDay}
              onSelect={(value) => setDraft((current) => ({ ...current, mealsPerDay: value }))}
              theme={theme}
            />

            <Section<FeedingMethod>
              title={t('mealPlanPreferencesScreen.methodTitle')}
              body={t('mealPlanPreferencesScreen.methodBody')}
              options={[
                { value: 'TOPPING', label: t('mealPlanScreen.methodTopping') },
                { value: 'TRADITIONAL', label: t('mealPlanScreen.methodTraditional') },
                { value: 'BLW_MIXED', label: t('mealPlanScreen.methodBlwMixed') },
              ]}
              selectedValue={draft.feedingMethod}
              onSelect={(value) => setDraft((current) => ({ ...current, feedingMethod: value }))}
              theme={theme}
            />

            <Section<boolean>
              title={t('mealPlanPreferencesScreen.proteinTitle')}
              body={t('mealPlanPreferencesScreen.proteinBody')}
              options={[
                { value: true, label: t('mealPlanPreferencesScreen.proteinStarted') },
                { value: false, label: t('mealPlanPreferencesScreen.proteinNotStarted') },
              ]}
              selectedValue={draft.proteinStarted}
              onSelect={(value) => setDraft((current) => ({ ...current, proteinStarted: value }))}
              theme={theme}
            />

            <Section<TextureLevel>
              title={t('mealPlanPreferencesScreen.textureTitle')}
              body={t('mealPlanPreferencesScreen.textureBody')}
              options={[
                { value: 'THIN_PORRIDGE', label: t('mealPlanPreferencesScreen.textureThin') },
                { value: 'SOFT_MASH', label: t('mealPlanPreferencesScreen.textureMash') },
                { value: 'SOFT_CHUNK', label: t('mealPlanPreferencesScreen.textureChunk') },
                { value: 'FINGER_FOOD', label: t('mealPlanPreferencesScreen.textureFinger') },
              ]}
              selectedValue={draft.textureLevel}
              onSelect={(value) => setDraft((current) => ({ ...current, textureLevel: value }))}
              theme={theme}
            />

            <Section<CaregiverGoal>
              title={t('mealPlanPreferencesScreen.goalTitle')}
              body={t('mealPlanPreferencesScreen.goalBody')}
              options={[
                { value: 'VARIETY', label: t('mealPlanPreferencesScreen.goalVariety') },
                { value: 'EASY', label: t('mealPlanPreferencesScreen.goalEasy') },
                { value: 'FREEZER', label: t('mealPlanPreferencesScreen.goalFreezer') },
              ]}
              selectedValue={draft.caregiverGoal}
              onSelect={(value) => setDraft((current) => ({ ...current, caregiverGoal: value }))}
              theme={theme}
            />

            <MultiSection
              title={t('mealPlanPreferencesScreen.blockedTitle')}
              body={t('mealPlanPreferencesScreen.blockedBody')}
              items={ingredientOptions}
              selectedIds={draft.blockedIngredientIds ?? []}
              onToggle={(id) => updateList('blockedIngredientIds', id)}
              theme={theme}
            />

            <MultiSection
              title={t('mealPlanPreferencesScreen.preferredTitle')}
              body={t('mealPlanPreferencesScreen.preferredBody')}
              items={ingredientOptions}
              selectedIds={draft.preferredIngredientIds ?? []}
              onToggle={(id) => updateList('preferredIngredientIds', id)}
              theme={theme}
            />

            <MultiSection
              title={t('mealPlanPreferencesScreen.dislikedTitle')}
              body={t('mealPlanPreferencesScreen.dislikedBody')}
              items={ingredientOptions}
              selectedIds={draft.dislikedIngredientIds ?? []}
              onToggle={(id) => updateList('dislikedIngredientIds', id)}
              theme={theme}
            />

            <MultiSection
              title={t('mealPlanPreferencesScreen.refusedTitle')}
              body={t('mealPlanPreferencesScreen.refusedBody')}
              items={ingredientOptions}
              selectedIds={draft.recentRefusedIngredientIds ?? []}
              onToggle={(id) => updateList('recentRefusedIngredientIds', id)}
              theme={theme}
            />
          </View>
          )}
        </Animated.View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={[styles.bottomBar, { backgroundColor: tones.paper, borderTopColor: theme.border }]}>
        <Pressable onPress={() => void handleSave()} style={[styles.saveButton, { backgroundColor: theme.accent }]}>
          <Text style={styles.saveButtonText}>{t('mealPlanPreferencesScreen.saveButton')}</Text>
        </Pressable>
      </SafeAreaView>
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
    paddingBottom: Spacing.stickyActionContentPaddingBottom,
    gap: Spacing.cardStackGap,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.cardPadding,
    gap: Spacing.cardStackGap,
    shadowColor: '#C9B8A4',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionBody: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceChip: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  choiceChipText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  bottomBar: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 12,
  },
  saveButton: {
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
});

import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import type { IngredientCategory } from '@/features/ingredients/model';
import { ensureIngredientRecorded } from '@/features/ingredients/repository';
import type {
  AmountLevel,
  AmountType,
  FeedingRecord,
  FeedingRecordIngredient,
  MealSlot,
  ReactionType,
  RecordDraft,
} from '@/features/records/model';
import { consumeLatestRecordDraft } from '@/features/records/record-draft-store';
import { createFeedingRecord, getFeedingRecordById, updateFeedingRecord } from '@/features/records/repository';
import { useBabyProfile } from '@/hooks/use-baby-profile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useIngredients } from '@/hooks/use-ingredients';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';
import { useToast } from '@/hooks/use-toast';
import { formatDisplayDate } from '@/utils/date';

type EditorIngredient = {
  key: string;
  ingredientId?: string;
  ingredientName: string;
};

type EditorState = {
  recordId?: string;
  createdAt?: string;
  sourcePlanId?: string;
  slot?: MealSlot;
  date: string;
  time: string;
  amountType: AmountType;
  amountGram: string;
  amountLevel: AmountLevel;
  reactionType: ReactionType;
  note: string;
  photoUrl?: string;
  ingredients: EditorIngredient[];
};

const AMOUNT_LEVELS: AmountLevel[] = ['HIGH', 'MEDIUM', 'LOW'];
const REACTION_TYPES: ReactionType[] = ['NONE', 'NORMAL', 'FUSSY', 'VOMIT', 'RASH'];
const TIME_MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);
const TIME_HOURS_12 = Array.from({ length: 12 }, (_, index) => index + 1);
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function getDefaultDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function getDefaultTime(): string {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function isValidDateInput(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

function isValidTimeInput(value: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [hours, minutes] = value.split(':').map(Number);
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
}

function buildDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

function formatDateLabel(dateTime: string): string {
  const parsed = new Date(dateTime);
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

function formatTimeLabel(dateTime: string): string {
  const parsed = new Date(dateTime);
  return `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
}

function parseDateInput(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function parseTimeInput(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(':').map(Number);
  return { hour, minute };
}

function formatTimePickerLabel(hour24: number, minute: number): string {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const hour12 = hour24 % 12 || 12;
  return `${period} ${pad(hour12)}:${pad(minute)}`;
}

function convertTo24Hour(period: 'AM' | 'PM', hour12: number): number {
  if (period === 'AM') {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
}

function getMonthGridDates(base: Date): Date[] {
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const last = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  const sundayIndex = first.getDay();
  const saturdayIndex = 6 - last.getDay();
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - sundayIndex);
  const gridEnd = new Date(last);
  gridEnd.setDate(last.getDate() + saturdayIndex);
  const days = Math.floor((gridEnd.getTime() - gridStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMonthLabel(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function categoryVisual(category: IngredientCategory): {
  emoji: string;
  bg: string;
} {
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

function createEmptyEditor(): EditorState {
  return {
    date: getDefaultDate(),
    time: getDefaultTime(),
    amountType: 'GRAM',
    amountGram: '',
    amountLevel: 'MEDIUM',
    reactionType: 'NONE',
    note: '',
    ingredients: [],
  };
}

function editorFromDraft(draft: RecordDraft): EditorState {
  return {
    date: draft.date,
    time: draft.seededTime ?? getDefaultTime(),
    amountType: 'GRAM',
    amountGram: '',
    amountLevel: 'MEDIUM',
    reactionType: 'NONE',
    note: '',
    ingredients: draft.seededItems.map((item, index) => ({
      key: `${item.ingredientId ?? item.ingredientName}-${index}`,
      ingredientId: item.ingredientId,
      ingredientName: item.ingredientName,
    })),
    sourcePlanId: draft.plannedMealRefId,
    slot: draft.slot,
  };
}

function editorFromRecord(record: FeedingRecord): EditorState {
  return {
    recordId: record.id,
    createdAt: record.createdAt,
    sourcePlanId: record.sourcePlanId,
    slot: record.slot,
    date: formatDateLabel(record.dateTime),
    time: formatTimeLabel(record.dateTime),
    amountType: record.amountType,
    amountGram: record.amountGram ? String(record.amountGram) : '',
    amountLevel: record.amountLevel ?? 'MEDIUM',
    reactionType: record.reactionType,
    note: record.note ?? '',
    photoUrl: record.photoUrl,
    ingredients: record.ingredients.map((item) => ({
      key: item.id,
      ingredientId: item.ingredientId,
      ingredientName: item.ingredientName,
    })),
  };
}

function amountLevelLabel(value: AmountLevel): string {
  switch (value) {
    case 'HIGH':
      return t('journeyScreen.amountLevelHigh');
    case 'LOW':
      return t('journeyScreen.amountLevelLow');
    case 'MEDIUM':
    default:
      return t('journeyScreen.amountLevelMedium');
  }
}

function reactionLabel(value: ReactionType): string {
  switch (value) {
    case 'NONE':
      return t('journeyScreen.reactionTypeNone');
    case 'NORMAL':
      return t('journeyScreen.reactionTypeNormal');
    case 'FUSSY':
      return t('journeyScreen.reactionTypeFussy');
    case 'VOMIT':
      return t('journeyScreen.reactionTypeVomit');
    case 'RASH':
      return t('journeyScreen.reactionTypeRash');
  }
}

export default function RecordEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recordId?: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
  };
  const { profile } = useBabyProfile();
  const { showToast } = useToast();
  const { ingredients } = useIngredients();

  const [ingredientQuery, setIngredientQuery] = useState('');
  const [editor, setEditor] = useState<EditorState>(createEmptyEditor());
  const [isSaving, setIsSaving] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time' | null>(null);
  const [pickerMonth, setPickerMonth] = useState<Date>(() => parseDateInput(getDefaultDate()));
  const [draftDate, setDraftDate] = useState<Date>(() => parseDateInput(getDefaultDate()));
  const [draftTime, setDraftTime] = useState(() => parseTimeInput(getDefaultTime()));
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        if (typeof params.recordId === 'string' && params.recordId) {
          const record = await getFeedingRecordById(params.recordId);
          if (record) {
            setEditor(editorFromRecord(record));
            return;
          }
        }

        const draft = consumeLatestRecordDraft();
        if (draft) {
          setEditor(editorFromDraft(draft));
          return;
        }

        setEditor(createEmptyEditor());
      })();
    }, [params.recordId])
  );

  const selectedIngredientNames = useMemo(
    () => new Set(editor.ingredients.map((item) => item.ingredientName.trim().toLowerCase())),
    [editor.ingredients]
  );

  const filteredIngredients = useMemo(() => {
    const normalizedQuery = ingredientQuery.trim().toLowerCase();
    if (!normalizedQuery) return [];
    return ingredients.filter((item) => {
      if (selectedIngredientNames.has(item.name.trim().toLowerCase())) return false;
      return item.name.toLowerCase().includes(normalizedQuery);
    });
  }, [ingredientQuery, ingredients, selectedIngredientNames]);

  const monthGridDates = useMemo(() => getMonthGridDates(pickerMonth), [pickerMonth]);
  const canSave =
    editor.ingredients.length > 0 &&
    (editor.amountType === 'LEVEL' || editor.amountGram.trim().length > 0);
  const hasIngredientSearchPanel = ingredientQuery.trim().length > 0;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/journey');
  };

  const addIngredient = (name: string, ingredientId?: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const normalized = trimmedName.toLowerCase();
    if (editor.ingredients.some((item) => item.ingredientName.trim().toLowerCase() === normalized)) return;

    setEditor((current) => ({
      ...current,
      ingredients: [
        ...current.ingredients,
        {
          key: `${ingredientId ?? trimmedName}-${Date.now()}`,
          ingredientId,
          ingredientName: trimmedName,
        },
      ],
    }));
    setIngredientQuery('');
  };

  const removeIngredient = (key: string) => {
    setEditor((current) => ({
      ...current,
      ingredients: current.ingredients.filter((item) => item.key !== key),
    }));
  };

  const openDatePicker = () => {
    const nextDate = isValidDateInput(editor.date) ? parseDateInput(editor.date) : new Date();
    setDraftDate(nextDate);
    setPickerMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    setPickerMode('date');
  };

  const openTimePicker = () => {
    const nextTime = isValidTimeInput(editor.time) ? parseTimeInput(editor.time) : parseTimeInput(getDefaultTime());
    setDraftTime(nextTime);
    setPickerMode('time');
  };

  const confirmDatePicker = () => {
    setEditor((current) => ({
      ...current,
      date: `${draftDate.getFullYear()}-${pad(draftDate.getMonth() + 1)}-${pad(draftDate.getDate())}`,
    }));
    setPickerMode(null);
  };

  const confirmTimePicker = () => {
    setEditor((current) => ({
      ...current,
      time: `${pad(draftTime.hour)}:${pad(draftTime.minute)}`,
    }));
    setPickerMode(null);
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('journeyScreen.photoPermissionTitle'), t('journeyScreen.photoPermissionMessage'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setEditor((current) => ({
        ...current,
        photoUrl: result.assets[0].uri,
      }));
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (editor.ingredients.length === 0) {
      showToast({
        title: t('journeyScreen.title'),
        message: t('journeyScreen.validationIngredient'),
        variant: 'error',
      });
      return;
    }
    if (!isValidDateInput(editor.date)) {
      showToast({
        title: t('journeyScreen.title'),
        message: t('journeyScreen.validationDate'),
        variant: 'error',
      });
      return;
    }
    if (!isValidTimeInput(editor.time)) {
      showToast({
        title: t('journeyScreen.title'),
        message: t('journeyScreen.validationTime'),
        variant: 'error',
      });
      return;
    }

    setIsSaving(true);

    try {
      const recordId = editor.recordId ?? `feeding-record-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const ensuredIngredients = await Promise.all(
        editor.ingredients.map((item) =>
          ensureIngredientRecorded({
            ingredientId: item.ingredientId,
            ingredientName: item.ingredientName,
            triedDate: editor.date,
          })
        )
      );

      const mappedIngredients: FeedingRecordIngredient[] = ensuredIngredients.map((item, index) => ({
        id: `${recordId}-ingredient-${index}`,
        recordId,
        ingredientId: item.id,
        ingredientName: item.name,
      }));

      const now = new Date().toISOString();
      const nextRecord: FeedingRecord = {
        id: recordId,
        babyId: profile?.babyName || 'default-baby',
        dateTime: buildDateTime(editor.date, editor.time),
        amountType: editor.amountType,
        amountGram: editor.amountType === 'GRAM' && editor.amountGram ? Number(editor.amountGram) : undefined,
        amountLevel: editor.amountType === 'LEVEL' ? editor.amountLevel : undefined,
        reactionType: editor.reactionType,
        note: editor.note.trim() || undefined,
        photoUrl: editor.photoUrl,
        ingredients: mappedIngredients,
        sourcePlanId: editor.sourcePlanId,
        slot: editor.slot,
        createdAt: editor.createdAt ?? now,
        updatedAt: now,
      };

      if (editor.recordId) {
        await updateFeedingRecord(nextRecord);
        showToast({
          title: t('journeyScreen.title'),
          message: t('journeyScreen.updateSuccess'),
          variant: 'success',
        });
      } else {
        await createFeedingRecord(nextRecord);
        showToast({
          title: t('journeyScreen.title'),
          message: t('journeyScreen.saveSuccess'),
          variant: 'success',
        });
      }

      router.replace('/(tabs)/journey');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={topStyle}>
          <HeroHeaderCard
            title={editor.recordId ? t('journeyScreen.detailTitle') : t('journeyScreen.addButton')}
            subtitle={
              editor.ingredients.length > 0
                ? `${editor.ingredients.length}${t('journeyScreen.editorHeaderCount')}`
                : t('journeyScreen.editorHeaderEmpty')
            }
            onBack={goBack}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />
        </Animated.View>

        <Animated.View style={sectionsStyle}>
        <View style={[styles.formCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
          <View style={[styles.decorBubble, styles.formBubbleTop, { backgroundColor: tones.cream }]} />
          <View style={[styles.decorBubble, styles.formBubbleBottom, { backgroundColor: tones.blush }]} />
          <View style={[styles.fieldSection, styles.ingredientSection]}>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={[styles.label, { color: theme.icon }]}>{t('journeyScreen.dateLabel')}</Text>
                <Pressable
                  onPress={openDatePicker}
                  style={[styles.pickerField, { borderColor: theme.border, backgroundColor: tones.cream }]}>
                  <Text style={[styles.pickerFieldText, { color: theme.text }]}>{formatDisplayDate(editor.date)}</Text>
                </Pressable>
              </View>
              <View style={styles.halfField}>
                <Text style={[styles.label, { color: theme.icon }]}>{t('journeyScreen.timeLabel')}</Text>
                <Pressable
                  onPress={openTimePicker}
                  style={[styles.pickerField, { borderColor: theme.border, backgroundColor: tones.cream }]}>
                  <Text style={[styles.pickerFieldText, { color: theme.text }]}>
                    {formatTimePickerLabel(parseTimeInput(editor.time).hour, parseTimeInput(editor.time).minute)}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.fieldSection}>
            <Text style={[styles.label, { color: theme.icon }]}>{t('journeyScreen.ingredientsLabel')}</Text>
            <Text style={[styles.helperText, { color: theme.icon }]}>{t('journeyScreen.ingredientsHint')}</Text>
            <View style={styles.searchWrap}>
              <TextInput
                value={ingredientQuery}
                onChangeText={setIngredientQuery}
                placeholder={t('journeyScreen.ingredientSearchPlaceholder')}
                placeholderTextColor="#9a9a9a"
                style={[
                  styles.input,
                  hasIngredientSearchPanel ? styles.searchInputOpen : null,
                  { borderColor: theme.border, color: theme.text, backgroundColor: tones.cream },
                ]}
              />

              {hasIngredientSearchPanel ? (
                filteredIngredients.length > 0 ? (
                  <View style={[styles.searchResultCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                    {filteredIngredients.slice(0, 8).map((item, index) => {
                      const visual = categoryVisual(item.category);
                      return (
                        <Pressable
                          key={item.id}
                          onPress={() => addIngredient(item.name, item.id)}
                          style={[
                            styles.searchResultItem,
                            index === filteredIngredients.slice(0, 8).length - 1 ? styles.searchResultItemLast : null,
                          ]}>
                          <View style={styles.searchResultMain}>
                            {item.imageUri ? (
                              <Image source={{ uri: item.imageUri }} style={styles.searchResultImage} contentFit="cover" />
                            ) : (
                              <View style={[styles.searchResultPlaceholder, { backgroundColor: visual.bg }]}>
                                <Text style={styles.searchResultPlaceholderEmoji}>{visual.emoji}</Text>
                              </View>
                            )}
                            <Text style={[styles.searchResultText, { color: theme.text }]} numberOfLines={1}>
                              {item.name}
                            </Text>
                          </View>
                          <MaterialIcons
                            name={item.isFavorite ? 'favorite' : 'favorite-border'}
                            size={18}
                            color={item.isFavorite ? '#D97757' : theme.tabIconDefault}
                          />
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <View style={[styles.searchResultCard, styles.searchEmptyCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                    <Text style={[styles.helperText, { color: theme.icon }]}>{t('journeyScreen.ingredientSearchEmpty')}</Text>
                  </View>
                )
              ) : null}
            </View>

            {editor.ingredients.length ? (
              <View style={styles.tagWrap}>
                {editor.ingredients.map((item) => (
                  <Pressable
                    key={item.key}
                    onPress={() => removeIngredient(item.key)}
                    style={[styles.tag, { backgroundColor: theme.accentSoft }]}>
                    <Text style={[styles.tagText, { color: theme.text }]}>{item.ingredientName} ×</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.fieldSection}>
            <Text style={[styles.label, { color: theme.icon }]}>{t('journeyScreen.amountLabel')}</Text>
            <View style={styles.toggleRow}>
              {([
                ['GRAM', t('journeyScreen.amountTypeGram')],
                ['LEVEL', t('journeyScreen.amountTypeLevel')],
              ] as const).map(([value, label]) => (
                <Pressable
                  key={value}
                  onPress={() => setEditor((current) => ({ ...current, amountType: value }))}
                  style={[
                    styles.toggleButton,
                    {
                      borderColor: theme.border,
                      backgroundColor: editor.amountType === value ? theme.accentSoft : theme.surface,
                    },
                  ]}>
                  <Text style={[styles.toggleText, { color: theme.text }]}>{label}</Text>
                </Pressable>
              ))}
            </View>

            {editor.amountType === 'GRAM' ? (
              <TextInput
                value={editor.amountGram}
                onChangeText={(value) =>
                  setEditor((current) => ({
                    ...current,
                    amountGram: value.replace(/\D/g, ''),
                  }))
                }
                keyboardType="number-pad"
                placeholder={t('journeyScreen.amountGramPlaceholder')}
                placeholderTextColor="#9a9a9a"
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: tones.cream }]}
              />
            ) : (
              <View style={styles.chipWrap}>
                {AMOUNT_LEVELS.map((value) => (
                  <Pressable
                    key={value}
                    onPress={() => setEditor((current) => ({ ...current, amountLevel: value }))}
                    style={[
                      styles.chip,
                      {
                        borderColor: theme.border,
                        backgroundColor: editor.amountLevel === value ? theme.accentSoft : tones.cream,
                      },
                    ]}>
                    <Text style={[styles.chipText, { color: theme.text }]}>{amountLevelLabel(value)}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.fieldSection}>
            <Text style={[styles.label, { color: theme.icon }]}>{t('journeyScreen.reactionLabel')}</Text>
            <View style={styles.chipWrap}>
              {REACTION_TYPES.map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setEditor((current) => ({ ...current, reactionType: value }))}
                  style={[
                    styles.chip,
                    {
                      borderColor: theme.border,
                      backgroundColor: editor.reactionType === value ? theme.accentSoft : tones.cream,
                    },
                  ]}>
                  <Text style={[styles.chipText, { color: theme.text }]}>{reactionLabel(value)}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.fieldSection}>
            <Text style={[styles.label, { color: theme.icon }]}>{t('journeyScreen.photoLabel')}</Text>
            <Text style={[styles.helperText, { color: theme.icon }]}>{t('journeyScreen.photoOptionalHint')}</Text>
            <Pressable onPress={() => void handlePickPhoto()} style={[styles.photoButton, { backgroundColor: tones.cream }]}>
              <Text style={[styles.photoButtonText, { color: theme.text }]}>
                {editor.photoUrl ? t('journeyScreen.photoChangeButton') : t('journeyScreen.photoAddButton')}
              </Text>
            </Pressable>
            {editor.photoUrl ? (
              <Image source={{ uri: editor.photoUrl }} style={styles.photoPreview} contentFit="cover" />
            ) : null}
          </View>

          <View style={styles.fieldSection}>
            <Text style={[styles.label, { color: theme.icon }]}>{t('journeyScreen.noteLabel')}</Text>
            <TextInput
              value={editor.note}
              onChangeText={(value) => setEditor((current) => ({ ...current, note: value }))}
              placeholder={t('journeyScreen.notePlaceholder')}
              placeholderTextColor="#9a9a9a"
              multiline
              style={[styles.noteInput, { borderColor: theme.border, color: theme.text, backgroundColor: tones.cream }]}
            />
          </View>
        </View>
        </Animated.View>
      </ScrollView>

      <SafeAreaView
        edges={['bottom']}
        style={[
          styles.bottomActionWrap,
          {
            backgroundColor: tones.paper,
            borderTopColor: theme.border,
          },
        ]}>
        <Pressable
          onPress={() => void handleSave()}
          disabled={isSaving || !canSave}
          style={[
            styles.saveButton,
            {
              backgroundColor: canSave ? theme.accent : theme.border,
              opacity: isSaving ? 0.6 : 1,
            },
          ]}>
          <Text style={styles.saveButtonText}>
            {editor.recordId ? t('journeyScreen.updateButton') : t('journeyScreen.saveButton')}
          </Text>
        </Pressable>
      </SafeAreaView>

      <Modal visible={pickerMode !== null} transparent animationType="fade" onRequestClose={() => setPickerMode(null)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.pickerModalCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: tones.lavender }]} />
            {pickerMode === 'date' ? (
              <>
                <View style={styles.pickerHeader}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>{t('journeyScreen.dateLabel')}</Text>
                  <Pressable onPress={() => setPickerMode(null)}>
                    <Text style={[styles.closeText, { color: theme.icon }]}>{t('journeyScreen.cancel')}</Text>
                  </Pressable>
                </View>

                <View style={styles.calendarHeader}>
                  <Pressable
                    onPress={() => setPickerMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                    style={[styles.calendarArrow, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                    <Text style={[styles.calendarArrowText, { color: theme.text }]}>{'‹'}</Text>
                  </Pressable>
                  <Text style={[styles.calendarMonthText, { color: theme.text }]}>{formatMonthLabel(pickerMonth)}</Text>
                  <Pressable
                    onPress={() => setPickerMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                    style={[styles.calendarArrow, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                    <Text style={[styles.calendarArrowText, { color: theme.text }]}>{'›'}</Text>
                  </Pressable>
                </View>

                <View style={styles.calendarWeekdayRow}>
                  {WEEKDAYS.map((label) => (
                    <Text key={label} style={[styles.calendarWeekdayText, { color: theme.icon }]}>
                      {label}
                    </Text>
                  ))}
                </View>

                <View style={styles.calendarMonthGrid}>
                  {monthGridDates.map((date) => {
                    const isCurrentMonth = date.getMonth() === pickerMonth.getMonth();
                    const isSelected = isSameDate(date, draftDate);

                    return (
                      <Pressable
                        key={`${date.toISOString()}-picker`}
                        onPress={() => setDraftDate(date)}
                        style={styles.calendarDayCell}>
                        <View
                          style={[
                            styles.calendarDayBubble,
                            !isCurrentMonth ? styles.calendarDayBubbleMuted : null,
                            isSelected ? styles.calendarDayBubbleActive : null,
                          ]}>
                          <Text
                            style={[
                              styles.calendarDayText,
                              { color: isSelected ? '#ffffff' : isCurrentMonth ? theme.text : theme.tabIconDefault },
                            ]}>
                            {date.getDate()}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable onPress={confirmDatePicker} style={[styles.modalConfirmButton, { backgroundColor: theme.accent }]}>
                  <Text style={styles.saveButtonText}>{t('journeyScreen.pickerDone')}</Text>
                </Pressable>
              </>
            ) : null}

            {pickerMode === 'time' ? (
              <>
                <View style={styles.pickerHeader}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>{t('journeyScreen.timeLabel')}</Text>
                  <Pressable onPress={() => setPickerMode(null)}>
                    <Text style={[styles.closeText, { color: theme.icon }]}>{t('journeyScreen.cancel')}</Text>
                  </Pressable>
                </View>

                <View style={styles.timePickerHeaderRow}>
                  <Text style={[styles.timePickerHeaderText, { color: theme.icon }]}>{t('journeyScreen.pickerAmPm')}</Text>
                  <Text style={[styles.timePickerHeaderText, { color: theme.icon }]}>{t('journeyScreen.pickerHour')}</Text>
                  <Text style={[styles.timePickerHeaderText, { color: theme.icon }]}>{t('journeyScreen.pickerMinute')}</Text>
                </View>

                <View style={styles.timePickerColumns}>
                  <View style={[styles.timePickerColumnCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.timePickerColumnContent}>
                      {(['AM', 'PM'] as const).map((period) => {
                        const selectedPeriod = draftTime.hour < 12 ? 'AM' : 'PM';
                        return (
                          <Pressable
                            key={period}
                            onPress={() =>
                              setDraftTime((current) => ({
                                ...current,
                                hour: convertTo24Hour(period, current.hour % 12 || 12),
                              }))
                            }
                            style={[
                              styles.timePickerItem,
                              selectedPeriod === period ? styles.timePickerItemActive : null,
                            ]}>
                            <Text
                              style={[
                                styles.timePickerItemText,
                                { color: selectedPeriod === period ? theme.text : theme.icon },
                              ]}>
                              {period === 'AM' ? t('journeyScreen.pickerAm') : t('journeyScreen.pickerPm')}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>

                  <View style={[styles.timePickerColumnCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.timePickerColumnContent}>
                      {TIME_HOURS_12.map((hour12) => {
                        const selectedHour12 = draftTime.hour % 12 || 12;
                        const selectedPeriod = draftTime.hour < 12 ? 'AM' : 'PM';
                        return (
                          <Pressable
                            key={`hour12-${hour12}`}
                            onPress={() =>
                              setDraftTime((current) => ({
                                ...current,
                                hour: convertTo24Hour(selectedPeriod, hour12),
                              }))
                            }
                            style={[
                              styles.timePickerItem,
                              selectedHour12 === hour12 ? styles.timePickerItemActive : null,
                            ]}>
                            <Text
                              style={[
                                styles.timePickerItemText,
                                { color: selectedHour12 === hour12 ? theme.text : theme.icon },
                              ]}>
                              {pad(hour12)}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>

                  <View style={[styles.timePickerColumnCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.timePickerColumnContent}>
                      {TIME_MINUTES.map((minute) => (
                        <Pressable
                          key={`minute-${minute}`}
                          onPress={() => setDraftTime((current) => ({ ...current, minute }))}
                          style={[
                            styles.timePickerItem,
                            draftTime.minute === minute ? styles.timePickerItemActive : null,
                          ]}>
                          <Text
                            style={[
                              styles.timePickerItemText,
                              { color: draftTime.minute === minute ? theme.text : theme.icon },
                            ]}>
                            {pad(minute)}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                <Pressable onPress={confirmTimePicker} style={[styles.modalConfirmButton, { backgroundColor: theme.accent }]}>
                  <Text style={styles.saveButtonText}>{t('journeyScreen.pickerDone')}</Text>
                </Pressable>
              </>
            ) : null}
          </View>
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
    paddingTop: 12,
    paddingBottom: Spacing.stickyActionContentPaddingBottom,
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
    opacity: 0.82,
  },
  decorBubbleTopRight: {
    width: 110,
    height: 110,
    right: -30,
    top: -24,
  },
  decorBubbleBottomLeft: {
    width: 76,
    height: 76,
    left: -20,
    bottom: -24,
  },
  formBubbleTop: {
    width: 120,
    height: 120,
    right: -34,
    top: -28,
  },
  formBubbleBottom: {
    width: 88,
    height: 88,
    left: -16,
    bottom: -22,
  },
  closeText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.cardPadding,
    gap: 2,
  },
  fieldSection: {
    gap: Spacing.fieldGap,
    paddingVertical: 10,
  },
  ingredientSection: {
    gap: Spacing.microGap,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfField: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  subLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  helperText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    minHeight: Spacing.formControlMinHeight,
    borderRadius: Spacing.formControlRadius,
    paddingHorizontal: Spacing.formControlHorizontal,
    paddingVertical: Spacing.formControlVertical,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  searchWrap: {
    gap: 0,
  },
  searchInputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  pickerField: {
    borderWidth: 1,
    borderRadius: Spacing.formControlRadius,
    minHeight: Spacing.formControlMinHeight,
    paddingHorizontal: Spacing.formControlHorizontal,
    justifyContent: 'center',
  },
  pickerFieldText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: Spacing.formControlRadius,
    minHeight: Spacing.formTextareaMinHeight,
    paddingHorizontal: Spacing.formControlHorizontal,
    paddingVertical: Spacing.formControlVertical,
    fontFamily: Fonts.sans,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  bottomActionWrap: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchResultCard: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    marginTop: -1,
  },
  searchEmptyCard: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchResultItem: {
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e6dfd4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchResultItemLast: {
    borderBottomWidth: 0,
  },
  searchResultMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 12,
  },
  searchResultImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  searchResultPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultPlaceholderEmoji: {
    fontSize: 18,
  },
  searchResultText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '500',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: Spacing.chipRadius,
    paddingHorizontal: Spacing.chipHorizontal,
    paddingVertical: Spacing.chipVertical,
  },
  tagText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: Spacing.chipRadius,
    paddingHorizontal: Spacing.chipHorizontal,
    paddingVertical: Spacing.chipVertical,
  },
  chipText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    minHeight: Spacing.formControlMinHeight,
    borderRadius: Spacing.formControlRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  photoButton: {
    minHeight: Spacing.formControlMinHeight,
    borderRadius: Spacing.formControlRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 28, 28, 0.28)',
    justifyContent: 'center',
    padding: 18,
  },
  pickerModalCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    gap: 16,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarArrow: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarArrowText: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '700',
  },
  calendarMonthText: {
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: '700',
  },
  calendarWeekdayRow: {
    flexDirection: 'row',
  },
  calendarWeekdayText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  calendarMonthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
  },
  calendarDayCell: {
    width: '14.28%',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayBubble: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1ef',
  },
  calendarDayBubbleMuted: {
    opacity: 0.45,
  },
  calendarDayBubbleActive: {
    backgroundColor: '#f57c4a',
  },
  calendarDayText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  timePickerHeaderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timePickerHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  timePickerColumns: {
    flexDirection: 'row',
    gap: 10,
  },
  timePickerColumnCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    height: 210,
    overflow: 'hidden',
  },
  timePickerColumnContent: {
    paddingVertical: 10,
    gap: 8,
  },
  timePickerItem: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderRadius: 14,
  },
  timePickerItemActive: {
    backgroundColor: '#F8E6AA',
  },
  timePickerItemText: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
  },
  modalConfirmButton: {
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveButton: {
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1c',
  },
});

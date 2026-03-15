/**
 * 초기 설정 온보딩 화면.
 *
 * 역할:
 * - 보호자가 아기 이름, 생년월일, 사진, 이유식 기준 정보를 순차적으로 입력한다.
 * - 프로필이 비어 있을 때만 노출되는 첫 진입 전용 흐름이다.
 *
 * 유지보수 포인트:
 * - 단계 순서는 짧고 명확하게 유지하고, 홈 수준의 복잡한 설정을 이 화면에 다시 끌어오지 않는다.
 */
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { BabyProfile, FeedingMethod, FeedingStage } from '@/constants/baby-profile';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useBabyProfile } from '@/hooks/use-baby-profile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';
import { useToast } from '@/hooks/use-toast';

const defaultBabyAvatar = require('../../assets/images/default-baby-avatar.png');

function normalizeBirthDateInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8);
}

const STAGE_OPTIONS: FeedingStage[] = ['PREP', 'INITIAL', 'MIDDLE', 'LATE', 'COMPLETE'];
const MEAL_OPTIONS: (1 | 2 | 3)[] = [1, 2, 3];
const METHOD_OPTIONS: FeedingMethod[] = ['TOPPING', 'TRADITIONAL', 'BLW_MIXED'];

function stageLabel(value: FeedingStage): string {
  switch (value) {
    case 'PREP':
      return t('home.profileForm.stagePrep');
    case 'INITIAL':
      return t('home.profileForm.stageInitial');
    case 'MIDDLE':
      return t('home.profileForm.stageMiddle');
    case 'LATE':
      return t('home.profileForm.stageLate');
    case 'COMPLETE':
    default:
      return t('home.profileForm.stageComplete');
  }
}

function mealLabel(value: 1 | 2 | 3): string {
  switch (value) {
    case 1:
      return t('home.profileForm.mealsOne');
    case 2:
      return t('home.profileForm.mealsTwo');
    case 3:
    default:
      return t('home.profileForm.mealsThree');
  }
}

function methodLabel(value: FeedingMethod): string {
  switch (value) {
    case 'TRADITIONAL':
      return t('home.profileForm.methodTraditional');
    case 'BLW_MIXED':
      return t('home.profileForm.methodBlwMixed');
    case 'TOPPING':
    default:
      return t('home.profileForm.methodTopping');
  }
}

function toIsoBirthDate(value: string): string {
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function getAgeInMonths(value: string): number {
  if (!/^\d{8}$/.test(value)) return -1;

  const iso = toIsoBirthDate(value);
  const birthDate = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return -1;

  const now = new Date();
  let months =
    (now.getFullYear() - birthDate.getFullYear()) * 12 +
    (now.getMonth() - birthDate.getMonth());

  if (now.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  return months;
}

function is24MonthsOrOlder(value: string): boolean {
  return getAgeInMonths(value) >= 24;
}

function isValidBirthDate(value: string): boolean {
  if (!/^\d{8}$/.test(value)) return false;

  const iso = toIsoBirthDate(value);
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;

  const [year, month, day] = [value.slice(0, 4), value.slice(4, 6), value.slice(6, 8)].map(Number);
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

export default function IntroScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { profile, isLoading, saveProfile } = useBabyProfile();
  const { showToast } = useToast();

  const [babyNameInput, setBabyNameInput] = useState('');
  const [birthDateInput, setBirthDateInput] = useState('');
  const [feedingStartDateInput, setFeedingStartDateInput] = useState('');
  const [feedingStageInput, setFeedingStageInput] = useState<FeedingStage>('INITIAL');
  const [mealsPerDayInput, setMealsPerDayInput] = useState<1 | 2 | 3>(1);
  const [feedingMethodInput, setFeedingMethodInput] = useState<FeedingMethod>('TOPPING');
  const [photoUriInput, setPhotoUriInput] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [profileStep, setProfileStep] = useState<1 | 2 | 3>(1);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();

  const step2Anim = useRef(new Animated.Value(0)).current;
  const step3Anim = useRef(new Animated.Value(0)).current;
  const bgFloatA = useRef(new Animated.Value(0)).current;
  const bgFloatB = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgFloatA, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bgFloatA, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bgFloatB, {
          toValue: 1,
          duration: 3400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bgFloatB, {
          toValue: 0,
          duration: 3400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bgFloatA, bgFloatB, glowPulse]);

  useEffect(() => {
    if (!profile) return;

    setBabyNameInput(profile.babyName);
    setBirthDateInput(normalizeBirthDateInput(profile.birthDate));
    setFeedingStartDateInput(normalizeBirthDateInput(profile.feedingStartDate ?? ''));
    setFeedingStageInput(profile.feedingStage ?? 'INITIAL');
    setMealsPerDayInput(profile.mealsPerDay ?? 1);
    setFeedingMethodInput(profile.feedingMethod ?? 'TOPPING');
    setPhotoUriInput(profile.photoUri);
    setProfileStep(3);
    setAgeConfirmed(is24MonthsOrOlder(normalizeBirthDateInput(profile.birthDate)));
    step2Anim.setValue(1);
    step3Anim.setValue(1);
  }, [profile, step2Anim, step3Anim]);

  const progress = useMemo(() => (profileStep / 3) * 100, [profileStep]);

  const confirmOlderBirthDate = (onConfirm: () => void) => {
    Alert.alert(t('home.profileForm.ageConfirmTitle'), t('home.profileForm.ageConfirmMessage'), [
      { text: t('home.profileForm.ageConfirmCancel'), style: 'cancel' },
      {
        text: t('home.profileForm.ageConfirmContinue'),
        onPress: () => {
          setAgeConfirmed(true);
          onConfirm();
        },
      },
    ]);
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(t('home.profileForm.permissionTitle'), t('home.profileForm.permissionMessage'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUriInput(result.assets[0].uri);
    }
  };

  const handleContinueFromName = () => {
    if (!babyNameInput.trim()) {
      showToast({
        message: t('home.profileForm.validationName'),
        variant: 'error',
      });
      return;
    }

    if (profileStep < 2) {
      setProfileStep(2);
      Animated.timing(step2Anim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  };

  const handleContinueFromBirthDate = () => {
    const birthDate = normalizeBirthDateInput(birthDateInput.trim());

    if (!birthDate) {
      showToast({
        message: t('home.profileForm.validationBirthDate'),
        variant: 'error',
      });
      return;
    }

    if (!isValidBirthDate(birthDate)) {
      showToast({
        message: t('home.profileForm.validationBirthDateFormat'),
        variant: 'error',
      });
      return;
    }

    const goNext = () => {
      if (profileStep < 3) {
        setProfileStep(3);
        Animated.timing(step3Anim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    };

    if (is24MonthsOrOlder(birthDate) && !ageConfirmed) {
      confirmOlderBirthDate(goNext);
      return;
    }

    goNext();
  };

  const handleSaveProfile = async () => {
    const babyName = babyNameInput.trim();
    const birthDate = normalizeBirthDateInput(birthDateInput.trim());
    const feedingStartDate = normalizeBirthDateInput(feedingStartDateInput.trim());

    if (!babyName) {
      showToast({
        message: t('home.profileForm.validationName'),
        variant: 'error',
      });
      return;
    }

    if (!birthDate) {
      showToast({
        message: t('home.profileForm.validationBirthDate'),
        variant: 'error',
      });
      return;
    }

    if (!isValidBirthDate(birthDate)) {
      showToast({
        message: t('home.profileForm.validationBirthDateFormat'),
        variant: 'error',
      });
      return;
    }

    if (feedingStartDate && !isValidBirthDate(feedingStartDate)) {
      showToast({
        message: t('home.profileForm.validationBirthDateFormat'),
        variant: 'error',
      });
      return;
    }

    const nextProfile: BabyProfile = {
      babyName,
      birthDate: toIsoBirthDate(birthDate),
      feedingStartDate: feedingStartDate ? toIsoBirthDate(feedingStartDate) : undefined,
      feedingStage: feedingStageInput,
      mealsPerDay: mealsPerDayInput,
      feedingMethod: feedingMethodInput,
      photoUri: photoUriInput,
    };

    const performSave = async () => {
      try {
        setIsSaving(true);
        await saveProfile(nextProfile);
        router.replace('/(tabs)/home');
      } catch {
        showToast({
          message: t('home.profileForm.saveFailedMessage'),
          variant: 'error',
        });
      } finally {
        setIsSaving(false);
      }
    };

    if (is24MonthsOrOlder(birthDate) && !ageConfirmed) {
      confirmOlderBirthDate(() => {
        void performSave();
      });
      return;
    }

    await performSave();
  };

  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.page, styles.loadingPage, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.icon }]}>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}> 
      <View style={styles.bgLayer} pointerEvents="none">
        <Animated.View
          style={[
            styles.blobA,
            {
              backgroundColor: '#ffd978',
              transform: [
                {
                  translateY: bgFloatA.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 18],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.blobB,
            {
              backgroundColor: '#f8d2b3',
              transform: [
                {
                  translateY: bgFloatB.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -16],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowPulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.5],
              }),
            },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.hero, topStyle]}>
          <Text style={[styles.eyebrow, { color: theme.icon }]}>{t('home.profileForm.overline')}</Text>
          <Text style={[styles.title, { color: theme.text }]}>{t('home.profileForm.title')}</Text>
          <Text style={[styles.subtitle, { color: theme.icon }]}>{t('home.profileForm.subtitle')}</Text>

          <View style={[styles.progressTrack, { backgroundColor: '#e7dfd2' }]}> 
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.accent,
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressLabel, { color: theme.icon }]}>{profileStep} / 3</Text>
        </Animated.View>

        <Animated.View style={sectionsStyle}>
        <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>{t('home.profileForm.stepNameTitle')}</Text>
            <TextInput
              value={babyNameInput}
              onChangeText={setBabyNameInput}
              placeholder={t('home.profileForm.babyNamePlaceholder')}
              placeholderTextColor="#9a9a9a"
              style={[styles.input, { borderColor: '#f1ddad', color: theme.text, backgroundColor: '#fffef9' }]}
            />
            {profileStep === 1 ? (
              <Pressable onPress={handleContinueFromName} style={[styles.stepButton, { backgroundColor: theme.accent }]}> 
                <Text style={styles.stepButtonText}>{t('home.profileForm.next')}</Text>
              </Pressable>
            ) : null}
          </View>

          {profileStep >= 2 ? (
            <Animated.View
              style={[
                styles.inputGroup,
                styles.stepSectionSpacing,
                {
                  opacity: step2Anim,
                  transform: [
                    {
                      translateY: step2Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={[styles.stepTitle, { color: theme.text }]}>{t('home.profileForm.stepBirthDateTitle')}</Text>
              <TextInput
                value={birthDateInput}
                onChangeText={(value) => {
                  setBirthDateInput(normalizeBirthDateInput(value));
                  setAgeConfirmed(false);
                }}
                placeholder={t('home.profileForm.birthDatePlaceholder')}
                placeholderTextColor="#9a9a9a"
                keyboardType="number-pad"
                maxLength={8}
                style={[styles.input, { borderColor: '#f1ddad', color: theme.text, backgroundColor: '#fffef9' }]}
              />
              {profileStep === 2 ? (
                <Pressable onPress={handleContinueFromBirthDate} style={[styles.stepButton, { backgroundColor: theme.accent }]}> 
                  <Text style={styles.stepButtonText}>{t('home.profileForm.next')}</Text>
                </Pressable>
              ) : null}
            </Animated.View>
          ) : null}

          {profileStep >= 3 ? (
            <Animated.View
              style={[
                styles.inputGroup,
                styles.stepSectionSpacing,
                {
                  opacity: step3Anim,
                  transform: [
                    {
                      translateY: step3Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={[styles.stepTitle, { color: theme.text }]}>{t('home.profileForm.stepPhotoTitle')}</Text>

              <View style={[styles.photoRow, photoUriInput ? styles.photoRowWithPreview : styles.photoRowOnlyButton]}>
                {photoUriInput ? <Image source={{ uri: photoUriInput }} style={styles.photoPreview} contentFit="cover" /> : null}
                <Pressable
                  onPress={handlePickPhoto}
                  style={[
                    styles.photoButton,
                    photoUriInput ? styles.photoButtonInline : styles.photoButtonFull,
                    { backgroundColor: '#ffe9b0' },
                  ]}>
                  <Text style={[styles.photoButtonText, { color: '#1c1c1c' }]}>
                    {photoUriInput ? t('home.profileForm.photoEditButton') : t('home.profileForm.photoButton')}
                  </Text>
                </Pressable>
              </View>
              {!photoUriInput ? (
                <View style={styles.defaultPreviewWrap}>
                  <Image source={defaultBabyAvatar} style={styles.photoPreview} contentFit="cover" />
                </View>
              ) : null}

              <Text style={[styles.stepTitle, styles.detailSectionTitle, { color: theme.text }]}>
                {t('home.profileForm.stepFeedingSetupTitle')}
              </Text>

              <Text style={[styles.inputLabel, { color: theme.icon }]}>{t('home.profileForm.feedingStartDateLabel')}</Text>
              <TextInput
                value={feedingStartDateInput}
                onChangeText={(value) => setFeedingStartDateInput(normalizeBirthDateInput(value))}
                placeholder={t('home.profileForm.feedingStartDatePlaceholder')}
                placeholderTextColor="#9a9a9a"
                keyboardType="number-pad"
                maxLength={8}
                style={[styles.input, { borderColor: '#f1ddad', color: theme.text, backgroundColor: '#fffef9' }]}
              />

              <Text style={[styles.inputLabel, { color: theme.icon }]}>{t('home.profileForm.feedingStageLabel')}</Text>
              <View style={styles.optionWrap}>
                {STAGE_OPTIONS.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => setFeedingStageInput(option)}
                    style={[
                      styles.optionChip,
                      {
                        borderColor: theme.border,
                        backgroundColor: feedingStageInput === option ? '#ffefc8' : '#fffef9',
                      },
                    ]}>
                    <Text style={[styles.optionChipText, { color: theme.text }]}>{stageLabel(option)}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.inputLabel, { color: theme.icon }]}>{t('home.profileForm.mealsPerDayLabel')}</Text>
              <View style={styles.optionWrap}>
                {MEAL_OPTIONS.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => setMealsPerDayInput(option)}
                    style={[
                      styles.optionChip,
                      {
                        borderColor: theme.border,
                        backgroundColor: mealsPerDayInput === option ? '#ffefc8' : '#fffef9',
                      },
                    ]}>
                    <Text style={[styles.optionChipText, { color: theme.text }]}>{mealLabel(option)}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.inputLabel, { color: theme.icon }]}>{t('home.profileForm.feedingMethodLabel')}</Text>
              <View style={styles.optionWrap}>
                {METHOD_OPTIONS.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => setFeedingMethodInput(option)}
                    style={[
                      styles.optionChip,
                      {
                        borderColor: theme.border,
                        backgroundColor: feedingMethodInput === option ? '#ffefc8' : '#fffef9',
                      },
                    ]}>
                    <Text style={[styles.optionChipText, { color: theme.text }]}>{methodLabel(option)}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable onPress={() => void handleSaveProfile()} disabled={isSaving} style={[styles.submitButton, { backgroundColor: '#ffb928' }]}> 
                <Text style={styles.submitButtonText}>{isSaving ? t('common.loading') : t('home.profileForm.submit')}</Text>
              </Pressable>
            </Animated.View>
          ) : null}
        </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  loadingPage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  blobA: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    top: -45,
    right: -50,
    opacity: 0.42,
  },
  blobB: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    bottom: -120,
    left: -95,
    opacity: 0.34,
  },
  glow: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    top: 180,
    alignSelf: 'center',
    backgroundColor: '#fff1c9',
  },
  content: {
    width: '100%',
    paddingHorizontal: Spacing.introScreenHorizontal,
    paddingTop: Spacing.introTopPadding,
    paddingBottom: Spacing.screenBottomPadding,
    gap: Spacing.introSectionGap,
  },
  hero: {
    borderRadius: 26,
    padding: Spacing.introCardPadding,
    gap: 8,
    backgroundColor: '#fff9eb',
    borderWidth: 1,
    borderColor: '#f7df9a',
  },
  eyebrow: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  progressTrack: {
    marginTop: 4,
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.introCardPadding,
    gap: Spacing.introCardInnerGap,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  inputGroup: {
    gap: Spacing.introInputGap,
  },
  stepSectionSpacing: {
    marginTop: Spacing.introStepSpacing,
  },
  stepTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 3,
  },
  detailSectionTitle: {
    marginTop: 14,
  },
  inputLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    minHeight: Spacing.formControlMinHeight,
    borderRadius: Spacing.formControlRadius,
    paddingHorizontal: Spacing.formControlHorizontal,
    paddingVertical: Spacing.formControlVertical,
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
  photoRow: {
    gap: 8,
  },
  photoRowOnlyButton: {
    width: '100%',
  },
  photoRowWithPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultPreviewWrap: {
    alignItems: 'center',
    marginTop: 8,
  },
  photoButton: {
    minHeight: Spacing.formControlMinHeight,
    borderRadius: Spacing.formControlRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonFull: {
    width: '100%',
  },
  photoButtonInline: {
    flex: 1,
  },
  photoButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  photoPreview: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 2,
  },
  optionChip: {
    borderWidth: 1,
    borderRadius: Spacing.chipRadius,
    paddingHorizontal: Spacing.chipHorizontal,
    paddingVertical: Spacing.chipVertical,
  },
  optionChipText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  stepButton: {
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  stepButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1c',
  },
  submitButton: {
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.introCardPadding,
  },
  submitButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1c1c',
  },
});

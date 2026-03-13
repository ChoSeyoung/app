import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import type { BabyProfile } from '@/constants/baby-profile';
import { useBabyProfile } from '@/hooks/use-baby-profile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';
import { useToast } from '@/hooks/use-toast';

const defaultBabyAvatar = require('../assets/images/default-baby-avatar.png');

function normalizeDateInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8);
}

function toIsoDate(value: string): string {
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function isValidDateInput(value: string): boolean {
  if (!/^\d{8}$/.test(value)) return false;

  const iso = toIsoDate(value);
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;

  const [year, month, day] = [value.slice(0, 4), value.slice(4, 6), value.slice(6, 8)].map(Number);
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

export default function ProfileEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
  };
  const { profile, saveProfile } = useBabyProfile();
  const { showToast } = useToast();

  const [babyNameInput, setBabyNameInput] = useState('');
  const [birthDateInput, setBirthDateInput] = useState('');
  const [feedingStartDateInput, setFeedingStartDateInput] = useState('');
  const [photoUriInput, setPhotoUriInput] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setBabyNameInput(profile.babyName);
    setBirthDateInput(normalizeDateInput(profile.birthDate));
    setFeedingStartDateInput(normalizeDateInput(profile.feedingStartDate ?? ''));
    setPhotoUriInput(profile.photoUri);
  }, [profile]);

  const canSave = babyNameInput.trim().length > 0 && isValidDateInput(birthDateInput);
  const returnTo = typeof params.returnTo === 'string' ? params.returnTo : undefined;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/more');
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

  const handleSave = async () => {
    if (isSaving || !canSave) return;

    if (!babyNameInput.trim()) {
      showToast({
        title: t('home.profileForm.validationTitle'),
        message: t('home.profileForm.validationName'),
        variant: 'error',
      });
      return;
    }

    if (!birthDateInput) {
      showToast({
        title: t('home.profileForm.validationTitle'),
        message: t('home.profileForm.validationBirthDate'),
        variant: 'error',
      });
      return;
    }

    if (!isValidDateInput(birthDateInput)) {
      showToast({
        title: t('home.profileForm.validationTitle'),
        message: t('home.profileForm.validationBirthDateFormat'),
        variant: 'error',
      });
      return;
    }

    if (feedingStartDateInput && !isValidDateInput(feedingStartDateInput)) {
      showToast({
        title: t('home.profileForm.validationTitle'),
        message: t('profileEditorScreen.validationStartDateFormat'),
        variant: 'error',
      });
      return;
    }

    const nextProfile: BabyProfile = {
      ...(profile ?? { babyName: '', birthDate: '' }),
      babyName: babyNameInput.trim(),
      birthDate: toIsoDate(birthDateInput),
      photoUri: photoUriInput,
      feedingStartDate: feedingStartDateInput ? toIsoDate(feedingStartDateInput) : undefined,
    };

    setIsSaving(true);
    try {
      await saveProfile(nextProfile);
      showToast({
        title: t('profileScreen.title'),
        message: t('profileEditorScreen.saveSuccess'),
        variant: 'success',
      });
      router.replace(returnTo ?? '/(tabs)/more');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E4DCF6" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={topStyle}>
          <HeroHeaderCard
            title={t('profileEditorScreen.title')}
            subtitle={t('profileEditorScreen.subtitle')}
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

          <View style={styles.photoSection}>
            <View style={[styles.photoFrame, { backgroundColor: tones.cream, borderColor: theme.border }]}>
              <Image
                source={photoUriInput ? { uri: photoUriInput } : defaultBabyAvatar}
                style={styles.photoPreview}
                contentFit="cover"
              />
            </View>
            <View style={styles.photoTextWrap}>
              <Text style={[styles.label, { color: theme.icon }]}>{t('home.profileForm.photoLabel')}</Text>
              <Text style={[styles.helperText, { color: theme.icon }]}>{t('profileEditorScreen.photoHint')}</Text>
            </View>
            <Pressable onPress={() => void handlePickPhoto()} style={[styles.photoButton, { backgroundColor: tones.cream }]}>
              <Text style={[styles.photoButtonText, { color: theme.text }]}>
                {photoUriInput ? t('home.profileForm.photoEditButton') : t('home.profileForm.photoButton')}
              </Text>
            </Pressable>
          </View>

          <View style={styles.fieldSection}>
            <Text style={[styles.label, { color: theme.icon }]}>{t('home.profileForm.babyNameLabel')}</Text>
            <TextInput
              value={babyNameInput}
              onChangeText={setBabyNameInput}
              placeholder={t('home.profileForm.babyNamePlaceholder')}
              placeholderTextColor="#9a9a9a"
              style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: tones.cream }]}
            />
          </View>

          <View style={styles.fieldSection}>
            <Text style={[styles.label, { color: theme.icon }]}>{t('home.profileForm.birthDateLabel')}</Text>
            <Text style={[styles.helperText, { color: theme.icon }]}>{t('profileEditorScreen.birthDateHint')}</Text>
            <TextInput
              value={birthDateInput}
              onChangeText={(value) => setBirthDateInput(normalizeDateInput(value))}
              keyboardType="number-pad"
              placeholder={t('home.profileForm.birthDatePlaceholder')}
              placeholderTextColor="#9a9a9a"
              style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: tones.cream }]}
            />
          </View>

          <View style={styles.fieldSection}>
            <Text style={[styles.label, { color: theme.icon }]}>{t('home.profileForm.feedingStartDateLabel')}</Text>
            <Text style={[styles.helperText, { color: theme.icon }]}>{t('profileEditorScreen.feedingStartDateHint')}</Text>
            <TextInput
              value={feedingStartDateInput}
              onChangeText={(value) => setFeedingStartDateInput(normalizeDateInput(value))}
              keyboardType="number-pad"
              placeholder={t('home.profileForm.feedingStartDatePlaceholder')}
              placeholderTextColor="#9a9a9a"
              style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: tones.cream }]}
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
          <Text style={styles.saveButtonText}>{t('profileEditorScreen.saveButton')}</Text>
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
  formCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.cardPadding,
    gap: Spacing.cardStackGap,
  },
  photoSection: {
    gap: Spacing.fieldGap,
    alignItems: 'flex-start',
  },
  photoFrame: {
    width: 88,
    height: 88,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoTextWrap: {
    gap: Spacing.microGap,
  },
  fieldSection: {
    gap: Spacing.microGap,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  helperText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 18,
  },
  input: {
    minHeight: Spacing.formControlMinHeight,
    borderWidth: 1,
    borderRadius: Spacing.formControlRadius,
    paddingHorizontal: Spacing.formControlHorizontal,
    paddingVertical: Spacing.formControlVertical,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  photoButton: {
    minHeight: Spacing.formControlMinHeight,
    borderRadius: Spacing.formControlRadius,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
  bottomActionWrap: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 12,
    paddingBottom: 8,
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

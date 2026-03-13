import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FoldableCard } from '@/components/design-system/foldable-card';
import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useBabyProfile } from '@/hooks/use-baby-profile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStarterGuideReadiness } from '@/hooks/use-starter-guide-readiness';
import { useStarterGuideProgress } from '@/hooks/use-starter-guide-progress';
import { useToast } from '@/hooks/use-toast';

export default function WeaningReadinessChecklistScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { profile, isLoading: isProfileLoading } = useBabyProfile();
  const { progress, toggleReadinessChecked } = useStarterGuideProgress();
  const { showToast } = useToast();
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    ageInMonths,
    autoAgeReady,
    checkedManualCount,
    manualChecklistItems,
    positiveChecklistCount,
    readinessItems,
    readinessReferences,
    readinessStatus,
    readinessStatusCopy,
  } = useStarterGuideReadiness({
    birthDate: profile?.birthDate,
    readinessCheckedIds: progress.readinessCheckedIds,
  });
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
    peach: '#FFF1E5',
  };

  const readinessStatusTone = useMemo(() => {
    switch (readinessStatus) {
      case 'ready':
        return tones.cream;
      case 'almost':
        return tones.peach;
      case 'wait':
        return tones.blush;
      case 'unknown':
      default:
        return tones.lavender;
    }
  }, [readinessStatus, tones.blush, tones.cream, tones.lavender, tones.peach]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/weaning-start-guide');
  };

  const openReference = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      showToast({
        message: t('starterGuideScreen.referenceOpenFailed'),
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    if (isProfileLoading) return;
    if (profile?.birthDate) return;

    router.replace({
      pathname: '/profile-editor',
      params: { returnTo: '/weaning-readiness-checklist' },
    });
  }, [isProfileLoading, profile?.birthDate, router]);

  useEffect(() => {
    return () => {
      if (!navigationTimerRef.current) return;
      clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    };
  }, []);

  const handleToggleReadiness = (itemId: string, isChecked: boolean) => {
    void toggleReadinessChecked(itemId);

    if (isChecked) return;
    if (autoAgeReady !== true) return;
    if (checkedManualCount + 1 !== manualChecklistItems.length) return;

    if (navigationTimerRef.current) {
      clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }

    showToast({
      message: t('starterGuideScreen.readinessCompleteToastBody'),
      variant: 'success',
    });

    navigationTimerRef.current = setTimeout(() => {
      router.replace('/weaning-start-guide');
    }, 650);
  };

  if (isProfileLoading || !profile?.birthDate) {
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
            title={t('starterGuideScreen.readinessTitle')}
            subtitle={t('starterGuideScreen.readinessSummaryBody')}
            onBack={goBack}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />

          <View style={[styles.readinessCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <View style={[styles.decorBubble, styles.readinessBubbleTop, { backgroundColor: tones.cream }]} />
            <View style={[styles.decorBubble, styles.readinessBubbleBottom, { backgroundColor: tones.lavender }]} />

            <FoldableCard
              title={t('starterGuideScreen.readinessCautionTitle')}
              theme={theme}
              backgroundColor={tones.blush}
              borderColor={theme.border}>
              <View>
                <Text style={[styles.cautionBody, { color: theme.icon }]}>{t('starterGuideScreen.readinessCautionBody')}</Text>
              </View>
            </FoldableCard>

            <View style={[styles.readinessStatusCard, { backgroundColor: readinessStatusTone, borderColor: theme.border }]}>
              <View style={styles.readinessStatusHeader}>
                <View style={styles.readinessStatusTitleWrap}>
                  <Text style={[styles.readinessStatusTitle, { color: theme.text }]}>{readinessStatusCopy.title}</Text>
                  <Text style={[styles.readinessStatusBody, { color: theme.icon }]}>{readinessStatusCopy.body}</Text>
                </View>
                <View style={[styles.progressBadge, { backgroundColor: theme.accentSoft }]}>
                  <Text style={[styles.progressBadgeText, { color: theme.text }]}>
                    {t('starterGuideScreen.readinessSignalsLabel', {
                      count: positiveChecklistCount,
                      total: readinessItems.length,
                    })}
                  </Text>
                </View>
              </View>

              {ageInMonths === null ? (
                <View style={styles.readinessMetaRow}>
                  <Pressable
                    onPress={() => router.push('/profile-editor')}
                    style={[styles.profileActionChip, { backgroundColor: theme.accent }]}>
                    <Text style={[styles.profileActionChipText, { color: theme.text }]}>
                      {t('starterGuideScreen.readinessProfileAction')}
                    </Text>
                  </Pressable>
                </View>
              ) : null}
            </View>

            <View style={styles.readinessList}>
              {readinessItems.map((item) => {
                const isAuto = item.autoDerived === 'ageAroundSixMonths';
                const isChecked = isAuto ? autoAgeReady === true : progress.readinessCheckedIds.includes(item.id);
                const iconName = isChecked ? 'check-circle' : isAuto ? 'radio-button-unchecked' : 'check-box-outline-blank';

                return (
                  <Pressable
                    key={item.id}
                    disabled={isAuto}
                    onPress={() => handleToggleReadiness(item.id, isChecked)}
                    style={[
                      styles.readinessItemCard,
                      {
                        backgroundColor: isChecked ? '#FFF7E1' : tones.cream,
                        borderColor: isChecked ? theme.accent : theme.border,
                        opacity: isAuto ? 0.98 : 1,
                      },
                    ]}>
                    <View style={styles.readinessItemHeader}>
                      <View style={styles.readinessItemTitleWrap}>
                        <MaterialIcons
                          name={iconName}
                          size={20}
                          color={isChecked ? '#4B9C68' : theme.icon}
                        />
                        <Text style={[styles.readinessItemTitle, { color: theme.text }]}>{item.title}</Text>
                      </View>
                    </View>
                    <Text style={[styles.readinessItemBody, { color: theme.icon }]}>{item.body}</Text>
                    <View style={styles.readinessSourceChips}>
                      {item.sources.map((source) => (
                        <View
                          key={`${item.id}-${source.id}`}
                          style={[styles.readinessSourceChip, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                          <Text style={[styles.readinessSourceChipText, { color: theme.text }]}>{source.shortLabel}</Text>
                        </View>
                      ))}
                    </View>
                  </Pressable>
                );
              })}
            </View>

          </View>

          <View style={[styles.referenceCard, styles.decorativeCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.referenceTitle')}</Text>
            </View>

            <View style={styles.referenceList}>
              {readinessReferences.map((reference) => (
                <View
                  key={reference.id}
                  style={[styles.referenceItemCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                  <View style={styles.referenceItemHeader}>
                    <View style={styles.referenceItemTextWrap}>
                      <Text style={[styles.referenceOrg, { color: theme.icon }]}>
                        {reference.organization} · {reference.year}
                      </Text>
                      <Text style={[styles.referenceTitleText, { color: theme.text }]}>{reference.title}</Text>
                    </View>
                    <Pressable
                      onPress={() => void openReference(reference.url)}
                      style={[styles.referenceAction, { backgroundColor: theme.accentSoft, borderColor: theme.border }]}>
                      <MaterialIcons name="open-in-new" size={16} color={theme.text} />
                      <Text style={[styles.referenceActionText, { color: theme.text }]}>
                        {t('starterGuideScreen.referenceOpenAction')}
                      </Text>
                    </Pressable>
                  </View>
                  <Text style={[styles.referenceSummary, { color: theme.icon }]}>
                    {t(reference.summaryKey)}
                  </Text>
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
  page: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.screenTopPadding,
    paddingBottom: Spacing.screenBottomPadding,
  },
  cardStack: {
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
  readinessBubbleTop: {
    width: 126,
    height: 126,
    top: -30,
    right: -24,
  },
  readinessBubbleBottom: {
    width: 140,
    height: 140,
    bottom: -42,
    left: -34,
    opacity: 0.56,
  },
  readinessCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 14,
  },
  readinessStatusCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  readinessStatusHeader: {
    gap: 10,
  },
  readinessStatusTitleWrap: {
    gap: 4,
  },
  readinessStatusTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  readinessStatusBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  progressBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  progressBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  readinessMetaRow: {
    gap: 10,
  },
  readinessMetaCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  metaLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 16,
  },
  readinessMetaValue: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  profileActionChip: {
    minHeight: Spacing.compactButtonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.compactButtonRadius,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  profileActionChipText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  readinessList: {
    gap: 10,
  },
  readinessItemCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  readinessItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  readinessItemTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  readinessItemTitle: {
    flex: 1,
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  readinessModeChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  readinessModeChipText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  readinessItemBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  readinessSourceRow: {
    gap: 8,
  },
  readinessSourceLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  readinessSourceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  readinessSourceChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  readinessSourceChipText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  cautionBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  referenceCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 12,
  },
  sectionHeaderRow: {
    gap: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  sectionBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  referenceList: {
    gap: 10,
  },
  referenceItemCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  referenceItemHeader: {
    gap: 12,
  },
  referenceItemTextWrap: {
    flexShrink: 1,
    width: '100%',
    gap: 4,
  },
  referenceOrg: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  referenceTitleText: {
    flexShrink: 1,
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  referenceSummary: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  referenceAction: {
    alignSelf: 'flex-start',
    minHeight: Spacing.compactButtonMinHeight,
    borderWidth: 1,
    borderRadius: Spacing.compactButtonRadius,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  referenceActionText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
});

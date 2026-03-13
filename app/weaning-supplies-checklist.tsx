import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStarterGuideProgress } from '@/hooks/use-starter-guide-progress';
import { useStarterGuideSupplies } from '@/hooks/use-starter-guide-supplies';

export default function WeaningSuppliesChecklistScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { progress, toggleSuppliesChecked } = useStarterGuideProgress();
  const { suppliesItems, checkedSuppliesCount } = useStarterGuideSupplies(progress.suppliesCheckedIds);
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
  };

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
            title={t('starterGuideScreen.suppliesChecklistTitle')}
            subtitle={t('starterGuideScreen.suppliesChecklistBody')}
            onBack={goBack}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />

          <View style={[styles.summaryCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>{t('starterGuideScreen.suppliesChecklistTitle')}</Text>
            <View style={[styles.progressBadge, { backgroundColor: theme.accentSoft }]}>
              <Text style={[styles.progressBadgeText, { color: theme.text }]}>
                {t('starterGuideScreen.suppliesProgressLabel', {
                  count: checkedSuppliesCount,
                  total: suppliesItems.length,
                })}
              </Text>
            </View>
          </View>

          <View style={styles.itemList}>
            {suppliesItems.map((item) => {
              const isChecked = progress.suppliesCheckedIds.includes(item.id);

              return (
                <Pressable
                  key={item.id}
                  onPress={() => void toggleSuppliesChecked(item.id)}
                  style={[
                    styles.itemCard,
                    {
                      backgroundColor: isChecked ? '#FFF7E1' : tones.cream,
                      borderColor: isChecked ? theme.accent : theme.border,
                    },
                  ]}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemTitleWrap}>
                      <MaterialIcons
                        name={isChecked ? 'check-circle' : 'check-box-outline-blank'}
                        size={20}
                        color={isChecked ? '#4B9C68' : theme.icon}
                      />
                      <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
                    </View>
                  </View>
                  <Text style={[styles.itemBody, { color: theme.icon }]}>{item.body}</Text>
                </Pressable>
              );
            })}
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
  summaryCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.cardPadding,
    gap: 10,
  },
  summaryTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
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
  itemList: {
    gap: 10,
  },
  itemCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemTitle: {
    flex: 1,
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  itemBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
});

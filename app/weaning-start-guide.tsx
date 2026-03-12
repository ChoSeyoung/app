import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdSlotCard } from '@/components/design-system/ad-slot-card';
import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';

type StarterCard = {
  title: string;
  body: string;
};

type StarterFaq = {
  question: string;
  answer: string;
};

export default function WeaningStartGuideScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
  };

  const basics = useMemo<StarterCard[]>(
    () => [
      { title: t('starterGuideScreen.basicsCard1Title'), body: t('starterGuideScreen.basicsCard1Body') },
      { title: t('starterGuideScreen.basicsCard2Title'), body: t('starterGuideScreen.basicsCard2Body') },
      { title: t('starterGuideScreen.basicsCard3Title'), body: t('starterGuideScreen.basicsCard3Body') },
    ],
    []
  );

  const checklist = useMemo<string[]>(
    () => [
      t('starterGuideScreen.checkItem1'),
      t('starterGuideScreen.checkItem2'),
      t('starterGuideScreen.checkItem3'),
      t('starterGuideScreen.checkItem4'),
    ],
    []
  );

  const faqItems = useMemo<StarterFaq[]>(
    () => [
      { question: t('starterGuideScreen.faq1Q'), answer: t('starterGuideScreen.faq1A') },
      { question: t('starterGuideScreen.faq2Q'), answer: t('starterGuideScreen.faq2A') },
      { question: t('starterGuideScreen.faq3Q'), answer: t('starterGuideScreen.faq3A') },
      { question: t('starterGuideScreen.faq4Q'), answer: t('starterGuideScreen.faq4A') },
    ],
    []
  );

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/more');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[topStyle, styles.cardStack]}>
          <HeroHeaderCard
            title={t('starterGuideScreen.title')}
            subtitle={t('starterGuideScreen.subtitle')}
            eyebrow={t('starterGuideScreen.eyebrow')}
            onBack={goBack}
            theme={theme}
            backgroundColor={tones.lavender}
            borderColor={theme.border}
            backButtonColor={tones.paper}
            topBubbleColor={tones.paper}
            bottomBubbleColor={tones.blush}
          />
        </Animated.View>

        <Animated.View style={[sectionsStyle, styles.cardStack]}>
          <View style={[styles.sectionCard, styles.decorativeCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.basicsTitle')}</Text>
            <Text style={[styles.sectionBody, { color: theme.icon }]}>{t('starterGuideScreen.basicsBody')}</Text>
            <View style={styles.cardGrid}>
              {basics.map((item, index) => (
                <View
                  key={item.title}
                  style={[
                    styles.miniCard,
                    {
                      backgroundColor: index % 3 === 0 ? tones.cream : index % 3 === 1 ? '#FFF4E8' : tones.blush,
                      borderColor: theme.border,
                    },
                  ]}>
                  <Text style={[styles.miniCardTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.miniCardBody, { color: theme.icon }]}>{item.body}</Text>
                </View>
              ))}
            </View>
          </View>

          <AdSlotCard tone="cream" />

          <View style={[styles.sectionCard, styles.decorativeCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.checklistTitle')}</Text>
            <Text style={[styles.sectionBody, { color: theme.icon }]}>{t('starterGuideScreen.checklistBody')}</Text>
            <View style={styles.checkList}>
              {checklist.map((item, index) => (
                <View key={item} style={[styles.checkRow, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                  <View style={[styles.checkBadge, { backgroundColor: theme.accentSoft }]}>
                    <Text style={[styles.checkBadgeText, { color: theme.text }]}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.checkText, { color: theme.text }]}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <AdSlotCard tone="blush" />

          <View style={[styles.sectionCard, styles.decorativeCard, { backgroundColor: tones.cream, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('starterGuideScreen.faqTitle')}</Text>
            <Text style={[styles.sectionBody, { color: theme.icon }]}>{t('starterGuideScreen.faqBody')}</Text>
            <View style={styles.faqList}>
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <View key={item.question} style={[styles.faqCard, { backgroundColor: tones.paper, borderColor: theme.border }]}>
                    <Pressable onPress={() => setOpenFaqIndex((current) => (current === index ? null : index))} style={styles.faqHeader}>
                      <Text style={[styles.faqQuestion, { color: theme.text }]}>{item.question}</Text>
                      <MaterialIcons
                        name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={20}
                        color={theme.text}
                      />
                    </Pressable>
                    {isOpen ? <Text style={[styles.faqAnswer, { color: theme.icon }]}>{item.answer}</Text> : null}
                  </View>
                );
              })}
            </View>
          </View>

          <AdSlotCard tone="lavender" />
        </Animated.View>
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
    gap: Spacing.cardStackGap,
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
  sectionCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.cardPadding,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 21,
    fontWeight: '700',
  },
  sectionBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  cardGrid: {
    gap: 10,
  },
  miniCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  miniCardTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  miniCardBody: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  checkList: {
    gap: 10,
  },
  checkRow: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  checkText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  faqAnswer: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
  },
});

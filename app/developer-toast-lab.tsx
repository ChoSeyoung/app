/**
 * 개발자용 토스트 테스트 화면.
 *
 * 역할:
 * - 디자인과 애니메이션을 포함한 토스트 상태를 한 곳에서 빠르게 확인한다.
 * - 개발 중 토스트 level, 액션 버튼, 긴 문구 노출을 반복 검증하는 실험실 역할을 한다.
 *
 * 유지보수 포인트:
 * - 개발 전용 화면이므로 반드시 __DEV__ 진입 경로와 함께 관리한다.
 * - 새 토스트 표현이 추가되면 여기서 먼저 검증 가능한 버튼을 같이 늘린다.
 */
import { useRouter } from 'expo-router';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { useToast } from '@/components/design-system/toast-provider';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, DecorativeTones, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';

type TestButtonProps = {
  title: string;
  body: string;
  onPress: () => void;
  theme: (typeof Colors)['light'];
  backgroundColor: string;
};

function TestButton({ title, body, onPress, theme, backgroundColor }: TestButtonProps) {
  return (
    <Pressable onPress={onPress} style={[styles.testButton, { backgroundColor, borderColor: theme.border }]}>
      <Text style={[styles.testButtonTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.testButtonBody, { color: theme.icon }]}>{body}</Text>
    </Pressable>
  );
}

export default function DeveloperToastLabScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const tones = DecorativeTones;
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();
  const { showToast } = useToast();

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
            title={t('developerToastLabScreen.title')}
            subtitle={t('developerToastLabScreen.subtitle')}
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
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('developerToastLabScreen.levelTitle')}</Text>
            <View style={styles.buttonStack}>
              <TestButton
                title={t('developerToastLabScreen.infoTitle')}
                body={t('developerToastLabScreen.infoBody')}
                backgroundColor={tones.cream}
                theme={theme}
                onPress={() =>
                  showToast({
                    message: t('developerToastLabScreen.infoMessage'),
                    level: 'info',
                  })
                }
              />
              <TestButton
                title={t('developerToastLabScreen.successTitle')}
                body={t('developerToastLabScreen.successBody')}
                backgroundColor="#EEF7F0"
                theme={theme}
                onPress={() =>
                  showToast({
                    message: t('developerToastLabScreen.successMessage'),
                    level: 'success',
                  })
                }
              />
              <TestButton
                title={t('developerToastLabScreen.warningTitle')}
                body={t('developerToastLabScreen.warningBody')}
                backgroundColor="#FFF3DE"
                theme={theme}
                onPress={() =>
                  showToast({
                    message: t('developerToastLabScreen.warningMessage'),
                    level: 'warning',
                  })
                }
              />
              <TestButton
                title={t('developerToastLabScreen.errorTitle')}
                body={t('developerToastLabScreen.errorBody')}
                backgroundColor="#FBEDEA"
                theme={theme}
                onPress={() =>
                  showToast({
                    message: t('developerToastLabScreen.errorMessage'),
                    level: 'error',
                  })
                }
              />
              <TestButton
                title={t('developerToastLabScreen.highlightTitle')}
                body={t('developerToastLabScreen.highlightBody')}
                backgroundColor="#F3EAFF"
                theme={theme}
                onPress={() =>
                  showToast({
                    message: t('developerToastLabScreen.highlightMessage'),
                    level: 'highlight',
                  })
                }
              />
            </View>
          </View>

          <View style={[styles.sectionCard, styles.decorativeCard, { backgroundColor: tones.blush, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('developerToastLabScreen.extraTitle')}</Text>
            <View style={styles.buttonStack}>
              <TestButton
                title={t('developerToastLabScreen.longMessageTitle')}
                body={t('developerToastLabScreen.longMessageBody')}
                backgroundColor={tones.paper}
                theme={theme}
                onPress={() =>
                  showToast({
                    message: t('developerToastLabScreen.longMessageValue'),
                    level: 'info',
                  })
                }
              />
              <TestButton
                title={t('developerToastLabScreen.actionTitle')}
                body={t('developerToastLabScreen.actionBody')}
                backgroundColor={tones.paper}
                theme={theme}
                onPress={() =>
                  showToast({
                    message: t('developerToastLabScreen.actionMessage'),
                    level: 'highlight',
                    actionLabel: t('developerToastLabScreen.actionButton'),
                    onActionPress: () => {
                      showToast({
                        message: t('developerToastLabScreen.actionFollowupMessage'),
                        level: 'success',
                      });
                    },
                  })
                }
              />
            </View>
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
    gap: 14,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
  },
  buttonStack: {
    gap: 10,
  },
  testButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 4,
  },
  testButtonTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: '700',
  },
  testButtonBody: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
});

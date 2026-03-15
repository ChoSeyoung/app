import { useRouter } from 'expo-router';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroHeaderCard } from '@/components/design-system/hero-header-card';
import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { exportAppBackup, importAppBackup } from '@/features/app-data/backup';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useScreenEnterAnimation } from '@/hooks/use-screen-enter-animation';
import { useToast } from '@/hooks/use-toast';

export default function DataManagementScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { topStyle, sectionsStyle } = useScreenEnterAnimation();
  const { showToast } = useToast();
  const tones = {
    blush: '#F4D7D0',
    lavender: '#DCD4F3',
    cream: '#EEEAD6',
    paper: '#FFFCF6',
  };

  const handleExport = async () => {
    try {
      await exportAppBackup();
      showToast({
        message: t('dataManagementScreen.exportSuccess'),
        level: 'success',
      });
    } catch {
      showToast({
        message: t('dataManagementScreen.exportFailed'),
        level: 'error',
      });
    }
  };

  const handleImport = async () => {
    try {
      await importAppBackup();
      showToast({
        message: t('dataManagementScreen.importSuccess'),
        level: 'success',
      });
      router.replace('/(tabs)/more');
    } catch (error) {
      if (error instanceof Error && error.message === 'BACKUP_IMPORT_CANCELLED') {
        return;
      }
      showToast({
        message: t('dataManagementScreen.importFailed'),
        level: 'error',
      });
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.page, { backgroundColor: theme.background }]}>
      <PageBackground topColor="#F4DDD3" middleColor="#E2D9F7" bottomColor="#F3ECD4" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={topStyle}>
          <HeroHeaderCard
            title={t('dataManagementScreen.title')}
            subtitle={t('dataManagementScreen.subtitle')}
            onBack={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }
              router.replace('/(tabs)/more');
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
          <View style={[styles.card, { backgroundColor: tones.paper, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{t('dataManagementScreen.exportTitle')}</Text>
            <Text style={[styles.cardBody, { color: theme.icon }]}>{t('dataManagementScreen.exportBody')}</Text>
            <Pressable onPress={() => void handleExport()} style={[styles.primaryButton, { backgroundColor: theme.accent }]}>
              <Text style={styles.primaryButtonText}>{t('dataManagementScreen.exportButton')}</Text>
            </Pressable>
          </View>

          <View style={[styles.card, { backgroundColor: tones.blush, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{t('dataManagementScreen.importTitle')}</Text>
            <Text style={[styles.cardBody, { color: theme.icon }]}>{t('dataManagementScreen.importBody')}</Text>
            <Pressable onPress={() => void handleImport()} style={[styles.secondaryButton, { borderColor: theme.border, backgroundColor: tones.paper }]}>
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>{t('dataManagementScreen.importButton')}</Text>
            </Pressable>
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
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.cardPadding,
    gap: 10,
    shadowColor: '#C9B8A4',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  cardTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  cardBody: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: Spacing.primaryButtonMinHeight,
    borderRadius: Spacing.primaryButtonRadius,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  secondaryButtonText: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
  },
});

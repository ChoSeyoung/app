import { Redirect } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageBackground } from '@/components/design-system/page-background';
import { t } from '@/constants/i18n';
import { Colors, Fonts } from '@/constants/theme';
import { useBabyProfile } from '@/hooks/use-baby-profile';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function IndexGateScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { profile, isLoading } = useBabyProfile();

  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.page, { backgroundColor: theme.background }]}
      >
        <PageBackground />
        <Text style={[styles.loadingText, { color: theme.icon }]}>{t('common.loading')}</Text>
      </SafeAreaView>
    );
  }

  if (profile) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(tabs)/intro" />;
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});

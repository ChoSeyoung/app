/**
 * 탭 게이트 화면.
 *
 * 역할:
 * - 프로필 존재 여부를 확인해 온보딩 또는 홈으로 즉시 분기한다.
 * - 실제 콘텐츠는 없고 라우팅 전환만 담당한다.
 *
 * 유지보수 포인트:
 * - 앱 초기 진입 조건이 늘어나면 이 게이트에서 판단하되, 화면 로직은 최소로 유지한다.
 */
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

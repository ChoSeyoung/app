/**
 * 예제 성격의 보조 모달 화면.
 *
 * 역할:
 * - Expo 기본 템플릿에서 제공하던 모달 라우트를 유지한다.
 * - 링크와 간단한 설명만 담는 최소 화면으로 동작한다.
 *
 * 유지보수 포인트:
 * - 실제 서비스용 모달이 필요해지면 이 파일을 재활용하지 말고 목적이 분명한 화면으로 교체하는 편이 안전하다.
 */
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/constants/i18n';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">{t('modalScreen.title')}</ThemedText>
        <Link href="/" dismissTo style={styles.link}>
          <ThemedText type="link">{t('modalScreen.homeLink')}</ThemedText>
        </Link>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

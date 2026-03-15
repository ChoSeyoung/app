/**
 * 섹션 제목과 우측 액션을 묶는 공통 헤더.
 *
 * 역할:
 * - 홈, 더보기, 가이드 같은 화면에서 섹션 단위의 읽기 구조를 일정하게 유지한다.
 * - 필요할 때만 우측 액션을 노출해 카드 블록의 의미를 분명히 한다.
 */
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
  style?: ViewStyle;
};

export function SectionHeader({
  title,
  actionLabel = t('common.seeAll'),
  onPressAction,
  style,
}: SectionHeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {onPressAction ? (
        <Pressable onPress={onPressAction} hitSlop={8}>
          <Text style={[styles.actionLabel, { color: theme.text }]}>{actionLabel}</Text>
        </Pressable>
      ) : (
        <Text style={[styles.actionLabel, { color: theme.text }]}>{actionLabel}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sectionHeaderMarginTop,
    marginBottom: Spacing.sectionHeaderMarginBottom,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 27,
    fontWeight: '600',
  },
  actionLabel: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '400',
  },
});

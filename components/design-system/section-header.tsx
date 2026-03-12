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

import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { t } from '@/constants/i18n';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type QuickCardProps = {
  title: string;
  body: string;
  chipLabel: string;
  dateLabel?: string;
  toneColor: string;
  style?: ViewStyle;
  onPress?: () => void;
};

export function QuickCard({
  title,
  body,
  chipLabel,
  dateLabel = t('common.today'),
  toneColor,
  style,
  onPress,
}: QuickCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Pressable style={[styles.card, { backgroundColor: toneColor }, style]} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <View style={styles.footer}>
        <Text style={styles.dateLabel}>{dateLabel}</Text>
        <View style={[styles.chip, { backgroundColor: theme.surface }]}>
          <Text style={styles.chipText}>{chipLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 188,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  title: {
    color: '#1F1B17',
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '600',
  },
  body: {
    color: '#2B2724',
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 50,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dateLabel: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: '#5C5752',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipText: {
    fontFamily: Fonts.sans,
    fontWeight: '500',
    fontSize: 13,
    color: '#6D6762',
  },
});

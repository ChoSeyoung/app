import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/spacing';
import { Fonts, type Colors } from '@/constants/theme';

type HeroHeaderCardProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  theme: (typeof Colors)['light'];
  backgroundColor: string;
  borderColor: string;
  backButtonColor: string;
  topBubbleColor: string;
  bottomBubbleColor: string;
  eyebrow?: string;
  style?: ViewStyle;
};

export function HeroHeaderCard({
  title,
  subtitle,
  onBack,
  theme,
  backgroundColor,
  borderColor,
  backButtonColor,
  topBubbleColor,
  bottomBubbleColor,
  eyebrow,
  style,
}: HeroHeaderCardProps) {
  return (
    <View style={[styles.card, styles.decorativeCard, { backgroundColor, borderColor }, style]}>
      <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: topBubbleColor }]} />
      <View style={[styles.decorBubble, styles.decorBubbleBottomLeft, { backgroundColor: bottomBubbleColor }]} />
      <View style={styles.headerRow}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={[styles.backButton, { backgroundColor: backButtonColor, borderColor }]}
            hitSlop={10}>
            <MaterialIcons name="chevron-left" size={26} color={theme.text} />
          </Pressable>
        ) : null}
        <View style={styles.headerTextWrap}>
          {eyebrow ? (
            <View style={[styles.eyebrowChip, { backgroundColor: backButtonColor }]}>
              <Text style={[styles.eyebrowChipText, { color: theme.text }]}>{eyebrow}</Text>
            </View>
          ) : null}
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: theme.icon }]}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  decorativeCard: {
    overflow: 'hidden',
    shadowColor: '#C9B8A4',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: Spacing.cardPadding,
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  eyebrowChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: Spacing.chipHorizontal,
    paddingVertical: 6,
    marginBottom: 2,
  },
  eyebrowChipText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  decorBubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.82,
  },
  decorBubbleTopRight: {
    width: 110,
    height: 110,
    right: -30,
    top: -24,
  },
  decorBubbleBottomLeft: {
    width: 76,
    height: 76,
    left: -20,
    bottom: -24,
  },
});

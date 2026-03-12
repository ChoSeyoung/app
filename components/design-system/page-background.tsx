import { StyleSheet, View } from 'react-native';

type PageBackgroundProps = {
  topColor?: string;
  middleColor?: string;
  bottomColor?: string;
};

export function PageBackground({
  topColor = '#F4DDD3',
  middleColor = '#E2D9F7',
  bottomColor = '#F3ECD4',
}: PageBackgroundProps) {
  return (
    <View pointerEvents="none" style={styles.backdrop}>
      <View style={[styles.orb, styles.orbTop, { backgroundColor: topColor }]} />
      <View style={[styles.orb, styles.orbMiddle, { backgroundColor: middleColor }]} />
      <View style={[styles.orb, styles.orbBottom, { backgroundColor: bottomColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.5,
  },
  orbTop: {
    width: 220,
    height: 220,
    top: -54,
    right: -72,
  },
  orbMiddle: {
    width: 180,
    height: 180,
    top: 280,
    left: -84,
  },
  orbBottom: {
    width: 240,
    height: 240,
    bottom: 70,
    right: -96,
  },
});

import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';

const splashIcon = require('../assets/images/splash-icon.png');

type AnimatedAppSplashProps = {
  colorScheme: 'light' | 'dark';
  onFinish: () => void;
};

export function AnimatedAppSplash({ colorScheme, onFinish }: AnimatedAppSplashProps) {
  const theme = Colors[colorScheme];
  const overlayOpacity = useSharedValue(1);
  const badgeScale = useSharedValue(0.84);
  const badgeOpacity = useSharedValue(0);
  const copyOpacity = useSharedValue(0);
  const copyTranslateY = useSharedValue(18);
  const pulse = useSharedValue(0);
  const drift = useSharedValue(0);
  const shimmer = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    badgeScale.value = withSpring(1, {
      damping: 14,
      stiffness: 150,
      mass: 0.82,
    });
    badgeOpacity.value = withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) });
    copyOpacity.value = withDelay(180, withTiming(1, { duration: 360 }));
    copyTranslateY.value = withDelay(
      180,
      withTiming(0, { duration: 360, easing: Easing.out(Easing.cubic) })
    );
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    drift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    progress.value = withTiming(1, { duration: 1550, easing: Easing.out(Easing.cubic) });

    const timeoutId = setTimeout(() => {
      overlayOpacity.value = withTiming(0, { duration: 420 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      });
    }, 2200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [badgeOpacity, badgeScale, copyOpacity, copyTranslateY, drift, onFinish, overlayOpacity, progress, pulse, shimmer]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.22, 0.52]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.92, 1.06]) }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [
      { scale: badgeScale.value },
      { translateY: interpolate(drift.value, [0, 1], [8, -10]) },
    ],
  }));

  const copyStyle = useAnimatedStyle(() => ({
    opacity: copyOpacity.value,
    transform: [{ translateY: copyTranslateY.value }],
  }));

  const blushOrbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(drift.value, [0, 1], [0, -18]) },
      { translateX: interpolate(pulse.value, [0, 1], [0, 10]) },
      { scale: interpolate(shimmer.value, [0, 1], [1, 1.06]) },
    ],
  }));

  const lavenderOrbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(drift.value, [0, 1], [0, 12]) },
      { translateX: interpolate(pulse.value, [0, 1], [0, -12]) },
      { scale: interpolate(shimmer.value, [0, 1], [1.02, 0.96]) },
    ],
  }));

  const creamOrbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(drift.value, [0, 1], [0, 10]) },
      { scale: interpolate(pulse.value, [0, 1], [1, 1.08]) },
    ],
  }));

  const sparkleLeftStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.45, 1]),
    transform: [
      { translateY: interpolate(drift.value, [0, 1], [0, -8]) },
      { rotate: `${interpolate(shimmer.value, [0, 1], [0, 18])}deg` },
    ],
  }));

  const sparkleRightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.9]),
    transform: [
      { translateY: interpolate(drift.value, [0, 1], [0, 6]) },
      { rotate: `${interpolate(shimmer.value, [0, 1], [0, -24])}deg` },
    ],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: interpolate(progress.value, [0, 1], [0.2, 1]) }],
    opacity: interpolate(copyOpacity.value, [0, 1], [0, 1]),
  }));

  return (
    <Animated.View
      pointerEvents="auto"
      style={[styles.overlay, { backgroundColor: theme.background }, overlayStyle]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.backdropOrb,
              styles.backdropOrbLeft,
              { backgroundColor: colorScheme === 'dark' ? theme.accentSoft : '#F4D7D0' },
              blushOrbStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.backdropOrb,
              styles.backdropOrbRight,
              { backgroundColor: colorScheme === 'dark' ? theme.surfaceMuted : '#DCD4F3' },
              lavenderOrbStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.backdropOrb,
              styles.backdropOrbBottom,
              { backgroundColor: colorScheme === 'dark' ? '#4D4021' : '#F8E6AA' },
              creamOrbStyle,
            ]}
          />

          <Animated.View
            style={[
              styles.halo,
              { backgroundColor: colorScheme === 'dark' ? '#2D2A2D' : '#FFF8EE' },
              haloStyle,
            ]}
          />

          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkleLeft,
              { backgroundColor: theme.accent },
              sparkleLeftStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkleRight,
              { backgroundColor: colorScheme === 'dark' ? '#E7D9FF' : '#E5D2FA' },
              sparkleRightStyle,
            ]}
          />

          <Animated.View
            style={[
              styles.badgeShell,
              {
                backgroundColor: colorScheme === 'dark' ? '#2E2A2C' : '#FFF9F1',
                borderColor: colorScheme === 'dark' ? '#4E4748' : '#EFE5D9',
              },
              badgeStyle,
            ]}>
            <Image source={splashIcon} style={styles.badgeIcon} resizeMode="contain" />
          </Animated.View>

          <Animated.View style={[styles.copyBlock, copyStyle]}>
            <View style={[styles.eyebrowChip, { backgroundColor: theme.accentSoft }]}>
              <Text
                style={[styles.eyebrowText, { color: theme.text }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}>
                {t('splashScreen.eyebrow')}
              </Text>
            </View>
            <Text
              style={[styles.title, { color: theme.text }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.9}>
              {t('splashScreen.title')}
            </Text>
            <Text
              style={[styles.subtitle, { color: colorScheme === 'dark' ? '#D8D0C9' : '#705C47' }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}>
              {t('splashScreen.subtitle')}
            </Text>

            <View
              style={[
                styles.progressTrack,
                { backgroundColor: colorScheme === 'dark' ? '#3A3537' : '#E8DED2' },
              ]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { backgroundColor: theme.accent },
                  progressStyle,
                ]}
              />
            </View>
            <Text
              style={[styles.status, { color: colorScheme === 'dark' ? '#B7ACA1' : '#8E7A63' }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}>
              {t('splashScreen.status')}
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
  },
  backdropOrb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.56,
  },
  backdropOrbLeft: {
    width: 224,
    height: 224,
    top: 132,
    left: -36,
  },
  backdropOrbRight: {
    width: 204,
    height: 204,
    top: 158,
    right: -30,
  },
  backdropOrbBottom: {
    width: 248,
    height: 248,
    bottom: 146,
    left: '50%',
    marginLeft: -124,
    opacity: 0.44,
  },
  halo: {
    position: 'absolute',
    width: 312,
    height: 312,
    borderRadius: 156,
  },
  sparkle: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 6,
    opacity: 0.8,
  },
  sparkleLeft: {
    top: 216,
    left: 84,
  },
  sparkleRight: {
    top: 276,
    right: 92,
  },
  badgeShell: {
    width: 232,
    height: 232,
    borderRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#A4865C',
    shadowOpacity: 0.16,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
  },
  badgeIcon: {
    width: 182,
    height: 182,
  },
  copyBlock: {
    alignItems: 'center',
    marginTop: 28,
    gap: 10,
    width: '100%',
    maxWidth: 320,
  },
  eyebrowChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  eyebrowText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressTrack: {
    width: 144,
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  status: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
});

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
  type ViewStyle,
} from 'react-native';

import { Fonts, type Colors } from '@/constants/theme';

type FoldableCardProps = {
  title: string;
  theme: (typeof Colors)['light'];
  backgroundColor: string;
  borderColor: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  defaultExpanded?: boolean;
  style?: ViewStyle;
  children: ReactNode;
};

export function FoldableCard({
  title,
  theme,
  backgroundColor,
  borderColor,
  iconName = 'info-outline',
  defaultExpanded = false,
  style,
  children,
}: FoldableCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [renderBody, setRenderBody] = useState(defaultExpanded);
  const progress = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggle = () => {
    const next = !expanded;

    LayoutAnimation.configureNext({
      duration: 240,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    if (next) {
      setRenderBody(true);
      setExpanded(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }

    setExpanded(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 220,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      setRenderBody(false);
    });
  };

  const arrowRotation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const animatedBodyOpacity = progress.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 0.18, 1],
  });

  return (
    <Animated.View>
      <Pressable onPress={toggle} style={[styles.card, { backgroundColor, borderColor }, style]}>
        <View style={styles.header}>
          <View style={styles.titleWrap}>
            <MaterialIcons name={iconName} size={18} color={theme.text} />
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          </View>
          <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.text} />
          </Animated.View>
        </View>
        {renderBody ? (
          <Animated.View
            pointerEvents={expanded ? 'auto' : 'none'}
            style={[
              styles.bodyContainer,
              {
                opacity: animatedBodyOpacity,
              },
            ]}>
            <View style={styles.body}>{children}</View>
          </Animated.View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    flex: 1,
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  bodyContainer: {},
  body: {
    paddingTop: 2,
  },
});

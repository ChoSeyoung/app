/**
 * 플로팅 스타일의 커스텀 바텀 탭바.
 *
 * 역할:
 * - 서비스 레퍼런스에 맞춘 크림색 pill 쉘과 이동형 활성 pill을 렌더링한다.
 * - 선택 상태에 따라 아이콘 표현과 탭 간격 재분배를 함께 제어한다.
 *
 * 유지보수 포인트:
 * - 탭 개수나 라벨 길이가 바뀌면 활성 pill 폭과 슬롯 분배 계산을 먼저 검토해야 한다.
 */
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ROUTE_ICON = {
  home: {
    active: 'house.fill',
    inactive: 'house',
  },
  'meal-plan': {
    active: 'fork.knife',
    inactive: 'fork.knife.circle',
  },
  journey: {
    active: 'book.fill',
    inactive: 'book',
  },
  ingredients: {
    active: 'leaf.fill',
    inactive: 'leaf',
  },
  more: {
    active: 'ellipsis.circle.fill',
    inactive: 'ellipsis.circle',
  },
} as const;

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  const hasInitialized = useRef(false);

  const visibleRoutes = useMemo(
    () =>
      state.routes.filter((route) => {
        const options = descriptors[route.key]?.options;
        if (options?.href === null) return false;
        if (options?.tabBarStyle && 'display' in options.tabBarStyle && options.tabBarStyle.display === 'none') {
          return false;
        }
        return route.name in ROUTE_ICON;
      }),
    [descriptors, state.routes]
  );

  const activeVisibleRouteKey = useMemo(() => {
    const currentRouteKey = state.routes[state.index]?.key;
    const currentVisible = visibleRoutes.find((route) => route.key === currentRouteKey);
    if (currentVisible) {
      return currentVisible.key;
    }

    const homeRoute = visibleRoutes.find((route) => route.name === 'home');
    return homeRoute?.key ?? visibleRoutes[0]?.key ?? '';
  }, [state.index, state.routes, visibleRoutes]);

  const shellWidth = Math.min(width * 0.8, 360);
  const shellHorizontalPadding = 18;
  const shellInnerWidth = shellWidth - shellHorizontalPadding * 2;
  const inactiveCount = Math.max(visibleRoutes.length - 1, 1);
  const focusedVisibleIndex = visibleRoutes.findIndex((route) => route.key === activeVisibleRouteKey);
  const activeSlotWidth = shellInnerWidth * 0.28;
  const activePillWidth = activeSlotWidth;
  const inactiveSlotWidth =
    visibleRoutes.length > 1 ? (shellInnerWidth - activeSlotWidth) / inactiveCount : activeSlotWidth;
  const activeTranslateX =
    shellHorizontalPadding +
    Math.max(focusedVisibleIndex, 0) * inactiveSlotWidth;

  useEffect(() => {
    if (hasInitialized.current) return;
    translateX.setValue(activeTranslateX);
    hasInitialized.current = true;
  }, [activeTranslateX, translateX]);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [state.index]);

  useEffect(() => {
    if (visibleRoutes.length === 0) return;

    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleX, {
          toValue: 1.1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(scaleX, {
          toValue: 1,
          speed: 16,
          bounciness: 6,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(translateX, {
        toValue: activeTranslateX,
        speed: 16,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTranslateX, scaleX, translateX, visibleRoutes.length]);

  if (visibleRoutes.length === 0) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.outer}>
      <View
        style={[
          styles.shell,
          {
            backgroundColor: '#FFF8F0',
            borderColor: theme.border,
            width: shellWidth,
            marginBottom: Math.max(insets.bottom, 10),
          },
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activePillBackground,
            {
              width: activePillWidth,
              opacity: 1,
              transform: [{ translateX }, { scaleX }],
            },
          ]}
        />
        {visibleRoutes.map((route) => {
          const focused = route.key === activeVisibleRouteKey;
          const options = descriptors[route.key]?.options;
          const label =
            typeof options?.title === 'string' && options.title.length > 0 ? options.title : route.name;
          const iconPair = ROUTE_ICON[route.name as keyof typeof ROUTE_ICON];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (process.env.EXPO_OS === 'ios') {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options?.tabBarAccessibilityLabel}
              testID={options?.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.item,
                { width: focused ? activePillWidth : inactiveSlotWidth },
                focused ? styles.itemActive : styles.itemInactive,
                pressed ? styles.itemPressed : null,
              ]}>
              {focused ? (
                <View style={[styles.activeCapsule, { width: activePillWidth }]}>
                  <View style={styles.activeContent}>
                    <IconSymbol name={iconPair.active} size={20} color="#FFFDF8" />
                    <Text style={styles.activeLabel} numberOfLines={1}>
                      {label}
                    </Text>
                  </View>
                </View>
              ) : (
                <IconSymbol name={iconPair.inactive} size={24} color={theme.tabIconDefault} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  shell: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 0,
    shadowColor: '#CBB8A7',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    position: 'relative',
  },
  activePillBackground: {
    position: 'absolute',
    left: 0,
    top: 9,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#EA7A34',
    zIndex: 0,
  },
  item: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    paddingHorizontal: 0,
  },
  itemInactive: {
    paddingHorizontal: 0,
  },
  itemActive: {
    paddingHorizontal: 0,
  },
  itemPressed: {
    opacity: 0.88,
  },
  activeCapsule: {
    minHeight: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activeLabel: {
    color: '#FFFDF8',
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});

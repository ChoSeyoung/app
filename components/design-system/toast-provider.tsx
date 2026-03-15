/**
 * 전역 토스트 공급자.
 *
 * 역할:
 * - 화면 하단에 한 줄 메시지 토스트를 띄우고, level별 색상과 아이콘을 공통 규격으로 관리한다.
 * - 화면 어디서든 같은 훅으로 토스트를 호출하게 만드는 인프라 역할을 한다.
 *
 * 유지보수 포인트:
 * - 토스트는 제목 없이 한 줄 메시지를 유지하는 것이 현재 프로젝트 규칙이다.
 */
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ToastLevel = 'info' | 'success' | 'warning' | 'error' | 'highlight';

export type ShowToastOptions = {
  message: string;
  level?: ToastLevel;
  variant?: ToastLevel;
  durationMs?: number;
  actionLabel?: string;
  onActionPress?: () => void;
};

type ToastState = ShowToastOptions & {
  id: number;
};

type ToastContextValue = {
  showToast: (options: ShowToastOptions) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 2600;
const ANIMATION_DURATION_MS = 220;
const TOAST_BOTTOM_OFFSET = 12;
const SWIPE_DISMISS_X = 72;
const SWIPE_DISMISS_Y = 38;
const UPWARD_DRAG_CAP = -18;
const AXIS_LOCK_START = 10;
const HORIZONTAL_LOCK_RATIO = 0.9;
const VERTICAL_LOCK_RATIO = 1.35;

function getToastTheme(level: ToastLevel, colorScheme: 'light' | 'dark') {
  const theme = Colors[colorScheme];

  switch (level) {
    case 'success':
      return {
        icon: 'check-circle',
        card: colorScheme === 'dark' ? '#21362B' : '#EEF7F0',
        badge: theme.success,
        chip: colorScheme === 'dark' ? '#2E4B39' : '#DDF1E2',
        bubbleTop: colorScheme === 'dark' ? '#315741' : '#D1EED8',
        bubbleBottom: colorScheme === 'dark' ? '#274434' : '#F7FBF5',
      };
    case 'warning':
      return {
        icon: 'priority-high',
        card: colorScheme === 'dark' ? '#40311E' : '#FFF3DE',
        badge: '#D99227',
        chip: colorScheme === 'dark' ? '#4B3820' : '#FCE7BE',
        bubbleTop: colorScheme === 'dark' ? '#5A4326' : '#FFE2A8',
        bubbleBottom: colorScheme === 'dark' ? '#48341D' : '#FFF8EA',
      };
    case 'error':
      return {
        icon: 'error-outline',
        card: colorScheme === 'dark' ? '#3B2724' : '#FBEDEA',
        badge: theme.danger,
        chip: colorScheme === 'dark' ? '#4A322E' : '#F6D9D2',
        bubbleTop: colorScheme === 'dark' ? '#593F3A' : '#F2C5BA',
        bubbleBottom: colorScheme === 'dark' ? '#47302C' : '#FFF7F5',
      };
    case 'highlight':
      return {
        icon: 'auto-awesome',
        card: colorScheme === 'dark' ? '#372B49' : '#F3EAFF',
        badge: '#9A67EA',
        chip: colorScheme === 'dark' ? '#45355E' : '#E7D9FF',
        bubbleTop: colorScheme === 'dark' ? '#58447B' : '#DCC7FF',
        bubbleBottom: colorScheme === 'dark' ? '#44355B' : '#FCF8FF',
      };
    case 'info':
    default:
      return {
        icon: 'notifications-none',
        card: colorScheme === 'dark' ? '#3A3120' : '#FFF6DD',
        badge: theme.accent,
        chip: colorScheme === 'dark' ? '#514325' : '#FCE7BE',
        bubbleTop: colorScheme === 'dark' ? '#68562F' : '#FFE0A3',
        bubbleBottom: colorScheme === 'dark' ? '#473B21' : '#FFFBEF',
      };
  }
}

export function ToastProvider({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const dragX = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const dragXValueRef = useRef(0);
  const dragYValueRef = useRef(0);
  const currentToastRef = useRef<ToastState | null>(null);
  const hideToastRef = useRef<(direction?: 'left' | 'right' | 'down') => void>(() => {});
  const gestureAxisRef = useRef<'horizontal' | 'vertical' | null>(null);

  useEffect(() => {
    currentToastRef.current = toast;
  }, [toast]);

  const clearTimer = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const startHideTimer = useCallback(
    (durationMs: number) => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        hideToastRef.current('down');
      }, durationMs);
    },
    [clearTimer]
  );

  const hideToast = useCallback(
    (direction: 'left' | 'right' | 'down' = 'down') => {
      clearTimer();

      const targetX = direction === 'left' ? -320 : direction === 'right' ? 320 : 0;
      const targetDragY = direction === 'down' ? 120 : 0;
      const targetBaseY = direction === 'down' ? 28 : 0;

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: targetBaseY,
          duration: ANIMATION_DURATION_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dragX, {
          toValue: targetX,
          duration: ANIMATION_DURATION_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dragY, {
          toValue: targetDragY,
          duration: ANIMATION_DURATION_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
        dragX.setValue(0);
        dragY.setValue(0);
        dragXValueRef.current = 0;
        dragYValueRef.current = 0;
        translateY.setValue(-12);
        setToast((current) => {
          if (!currentToastRef.current) return current;
          return null;
        });
      });
    },
    [clearTimer, dragX, dragY, opacity, translateY]
  );

  useEffect(() => {
    hideToastRef.current = hideToast;
  }, [hideToast]);

  const resetToastPosition = useCallback(() => {
    clearTimer();

    Animated.parallel([
      Animated.spring(dragX, {
        toValue: 0,
        damping: 16,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: true,
      }),
      Animated.spring(dragY, {
        toValue: 0,
        damping: 16,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        damping: 16,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dragXValueRef.current = 0;
      dragYValueRef.current = 0;
      gestureAxisRef.current = null;
      const activeToast = currentToastRef.current;
      if (!activeToast) return;
      startHideTimer(activeToast.durationMs ?? TOAST_DURATION_MS);
    });
  }, [clearTimer, dragX, dragY, startHideTimer, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8,
      onPanResponderGrant: () => {
        clearTimer();
        gestureAxisRef.current = null;
      },
      onPanResponderMove: (_, gestureState) => {
        if (!gestureAxisRef.current) {
          const absX = Math.abs(gestureState.dx);
          const absY = Math.abs(gestureState.dy);

          if (absX < AXIS_LOCK_START && absY < AXIS_LOCK_START) {
            return;
          }

          if (absX >= AXIS_LOCK_START && absX >= absY * HORIZONTAL_LOCK_RATIO) {
            gestureAxisRef.current = 'horizontal';
          } else if (absY >= AXIS_LOCK_START && absY >= absX * VERTICAL_LOCK_RATIO) {
            gestureAxisRef.current = 'vertical';
          } else {
            return;
          }
        }

        if (gestureAxisRef.current === 'horizontal') {
          const isMostlyHorizontal = Math.abs(gestureState.dy) <= Math.abs(gestureState.dx) * 0.55;
          const nextX = isMostlyHorizontal ? gestureState.dx : dragXValueRef.current;
          dragXValueRef.current = nextX;
          dragYValueRef.current = 0;
          dragX.setValue(nextX);
          dragY.setValue(0);
          return;
        }

        dragX.setValue(0);
        dragXValueRef.current = 0;

        if (gestureState.dy < 0) {
          const nextY = Math.max(UPWARD_DRAG_CAP, gestureState.dy * 0.32);
          dragYValueRef.current = nextY;
          dragY.setValue(nextY);
          return;
        }

        dragYValueRef.current = gestureState.dy;
        dragY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const absX = Math.abs(dragXValueRef.current);
        const downY = Math.max(0, dragYValueRef.current);
        const lockedAxis = gestureAxisRef.current;

        if (absX >= SWIPE_DISMISS_X && absX >= downY) {
          gestureAxisRef.current = null;
          hideToast(dragXValueRef.current < 0 ? 'left' : 'right');
          return;
        }

        if (lockedAxis !== 'horizontal' && downY >= SWIPE_DISMISS_Y) {
          gestureAxisRef.current = null;
          hideToast('down');
          return;
        }

        resetToastPosition();
      },
      onPanResponderTerminate: () => {
        gestureAxisRef.current = null;
        resetToastPosition();
      },
    })
  ).current;

  const showToast = useCallback(
    (options: ShowToastOptions) => {
      clearTimer();

      const nextToast: ToastState = {
        id: Date.now(),
        level: options.level ?? options.variant ?? 'info',
        durationMs: options.durationMs ?? TOAST_DURATION_MS,
        ...options,
      };

      opacity.stopAnimation();
      translateY.stopAnimation();
      dragX.stopAnimation();
      dragY.stopAnimation();
      opacity.setValue(0);
      translateY.setValue(28);
      dragX.setValue(0);
      dragY.setValue(0);
      dragXValueRef.current = 0;
      dragYValueRef.current = 0;
      gestureAxisRef.current = null;
      setToast(nextToast);

      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: ANIMATION_DURATION_MS,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: ANIMATION_DURATION_MS,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start();
      });

      startHideTimer(nextToast.durationMs);
    },
    [clearTimer, dragX, dragY, opacity, startHideTimer, translateY]
  );

  useEffect(() => () => {
    clearTimer();
  }, [clearTimer]);

  const contextValue: ToastContextValue = {
    showToast,
    hideToast: () => hideToast('down'),
  };

  const toastTheme = getToastTheme(toast?.level ?? toast?.variant ?? 'info', colorScheme);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {toast ? (
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.overlay,
              {
                bottom: Math.max(insets.bottom, 8) + TOAST_BOTTOM_OFFSET,
                opacity,
                transform: [{ translateX: dragX }, { translateY: Animated.add(translateY, dragY) }],
              },
            ]}
            {...panResponder.panHandlers}>
            <View
              style={[
                styles.toastCard,
                {
                  backgroundColor: toastTheme.card,
                  borderColor: theme.border,
                },
              ]}>
              <View style={[styles.decorBubble, styles.decorBubbleTopRight, { backgroundColor: toastTheme.bubbleTop }]} />
              <View
                style={[styles.decorBubble, styles.decorBubbleBottomLeft, { backgroundColor: toastTheme.bubbleBottom }]}
              />
              <View style={styles.toastBody}>
                <View style={[styles.iconBadge, { backgroundColor: toastTheme.badge }]}>
                  <MaterialIcons name={toastTheme.icon as never} size={18} color="#FFFDF8" />
                </View>

                <View style={styles.textWrap}>
                  <Text
                    style={[styles.message, { color: theme.text }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.9}>
                    {toast.message}
                  </Text>
                </View>

                {toast.actionLabel && toast.onActionPress ? (
                  <Pressable
                    hitSlop={8}
                    onPress={() => {
                      hideToast('down');
                      requestAnimationFrame(() => {
                        toast.onActionPress?.();
                      });
                    }}
                    style={[styles.actionChip, { backgroundColor: toastTheme.chip, borderColor: theme.border }]}>
                    <Text style={[styles.actionLabel, { color: theme.text }]} numberOfLines={1}>
                      {toast.actionLabel}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </Animated.View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
  },
  toastCard: {
    overflow: 'hidden',
    width: '100%',
    maxWidth: 460,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 15,
    shadowColor: '#C9B8A4',
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  toastBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 0,
  },
  message: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    fontWeight: '700',
  },
  actionChip: {
    minHeight: Spacing.compactButtonMinHeight,
    borderWidth: 1,
    borderRadius: Spacing.compactButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
  },
  actionLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  decorBubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.85,
  },
  decorBubbleTopRight: {
    width: 72,
    height: 72,
    right: -20,
    top: -20,
  },
  decorBubbleBottomLeft: {
    width: 52,
    height: 52,
    left: -14,
    bottom: -18,
    opacity: 0.65,
  },
});

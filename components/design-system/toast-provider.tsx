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

function getToastTheme(level: ToastLevel, colorScheme: 'light' | 'dark') {
  const theme = Colors[colorScheme];

  switch (level) {
    case 'success':
      return {
        icon: 'check-circle',
        badgeLabel: 'SUCCESS',
        card: colorScheme === 'dark' ? '#21362B' : '#EEF7F0',
        badge: theme.success,
        chip: colorScheme === 'dark' ? '#2E4B39' : '#DDF1E2',
        bubbleTop: colorScheme === 'dark' ? '#315741' : '#D1EED8',
        bubbleBottom: colorScheme === 'dark' ? '#274434' : '#F7FBF5',
      };
    case 'warning':
      return {
        icon: 'priority-high',
        badgeLabel: 'CAUTION',
        card: colorScheme === 'dark' ? '#40311E' : '#FFF3DE',
        badge: '#D99227',
        chip: colorScheme === 'dark' ? '#4B3820' : '#FCE7BE',
        bubbleTop: colorScheme === 'dark' ? '#5A4326' : '#FFE2A8',
        bubbleBottom: colorScheme === 'dark' ? '#48341D' : '#FFF8EA',
      };
    case 'error':
      return {
        icon: 'error-outline',
        badgeLabel: 'ERROR',
        card: colorScheme === 'dark' ? '#3B2724' : '#FBEDEA',
        badge: theme.danger,
        chip: colorScheme === 'dark' ? '#4A322E' : '#F6D9D2',
        bubbleTop: colorScheme === 'dark' ? '#593F3A' : '#F2C5BA',
        bubbleBottom: colorScheme === 'dark' ? '#47302C' : '#FFF7F5',
      };
    case 'highlight':
      return {
        icon: 'auto-awesome',
        badgeLabel: 'NICE',
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
        badgeLabel: 'INFO',
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
  const currentToastRef = useRef<ToastState | null>(null);

  useEffect(() => {
    currentToastRef.current = toast;
  }, [toast]);

  const clearTimer = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const hideToast = useCallback(() => {
    clearTimer();

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 28,
        duration: ANIMATION_DURATION_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) return;
      setToast((current) => {
        if (!currentToastRef.current) return current;
        return null;
      });
    });
  }, [clearTimer, opacity, translateY]);

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
      opacity.setValue(0);
      translateY.setValue(28);
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

      timerRef.current = setTimeout(() => {
        hideToast();
      }, nextToast.durationMs);
    },
    [clearTimer, hideToast, opacity, translateY]
  );

  useEffect(() => () => {
    clearTimer();
  }, [clearTimer]);

  const contextValue: ToastContextValue = {
    showToast,
    hideToast,
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
                transform: [{ translateY }],
              },
            ]}>
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
                  <View style={[styles.levelChip, { backgroundColor: toastTheme.chip, borderColor: theme.border }]}>
                    <Text style={[styles.levelChipText, { color: theme.text }]}>{toastTheme.badgeLabel}</Text>
                  </View>
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
                      toast.onActionPress?.();
                      hideToast();
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
    gap: 3,
  },
  levelChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 1,
  },
  levelChipText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
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

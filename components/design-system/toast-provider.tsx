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

type ToastVariant = 'info' | 'success' | 'error';

export type ShowToastOptions = {
  message: string;
  title?: string;
  variant?: ToastVariant;
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

function getVariantColors(variant: ToastVariant, colorScheme: 'light' | 'dark') {
  const theme = Colors[colorScheme];

  switch (variant) {
    case 'success':
      return {
        icon: 'check-circle',
        card: colorScheme === 'dark' ? '#21362B' : '#EEF7F0',
        badge: theme.success,
      };
    case 'error':
      return {
        icon: 'error-outline',
        card: colorScheme === 'dark' ? '#3B2724' : '#FBEDEA',
        badge: theme.danger,
      };
    case 'info':
    default:
      return {
        icon: 'notifications-none',
        card: colorScheme === 'dark' ? '#3A3120' : '#FFF6DD',
        badge: theme.accent,
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
        toValue: -12,
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
        variant: options.variant ?? 'info',
        durationMs: options.durationMs ?? TOAST_DURATION_MS,
        ...options,
      };

      opacity.stopAnimation();
      translateY.stopAnimation();
      opacity.setValue(0);
      translateY.setValue(-12);
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

  const variantColors = getVariantColors(toast?.variant ?? 'info', colorScheme);

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
                paddingTop: Math.max(insets.top, 12) + 8,
                opacity,
                transform: [{ translateY }],
              },
            ]}>
            <View
              style={[
                styles.toastCard,
                {
                  backgroundColor: variantColors.card,
                  borderColor: theme.border,
                },
              ]}>
              <View style={styles.toastBody}>
                <View style={[styles.iconBadge, { backgroundColor: variantColors.badge }]}>
                  <MaterialIcons name={variantColors.icon as never} size={18} color="#FFFDF8" />
                </View>

                <View style={styles.textWrap}>
                  {toast.title ? (
                    <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                      {toast.title}
                    </Text>
                  ) : null}
                  <Text style={[styles.message, { color: theme.text }]} numberOfLines={2}>
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
                    style={[styles.actionChip, { backgroundColor: theme.accentSoft, borderColor: theme.border }]}>
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
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
  },
  toastCard: {
    width: '100%',
    maxWidth: 520,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#C9B8A4',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  toastBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  actionChip: {
    minHeight: Spacing.compactButtonMinHeight,
    borderWidth: 1,
    borderRadius: Spacing.compactButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  actionLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
});

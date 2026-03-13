import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { AnimatedAppSplash } from '@/components/animated-app-splash';
import { ToastProvider } from '@/components/design-system/toast-provider';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore repeated preventAutoHideAsync calls during fast refresh.
});

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const [isNativeSplashHidden, setIsNativeSplashHidden] = useState(false);
  const [isAnimatedSplashVisible, setIsAnimatedSplashVisible] = useState(true);

  const handleLayout = useCallback(() => {
    if (isNativeSplashHidden) return;

    void SplashScreen.hideAsync()
      .catch(() => {
        // Ignore hide errors during reloads.
      })
      .finally(() => {
        setIsNativeSplashHidden(true);
      });
  }, [isNativeSplashHidden]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ToastProvider>
          <View style={styles.container} onLayout={handleLayout}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="weaning-start-guide" options={{ headerShown: false }} />
              <Stack.Screen name="weaning-readiness-checklist" options={{ headerShown: false }} />
              <Stack.Screen name="weaning-supplies-checklist" options={{ headerShown: false }} />
              <Stack.Screen name="weaning-part-guide" options={{ headerShown: false }} />
              <Stack.Screen name="weaning-faq" options={{ headerShown: false }} />
              <Stack.Screen name="open-source-licenses" options={{ headerShown: false }} />
              <Stack.Screen name="notification-settings" options={{ headerShown: false }} />
              <Stack.Screen name="terms-of-service" options={{ headerShown: false }} />
              <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
              <Stack.Screen name="record-editor" options={{ headerShown: false }} />
              <Stack.Screen name="profile-editor" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            {isNativeSplashHidden && isAnimatedSplashVisible ? (
              <AnimatedAppSplash
                colorScheme={colorScheme}
                onFinish={() => {
                  setIsAnimatedSplashVisible(false);
                }}
              />
            ) : null}
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </View>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import { Tabs } from 'expo-router';
import React from 'react';

import { FloatingTabBar } from '@/components/design-system/floating-tab-bar';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabs.home'),
        }}
      />
      <Tabs.Screen
        name="intro"
        options={{
          href: null,
          tabBarStyle: {
            display: 'none',
          },
        }}
      />
      <Tabs.Screen
        name="meal-plan"
        options={{
          title: t('tabs.mealPlan'),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: t('tabs.journey'),
        }}
      />
      <Tabs.Screen
        name="ingredients"
        options={{
          title: t('tabs.ingredients'),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('tabs.more'),
        }}
      />
    </Tabs>
  );
}

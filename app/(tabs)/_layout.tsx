/**
 * 탭 라우터 전용 레이아웃.
 *
 * 역할:
 * - 홈, 식단, 기록, 식재료, 더보기 탭을 등록하고 커스텀 플로팅 탭바를 연결한다.
 * - 탭별 헤더 노출 정책과 탭바 예외 라우트를 함께 관리한다.
 *
 * 유지보수 포인트:
 * - 탭 순서나 라벨을 바꾸면 플로팅 탭바 아이콘 매핑도 함께 점검해야 한다.
 */
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

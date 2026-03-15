/**
 * 탭 버튼 햅틱 보조 컴포넌트.
 *
 * 역할:
 * - 탭을 누를 때 플랫폼별 햅틱 피드백을 가볍게 제공한다.
 * - 실제 시각 디자인은 커스텀 탭바가 담당하고, 이 컴포넌트는 입력 감각만 보조한다.
 */
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

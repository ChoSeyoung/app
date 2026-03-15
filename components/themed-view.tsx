/**
 * 테마 색을 자동 적용하는 기본 View 래퍼.
 *
 * 역할:
 * - 라이트/다크 테마 값에 맞춰 배경색을 주입한다.
 * - 예제 계열 공통 컴포넌트와 레거시 템플릿 호환용으로 남겨둔 래퍼다.
 */
import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

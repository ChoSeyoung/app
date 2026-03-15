/**
 * 테마 색을 자동 적용하는 기본 Text 래퍼.
 *
 * 역할:
 * - 예제/공통 컴포넌트에서 라이트/다크 대응 텍스트를 쉽게 만들게 돕는다.
 * - 타입 프리셋을 통해 제목/본문 수준 스타일을 빠르게 고를 수 있게 한다.
 */
import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.sans,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
    fontFamily: Fonts.rounded,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
  },
  link: {
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: Fonts.sans,
  },
});

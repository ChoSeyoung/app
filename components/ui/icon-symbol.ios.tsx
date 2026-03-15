/**
 * iOS 전용 아이콘 심볼 컴포넌트.
 *
 * 역할:
 * - iOS에서는 SF Symbols를 직접 렌더링해 가장 자연스러운 시스템 아이콘 표현을 유지한다.
 * - Android/Web fallback과 달리 매핑 없이 native symbol을 그대로 사용한다.
 */
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}

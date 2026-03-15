/**
 * Android/Web용 아이콘 fallback 매핑 컴포넌트.
 *
 * 역할:
 * - iOS의 SF Symbols 이름을 Android/Web의 Material Icons 이름으로 연결한다.
 * - 플랫폼마다 다른 아이콘 세트를 서비스 코드에서는 같은 이름으로 쓰게 해준다.
 *
 * 유지보수 포인트:
 * - 새 아이콘을 추가할 때는 iOS와 Android/Web 쌍을 모두 맞춰야 시각 차이가 줄어든다.
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols 이름과 Material Icons 이름을 매핑하는 표.
 *
 * 새 아이콘을 넣을 때는:
 * - iOS에서는 SF Symbols 이름이 자연스러운지 확인하고
 * - Android/Web에서는 최대한 비슷한 의미와 무게감의 Material 아이콘으로 연결한다.
 */
const MAPPING = {
  'house.fill': 'home',
  'house': 'home-outline',
  'safari.fill': 'explore',
  'book.fill': 'book',
  'book': 'menu-book',
  'person.crop.circle': 'person-outline',
  'paperplane.fill': 'send',
  'chart.bar.fill': 'bar-chart',
  'leaf.fill': 'spa',
  'leaf': 'eco',
  'fork.knife': 'restaurant',
  'fork.knife.circle': 'restaurant-menu',
  'ellipsis.circle.fill': 'more-horiz',
  'ellipsis.circle': 'more-horiz',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * 플랫폼 공통 아이콘 컴포넌트.
 *
 * iOS에서는 SF Symbols를 그대로 쓰고,
 * Android/Web에서는 위 매핑표를 통해 Material Icons로 치환한다.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

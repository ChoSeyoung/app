/**
 * 손 흔들기 이모지 애니메이션 예제 컴포넌트.
 *
 * 역할:
 * - 템플릿성 화면에서 짧은 리액션 애니메이션을 보여주는 용도다.
 * - 서비스 핵심 흐름보다는 데모 성격이 강하다.
 */
import Animated from 'react-native-reanimated';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}

import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type ScreenEnterAnimationResult = {
  topStyle: {
    opacity: Animated.Value;
    transform: { translateY: Animated.AnimatedInterpolation<number> }[];
  };
  sectionsStyle: {
    opacity: Animated.Value;
    transform: { translateY: Animated.AnimatedInterpolation<number> }[];
  };
};

export function useScreenEnterAnimation(): ScreenEnterAnimationResult {
  const top = useRef(new Animated.Value(0)).current;
  const sections = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    top.setValue(0);
    sections.setValue(0);

    Animated.sequence([
      Animated.timing(top, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(sections, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();
  }, [sections, top]);

  return {
    topStyle: {
      opacity: top,
      transform: [
        {
          translateY: top.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          }),
        },
      ],
    },
    sectionsStyle: {
      opacity: sections,
      transform: [
        {
          translateY: sections.interpolate({
            inputRange: [0, 1],
            outputRange: [14, 0],
          }),
        },
      ],
    },
  };
}

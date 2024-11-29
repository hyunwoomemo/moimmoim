import {Pressable, useWindowDimensions} from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const useBottomSheet = ({openAction}) => {
  const {height} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(height);

  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const translateYStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  const open = () => {
    openAction && openAction();
    translateY.value = withTiming(height / 2, {
      duration: 300,
      reduceMotion: ReduceMotion.System,
    });
    opacity.value = withTiming(0.3, {
      duration: 300,
      reduceMotion: ReduceMotion.System,
    });
  };

  const close = () => {
    translateY.value = withTiming(height, {
      duration: 300,
      reduceMotion: ReduceMotion.System,
    });
    opacity.value = withTiming(0, {
      duration: 300,
      reduceMotion: ReduceMotion.System,
    });
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const BottomSheet = ({children}) => {
    return (
      <>
        <AnimatedPressable
          onPress={close}
          style={[
            {
              backgroundColor: '#000',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // pointerEvents: 'none',
              flex: 1,
              zIndex: 999,
            },
            [animatedStyle],
          ]}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              height: height - (insets.top + 40),
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 50,
              backgroundColor: '#fff',
              padding: 20,
              zIndex: 9999,
            },
            translateYStyle,
          ]}>
          {children}
        </Animated.View>
      </>
    );
  };

  return {BottomSheet, open, close};
};

export default useBottomSheet;

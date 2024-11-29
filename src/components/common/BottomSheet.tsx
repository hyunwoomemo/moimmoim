import React, {useEffect} from 'react';
import {Pressable} from 'react-native';
import Animated from 'react-native-reanimated';
const BottomSheet = ({
  insets,
  animatedStyle,
  translateYStyle,
  height,
  closeBottomSheet,
  children,
}) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <>
      <AnimatedPressable
        onPress={closeBottomSheet}
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

export default BottomSheet;

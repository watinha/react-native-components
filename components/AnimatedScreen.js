import React, { useState, useEffect } from 'react';

import { Animated, Text } from 'react-native';

export default function AnimatedScreen (
    { navigation, children, style, duration=300 }) {
  let [opacity, setOpacity] = useState(new Animated.Value(0));

  useEffect(() => navigation.addListener('focus', () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true
    }).start();
  }), [navigation]);

  useEffect(() => navigation.addListener('blur', () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true
    }).start();
  }), [navigation]);

  return (
    <Animated.View testID={'screenView'}
          style={{
            opacity: opacity,
            transform: [{
              'translateX': opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0]
              })
            }],
            ...style
          }}>
      {children}
    </Animated.View>
  );
}

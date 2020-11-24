import React, { useState, useEffect } from 'react';

import { View, Text } from 'react-native';

export default function AnimatedScreen ({ navigation, children }) {
  let [opacity, setOpacity] = useState(0);

  useEffect(() => navigation.addListener('focus', () => {
    setOpacity(1);
  }), [navigation]);

  useEffect(() => navigation.addListener('blur', () => {
    setOpacity(0);
  }), [navigation]);

  return (
    <View testID={'screenView'}
          style={{opacity: opacity}}> {children} </View>
  );
}

import React, { useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from
  '@react-navigation/material-bottom-tabs';

export function DummyComponent1 ({ navigation }) {
  let [opacity, setOpacity] = useState(new Animated.Value(0));

  if (opacity === 0 && navigation.isFocused()) {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  }

  navigation.addListener('focus', () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  });

  navigation.addListener('blur', () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 30,
      useNativeDriver: true
    }).start();
  });

  return (
    <Animated.View style={{
        backgroundColor: '#FFCCCC',
        transform: [
            {
                'translateX': opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0]
                })
            }
        ],
        opacity: opacity,
        overflow: 'hidden', ...styles.dummy}}>
      <Text>Dummy 1!!!</Text>
      <Image source={require('./resources/img/camera-line.png')} />
    </Animated.View>
  );
}
export function DummyComponent2 () {
  return (
    <View style={{backgroundColor: '#AACCFF', ...styles.dummy}}>
      <Text>Dummy 2!!!</Text>
    </View>
  );
}

const Tab = createMaterialBottomTabNavigator();

function TabBarIcons (route, { focused, color, size }) {
  let icons = {
        'Dummy 1': require('./resources/img/camera-line.png'),
        'Dummy 2': require('./resources/img/image-line.png')
      },
      focused_icons = {
        'Dummy 1': require('./resources/img/camera-fill-white.png'),
        'Dummy 2': require('./resources/img/image-line-white.png')
      };

  if (focused)
      return <Image source={focused_icons[route.name]} />;
  return <Image source={icons[route.name]} />;
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator shifting={true} screenOptions={
          ({route}) => ({ tabBarIcon: TabBarIcons.bind(null, route) })}>
        <Tab.Screen name='Dummy 1'
                    component={DummyComponent1}
                    options={{
                      tabBarColor: '#FF3333'
                    }}></Tab.Screen>
        <Tab.Screen name='Dummy 2'
                    component={DummyComponent2}
                    options={{
                      tabBarColor: '#3333FF'
                    }}></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  dummy: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center'
  }
});

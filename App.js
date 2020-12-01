import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from
  '@react-navigation/material-bottom-tabs';

import AnimatedScreen from './components/AnimatedScreen';
import CameraScreen from './components/CameraScreen';

export function FirstScreen ({ navigation }) {
  return (
    <AnimatedScreen navigation={navigation}
                    style={{backgroundColor: '#FFCCAA', ...styles.dummy}}>
      <CameraScreen />
    </AnimatedScreen>
  );
}
export function DummyComponent2 ({ navigation }) {
  return (
    <AnimatedScreen navigation={navigation}
                    style={{backgroundColor: '#AACCFF', ...styles.dummy}}>
      <Text>Dummy 2!!!</Text>
    </AnimatedScreen>
  );
}

const Tab = createMaterialBottomTabNavigator();

function TabBarIcons (route, { focused, color, size }) {
  let icons = {
        'Camera': require('./resources/img/camera-line.png'),
        'Dummy 2': require('./resources/img/image-line.png')
      },
      focused_icons = {
        'Camera': require('./resources/img/camera-fill-white.png'),
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
        <Tab.Screen name='Camera'
                    component={FirstScreen}
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

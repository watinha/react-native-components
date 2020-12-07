import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from
  '@react-navigation/material-bottom-tabs';

import { Provider } from 'react-redux';

import AnimatedScreen from './components/AnimatedScreen';
import CameraScreen from './components/CameraScreen';
import GaleryScreen from './components/GaleryScreen';
import store from './store';

export function FirstScreen ({ navigation }) {
  return (
    <AnimatedScreen navigation={navigation}
                    style={{backgroundColor: '#FFCCAA', ...styles.screen}}>
      <CameraScreen />
    </AnimatedScreen>
  );
}
export function SecondScreen ({ navigation }) {
  return (
    <AnimatedScreen navigation={navigation}
                    style={{backgroundColor: '#AACCFF', ...styles.screen}}>
      <GaleryScreen />
    </AnimatedScreen>
  );
}

const Tab = createMaterialBottomTabNavigator();

function TabBarIcons (route, { focused, color, size }) {
  let icons = {
        'Camera': require('./resources/img/camera-line.png'),
        'Galery': require('./resources/img/image-line.png')
      },
      focused_icons = {
        'Camera': require('./resources/img/camera-fill-white.png'),
        'Galery': require('./resources/img/image-line-white.png')
      };

  if (focused)
      return <Image source={focused_icons[route.name]} />;
  return <Image source={icons[route.name]} />;
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator shifting={true} screenOptions={
            ({route}) => ({ tabBarIcon: TabBarIcons.bind(null, route) })}>
          <Tab.Screen name='Camera'
                      component={FirstScreen}
                      options={{
                        tabBarColor: '#FF3333'
                      }}></Tab.Screen>
          <Tab.Screen name='Galery'
                      component={SecondScreen}
                      options={{
                        tabBarColor: '#3333FF'
                      }}></Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  screen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

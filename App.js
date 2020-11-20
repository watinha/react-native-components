import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export function DummyComponent1 () {
  return (
    <View style={{backgroundColor: '#FFCCCC', ...styles.dummy}}>
      <Text>Dummy 1!!!</Text>
      <Image source={require('./resources/img/camera-line.png')} />
    </View>
  );
}
export function DummyComponent2 () {
  return (
    <View style={{backgroundColor: '#AACCFF', ...styles.dummy}}>
      <Text>Dummy 2!!!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function TabBarIcons (route, focused, color, size) {
  let icons = {
      'Dummy 1': require('./resources/img/camera-line.png'),
      'Dummy 2': require('./resources/img/image-line.png')
  };
  return <Image source={icons[route.name]} />;
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={
          ({route}) => ({ tabBarIcon: TabBarIcons.bind(null, route) })}>
        <Tab.Screen name='Dummy 1'
                    component={DummyComponent1}></Tab.Screen>
        <Tab.Screen name='Dummy 2'
                    component={DummyComponent2}></Tab.Screen>
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

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export function DummyComponent1 () {
  return (
    <View style={{backgroundColor: '#FFCCCC', ...styles.dummy}}>
      <Text>Dummy 1!!!</Text>
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

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
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

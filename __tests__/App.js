import { View } from 'react-native';
import React from 'react';
import { create, act } from 'react-test-renderer';

import App, { FirstScreen, SecondScreen } from '../App';

jest.useFakeTimers();

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

it('renders correctly', async () => {
  let target = create(<App />),
      components1 = target.root.findAllByType(FirstScreen),
      components2 = target.root.findAllByType(SecondScreen);

  expect(components1.length).toBe(1);
  expect(components2.length).toBe(0);
  target.unmount();
});

it('changes visible view element after press', async () => {
  let target = create(<App />), components1, components2;
  const tabs = target.root.findAll((el) =>
    el.instance && el.props.onPress &&
    el.props.accessibilityRole === 'button');

  act(tabs[1].props.onPress);

  components1 = target.root.findAllByType(FirstScreen);
  components2 = target.root.findAllByType(SecondScreen);

  expect(components1.length).toBe(1);
  expect(components2.length).toBe(1);
  target.unmount();
});

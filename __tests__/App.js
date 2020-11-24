import { View } from 'react-native';
import React from 'react';

import App from '../App';
import fs from 'fs';

// Note: test renderer must be required after react-native.
import { act, render, fireEvent, cleanup, waitForElementToBeRemoved } from '@testing-library/react-native';

jest.useFakeTimers();
afterEach(cleanup);

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

it('renders correctly', async () => {
  let target = render(<App />),
      containers, components1, components2;
  let { queryAllByText } = target;

  await act(async () => {
    components1 = await queryAllByText('Dummy 1!!!');
    components2 = await queryAllByText('Dummy 2!!!');
  });

  expect(components1.length).toBe(1);
  expect(components2.length).toBe(0);
});

it('changes visible view element after press', async () => {
  let target = render(<App />),
      containers, components1, components2;
  let { queryByText, queryAllByText } = target;

  await act(async () => {
    tabItem2 = await queryByText('Dummy 2');
    fireEvent.press(tabItem2);
  });

  components1 = await queryAllByText('Dummy 1!!!');
  components2 = await queryAllByText('Dummy 2!!!');

  expect(components1.length).toBe(1);
  expect(components2.length).toBe(1);
});

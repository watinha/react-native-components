import React from 'react';
import { Provider } from 'react-redux';
import { Image, Text } from 'react-native';
import { act, create, update } from 'react-test-renderer';
import * as fs from 'expo-file-system';

import store from '../../store';
import GaleryScreen from '../../components/GaleryScreen';

jest.useFakeTimers();

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('expo-file-system');

it('should render galery screen with one image', async () => {
  let rendered_test;

  fs.readAsStringAsync = jest.fn();
  fs.readAsStringAsync.mockResolvedValue(JSON.stringify({
    count: 1,
    pictures: [
      { uri: `file:///1.png`, height: 1000, width: 800 }
    ]
  }));

  await act(async () =>
    rendered_test = await create(
      <Provider store={store}>
        <GaleryScreen></GaleryScreen>
      </Provider>));

  const image = rendered_test.root.findByType(Image);
  expect(image.props.source.uri).toBe('file:///1.png');

  fs.readAsStringAsync.mockClear();
});

it('should render galery screen two images', async () => {
  const component = (
    <Provider store={store}>
      <GaleryScreen></GaleryScreen>
    </Provider>);
  let rendered_test;

  fs.readAsStringAsync = jest.fn();
  fs.readAsStringAsync.mockResolvedValue(JSON.stringify({
    count: 2,
    pictures: [
      { uri: `file:///2.png`, height: 123, width: 910 },
      { uri: `file:///3.png`, height: 45, width: 78 }
    ]
  }));

  await act(async () =>
    rendered_test = await create(component));

  await act(async () => await rendered_test.update(component));

  const images = rendered_test.root.findAllByType(Image);
  expect(images.length).toBe(2);
  expect(images[0].props.source.uri).toBe('file:///2.png');
  expect(images[1].props.source.uri).toBe('file:///3.png');

  fs.readAsStringAsync.mockClear();
});

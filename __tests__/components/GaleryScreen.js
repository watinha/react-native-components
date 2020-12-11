import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { Image, TouchableHighlight, Text } from 'react-native';
import { act, create } from 'react-test-renderer';
import * as fs from 'expo-file-system';

import create_store from '../../store';
import GaleryScreen from '../../components/GaleryScreen';
import { map_new_count } from '../../reducers/photo';
import { NavigationContext } from '../../components/AnimatedScreen';

jest.useFakeTimers();

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('expo-file-system');

let rendered_test,
    navigation_mock = { addListener: jest.fn() },
    store = create_store();

const component = (
  <Provider store={store}>
    <NavigationContext.Provider value={navigation_mock}>
      <GaleryScreen anim_duration={0}></GaleryScreen>
    </NavigationContext.Provider>
  </Provider>);

beforeEach(() => {
  fs.readAsStringAsync = jest.fn();
  fs.writeAsStringAsync = jest.fn();
  fs.deleteAsync = jest.fn();
  store = create_store();
});

afterEach(() => {
  rendered_test.unmount();
  fs.readAsStringAsync.mockClear();
  fs.writeAsStringAsync.mockClear();
  fs.deleteAsync.mockClear();
});

it('should render galery screen with one image', async () => {
  fs.readAsStringAsync.mockResolvedValue(JSON.stringify({
    count: 1,
    pictures: [
      { uri: `file:///1.png`, height: 1000, width: 800 }
    ]
  }));
  await act(async () =>
    rendered_test = await create(component));

  const image = rendered_test.root.findByType(Image);
  expect(image.props.source.uri).toBe('file:///1.png');
});

it('should render galery screen two images', async () => {
  fs.readAsStringAsync.mockResolvedValue(JSON.stringify({
    count: 2,
    pictures: [
      { uri: `file:///2.png`, height: 123, width: 910 },
      { uri: `file:///3.png`, height: 45, width: 78 }
    ]
  }));

  await act(async () =>
    rendered_test = await create(component));

  const images = rendered_test.root.findAllByType(Image);
  expect(images.length).toBe(2);
  expect(images[0].props.source.uri).toBe('file:///2.png');
  expect(images[1].props.source.uri).toBe('file:///3.png');
});

it('should delete an image after clicking the delete button', async () => {
  fs.readAsStringAsync.mockResolvedValue(JSON.stringify({
    count: 3,
    pictures: [
      { uri: `file:///2.png`, height: 123, width: 910 },
      { uri: `file:///3.png`, height: 45, width: 78 },
      { uri: `file:///1.png`, height: 12, width: 96 }
    ]
  }));

  await act(async () =>
    rendered_test = await create(component));

  const delete_button = rendered_test.root.findAllByType(
    TouchableHighlight);
  expect(delete_button.length).toBe(3);

  await act(async () =>
    delete_button[0].props.onPress());

  expect(fs.deleteAsync).toBeCalledWith('file:///2.png');
  expect(fs.writeAsStringAsync).toBeCalledWith(
    `${fs.documentDirectory}/pictures.json`,
    JSON.stringify({
      count: 2,
      pictures: [
        { uri: `file:///3.png`, height: 45, width: 78 },
        { uri: `file:///1.png`, height: 12, width: 96 }
      ]
    }));

  const images = rendered_test.root.findAllByType(Image);
  expect(images.length).toBe(2);
  expect(images[0].props.source.uri).toBe('file:///3.png');
  expect(images[1].props.source.uri).toBe('file:///1.png');
});

it('should delete an image after clicking another button', async () => {
  fs.readAsStringAsync.mockResolvedValue(JSON.stringify({
    count: 3,
    pictures: [
      { uri: `file:///2.png`, height: 123, width: 910 },
      { uri: `file:///3.png`, height: 45, width: 78 },
      { uri: `file:///1.png`, height: 12, width: 96 }
    ]
  }));

  await act(async () =>
    rendered_test = await create(component));

  const delete_button = rendered_test.root.findAllByType(
    TouchableHighlight);
  expect(delete_button.length).toBe(3);

  await act(async () =>
    delete_button[2].props.onPress());

  expect(fs.deleteAsync).toBeCalledWith('file:///1.png');
  expect(fs.writeAsStringAsync).toBeCalledWith(
    `${fs.documentDirectory}/pictures.json`,
    JSON.stringify({
      count: 2,
      pictures: [
        { uri: `file:///2.png`, height: 123, width: 910 },
        { uri: `file:///3.png`, height: 45, width: 78 },
      ]
    }));

  const images = rendered_test.root.findAllByType(Image);
  expect(images.length).toBe(2);
  expect(images[0].props.source.uri).toBe('file:///2.png');
  expect(images[1].props.source.uri).toBe('file:///3.png');
});

it('should reset new_count on focus', async () => {
  const unregister_fn = jest.fn(),
        navigation_mock = {
          addListener: jest.fn()
        };
  navigation_mock.addListener.mockReturnValue(unregister_fn);
  fs.readAsStringAsync.mockResolvedValue(JSON.stringify({
    count: 3,
    new_count: 3,
    pictures: []
  }));

  function FakeCount () {
    const new_count = useSelector(map_new_count);
    return <Text testID={'fake_count'}>{new_count}</Text>
  }

  await act(async () =>
    rendered_test = await create(
      <Provider store={store}>
        <NavigationContext.Provider value={navigation_mock}>
          <GaleryScreen anim_duration={0}></GaleryScreen>
        </NavigationContext.Provider>
        <FakeCount />
      </Provider>
    ));

  expect(navigation_mock.addListener).toHaveBeenCalled();
  expect(navigation_mock.addListener.mock.calls[0][0]).toBe('focus');
  const callback = navigation_mock.addListener.mock.calls[0][1];
  act(() => callback());

  const fake_count = rendered_test.root.find((el) =>
    el.props.testID === 'fake_count');
  expect(fake_count.props.children).toBe(0);

  act(() => {
    rendered_test.unmount();
  });
  expect(unregister_fn).toHaveBeenCalled();
});

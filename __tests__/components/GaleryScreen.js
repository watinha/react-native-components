import React from 'react';
import { Provider } from 'react-redux';
import { Image, TouchableHighlight } from 'react-native';
import { act, create } from 'react-test-renderer';
import * as fs from 'expo-file-system';

import create_store from '../../store';
import GaleryScreen from '../../components/GaleryScreen';

jest.useFakeTimers();

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('expo-file-system');

let rendered_test,
    store = create_store();

const component = (
  <Provider store={store}>
    <GaleryScreen anim_duration={0}></GaleryScreen>
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

import React from 'react';
import { Provider } from 'react-redux';
import { Text } from 'react-native';
import { act, create } from 'react-test-renderer';
import fs from 'expo-file-system';

import store from '../../store';

import CameraScreen, { CONSTANTS } from '../../components/CameraScreen';

jest.useFakeTimers();

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('expo-file-system');

it('should ask for permissions before rendering', async () => {
  let CameraMock = {
        requestPermissionsAsync: jest.fn()
      },
      camera_element = null,
      rendered_test = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});
  fs.readAsStringAsync.mockImplementation(() => { throw {}; });

  await act(async () =>
    rendered_test = await create(
      <Provider store={store}>
        <CameraScreen Camera_mock={CameraMock}></CameraScreen>
      </Provider>));

  camera_element = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.CAMERA_ELEMENT);
  expect(CameraMock.requestPermissionsAsync.mock.calls.length).toBe(1);
  expect(camera_element).not.toBeUndefined();

  fs.readAsStringAsync.mockClear();
});

it('should not render camera if permissions are not granted', async () => {
  let CameraMock = {
        requestPermissionsAsync: jest.fn()
      },
      rendered_test = null,
      no_camera_element = null,
      camera_element = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: false});
  fs.readAsStringAsync.mockImplementation(() => { throw {}; });

  await act(async () =>
    rendered_test = await create(
      <Provider store={store}>
        <CameraScreen Camera_mock={CameraMock}></CameraScreen>
      </Provider>));

  camera_element = rendered_test.root.findAll((el) =>
    el.props.testID === CONSTANTS.CAMERA_ELEMENT);
  no_camera_element = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.NO_CAMERA_MESSAGE);

  expect(CameraMock.requestPermissionsAsync.mock.calls.length).toBe(1);
  expect(camera_element.length).toBe(0);

  fs.readAsStringAsync.mockClear();
});

it('should capture picture when button is pressed', async () => {
  let CameraMock = {
        requestPermissionsAsync: jest.fn(),
        takePictureAsync: jest.fn()
      },
      date_mock = { getTime: () => 321 },
      rendered_test = null,
      button = null,
      camera_element = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});
  fs.moveAsync.mockReturnValue('');
  fs.readAsStringAsync.mockImplementation(() => { throw {}; });
  fs.writeAsStringAsync.mockReturnValue('');

  await act(async () =>
    rendered_test = await create(
      <Provider store={store}>
        <CameraScreen Camera_mock={CameraMock}
                      date_mock={date_mock}></CameraScreen>
      </Provider>));

  button = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.CAMERA_BUTTON);
  camera_element = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.CAMERA_ELEMENT);
  camera_element.instance.takePictureAsync = jest.fn();
  camera_element.instance.takePictureAsync.mockResolvedValue({
    'height': 1000,
    'width': 800,
    'uri': 'file:///var/mobile/somewhere'
  });

  await act(async () =>
    button.props.onPress());

  expect(fs.moveAsync).toBeCalledWith({
    from: 'file:///var/mobile/somewhere',
    to: `undefined321.png`
  });
  expect(fs.writeAsStringAsync).toBeCalledWith(
    `${fs.documentDirectory}/pictures.json`,
    JSON.stringify({
      count: 1,
      pictures: [
        {
          uri: `${fs.documentDirectory}/321.png`,
          height: 1000, width: 800
        }
      ]
    }));
  expect(fs.readAsStringAsync).toBeCalledWith(
    `${fs.documentDirectory}/pictures.json`);

  fs.moveAsync.mockClear();
  fs.readAsStringAsync.mockClear();
  fs.writeAsStringAsync.mockClear();
});

it('should capture picture when pressed a second time', async () => {
  let CameraMock = {
        requestPermissionsAsync: jest.fn(),
        takePictureAsync: jest.fn()
      },
      date_mock = { getTime: () => 777 },
      rendered_test = null,
      button = null,
      camera_element = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});
  fs.moveAsync.mockReturnValue('');
  fs.readAsStringAsync.mockResolvedValue(
    JSON.stringify({
      count: 1,
      pictures: [
        { uri: '1.png', height: 1, width: 2 }
      ]
    })
  );
  fs.writeAsStringAsync.mockReturnValue('');

  await act(async () =>
    rendered_test = await create(
      <Provider store={store}>
        <CameraScreen Camera_mock={CameraMock}
                      date_mock={date_mock}></CameraScreen>
      </Provider>));

  button = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.CAMERA_BUTTON);
  camera_element = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.CAMERA_ELEMENT);
  camera_element.instance.takePictureAsync = jest.fn();
  camera_element.instance.takePictureAsync.mockResolvedValue({
    'height': 755,
    'width': 255,
    'uri': 'file:///var/another/file'
  });

  await act(async () =>
    button.props.onPress());

  expect(fs.moveAsync).toBeCalledWith({
    from: 'file:///var/another/file',
    to: `undefined777.png`
  });
  expect(fs.writeAsStringAsync).toBeCalledWith(
    `${fs.documentDirectory}/pictures.json`,
    JSON.stringify({
      count: 2,
      pictures: [
        {uri: `${fs.documentDirectory}/777.png`, height: 755, width: 255},
        {uri: '1.png', height: 1, width: 2}
      ]
    }));
  expect(fs.readAsStringAsync).toBeCalledWith(
    `${fs.documentDirectory}/pictures.json`);

  fs.moveAsync.mockClear();
  fs.readAsStringAsync.mockClear();
  fs.writeAsStringAsync.mockClear();
});

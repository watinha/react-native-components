import React from 'react';
import { Text } from 'react-native';
import { act, create } from 'react-test-renderer';

import App from '../App';

import CameraScreen from '../../components/CameraScreen';

jest.useFakeTimers();

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

it('should ask for permissions before rendering', async () => {
  let CameraMock = {
        requestPermissionsAsync: jest.fn()
      },
      camera_element = null,
      rendered_test = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});

  await act(async () =>
    rendered_test = await create(
      <CameraScreen camera={CameraMock}></CameraScreen>));

  camera_element = rendered_test.root.find((el) =>
    el.props.testID === 'camera_element');
  expect(CameraMock.requestPermissionsAsync.mock.calls.length).toBe(1);
  expect(camera_element).not.toBeUndefined();

});

it('should not render camera if permissions are not granted', async () => {
  let CameraMock = {
        requestPermissionsAsync: jest.fn()
      },
      rendered_test = null,
      no_camera_element = null,
      camera_element = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: false});

  await act(async () =>
    rendered_test = await create(
      <CameraScreen camera={CameraMock}></CameraScreen>));

  camera_element = rendered_test.root.findAll((el) =>
    el.props.testID === 'camera_element');
  no_camera_element = rendered_test.root.find((el) =>
    el.props.testID === 'no_camera_message');

  expect(CameraMock.requestPermissionsAsync.mock.calls.length).toBe(1);
  expect(camera_element.length).toBe(0);
});

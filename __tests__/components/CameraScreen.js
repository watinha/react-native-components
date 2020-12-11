import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { Text, View } from 'react-native';
import { act, create } from 'react-test-renderer';
import fs from 'expo-file-system';

import create_store from '../../store';
import CameraScreen, { CONSTANTS } from '../../components/CameraScreen';
import { map_new_count } from '../../reducers/photo';

jest.useFakeTimers();

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('expo-file-system');

let CameraMock = null,
    date_mock = null,
    rendered_test = null,
    store;

beforeEach(() => {
  CameraMock = {
    requestPermissionsAsync: jest.fn(),
    takePictureAsync: jest.fn()
  };
  date_mock = { getTime: () => 321 };
  fs.readAsStringAsync.mockImplementation(() => { throw { id: 'no'}; });
  fs.writeAsStringAsync.mockReturnValue('');
  fs.moveAsync.mockReturnValue('');
  store = create_store();
});

afterEach(() => {
  fs.moveAsync.mockClear();
  fs.readAsStringAsync.mockClear();
  fs.writeAsStringAsync.mockClear();
  rendered_test.unmount();
  rendered_test = null;
  store = null;
});

it('should ask for permissions before rendering', async () => {
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});

  await act(async () =>
    rendered_test = await create(
      <Provider store={store}>
        <CameraScreen Camera_mock={CameraMock}></CameraScreen>
      </Provider>));

  const camera_element = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.CAMERA_ELEMENT);
  expect(CameraMock.requestPermissionsAsync.mock.calls.length).toBe(1);
  expect(camera_element).not.toBeUndefined();

  preview = rendered_test.root.findAll((el) =>
    el.props.testID === CONSTANTS.PREVIEW_ELEMENT);
  expect(preview.length).toBe(0);
});

it('should not render camera if permissions are not granted', async () => {
  let no_camera_element = null,
      camera_element = null;

  CameraMock.requestPermissionsAsync.mockResolvedValue({status: false});

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
});

it('should capture picture when button is pressed', async () => {
  let date_mock = { getTime: () => 321 },
      button = null,
      camera_element = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});

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
      new_count: 1,
      pictures: [
        {
          uri: `${fs.documentDirectory}/321.png`,
          height: 1000, width: 800
        }
      ]
    }));
  expect(fs.readAsStringAsync).toBeCalledWith(
    `${fs.documentDirectory}/pictures.json`);
});

it('should capture picture when pressed a second time', async () => {
  let date_mock = { getTime: () => 777 },
      button = null,
      camera_element = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});
  fs.readAsStringAsync.mockClear();
  fs.readAsStringAsync.mockResolvedValue(
    JSON.stringify({
      count: 1,
      new_count: 2,
      pictures: [
        { uri: '1.png', height: 1, width: 2 }
      ]
    })
  );

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
      new_count: 3,
      pictures: [
        {uri: `${fs.documentDirectory}/777.png`, height: 755, width: 255},
        {uri: '1.png', height: 1, width: 2}
      ]
    }));
  expect(fs.readAsStringAsync).toBeCalledWith(
    `${fs.documentDirectory}/pictures.json`);
});

it('should show preview element after press', async () => {
  let date_mock = { getTime: () => 888 },
      button = null,
      camera_element = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});

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

  preview = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.PREVIEW_ELEMENT);
  expect(preview.props.source.uri).toBe(`${fs.documentDirectory}/888.png`);
  button = rendered_test.root.findAll((el) =>
    el.props.testID === CONSTANTS.CAMERA_BUTTON);
  expect(button.length).toBe(0); // hide button
});

it('should show preview of another element after press', async () => {
  let date_mock = { getTime: () => 123 },
      button = null,
      camera_element = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});

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
    'uri': 'file:///same/file'
  });

  await act(async () =>
    button.props.onPress());

  preview = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.PREVIEW_ELEMENT);
  expect(preview.props.source.uri).toBe(`${fs.documentDirectory}/123.png`);
  button = rendered_test.root.findAll((el) =>
    el.props.testID === CONSTANTS.CAMERA_BUTTON);
  expect(button.length).toBe(0); // hide button
});

it('should remove preview element after some time', async () => {
  let date_mock = { getTime: () => 777 },
      button = null,
      camera_element = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});

  await act(async () =>
    rendered_test = await create(
      <Provider store={store}>
        <CameraScreen Camera_mock={CameraMock}
                      date_mock={date_mock}
                      duration_parameter={0}></CameraScreen>
      </Provider>));

  button = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.CAMERA_BUTTON);
  camera_element = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.CAMERA_ELEMENT);
  camera_element.instance.takePictureAsync = jest.fn();
  camera_element.instance.takePictureAsync.mockResolvedValue({
    'height': 755,
    'width': 255,
    'uri': 'file:///another.thing'
  });

  await act(async () =>
    await button.props.onPress());

  preview = rendered_test.root.findAll((el) =>
    el.props.testID === CONSTANTS.PREVIEW_ELEMENT);
  expect(preview.length).toBe(0);
  button = rendered_test.root.findAll((el) =>
    el.props.testID === CONSTANTS.CAMERA_BUTTON);
  expect(button.length).toBeGreaterThan(0); // show button again
});

it('should present 0 new count as rendered', async () => {
  let date_mock = { getTime: () => 999 },
      button = null,
      camera_element = null,
      count_stub = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});

  function StubComponent () {
    const count = useSelector(map_new_count);
    return <Text testID={'count_stub'}>{count}</Text>;
  };

  await act(async () =>
    rendered_test = await create(
      <Provider store={store}>
        <CameraScreen Camera_mock={CameraMock}
                      date_mock={date_mock}
                      duration_parameter={0}></CameraScreen>
        <StubComponent />
      </Provider>));

  count_stub = rendered_test.root.find((el) =>
    el.props.testID === 'count_stub');
  expect(count_stub.props.children).toBe(0);
});

it('should present 0 new count when picture.json does not have new_count', async () => {
  let date_mock = { getTime: () => 999 },
      button = null,
      camera_element = null,
      count_stub = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});
  fs.readAsStringAsync.mockClear();
  fs.readAsStringAsync.mockResolvedValue(
    JSON.stringify({
      count: 1,
      pictures: [
        { uri: '1.png', height: 1, width: 2 }
      ]
    })
  );

  function StubComponent () {
    const count = useSelector(map_new_count);
    return <Text testID={'count_stub'}>{count}</Text>;
  };

  await act(async () =>
    rendered_test = await create(
      <Provider store={store}>
        <CameraScreen Camera_mock={CameraMock}
                      date_mock={date_mock}
                      duration_parameter={0}></CameraScreen>
        <StubComponent />
      </Provider>));

  count_stub = rendered_test.root.find((el) =>
    el.props.testID === 'count_stub');
  expect(count_stub.props.children).toBe(0);
});

it('should increment new pictures count to 1, then 2', async () => {
  let date_mock = { getTime: () => 999 },
      button = null,
      camera_element = null,
      count_stub = null;
  CameraMock.requestPermissionsAsync.mockResolvedValue({status: true});

  function StubComponent () {
    const count = useSelector(map_new_count);
    return <Text testID={'count_stub'}>{count}</Text>;
  };

  await act(async () =>
    rendered_test = await create(
      <Provider store={store}>
        <CameraScreen Camera_mock={CameraMock}
                      date_mock={date_mock}
                      duration_parameter={0}></CameraScreen>
        <StubComponent />
      </Provider>));

  button = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.CAMERA_BUTTON);
  camera_element = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.CAMERA_ELEMENT);
  camera_element.instance.takePictureAsync = jest.fn();
  camera_element.instance.takePictureAsync.mockResolvedValue({
    'height': 755,
    'width': 255,
    'uri': 'file:///another.thing'
  });

  await act(async () =>
    await button.props.onPress());

  count_stub = rendered_test.root.find((el) =>
    el.props.testID === 'count_stub');
  expect(count_stub.props.children).toBe(1);
  button = rendered_test.root.find((el) =>
    el.props.testID === CONSTANTS.CAMERA_BUTTON);

  await act(async () =>
    await button.props.onPress());

  count_stub = rendered_test.root.find((el) =>
    el.props.testID === 'count_stub');
  expect(count_stub.props.children).toBe(2);
});

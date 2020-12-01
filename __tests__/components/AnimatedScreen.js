import React from 'react';
import { Text } from 'react-native';
import Renderer, { act } from 'react-test-renderer';

import AnimatedScreen from '../../components/AnimatedScreen';

jest.useFakeTimers();

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

it('renders correctly', () => {
  const navigation_mock = { addListener: () => {} },
        rendered_test = Renderer.create(
          <AnimatedScreen navigation={navigation_mock}>
            <Text>Abobrinha</Text>
          </AnimatedScreen>
        );

  rendered_test.root.find((el) => el.props.children === 'Abobrinha');
});

it('renders multiple elements inside', () => {
  const navigation_mock = { addListener: () => {} },
        rendered_test = Renderer.create(
          <AnimatedScreen navigation={navigation_mock}>
            <Text>Uva</Text>
            <Text>Abacaxi</Text>
          </AnimatedScreen>
        );

  rendered_test.root.find((el) => el.props.children === 'Uva');
  rendered_test.root.find((el) => el.props.children === 'Abacaxi');
});

it('renders styles passed as props', () => {
  const navigation_mock = { addListener: () => {} },
        styles_stub = { backgroundColor: 'bla' },
        rendered_test = Renderer.create(
          <AnimatedScreen navigation={navigation_mock}
                          style={styles_stub}>
            <Text>Uva</Text>
            <Text>Abacaxi</Text>
          </AnimatedScreen>
        );

  rendered_test.root.find(
    (el) => el.props.style.backgroundColor === 'bla');
});

it('renders other styles passed as props', () => {
  const navigation_mock = { addListener: () => {} },
        styles_stub = { flex: 1, backgroundColor: 'red' },
        rendered_test = Renderer.create(
          <AnimatedScreen navigation={navigation_mock}
                          style={styles_stub}>
            <Text>Uva</Text>
            <Text>Abacaxi</Text>
          </AnimatedScreen>
        );

  rendered_test.root.find((el) =>
    el.props.style.flex === 1 && el.props.style.backgroundColor === 'red');
});

it('initializes with opacity state in 0', () => {
  const navigation_mock = { addListener: () => {} },
        rendered_test = Renderer.create(
          <AnimatedScreen navigation={navigation_mock}></AnimatedScreen>);
  rendered_test.root.find((el) =>
    el.props.style && el.props.style.opacity === 0);
});

it('should change opacity on focus event', async () => {
  let callback_param = null,
      unregister_mock = jest.fn(),
      navigation_mock = { addListener: jest.fn() },
      rendered_test;

  navigation_mock.addListener.mockReturnValueOnce(unregister_mock);

  await act(async () => {
    rendered_test = await Renderer.create(
          <AnimatedScreen navigation={navigation_mock}
                          duration={0}></AnimatedScreen>);
  });

  await act(async () => {
    expect(navigation_mock.addListener.mock.calls[0][0]).toBe('focus');
    callback_param = navigation_mock.addListener.mock.calls[0][1];
    callback_param();
  });

  let screen = rendered_test.root.find((el) =>
    el.props.testID === 'screenView');
  expect(screen.props.style.opacity._value).toBe(1);

  act(() => {
    rendered_test.unmount();
  });

  expect(unregister_mock.mock.calls.length).toBe(1);
});

it('should change opacity on blur event', async () => {
  let navigation_mock = {
        addListener: jest.fn()
      },
      unregister_mock = jest.fn(),
      rendered_test;

  navigation_mock.addListener.mockReturnValueOnce(() => { return false; })
                             .mockReturnValueOnce(unregister_mock);

  await act(async () => {
    rendered_test = await Renderer.create(
          <AnimatedScreen navigation={navigation_mock}
                          duration={0}></AnimatedScreen>);
  });

  act(() => {
    const focus_event = navigation_mock.addListener.mock.calls[0][0],
          focus_callback = navigation_mock.addListener.mock.calls[0][1];
    expect(focus_event).toBe('focus');
    focus_callback();
  });

  act(() => {
    expect(navigation_mock.addListener.mock.calls.length).toBe(2);
    const blur_event = navigation_mock.addListener.mock.calls[1][0],
          blur_callback = navigation_mock.addListener.mock.calls[1][1];
    expect(blur_event).toBe('blur');
    blur_callback();
  });

  let screen = rendered_test.root.find((el) =>
    el.props.testID === 'screenView');
  expect(screen.props.style.opacity._value).toBe(0);

  act(() => {
    rendered_test.unmount();
  });

  expect(unregister_mock.mock.calls.length).toBe(1);
});

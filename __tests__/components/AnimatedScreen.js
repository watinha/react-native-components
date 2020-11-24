import React from 'react';
import { Text } from 'react-native';

import App from '../App';

// Note: test renderer must be required after react-native.
import { act, render, fireEvent, cleanup } from '@testing-library/react-native';

import AnimatedScreen from '../../components/AnimatedScreen';

jest.useFakeTimers();
afterEach(cleanup);

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

it('renders correctly', () => {
  const navigation_mock = { addListener: () => {} },
        { queryAllByText } = render(
          <AnimatedScreen navigation={navigation_mock}>
            <Text>Abobrinha</Text>
          </AnimatedScreen>
        );

  let texts = queryAllByText('Abobrinha');
  expect(texts.length).toBe(1);
});

it('renders multiple elements inside', () => {
  const navigation_mock = { addListener: () => {} },
        { queryAllByText } = render(
          <AnimatedScreen navigation={navigation_mock}>
            <Text>Uva</Text>
            <Text>Abacaxi</Text>
          </AnimatedScreen>
        );

  let uva = queryAllByText('Uva'),
      abacaxi = queryAllByText('Abacaxi');

  expect(uva.length).toBe(1);
  expect(abacaxi.length).toBe(1);
});

it('renders styles passed as props', () => {
  const navigation_mock = { addListener: () => {} },
        styles_stub = { backgroundColor: 'bla' },
        { queryByTestId } = render(
          <AnimatedScreen navigation={navigation_mock}
                          style={styles_stub}>
            <Text>Uva</Text>
            <Text>Abacaxi</Text>
          </AnimatedScreen>
        );

  let view = queryByTestId('screenView');
  expect(view.props.style.backgroundColor).toBe('bla');
});

it('renders other styles passed as props', () => {
  const navigation_mock = { addListener: () => {} },
        styles_stub = { flex: 1, backgroundColor: 'red' },
        { queryByTestId } = render(
          <AnimatedScreen navigation={navigation_mock}
                          style={styles_stub}>
            <Text>Uva</Text>
            <Text>Abacaxi</Text>
          </AnimatedScreen>
        );

  let view = queryByTestId('screenView');
  expect(view.props.style.backgroundColor).toBe('red');
  expect(view.props.style.flex).toBe(1);
});

it('initializes with opacity state in 0', () => {
  const navigation_mock = { addListener: () => {} },
        { queryByTestId } = render(
          <AnimatedScreen navigation={navigation_mock}></AnimatedScreen>),
        screen = queryByTestId('screenView');
  expect(screen.props.style.opacity).toBe(0);
});

it('should change opacity on focus event', () => {
  let callback_param = null,
      unregister_mock = jest.fn(),
      navigation_mock = { addListener: jest.fn() };

  navigation_mock.addListener.mockReturnValueOnce(unregister_mock);

  let { queryByTestId, unmount } = render(
        <AnimatedScreen navigation={navigation_mock}></AnimatedScreen>);

  act(() => {
    expect(navigation_mock.addListener.mock.calls[0][0]).toBe('focus');
    callback_param = navigation_mock.addListener.mock.calls[0][1];
    callback_param();
  });

  let screen = queryByTestId('screenView');
  expect(screen.props.style.opacity).toBe(1);

  act(() => {
    unmount();
  });

  expect(unregister_mock.mock.calls.length).toBe(1);
});

it('should change opacity on blur event', () => {
  let navigation_mock = {
        addListener: jest.fn()
      },
      unregister_mock = jest.fn();

  navigation_mock.addListener.mockReturnValueOnce(() => { return false; })
                             .mockReturnValueOnce(unregister_mock);

  let { queryByTestId, unmount } = render(
        <AnimatedScreen navigation={navigation_mock}></AnimatedScreen>);

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

  let screen = queryByTestId('screenView');
  expect(screen.props.style.opacity).toBe(0);

  act(() => {
    unmount();
  });

  expect(unregister_mock.mock.calls.length).toBe(1);
});

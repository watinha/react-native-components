import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';

import { Camera } from 'expo-camera';

import { load_json, take_picture } from '../reducers/photo';

export const CONSTANTS = {
  CAMERA_ELEMENT: 'camera_element',
  CAMERA_BUTTON: 'camera_button',
  NO_CAMERA_ELEMENT: 'no_camera_message'
};

export default function CameraScreen ({ Camera_mock, date_mock }) {
  let [permission, setPermission] = useState(false),
      dispatch = useDispatch(),
      camera_api = Camera_mock ? Camera_mock : Camera,
      camera = null;

  useEffect(() => {
    (async () => {
      const permissions = await camera_api.requestPermissionsAsync();
      setPermission(permissions.status);
      dispatch(load_json());
    })();
  }, []);

  const __onPress = async () => {
    const date = date_mock ? date_mock : new Date(),
          photo = await camera.takePictureAsync();
    dispatch(take_picture(photo, date))
  };

  if (!permission) {
    return (
      <View>
        <Text testID={CONSTANTS.NO_CAMERA_MESSAGE}>
          Camera permissions were not granted!!!
        </Text>
      </View>
    );
  }
  return (
    <View style={{flex: 1}}>
      <Camera ref={(el) => camera = el} style={{flex: 1}}
              testID={CONSTANTS.CAMERA_ELEMENT}></Camera>
      <TouchableHighlight testID={CONSTANTS.CAMERA_BUTTON}
                          style={styles.button}
                          onPress={__onPress}>
        <Text>Take Picture</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 30,
    borderRadius: 30,
    borderColor: '#FFFFFF',
    height: 0,
    width: 0,
    opacity: 0.9,
    flex: 1,
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center'
  }
});

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Image, View, Text, TouchableHighlight, StyleSheet }
  from 'react-native';

import { Camera } from 'expo-camera';

import { load_json, take_picture, map_pictures } from '../reducers/photo';

export const CONSTANTS = {
  CAMERA_ELEMENT: 'camera_element',
  CAMERA_BUTTON: 'camera_button',
  PREVIEW_ELEMENT: 'preview_element',
  NO_CAMERA_ELEMENT: 'no_camera_message'
};

export default function CameraScreen (
    { Camera_mock, date_mock, duration_parameter }) {
  let [permission, setPermission] = useState(false),
      [preview, setPreview] = useState(false),
      pictures = useSelector(map_pictures),
      dispatch = useDispatch(),
      camera_api = Camera_mock ? Camera_mock : Camera,
      camera = null,
      duration = duration_parameter === 0 ? 0 : 200;

  useEffect(() => {
    (async () => {
      const permissions = await camera_api.requestPermissionsAsync();
      setPermission(permissions.status);
      dispatch(load_json());
    })();
  }, []);

  const __onPress = async () => {
    const date = date_mock ? date_mock : new Date(),
          photo = await camera.takePictureAsync(),
          preview = await dispatch(take_picture(photo, date));
    setPreview(preview);
    if (duration === 0)
      setPreview(false)
    else
      setTimeout(() => setPreview(false), duration);
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
      {preview && (
        <Image testID={CONSTANTS.PREVIEW_ELEMENT}
               style={styles.preview}
               source={{ uri: preview['uri'] }}></Image>
      )}
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
  },
  preview: {
    height: 100,
    width: 100,
  }
});

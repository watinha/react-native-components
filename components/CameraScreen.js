import React, { useState, useEffect } from 'react';

import { View, Text, TouchableHighlight } from 'react-native';

import { Camera } from 'expo-camera';
import * as fs from 'expo-file-system';

export default function CameraScreen ({ camera }) {
  let [permission, setPermission] = useState(false),
      [count, setCount] = useState(0),
      [pictures, setPictures] = useState([]),
      camera_api = camera ? camera : Camera;

  useEffect(() => {
    (async () => {
      const permissions = await camera_api.requestPermissionsAsync();
      setPermission(permissions.status);

      try {
        const json = JSON.parse(await fs.readAsStringAsync(
          `${fs.documentDirectory}/pictures.json`));
        setCount(json.count);
        setPictures(json.pictures);
      } catch (e) {
        throw e;
      }
    })();
  }, []);

  const __onPress = async () => {
    const photo = await camera_api.takePictureAsync();
    fs.moveAsync(photo['uri'], `${fs.documentDirectory}/${count + 1}.png`);
    fs.writeAsStringAsync(
      `${fs.documentDirectory}/pictures.json`,
      JSON.stringify({
        count: (count + 1),
        pictures: [{
          uri: `${fs.documentDirectory}/${count + 1}.png`,
          height: photo['height'],
          width: photo['width']
        }, ...pictures]
      })
    );
    setCount(count + 1);
  };

  if (!permission) {
    return (
      <View>
        <Text testID="no_camera_message">
          Camera permissions were not granted!!!
        </Text>
      </View>
    );
  }
  return (
    <View style={{flex: 1}}>
      <Camera style={{flex: 1}} testID="camera_element"></Camera>
      <TouchableHighlight testID="camera_button"
                          onPress={__onPress}>
        <Text>Oi</Text>
      </TouchableHighlight>
    </View>
  );
}

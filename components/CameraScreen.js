import React, { useState, useEffect } from 'react';

import { View, Text } from 'react-native';

import { Camera } from 'expo-camera';

export default function CameraScreen ({ camera }) {
  let [permission, setPermission] = useState(false),
      camera_api = camera ? camera : Camera;

  useEffect(() => {
    (async () => {
      const permissions = await camera_api.requestPermissionsAsync();
      setPermission(permissions.status);
    })();
  }, []);

  if (!permission) {
    return (
      <View>
        <Text testID="no_camera_message">
          Camera permissions were not granted!!!</Text>
      </View>
    );
  }
  return (
    <View style={{flex: 1}}>
      <Camera style={{flex: 1}}testID="camera_element"></Camera>
    </View>
  );
}

import React, { useState, useEffect } from 'react';

import { View, Text } from 'react-native';

import { Camera } from 'expo-camera';

export default function CameraScreen ({ camera }) {
  let [permission, setPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const permissions = await camera.requestPermissionsAsync();
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
    <View>
      <Camera testID="camera_element"></Camera>
    </View>
  );
}

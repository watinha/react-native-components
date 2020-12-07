import React, { useEffect } from 'react';

import { View, StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { load_json, map_pictures } from '../reducers/photo';

export default function GaleryScreen () {
  let pictures = useSelector(map_pictures),
      dispatch = useDispatch();

  useEffect(() => {
    dispatch(load_json());
  }, []);

  return (
    <View>
    {pictures.map((picture, index) =>
      <Image style={styles.image}
             key={`Image-${index}`}
             source={{ uri: picture.uri }}></Image>)}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
  },
});

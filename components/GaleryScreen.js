import React, { useEffect } from 'react';
import { FlatList, View, StyleSheet, Image, Text, TouchableHighlight }
  from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import fs from 'expo-file-system';

import { load_json, map_pictures, delete_picture }
  from '../reducers/photo';

export default function GaleryScreen () {
  let pictures = useSelector(map_pictures),
      dispatch = useDispatch();

  const deletePicture = (item) => {
    return () => dispatch(delete_picture(item));
  };

  const renderPicture = ({ item }) => {
    return (
      <View style={styles.item_container}>
        <Image style={styles.image}
               source={{ uri: item.uri }}></Image>
        <TouchableHighlight onPress={deletePicture(item)}>
          <Text>Delete</Text>
        </TouchableHighlight>
      </View>
    );
  };

  useEffect(() => {
    dispatch(load_json());
  }, []);

  return (
    <FlatList data={pictures}
              renderItem={renderPicture}
              keyExtractor={(item, index) => `picture-${index}`} />
  );
};

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
  },
  item_container: {
    flex: 1,
    margin: 7,
    padding: 3,
    backgroundColor: 'white'
  }
});

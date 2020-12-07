import React, { useEffect } from 'react';

import { FlatList, View, StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { load_json, map_pictures } from '../reducers/photo';

function renderPicture ({ item }) {
  return (
    <View style={styles.item_container}>
      <Image style={styles.image}
             source={{ uri: item.uri }}></Image>
    </View>
  );
}

export default function GaleryScreen () {
  let pictures = useSelector(map_pictures),
      dispatch = useDispatch();

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

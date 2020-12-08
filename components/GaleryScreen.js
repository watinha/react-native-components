import React, { useEffect, useRef } from 'react';
import { FlatList, Animated, StyleSheet, Image, Text, TouchableHighlight }
  from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import fs from 'expo-file-system';

import { load_json, map_pictures, delete_picture }
  from '../reducers/photo';

export default function GaleryScreen ({ anim_duration }) {
  const duration = anim_duration === 0 ? anim_duration : 200;
  let pictures = useSelector(map_pictures),
      dispatch = useDispatch();

  const renderPicture = ({ item }) => {
    const height_anim = new Animated.Value(106);

    const delete_clicked = (item) => {
      return () => {
        Animated.timing(height_anim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: false
        }).start(() => dispatch(delete_picture(item)));
      };
    };

    return (
      <Animated.View style={[
          styles.item_container,
          {
            maxHeight: height_anim,
            padding: height_anim.interpolate({
              inputRange: [0, 106],
              outputRange: [0, 3]
            }),
            overflow: 'hidden'
          }]}>
        <Image style={styles.image}
               source={{ uri: item.uri }}></Image>
        <TouchableHighlight style={styles.delete_button}
                            onPress={delete_clicked(item)}>
          <Text style={{ textAlign: 'center' }}>Delete</Text>
        </TouchableHighlight>
      </Animated.View>
    );
  };

  useEffect(() => {
    dispatch(load_json());
  }, []);

  return (
    <FlatList data={pictures}
              renderItem={renderPicture}
              keyExtractor={(item) => `picture-${item.uri}`} />
  );
};

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100
  },
  item_container: {
    flex: 1,
    margin: 7,
    padding: 3,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  delete_button: {
    height: 100,
    width: 70,
    justifyContent: 'center',
    backgroundColor: '#FFAAAA'
  }
});

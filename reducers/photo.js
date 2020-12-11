import { createSlice } from '@reduxjs/toolkit';

import * as fs from 'expo-file-system';

export const photo_slice = createSlice({
  name: 'photo',
  initialState: {
    count: 0,
    pictures: [],
    new_count: 0
  },
  reducers: {
    reset_new_count: (state, action) => {
      return { ...state, new_count: 0 };
    },
    load: (state, action) => {
      return {
        count: action.payload.count,
        pictures: action.payload.pictures,
        new_count: (action.payload.new_count ? action.payload.new_count : 0)
      };
    }
  },
});

export const map_count = (state) => state.photo.count;
export const map_pictures = (state) => state.photo.pictures;
export const map_new_count = (state) => state.photo.new_count;
export const reset_new_count = photo_slice.actions.reset_new_count;
export const load_json = () => {
  return async (dispatch) => {
    try {
      let data = await fs.readAsStringAsync(`${fs.documentDirectory}/pictures.json`),
          json = JSON.parse(data);
      dispatch(photo_slice.actions.load(json));
    } catch (e) {
      throw e;
    }
  };
};
export const take_picture = (photo, date) => {
  return async (dispatch, getState) => {
    const state = getState(),
          new_state = {
            count: (state.photo.count + 1),
            new_count: (state.photo.new_count + 1),
            pictures: [{
              uri: `${fs.documentDirectory}/${date.getTime()}.png`,
              height: photo['height'],
              width: photo['width']
            }, ...state.photo.pictures]
          };
    await fs.moveAsync({
      from: photo['uri'],
      to: `${fs.documentDirectory}${date.getTime()}.png`
    });
    await fs.writeAsStringAsync(
      `${fs.documentDirectory}/pictures.json`,
      JSON.stringify(new_state));
    dispatch(photo_slice.actions.load(new_state));
    return new_state.pictures[0];
  };
};
export const delete_picture = (item) => {
  return async (dispatch, getState) => {
    const state = getState(),
          new_state = {
            count: (state.photo.pictures.length - 1),
            pictures: state.photo.pictures.filter((picture) =>
              picture.uri !== item.uri)
          };
    await fs.deleteAsync(item.uri);
    await fs.writeAsStringAsync(
      `${fs.documentDirectory}/pictures.json`,
      JSON.stringify(new_state));
    dispatch(photo_slice.actions.load(new_state));
  };
};

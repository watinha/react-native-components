import { createSlice } from '@reduxjs/toolkit';

import * as fs from 'expo-file-system';

export const photo_slice = createSlice({
  name: 'photo',
  initialState: {
    count: 0,
    pictures: []
  },
  reducers: {
    load: (state, action) => {
      return { count: action.payload.count, pictures: action.payload.pictures };
    },
    update_state: (state, action) => {
      return action['payload'];
    }
  },
});

export const map_count = (state) => state.photo.count;
export const map_pictures = (state) => state.photo.pictures;
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
export const take_picture = (photo) => {
  return async (dispatch, getState) => {
    const state = getState(),
          new_state = {
            count: (state.photo.count + 1),
            pictures: [{
              uri: `${fs.documentDirectory}/${state.photo.count + 1}.png`,
              height: photo['height'],
              width: photo['width']
            }, ...state.photo.pictures]
          };
    await fs.moveAsync({
      from: photo['uri'],
      to: `${fs.documentDirectory}${state.photo.count + 1}.png`
    });
    await fs.writeAsStringAsync(
      `${fs.documentDirectory}/pictures.json`,
      JSON.stringify(new_state));
    dispatch(photo_slice.actions.update_state(new_state));
  };
};
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
    take_picture: (state, action) => {
      fs.moveAsync(action['payload']['uri'],
        `${fs.documentDirectory}/${state.count + 1}.png`);
      fs.writeAsStringAsync(
        `${fs.documentDirectory}/pictures.json`,
        JSON.stringify({
          count: (state.count + 1),
          pictures: [{
            uri: `${fs.documentDirectory}/${state.count + 1}.png`,
            height: action['payload']['height'],
            width: action['payload']['width']
          }, ...state.pictures]
        })
      );
      return { ...state, count: state.count + 1 };
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

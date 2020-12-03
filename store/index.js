import { configureStore } from '@reduxjs/toolkit';
import { photo_slice } from '../reducers/photo';

export default configureStore({
  reducer: {
    'photo': photo_slice.reducer
  }
});

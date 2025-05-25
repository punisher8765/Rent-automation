import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import roomReducer from './slices/roomSlice';
import billReducer from './slices/billSlice'; // Import billReducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    room: roomReducer,
    bill: billReducer, // Add billReducer
    // Add other reducers here if you have them
  },
});

export default store;

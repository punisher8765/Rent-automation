import { createSlice } from '@reduxjs/toolkit';

// Helper function to get initial rooms from localStorage
const getInitialRooms = () => {
  try {
    const item = localStorage.getItem('rooms');
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error loading rooms from localStorage:', error);
    return [];
  }
};

// Helper function to save rooms to localStorage
const saveRoomsToLocalStorage = (rooms) => {
  try {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  } catch (error) {
    console.error('Error saving rooms to localStorage:', error);
  }
};

const initialState = {
  rooms: getInitialRooms(),
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    addRoom: (state, action) => {
      // Ensure propertyId is part of the payload
      if (!action.payload.propertyId) {
        console.error('propertyId is required to add a room.');
        // Optionally set an error state here
        state.error = 'Cannot add room without a propertyId.';
        return;
      }
      const newRoom = { 
        ...action.payload, 
        id: `room_${Date.now().toString()}_${Math.random().toString(36).substr(2, 9)}` // More unique ID
      };
      state.rooms.push(newRoom);
      saveRoomsToLocalStorage(state.rooms);
      state.error = null; // Clear any previous error
    },
    updateRoom: (state, action) => {
      const index = state.rooms.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.rooms[index] = { ...state.rooms[index], ...action.payload };
        saveRoomsToLocalStorage(state.rooms);
      }
    },
    setRooms: (state, action) => {
      state.rooms = action.payload;
      saveRoomsToLocalStorage(state.rooms); // Also save when explicitly setting rooms
    },
    deleteRoom: (state, action) => {
      state.rooms = state.rooms.filter(r => r.id !== action.payload.id); // action.payload should be the roomId
      saveRoomsToLocalStorage(state.rooms);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addRoom,
  updateRoom,
  setRooms,
  deleteRoom,
  setLoading,
  setError,
  clearError,
} = roomSlice.actions;

export default roomSlice.reducer;

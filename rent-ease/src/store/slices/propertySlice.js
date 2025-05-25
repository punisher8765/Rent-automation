import { createSlice } from '@reduxjs/toolkit';

const getInitialProperties = () => {
  try {
    const item = localStorage.getItem('properties');
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error loading properties from localStorage:', error);
    return [];
  }
};

const savePropertiesToLocalStorage = (properties) => {
  try {
    localStorage.setItem('properties', JSON.stringify(properties));
  } catch (error) {
    console.error('Error saving properties to localStorage:', error);
  }
};

const initialState = {
  properties: getInitialProperties(),
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    addProperty: (state, action) => {
      const newProperty = { ...action.payload, id: Date.now().toString() }; // Add a unique ID
      state.properties.push(newProperty);
      savePropertiesToLocalStorage(state.properties);
    },
    setProperties: (state, action) => {
      state.properties = action.payload;
      savePropertiesToLocalStorage(state.properties);
    },
    // Placeholder for future actions
    updateProperty: (state, action) => {
      const index = state.properties.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.properties[index] = action.payload;
        savePropertiesToLocalStorage(state.properties);
      }
    },
    deleteProperty: (state, action) => {
      state.properties = state.properties.filter(p => p.id !== action.payload.id);
      savePropertiesToLocalStorage(state.properties);
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
  addProperty,
  setProperties,
  updateProperty,
  deleteProperty,
  setLoading,
  setError,
  clearError,
} = propertySlice.actions;

export default propertySlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/api/auth';

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data; // Contains user and token
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for user signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.signup(userData);
      return data; // Contains user and token
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: authService.getCurrentUser(),
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!authService.getCurrentUser(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    loadUser: (state) => {
      const user = authService.getCurrentUser();
      const token = localStorage.getItem('authToken');
      if (user && token) {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logoutUser, loadUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

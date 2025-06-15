import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

const loadFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }
  
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    return { user, token };
  } catch (error) {
    console.error('Error loading auth state:', error);
    return { user: null, token: null };
  }
};

const { user, token } = loadFromLocalStorage();

const initialState = {
  user,
  token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },
    restoreUser: (state) => {
      const { user, token } = loadFromLocalStorage();
      state.user = user;
      state.token = token;
      state.isAuthenticated = !!token;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login success
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.isAuthenticated = true;
          state.user = payload.user;
          state.token = payload.token;
          state.loading = false;
          state.error = null;
          
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(payload.user));
            localStorage.setItem('token', payload.token);
          }
        }
      )
      // Login failure
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, action) => {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.loading = false;
          state.error = action.payload?.data?.message || 'Authentication failed';
        }
      )
      // Signup success
      .addMatcher(
        authApi.endpoints.signup.matchFulfilled,
        (state, { payload }) => {
          // If your API returns user and token on signup, handle it here
          if (payload.token && payload.user) {
            state.isAuthenticated = true;
            state.user = payload.user;
            state.token = payload.token;
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(payload.user));
              localStorage.setItem('token', payload.token);
            }
          }
          state.loading = false;
          state.error = null;
        }
      )
      // Logout success
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.loading = false;
          state.error = null;
          
          // Clear localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      );
  },
});

export const { logout, restoreUser } = authSlice.actions;
export default authSlice.reducer;
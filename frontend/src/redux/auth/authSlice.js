import { createSlice } from '@reduxjs/toolkit';
import { userLogin, userRegister } from './authActions';

const initialState = {
  loading: false,
  token: null, // Do not persist this directly in Redux or localStorage
  isLogged: false, // Updated based on login state
  role: null, // Role will persist if needed
  error: null,
  success: false,
  id:null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.token = null;
      state.role = null; // Clear role on logout
      state.isLogged = false;
      state.error = null;
      state.success = false;
      state.id = null
    },
    setCredentials: (state, { payload }) => {
      state.token = payload.token;
      state.role = payload.role; // Assume role is sent from backend
      state.isLogged = true;
      state.success = true;
      state.id = payload.id
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.role = payload.role; // Set role based on server response
        state.isLogged = true;
        state.success = true;
        state.id = payload.id
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Signup cases
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, { payload }) => {
        state.loading = false;
        // Optionally handle role or other user details
      })
      .addCase(userRegister.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;

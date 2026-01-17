import { createSlice } from '@reduxjs/toolkit';
import { userLogin, userRegister, fetchCurrentUser } from './authActions';

const initialState = {
  loading: false,
  token: null,
  isLogged: false,
  role: null,
  fullName: null,
  email: null,
  phone: null,
  id: null,
  error: null,
  success: false,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.token = null;
      state.role = null;
      state.fullName = null;
      state.email = null;
      state.phone = null;
      state.id = null;
      state.isLogged = false;
      state.error = null;
      state.success = false;
      state.initialized = true;
    },
    setCredentials: (state, { payload }) => {
      state.token = payload.token;
      state.role = payload.role;
      state.fullName = payload.fullName || null;
      state.email = payload.email || null;
      state.phone = payload.phone || null;
      state.id = payload.id || null;
      state.isLogged = true;
      state.success = true;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.role = payload.role;
        state.fullName = payload.fullName || null;
        state.email = payload.email || null;
        state.phone = payload.phone || null;
        state.id = payload.id || null;
        state.isLogged = true;
        state.success = true;
        state.initialized = true;
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.initialized = true;
      })
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.role = payload.role;
        state.fullName = payload.fullName || null;
        state.email = payload.email || null;
        state.phone = payload.phone || null;
        state.id = payload.id || null;
        state.initialized = true;
      })
      .addCase(userRegister.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.initialized = false;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.role = payload.role;
        state.fullName = payload.fullName || null;
        state.email = payload.email || null;
        state.phone = payload.phone || null;
        state.id = payload.id || null;
        state.isLogged = true;
        state.success = true;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.isLogged = false;
        state.role = null;
        state.token = null;
        state.fullName = null;
        state.email = null;
        state.phone = null;
        state.id = null;
        state.success = false;
        state.initialized = true;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;

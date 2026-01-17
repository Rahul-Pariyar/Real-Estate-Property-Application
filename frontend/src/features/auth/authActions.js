import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout, setCredentials } from "./authSlice";

const backendURL = "http://localhost:3000";

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${backendURL}/auth/login`,
        { email, password },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Signup (Register) Action
export const userRegister = createAsyncThunk(
  "auth/signup",
  async ({ fullName, email, phone, password, userType }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${backendURL}/auth/signup`,
        { fullName, email, phone, password, userType },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch current user info (for persistent login)
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.get(`${backendURL}/auth/me`, config);
      // data should include at least: { token, role }
      dispatch(setCredentials(data));
      return data;
    } catch (error) {
      // If not authenticated, log out
      dispatch(logout());
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const userLogout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await axios.post(
        `${backendURL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      // Clear local storage
      localStorage.clear();

      // Dispatch logout action to update Redux state
      dispatch(logout());

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  }
);

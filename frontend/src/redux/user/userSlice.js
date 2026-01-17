

// // Fetch current user profile (GET /users/:id)
// export const fetchUserProfile = createAsyncThunk(
//   'user/fetchProfile',
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(`${backendURL}/users/${id}`, { withCredentials: true });
//       return data.user || data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Update user profile (PUT /users/:id)
// export const updateUserProfile = createAsyncThunk(
//   'user/updateProfile',
//   async ({ id, fullName, email, phone, currentPassword, newPassword }, { rejectWithValue }) => {
//     try {
//       const payload = { fullName, email, phone };
//       if (currentPassword && newPassword) {
//         payload.currentPassword = currentPassword;
//         payload.newPassword = newPassword;
//       }
//       const { data } = await axios.put(
//         `${backendURL}/users/${id}`,
//         payload,
//         { withCredentials: true }
//       );
//       return data.updatedUser || data.user || data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// const initialState = {
//   id: null,
//   fullName: '',
//   email: '',
//   phone: '',
//   role: '',
//   loading: false,
//   error: null,
//   success: false,
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     clearUserState: (state) => {
//       state.id = null;
//       state.fullName = '';
//       state.email = '';
//       state.phone = '';
//       state.role = '';
//       state.loading = false;
//       state.error = null;
//       state.success = false;
//     },
//     setUser: (state, { payload }) => {
//       state.id = payload.id;
//       state.fullName = payload.fullName;
//       state.email = payload.email;
//       state.phone = payload.phone;
//       state.role = payload.role;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         state.id = payload._id;
//         state.fullName = payload.fullName;
//         state.email = payload.email;
//         state.phone = payload.phone;
//         state.role = payload.role;
//         state.success = true;
//       })
//       .addCase(fetchUserProfile.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload;
//       })
//       .addCase(updateUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         state.id = payload._id;
//         state.fullName = payload.fullName;
//         state.email = payload.email;
//         state.phone = payload.phone;
//         state.role = payload.role;
//         state.success = true;
//       })
//       .addCase(updateUserProfile.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload;
//         state.success = false;
//       });
//   },
// });

// export const { clearUserState, setUser } = userSlice.actions;
// export default userSlice.reducer;

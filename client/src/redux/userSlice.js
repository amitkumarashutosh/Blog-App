import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteInSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.error = null;
      state.loading = false;
      state.currentUser = null;
    },
    signoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  updateInFailure,
  updateInStart,
  updateInSuccess,
  deleteInStart,
  deleteInFailure,
  deleteInSuccess,
  signoutFailure,
  signoutSuccess,
} = userSlice.actions;
export default userSlice.reducer;

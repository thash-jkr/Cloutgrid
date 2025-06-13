import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { logoutThunk } from "./authSlice";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (showAll, { getState, rejectWithValue }) => {
    try {
      const access = getState().auth.access;
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/notifications/?all=${showAll}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      return { notifications: response.data, showAll };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { getState, rejectWithValue }) => {
    try {
      const access = getState().auth.access;
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/notifications/${id}/mark_as_read/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

const initialState = {
  notifications: [],
  count: 0,
  notificationLoading: false,
  notificationError: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notifications = [];
      state.notificationLoading = false;
      state.notificationError = null;
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationLoading = true;
        state.notificationError = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { notifications, showAll } = action.payload;
        state.notificationLoading = false;
        state.notifications = notifications;
        state.count = showAll ? state.count : state.notifications.length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.notificationLoading = false;
        state.notificationError = action.payload;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.notifications = [];
        state.notificationLoading = false;
        state.notificationError = null;
        state.count = 0;
      });

    builder
      .addCase(markAsRead.pending, (state) => {
        state.notificationError = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        state.count -= 1;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.notificationError = action.payload;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

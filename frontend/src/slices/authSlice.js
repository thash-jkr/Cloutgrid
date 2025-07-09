import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchProfile, updateProfile } from "./profileSlice";
// import { fetchProfile, updateProfile } from "../slices/profileSlice";

export const loginThunk = createAsyncThunk(
  "auth/loginThunk",
  async ({ email, password, type }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login/${type}/`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { access, refresh, user } = response.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("type", type);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common.Authorization = `Bearer ${access}`;

      return {
        access,
        refresh,
        user,
        type,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Something went wrong!"
      );
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/registerThunk",
  async ({ data, type }, { rejectWithValue }) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/register/${type}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Something went wrong!"
      );
    }
  }
);

export const handlePasswordResetRequest = createAsyncThunk(
  "auth/passwordResetRequest",
  async (email, { rejectWithValue }) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/password-reset/`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Something went wrong!"
      );
    }
  }
);

export const handlePasswordResetConfirm = createAsyncThunk(
  "auth/passwordResetConfirm",
  async ({ uid, token, password }, { rejectWithValue }) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/password-reset-confirm/${uid}/${token}/`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data.message || "Something went wrong!"
      );
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logoutThunk",
  async (_, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");
      const refresh = localStorage.getItem("refresh");

      if (!refresh) throw new Error("No refresh token found");

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/logout/`,
        { refresh },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("type");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common.Authorization;

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

const initialState = {
  user: null,
  access: null,
  refresh: null,
  type: null,
  authLoading: false,
  authError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.type = null;
      state.authLoading = false;
      state.authError = null;
    },

    setCredentials(state, action) {
      const { user, access, refresh, type } = action.payload;
      state.user = user;
      state.access = access;
      state.refresh = refresh;
      state.type = type;
      state.authLoading = false;
      state.authError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload.user;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.type = action.payload.type;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      });

    builder
      .addCase(registerThunk.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.authLoading = false;
        state.authError = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      });

    builder
      .addCase(handlePasswordResetRequest.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(handlePasswordResetRequest.fulfilled, (state) => {
        state.authLoading = false;
        state.authError = null;
      })
      .addCase(handlePasswordResetRequest.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      });

    builder
      .addCase(handlePasswordResetConfirm.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(handlePasswordResetConfirm.fulfilled, (state) => {
        state.authLoading = false;
        state.authError = null;
      })
      .addCase(handlePasswordResetConfirm.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      });

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.authLoading = true;
        state.authError = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.access = null;
        state.refresh = null;
        state.type = null;
        state.authLoading = false;
        state.authError = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.authLoading = false;
        state.authError = action.payload;
      });

    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      });
  },
});

export const { logoutLocal, setCredentials } = authSlice.actions;
export default authSlice.reducer;

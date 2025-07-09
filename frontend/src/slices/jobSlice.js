import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { handleBlock } from "./profilesSlice";

export const fetchJobs = createAsyncThunk(
  "job/fetchJobs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { access } = getState().auth;
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/jobs/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const fetchMyJobs = createAsyncThunk(
  "job/fetchMyJobs",
  async (_, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/jobs/my-jobs/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const handleCreateJob = createAsyncThunk(
  "job/handleCreateJob",
  async (data, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/jobs/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const handleDeleteJob = createAsyncThunk(
  "job/handleDeleteJob",
  async (id, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/jobs/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const handleApplication = createAsyncThunk(
  "job/handleApplication",
  async ({ id, answers }, { getState, rejectWithValue }) => {
    try {
      const { access } = getState().auth;
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/jobs/${id}/apply/`,
        { answers },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const initialState = {
  jobs: [],
  myJobs: [],
  jobLoading: false,
  jobError: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    clearJobs: (state) => {
      state.jobs = [];
      state.jobLoading = false;
      state.jobError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.jobLoading = true;
        state.jobError = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.jobLoading = false;
        state.jobError = action.payload;
      })

      .addCase(fetchMyJobs.pending, (state) => {
        state.jobLoading = true;
        state.jobError = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.myJobs = action.payload;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.jobLoading = false;
        state.jobError = action.payload;
      })

      .addCase(handleCreateJob.pending, (state) => {
        state.jobLoading = true;
        state.jobError = null;
      })
      .addCase(handleCreateJob.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.myJobs.push(action.payload);
      })
      .addCase(handleCreateJob.rejected, (state, action) => {
        state.jobLoading = false;
        state.jobError = action.payload;
      })

      .addCase(handleDeleteJob.pending, (state) => {
        state.jobLoading = true;
        state.jobError = null;
      })
      .addCase(handleDeleteJob.fulfilled, (state, action) => {
        const id = action.payload;
        state.myJobs = state.myJobs.filter((job) => job.id !== id);
        state.jobLoading = false;
      })
      .addCase(handleDeleteJob.rejected, (state, action) => {
        state.jobLoading = false;
        state.jobError = action.payload;
      })

      .addCase(handleApplication.fulfilled, (state, action) => {
        const id = action.payload;
        const job = state.jobs.find((j) => j.id === id);
        if (job) job.is_applied = true;
        state.jobLoading = false;
      })
      .addCase(handleApplication.rejected, (state, action) => {
        state.jobLoading = false;
        state.jobError = action.payload;
      })

      .addCase(handleBlock.pending, (state, action) => {
        const username = action.meta.arg;
        state.jobs = state.jobs.filter((job) => {
          return job.posted_by.user.username !== username;
        });
      });
  },
});

export const { clearJobs } = jobSlice.actions;
export default jobSlice.reducer;

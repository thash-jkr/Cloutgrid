import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { handleBlock } from "./profilesSlice";
import { deletePost } from "./profileSlice";

export const fetchFeed = createAsyncThunk(
  "feed/fetchFeed",
  async (_, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/posts/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const handleCreatePost = createAsyncThunk(
  "feed/handleCreatePost",
  async (data, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/posts/`,
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
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  "feed/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}/like/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      const is_liked = response.data.liked;
      const like_count = response.data.like_count;
      return {
        postId,
        is_liked,
        like_count,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

const initialState = {
  posts: [],
  postLoading: false,
  postError: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    clearFeed(state) {
      state.posts = [];
      state.postLoading = false;
      state.postError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.postLoading = true;
        state.postError = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.postLoading = false;
        state.postError = null;
        state.posts = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.postLoading = false;
        state.postError = action.payload;
      })

      .addCase(handleCreatePost.pending, (state) => {
        state.postLoading = true;
        state.postError = null;
      })
      .addCase(handleCreatePost.fulfilled, (state, action) => {
        state.postLoading = false;
        state.postError = null;
        state.posts.unshift(action.payload);
      })
      .addCase(handleCreatePost.rejected, (state, action) => {
        state.postLoading = false;
        state.postError = action.payload;
      })

      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, is_liked, like_count } = action.payload;
        state.posts = state.posts.map((post) =>
          post.id === postId ? { ...post, like_count, is_liked } : post
        );
      })
      .addCase(likePost.rejected, (state, action) => {
        state.postError = action.payload;
      })

      .addCase(handleBlock.pending, (state, action) => {
        const username = action.meta.arg;
        state.posts = state.posts.filter((post) => {
          return post.author.username !== username;
        });
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post.id !== action.payload.id
        );
      });
  },
});

export const { clearFeed } = feedSlice.actions;
export default feedSlice.reducer;

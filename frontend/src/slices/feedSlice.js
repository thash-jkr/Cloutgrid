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
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const fetchComments = createAsyncThunk(
  "feed/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}/comments/`,
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

export const handleAddComment = createAsyncThunk(
  "feed/handleAddComment",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}/comments/`,
        { content },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      const newComment = response.data;

      return { newComment, postId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const initialState = {
  posts: [],
  comments: [],
  feedLoading: false,
  feedError: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    clearFeed(state) {
      state.posts = [];
      state.comments = [];
      state.feedLoading = false;
      state.feedError = null;
    },
    clearComments(state) {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.feedError = null;
        state.posts = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload;
      })

      .addCase(handleCreatePost.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(handleCreatePost.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.feedError = null;
        state.posts.unshift(action.payload);
      })
      .addCase(handleCreatePost.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload;
      })

      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, is_liked, like_count } = action.payload;
        state.posts = state.posts.map((post) =>
          post.id === postId ? { ...post, like_count, is_liked } : post
        );
      })
      .addCase(likePost.rejected, (state, action) => {
        state.feedError = action.payload;
      })

      .addCase(fetchComments.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.feedError = null;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload;
      })

      .addCase(handleAddComment.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(handleAddComment.fulfilled, (state, action) => {
        state.feedLoading = false;
        state.feedError = null;
        const { newComment, postId } = action.payload;
        state.comments.push(newComment);
        state.posts = state.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comment_count: post.comment_count + 1,
            };
          }
          return post;
        });
      })
      .addCase(handleAddComment.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload;
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

export const { clearFeed, clearComments } = feedSlice.actions;
export default feedSlice.reducer;

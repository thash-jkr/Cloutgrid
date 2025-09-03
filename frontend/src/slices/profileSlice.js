import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { handleAddComment, likePost } from "./feedSlice";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { access, type } = getState().auth;
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/profile/${type}/`,
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

export const fetchPosts = createAsyncThunk(
  "profile/fetchPosts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { access, user } = getState().auth;
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${user?.user.username}/`,
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

export const fetchCollabs = createAsyncThunk(
  "profile/fetchCollabs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const access = getState().auth.access;
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/posts/collabs/`,
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

export const deletePost = createAsyncThunk(
  "profile/deletePost",
  async (postId, { getState, rejectWithValue }) => {
    try {
      const { access } = getState().auth;
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      return { id: postId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail ?? error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (updates, { getState, rejectWithValue }) => {
    try {
      const { type } = getState().auth;
      const access = localStorage.getItem("access");

      const data = new FormData();
      data.append("user[name]", updates.user.name);
      data.append("user[email]", updates.user.email);
      data.append("user[username]", updates.user.username);

      if (updates.user.profile_photo) {
        data.append("user[profile_photo]", updates.user.profile_photo);
      }

      if (updates.user.password) {
        data.append("user[password]", updates.user.password);
      }

      data.append("user[bio]", updates.user.bio);

      if (type === "creator") {
        data.append("area", updates.area);
      } else {
        data.append("website", updates.website);
        data.append("target_audience", updates.target_audience);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/profile/${type}/`,
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
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

export const connectInstagram = createAsyncThunk(
  "profile/connectInstagram",
  async (_, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/instagram/connect/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

export const disconnectInstagram = createAsyncThunk(
  "profile/disconnectInstagram",
  async (_, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/facebook/deauthorize/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

export const purgeFacebook = createAsyncThunk(
  "profile/purgeFacebook",
  async (_, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/privacy/facebook/purge/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

export const fetchInstagramProfile = createAsyncThunk(
  "profile/fetchInstagramProfile",
  async (_, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/instagram/profile/fetch/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

export const readInstagramProfile = createAsyncThunk(
  "profile/readInstagramProfile",
  async (username, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/instagram/profile/read/${username}/`,
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
        error.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

export const fetchInstagramMedia = createAsyncThunk(
  "profile/fetchInstagramMedia",
  async (_, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/instagram/media/fetch/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

export const readInstagramMedia = createAsyncThunk(
  "profile/readInstagramMedia",
  async (username, { rejectWithValue }) => {
    try {
      const access = localStorage.getItem("access");

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/instagram/media/read/${username}/`,
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
        error.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

export const selectPostById = (state, postId) =>
  state.profile.posts.find((post) => post.id === postId) ||
  state.profile.collabs.find((post) => post.id === postId) ||
  state.profiles.otherPosts.find((post) => post.id === postId) ||
  state.profiles.otherCollabs.find((post) => post.id === postId);

const initialState = {
  posts: [],
  collabs: [],
  profile: null,
  instagramProfile: [],
  instagramMedia: [],
  profileLoading: false,
  profileError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(fetchPosts.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(fetchCollabs.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchCollabs.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.collabs = action.payload;
      })
      .addCase(fetchCollabs.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(deletePost.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.posts = state.posts.filter(
          (post) => post.id !== action.payload.id
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(connectInstagram.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(connectInstagram.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile.instagram_connected = true;
      })
      .addCase(connectInstagram.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(disconnectInstagram.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(disconnectInstagram.fulfilled, (state) => {
        state.profileLoading = false;
        state.instagramProfile = null;
        state.instagramMedia = null;
        state.profile.instagram_connected = false;
      })
      .addCase(disconnectInstagram.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
        state.instagramProfile = null;
        state.instagramMedia = null;
        state.profile.instagram_connected = false;
      });

    builder
      .addCase(purgeFacebook.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(purgeFacebook.fulfilled, (state) => {
        state.profileLoading = false;
        state.instagramProfile = null;
        state.instagramMedia = null;
        state.profile.instagram_connected = false;
      })
      .addCase(purgeFacebook.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
        state.instagramProfile = null;
        state.instagramMedia = null;
        state.profile.instagram_connected = false;
      });

    builder
      .addCase(fetchInstagramProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchInstagramProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profileError = null;
      })
      .addCase(fetchInstagramProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(readInstagramProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(readInstagramProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.instagramProfile = action.payload;
      })
      .addCase(readInstagramProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(fetchInstagramMedia.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchInstagramMedia.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profileError = null;
      })
      .addCase(fetchInstagramMedia.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(readInstagramMedia.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(readInstagramMedia.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.instagramMedia = action.payload;
      })
      .addCase(readInstagramMedia.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    builder
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, is_liked, like_count } = action.payload;
        state.posts = state.posts.map((post) =>
          post.id === postId ? { ...post, like_count, is_liked } : post
        );
        state.collabs = state.collabs.map((post) =>
          post.id === postId ? { ...post, like_count, is_liked } : post
        );
      })
      .addCase(handleAddComment.fulfilled, (state, action) => {
        const { newComment, postId } = action.payload;
        state.posts = state.posts.map((post) =>
          post.id === postId
            ? { ...post, comment_count: post.comment_count + 1 }
            : post
        );
        state.collabs = state.collabs.map((post) =>
          post.id === postId
            ? { ...post, comment_count: post.comment_count + 1 }
            : post
        );
      });
  },
});

export const { clearProfile, resetUpdateStatus } = profileSlice.actions;
export default profileSlice.reducer;

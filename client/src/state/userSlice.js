import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  posts: [],
};

const resetState = () => ({
  type: "RESET_STATE",
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      }
    },
    updateUser: (state, action) => {
      state.user = action.payload.user;
    },
    setPostsFeed: (state, action) => {
      state.posts = action.payload.posts;
    },
    updatePost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (posts) => posts._id !== action.payload.post._id
      );
    },
    reset: (state, action) => {
      state = undefined;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setFriends,
  updateUser,
  setPostsFeed,
  updatePost,
  updateFriends,
  deletePost,
  reset,
} = authSlice.actions;
export default authSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, IPost, IFriendProfileState } from "../../types/types";



const initialState: IFriendProfileState = {
  profile: null,
  loading: false,
  error: null,
  friends: [],
  posts: [],
};

const friendProfileSlice = createSlice({
  name: "friendProfile",
  initialState,
  reducers: {
    fetchFriendProfileStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFriendProfileSuccess(
      state,
      action: PayloadAction<{
        user: IUser;
        friends: IUser[];
        posts: IPost[];
      }>
    ) {
      state.profile = action.payload.user;
      state.friends = action.payload.friends;
      state.posts = action.payload.posts;
      state.loading = false;
    },
    fetchFriendProfileError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearFriendProfile(state) {
      state.profile = null;
      state.friends = [];
      state.posts = [];
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  fetchFriendProfileStart,
  fetchFriendProfileSuccess,
  fetchFriendProfileError,
  clearFriendProfile,
} = friendProfileSlice.actions;

export default friendProfileSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFriends, IUser } from "../../types/types";

interface IUserResponse {
  message: string;
  updatedUser: IUser;
}

interface IProfileState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  friends: IFriends | null;
}

const initialState: IProfileState = {
  user: null,
  loading: false,
  error: null,
  friends: null,
};

const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    setUser: (state, action: PayloadAction<IUser>) => {
      console.log("setUser", action.payload);
      state.user = action.payload.user;
      state.loading = false;
    },

    updateUser: (state, action: PayloadAction<IUserResponse>) => {
      console.log("updateUser", action.payload);
      state.user = action.payload.updatedUser;
      state.loading = false;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    totalFriends: (state, action: PayloadAction<string>) => {
      console.log("action", action.payload);

      state.friends = action.payload.data;
      state.friendsCount = action.payload.total;
    },
    unfriendRedux: (state, action: PayloadAction<number>) => {
      console.log("action ", action.payload);

      if (state.friends) {
        state.friends = state.friends.filter(
          (friend) => friend.user_id !== action.payload
        );
        state.friendsCount = (state.friendsCount || 0) - 1;
      }
    },
  },
});

export const {
  startLoading,
  setUser,
  updateUser,
  setError,
  totalFriends,
  unfriendRedux,
} = ProfileSlice.actions;

export default ProfileSlice.reducer;

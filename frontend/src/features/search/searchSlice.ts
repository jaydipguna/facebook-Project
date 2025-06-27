import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types/types";

interface ISearchState {
  users: IUser[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}

const initialState: ISearchState = {
  users: [],
  loading: false,
  error: null,
  totalUsers: 0,
  totalPages: 0,
  currentPage: 1,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    startSearch(state) {
      state.loading = true;
      state.error = null;
    },
    searchSuccess(
      state,
      action: PayloadAction<{
        users: IUser[];
        totalUsers: number;
        totalPages: number;
        currentPage: number;
      }>
    ) {
      console.log("action in searching", action.payload);

      state.users = action.payload.users;
      state.totalUsers = action.payload.totalUsers;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.loading = false;
    },
    searchError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateFriendshipStatus: (
      state,
      action: PayloadAction<{
        message: string;
        updatedRequest: {
          friendrequest_id: number;
          sender_id: number;
          receiver_id: number;
          status: string;
        };
      }>
    ) => {
      const { sender_id, receiver_id, status } = action.payload.updatedRequest;
      console.log(
        "sender_id",
        sender_id,
        "receiver_id",
        receiver_id,
        "status",
        status
      );

      const requestId = action.payload.updatedRequest.friendrequest_id;

      if (status === "accepted") {
        const requestToUpdate = state.users.find(
          (user) => user.requestId === requestId
        );

        if (requestToUpdate) {
          requestToUpdate.friendshipStatus = status;
          requestToUpdate.actions = ["unfriend"];
          requestToUpdate.requestId = null;
        }
      } else {
        const userToUpdate = state.users.find(
          (user) => user.user_id === receiver_id
        );

        if (userToUpdate) {
          userToUpdate.friendshipStatus = status;

          if (status === "friends") {
            userToUpdate.actions = ["unfriend"];
          } else if (status === "pending_sent") {
            userToUpdate.actions = ["cancel_request"];
          } else if (status === "pending_received") {
            userToUpdate.actions = ["accept_request"];
          } else {
            userToUpdate.actions = [];
          }

          userToUpdate.requestId = status === "friends" ? null : requestId;
        }
      }
    },
  },
});

export const {
  startSearch,
  searchSuccess,
  searchError,
  updateFriendshipStatus,
} = searchSlice.actions;
export default searchSlice.reducer;

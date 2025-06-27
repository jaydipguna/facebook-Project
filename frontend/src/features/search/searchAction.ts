import api from "../../services/api";
import {
  searchError,
  searchSuccess,
  startSearch,
  updateFriendshipStatus,
} from "./searchSlice";

export const searchUser = (query: string) => async (dispatch: any) => {
  console.log("query", query);
  dispatch(startSearch());

  try {
    const response = await api.get("/user/search", {
      params: { query },
    });

    console.log("response in searching", response);
    dispatch(searchSuccess(response));
  } catch (error) {
    console.error("error", error);
    dispatch(searchError(error.response?.data?.message || "Search failed"));
  }
};

export const sendFriendRequested =
  (receiverId: number) => async (dispatch: any) => {
    try {
      const response = await api.post(`/user/friend-requests/${receiverId}`);
      console.log("Response from sendFriendRequested", response);
      dispatch(updateFriendshipStatus(response));
    } catch (error) {
      console.error("Error sending friend request", error);
    }
  };

export const acceptedFriendRequest =
  (friendRequestId: number) => async (dispatch: any) => {
    try {
      const response = await api.put(
        `/user/friend-requests/${friendRequestId}/accept`
      );
      console.log("Response from acceptFriendRequest", response);
      dispatch(updateFriendshipStatus(response));
    } catch (error) {
      console.error("Error accepting friend request", error);
    }
  };

export const unfriendSendRequest =
  (friendId: number) => async (dispatch: any) => {
    try {
      const response = await api.delete(`/user/unfriend/${friendId}`);
      console.log("Response from unfriendSendRequest", response);
      dispatch(updateFriendshipStatus(response));
    } catch (error) {
      console.error("Error unfriending", error);
    }
  };


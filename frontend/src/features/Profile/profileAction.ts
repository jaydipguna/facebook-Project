import api from "../../services/api";
import { IUser } from "../../types/types";

import {
  setError,
  setUser,
  totalFriends,
  unfriendRedux,
  updateUser,
} from "./profileSlice";

export const getUserInfo = () => async (dispatch: any) => {
  try {
    const response = await api.get("/user/profile");
    console.log("response", response);
    dispatch(setUser(response));
  } catch (error) {
    console.error("Error getting user Info:", error);
    dispatch(setError(error));
  }
};

export const updateUserProfile = (formData: IUser) => async (dispatch: any) => {
  try {
    const response = await api.put("/user/profile-update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(updateUser(response));
    console.log("response", response);
  } catch (error) {
    console.error("error", error);
  }
};

export const getAllFriend = () => async (dispatch: any) => {
  try {
    const response = await api.get("/user/friends");
    console.log("response", response);
    dispatch(totalFriends(response));
  } catch (error) {
    console.error("error", error);
  }
};
export const unfriend = (friendId: number) => async (dispatch: any) => {
  console.log("friendId", friendId);

  try {
    const response = await api.delete(`/user/unfriend/${friendId}`);
    dispatch(unfriendRedux(friendId));

    console.log("response", response);
  } catch (error) {
    console.error("error", error);
  }
};

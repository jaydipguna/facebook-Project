import api from "../../services/api";
import { fetchFriendProfileError, fetchFriendProfileStart, fetchFriendProfileSuccess } from "./friendProfileSlice";

export const getProfileByFriend =
  (friendId: number) => async (dispatch: any) => {
    console.log("friendId", friendId);
    dispatch(fetchFriendProfileStart())
    try {
      const response = await api.get(`/user/friend-profile/${friendId}`);
      console.log("response", response);
      dispatch(fetchFriendProfileSuccess(response))
    } catch (error) {
      console.error("Error unfriending", error);
      dispatch(fetchFriendProfileError())
    }
  };

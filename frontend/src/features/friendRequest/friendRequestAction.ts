import api from "../../services/api";
import { setUsers, updateFriendshipStatus } from "./friendRequestsSlice";
// import { updateFriendshipStatus } from "../Profile/profileSlice";


export const getAllUser=()=>async(dispatch:any)=>{
  console.log("here");
  
  try {
    const response=await api.get("/user/allUsers")
    console.log("response",response);
    dispatch(setUsers(response))

    
  } catch (error) {
    console.error("Error fetching all userdata", error);

  }
}


export const sendFriendRequestedToUser = (receiverId: number) => async (dispatch: any) => {
  console.log("reciver id in action",receiverId);
  
  try {
    const response = await api.post(`/user/friend-requests/${receiverId}`);
    console.log("Response from sendFriendRequested", response);
       dispatch(updateFriendshipStatus(response));
   
  } catch (error) {
    console.error("Error sending friend request", error);
  }
};

export const acceptedFriendRequest = (friendRequestId: number) => async (dispatch: any) => {
  try {
    const response = await api.put(`/user/friend-requests/${friendRequestId}/accept`);
    console.log("Response from acceptFriendRequest", response);
    dispatch(updateFriendshipStatus(response));

  } catch (error) {
    console.error("Error accepting friend request", error);
  }
};

export const deleteFriendRequest = (friendRequestId: number) => async (dispatch: any) => {
    console.log("friendRequestId",friendRequestId);
    
  try {
    const response = await api.delete(`/user/friend-Request-Delete/${friendRequestId}`);
    console.log("Response from acceptFriendRequest", response);
    dispatch(updateFriendshipStatus(response));

  } catch (error) {
    console.error("Error accepting friend request", error);
  }
};
// export const unfriendSendRequest = (friendId: number) => async (dispatch: any) => {
//   try {
//     const response = await api.delete(`/user/unfriend/${friendId}`);
//     console.log("Response from unfriendSendRequest", response);
//     dispatch(deleteFriend(response)); 
//     dispatch(updateFriendshipStatus(response))
//   } catch (error) {
//     console.error("Error unfriending", error);
//   }
// };

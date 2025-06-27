import { Router } from "express";
import uploadImage from "../middleware/upload.js";
import {
  updateProfile,
  getProfile,
  getUserFriendsController,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  searchUsers,
  unfriendUser,
  allUser,
  deleteRequest,
  getFriendProfileByID,
} from "../controllers/user.controller.js";
import UserAuthorization from "../middleware/auth.middleware.js";

const userRouter = Router();

//  User Profile Routes
userRouter.get("/search", UserAuthorization, searchUsers);

userRouter.get(
  "/allUsers",
  UserAuthorization,
  allUser
);

userRouter.get("/profile", UserAuthorization, getProfile);

userRouter.get("/friend-profile/:friendId", UserAuthorization, getFriendProfileByID);


userRouter.put(
  "/profile-update",
  UserAuthorization,
  uploadImage({ folderName: "post_images" }).single("profile"),
  updateProfile
);

userRouter.get("/friends", UserAuthorization, getUserFriendsController);



userRouter.delete("/friend-Request-Delete/:requestId",UserAuthorization, deleteRequest);


userRouter.delete("/unfriend/:friendId",UserAuthorization, unfriendUser);


userRouter.post(
  "/friend-requests/:receiverId",
  UserAuthorization,
  sendFriendRequest
);

userRouter.put(
  "/friend-requests/:requestId/accept",
  UserAuthorization,
  acceptFriendRequest
);

userRouter.put(
  "/friend-requests/:requestId/reject",
  UserAuthorization,
  rejectFriendRequest
);



export default userRouter;

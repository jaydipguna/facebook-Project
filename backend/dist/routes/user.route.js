import { Router } from "express";
import uploadImage from '../middleware/upload.js';
import { updateProfile, getProfile, getUserFriendsController, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../controllers/user.controller.js';
import UserAuthorization from '../middleware/auth.middleware.js';
const userRouter = Router();
//  User Profile Routes
userRouter.get('/profile', UserAuthorization, getProfile);
userRouter.put('/profile-update', UserAuthorization, 
// validate(updateProfileValidationSchema),
uploadImage({ folderName: 'post_images' }).single('profile'), updateProfile);
//  Friend Request Routes
userRouter.get('/friends', UserAuthorization, getUserFriendsController);
userRouter.post('/friend-requests/:receiverId', UserAuthorization, sendFriendRequest);
userRouter.put('/friend-requests/:requestId/accept', UserAuthorization, acceptFriendRequest);
userRouter.put('/friend-requests/:requestId/reject', UserAuthorization, rejectFriendRequest);
export default userRouter;

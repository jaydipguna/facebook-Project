import userService from "../services/user.service";
import { deleteImageFromCloudinary, extractPublicId, } from "../utils/cloudinary.utils";
import asyncHandler from "../utils/asyncHandler";
//  User Profile API
export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.userId; // assuming userId is stored in the user object after auth middleware
    try {
        const user = await userService.findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Successfully fetched user data", user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export const updateProfile = asyncHandler(async (req, res) => {
    const { first_name, last_name, bio } = req.body;
    const userId = req.user.userId;
    console.log("last_name", last_name);
    console.log("first_name", first_name);
    console.log("bio", bio);
    try {
        const user = await userService.findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let profileUrl = user.profile;
        if (req.file) {
            console.log("req.file", req.file);
            if (user.profile) {
                const publicId = extractPublicId(user.profile);
                if (publicId)
                    await deleteImageFromCloudinary(publicId);
            }
            profileUrl = req.file.path;
        }
        const updatedUser = await user.update({
            first_name: first_name || user.first_name,
            last_name: last_name || user.last_name,
            bio: bio || user.bio,
            profile: profileUrl,
        });
        res
            .status(200)
            .json({ message: "User updated successfully", updatedUser });
    }
    catch (error) {
        console.error("Profile update failed:", error);
        res.status(500).json({ error: error.message });
    }
});
// Friend Request API
export const getUserFriendsController = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    console.log("userId", userId);
    try {
        const friends = await userService.getUserFriendsService(userId);
        res.status(200).json({
            message: "Friends fetched successfully",
            data: friends,
        });
    }
    catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({
            message: "Failed to fetch friends",
            error: error.message,
        });
    }
});
export const sendFriendRequest = asyncHandler(async (req, res) => {
    const senderId = req.user.userId;
    const receiverId = req.params.receiverId;
    console.log("senderId", senderId);
    console.log("receiverId", receiverId);
    try {
        if (senderId === parseInt(receiverId)) {
            return res.status(400).json({
                message: "You cannot send a friend request to yourself",
            });
        }
        const existingRequest = await userService.checkExistingRequest(senderId, receiverId);
        console.log("existingRequest", existingRequest);
        if (existingRequest) {
            return res
                .status(400)
                .json({ message: "Friend request already exists" });
        }
        const request = await userService.createFriendRequest(senderId, receiverId);
        console.log("request", request);
        return res.status(201).json({ message: "Friend request sent", request });
    }
    catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ message: "Error sending friend request" });
    }
});
export const acceptFriendRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId;
    try {
        const request = await userService.getFriendRequestById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        await userService.updateFriendRequestStatus(request, "accepted");
        return res.status(200).json({ message: "Friend request accepted" });
    }
    catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Error accepting friend request" });
    }
});
export const rejectFriendRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId;
    try {
        const request = await userService.getFriendRequestById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        await userService.updateFriendRequestStatus(request, "rejected");
        return res.status(200).json({ message: "Friend request rejected" });
    }
    catch (error) {
        console.error("Error rejecting friend request:", error);
        res.status(500).json({ message: "Error rejecting friend request" });
    }
});

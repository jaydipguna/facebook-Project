import { Request, Response } from "express";
import userService from "../services/user.service";
import {
  deleteImageFromCloudinary,
  extractPublicId,
} from "../utils/cloudinary.utils";
import asyncHandler from "../utils/asyncHandler";
import { number } from "joi";
import User from "../models/user.model";
import { Op } from "sequelize";
import FriendRequest from "../models/friendRequest.model";
import postServices from "../services/post.services";

//  User Profile API
export const getProfile = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user.userId; 
  try {
    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Successfully fetched user data", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
export const getFriendProfileByID = asyncHandler(async (req: Request, res: Response) => {
  const { friendId } = req.params;
  console.log("friendId", friendId);

  try {
    const user = await userService.findUserById(friendId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = await userService.getFriendsByUserId(friendId);
    // console.log("friends", friends);

    const posts = await postServices.getPostsByUserId(friendId);

    res.status(200).json({
      message: "Successfully fetched user data",
      user,
      friends,
      posts,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export const updateProfile = asyncHandler(async (req: any, res: Response) => {
  const { username, first_name, last_name, bio } = req.body;

  const userId = req.user.userId;

  console.log("last_name", last_name);
  console.log("first_name", first_name);
  console.log("bio", bio);
  console.log("username", username);


  try {
    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingUser = await userService.findUserByUsername(username);
    if (existingUser && existingUser.user_id !== userId) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    let profileUrl = user.profile;

    if (req.file) {
      console.log("req.file", req.file);

      if (user.profile) {
        const publicId = extractPublicId(user.profile);
        if (publicId) await deleteImageFromCloudinary(publicId);
      }

      profileUrl = req.file.path;
    }
    const updatedUser = await user.update({
      username: username || user.username,
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name,
      bio: bio || user.bio,
      profile: profileUrl,
    });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error: any) {
    console.error("Profile update failed:", error);
    res.status(500).json({ error: error.message });
  }
});


// searching friend 



export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { query, page = "1", limit = "10" } = req.query;
    const currentUserId = req.user.userId; // Assuming you store userId in the token

    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return res.status(400).json({
        message: "Search query is required and should be at least 3 characters long.",
      });
    }

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const offset = (pageNumber - 1) * limitNumber;

    const whereClause = {
      [Op.or]: [
        { username: { [Op.iLike]: `%${query}%` } },
        { first_name: { [Op.iLike]: `%${query}%` } },
        { last_name: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
      ],
      user_id: { [Op.ne]: currentUserId },
    };

    const { rows: users, count: totalUsers } = await User.findAndCountAll({
      where: whereClause,
      attributes: ["user_id", "username", "first_name", "last_name", "email", "profile"],
      limit: limitNumber,
      offset,
    });

    const userIds = users.map(user => user.user_id);

    const friendRequests = await FriendRequest.findAll({
      where: {
        [Op.or]: [
          { sender_id: currentUserId, receiver_id: { [Op.in]: userIds } },
          { receiver_id: currentUserId, sender_id: { [Op.in]: userIds } },
        ],
      },
    });

    const requestMap = new Map<number, { status: string; requestId: number }>();

    friendRequests.forEach(req => {
      const senderId = req.get("sender_id");
      const receiverId = req.get("receiver_id");
      const status = req.get("status");
      const requestId = req.get("friendrequest_id");

      const isSender = senderId === currentUserId;
      const otherUserId = isSender ? receiverId : senderId;
      const direction = isSender ? "sent" : "received";

      requestMap.set(otherUserId, {
        status: `${direction}:${status}`,
        requestId,
      });
    });

    const enrichedUsers = users.map(user => {
      const otherUserId = user.user_id;
      const request = requestMap.get(otherUserId);

      let friendshipStatus = "none";
      let actions: string[] = ["send_request"];

      if (request) {
        const [direction, status] = request.status.split(":");

        if (status === "pending") {
          if (direction === "sent") {
            friendshipStatus = "pending_sent";
            actions = ["cancel_request"];
          } else {
            friendshipStatus = "pending_received";
            actions = ["accept_request", "decline_request"];
          }
        } else if (status === "accepted") {
          friendshipStatus = "friends";
          actions = ["unfriend"];
        }
      }

      return {
        ...user.toJSON(),
        friendshipStatus,
        actions,
        requestId: request?.requestId || null,
        receiver_id: otherUserId,
      };
    });

    return res.status(200).json({
      users: enrichedUsers,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limitNumber),
      currentPage: pageNumber,

    });

  } catch (error: any) {
    console.error("Error during search:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Friend Request API

export const getUserFriendsController = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user.userId;
  

    try {
      const friends = await userService.getUserFriendsService(userId);
 
      
      res.status(200).json({
        message: "Friends fetched successfully",
        data: friends,
        total: friends.length,
      });
    } catch (error: any) {
      console.error("Error fetching friends:", error);
      res.status(500).json({
        message: "Failed to fetch friends",
        error: error.message,
      });
    }
  }
);

export const sendFriendRequest = asyncHandler(
  async (req: any, res: Response) => {
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

      const existingRequest = await userService.checkExistingRequest(
        senderId,
        receiverId
      );
      console.log("existingRequest", existingRequest);
      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Friend request already exists" });
      }

      const updatedRequest = await userService.createFriendRequest(
        senderId,
        receiverId
      );
      console.log("request", updatedRequest);
      return res.status(200).json({ message: "Friend request sent", updatedRequest });
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      res.status(500).json({ message: "Error sending friend request" });
    }
  }
);

export const acceptFriendRequest = asyncHandler(
  async (req: any, res: Response) => {
    const requestId = req.params.requestId;
    console.log("requestId in acept",requestId);
    

    try {
      const request = await userService.getFriendRequestById(requestId);

      if (!request) {
        return res.status(404).json({ message: "Friend request not found" });
      }

      if (request.status === "accepted") {
        return res.status(400).json({ message: "Friend request already accepted" });
      }

      const updatedRequest = await userService.updateFriendRequestStatus(request, "accepted");

     

      return res.status(200).json({ message: "Friend request accepted", updatedRequest });
    } catch (error: any) {
      console.error("Error accepting friend request:", error);
      res.status(500).json({ message: "Error accepting friend request" });
    }
  }
);

export const rejectFriendRequest = asyncHandler(
  async (req: any, res: Response) => {
    const requestId = req.params.requestId;

    try {
      const request = await userService.getFriendRequestById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Friend request not found" });
      }

      const updatedRequest= await userService.updateFriendRequestStatus(request, "rejected");
      return res.status(200).json({ message: "Friend request rejected" ,updatedRequest});
    } catch (error: any) {
      console.error("Error rejecting friend request:", error);
      res.status(500).json({ message: "Error rejecting friend request" });
    }
  }
);

export const deleteRequest = asyncHandler(
  async (req: any, res: Response) => {
    const requestId = req.params.requestId;
    console.log("requestId",requestId);
    
    try {
      const request = await FriendRequest.findByPk(requestId);

      if (!request) {
        return res.status(404).json({ message: "Friend request not found" });
      }

      await request.destroy();

      return res.status(200).json({ message: "Friend request deleted successfully" ,status:"pending"});
    } catch (error: any) {
      console.error("Error deleting friend request:", error);
      return res.status(500).json({ message: "Error deleting friend request" });
    }
  }
);



// unfriend 
export const unfriendUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.userId; 
    const friendId = req.params.friendId;

    console.log("userId", userId);
    console.log("friendId", friendId);

    try {
      if (userId === parseInt(friendId)) {
        return res.status(400).json({
          message: "You cannot unfriend yourself",
        });
      }

      const friendRequest = await userService.getFriendRequestBetweenUsers(
        userId,
        friendId
      );

      if (!friendRequest) {
        return res.status(400).json({
          message: "You are not friends with this user",
        });
      }

      await userService.deleteFriendRequest(userId, friendId);
      // const updatedRequest = await userService.updateFriendRequestStatus(friendRequest, "none");


      return res.status(200).json({
        message: "Successfully unfriended the user",
        // updatedRequest
      });
    } catch (error: any) {
      console.error("Error unfriending user:", error);
      res.status(500).json({
        message: "Error unfriending user",
      });
    }
  }
);



export const allUser = asyncHandler(async (req: any, res: Response) => {
  try {
    const currentUserId = req.user.userId;

    const users = await User.findAll({
      attributes: ["user_id", "username", "first_name", "last_name", "email", "profile"],
      where: { user_id: { [Op.ne]: currentUserId } },
    });

    const userIds = users.map(user => user.user_id);

    const friendRequests = await FriendRequest.findAll({
      where: {
        [Op.or]: [
          { sender_id: currentUserId, receiver_id: { [Op.in]: userIds } },
          { receiver_id: currentUserId, sender_id: { [Op.in]: userIds } },
        ],
      },
    });

    const requestMap = new Map<number, { status: string; requestId: number }>();

    friendRequests.forEach(req => {
      const senderId = req.get("sender_id");
      const receiverId = req.get("receiver_id");
      const status = req.get("status");
      const requestId = req.get("friendrequest_id");

      const isSender = senderId === currentUserId;
      const otherUserId = isSender ? receiverId : senderId;
      const direction = isSender ? "sent" : "received";

      requestMap.set(otherUserId, {
        status: `${direction}:${status}`,
        requestId,
      });
    });

    const enrichedUsers = users.map(user => {
      const otherUserId = user.user_id;
      const request = requestMap.get(otherUserId);

      let friendshipStatus = "none";
      let actions: string[] = ["send_request"];

      if (request) {
        const [direction, status] = request.status.split(":");

        if (status === "pending") {
          if (direction === "sent") {
            friendshipStatus = "pending_sent";
            actions = ["cancel_request"];
          } else {
            friendshipStatus = "pending_received";
            actions = ["accept_request", "decline_request"];
          }
        } else if (status === "accepted") {
          friendshipStatus = "friends";
          actions = ["unfriend"];
        }
      }

      return {
        ...user.toJSON(),
        friendshipStatus,
        actions,
        requestId: request?.requestId || null,
        receiver_id: otherUserId,
      };
    });

    const priorityOrder = {
      pending_received: 1,
      pending_sent: 2,
      friends: 3,
      none: 4,
    };

    enrichedUsers.sort((a, b) => {
      return (priorityOrder[a.friendshipStatus] || 99) - (priorityOrder[b.friendshipStatus] || 99);
    });

    return res.status(200).json({
      users: enrichedUsers,
    });

  } catch (error: any) {
    console.error("Error during user fetch:", error);
    return res.status(500).json({ message: "Server error" });
  }
});




// export const allUser = asyncHandler(async (req: any, res: Response) => {
//   try {
//     const { page = "1", limit = "10" } = req.query;
//     const currentUserId = req.user.userId;

//     const pageNumber = parseInt(page as string);
//     const limitNumber = parseInt(limit as string);
//     const offset = (pageNumber - 1) * limitNumber;

//     // Fetch users excluding the current user
//     const { rows: users, count: totalUsers } = await User.findAndCountAll({
//       attributes: ["user_id", "username", "first_name", "last_name", "email", "profile"],
//       where: { user_id: { [Op.ne]: currentUserId } },
//       limit: limitNumber,
//       offset,
//     });

//     const userIds = users.map(user => user.user_id);

//     // Fetch friend requests where currentUserId is either sender or receiver
//     const friendRequests = await FriendRequest.findAll({
//       where: {
//         [Op.or]: [
//           { sender_id: currentUserId, receiver_id: { [Op.in]: userIds } },
//           { receiver_id: currentUserId, sender_id: { [Op.in]: userIds } },
//         ],
//       },
//     });
//     console.log("friendRequests",);
    
//     const requestMap = new Map<number, { status: string; requestId: number }>();

//     friendRequests.forEach(req => {
//       const senderId = req.get("sender_id");
//       const receiverId = req.get("receiver_id");
//       const status = req.get("status");
//       const requestId = req.get("friendrequest_id");

//       if (senderId === currentUserId) {
//         requestMap.set(receiverId, { status: `sent:${status}`, requestId });
//       } else if (receiverId === currentUserId) {
//         requestMap.set(senderId, { status: `received:${status}`, requestId });
//       }
//     });

//     const enrichedUsers = users.map(user => {
//       const otherUserId = user.user_id;
//       const request = requestMap.get(otherUserId);

//       let friendshipStatus = "none";
//       let actions: string[] = ["send_request"];

//       if (request) {
//         const [direction, status] = request.status.split(":");

//         if (status === "pending") {
//           if (direction === "sent") {
//             friendshipStatus = "pending_sent";
//             actions = ["cancel_request"];
//           } else {
//             friendshipStatus = "pending_received";
//             actions = ["accept_request", "decline_request"];
//           }
//         } else if (status === "accepted") {
//           friendshipStatus = "friends";
//           actions = ["unfriend"];
//         }
//       }

//       return {
//         ...user.toJSON(),
//         friendshipStatus,
//         actions,
//         requestId: request?.requestId || null,
//         receiver_id: otherUserId,
//       };
//     });

//     // Sort by friendshipStatus priority
//     const priorityOrder = {
//       pending_received: 1,
//       pending_sent: 2,
//       friends: 3,
//       none: 4,
//     };

//     enrichedUsers.sort((a, b) => {
//       return (priorityOrder[a.friendshipStatus] || 99) - (priorityOrder[b.friendshipStatus] || 99);
//     });

//     return res.status(200).json({
//       users: enrichedUsers,
//       totalUsers,
//       totalPages: Math.ceil(totalUsers / limitNumber),
//       currentPage: pageNumber,
//     });

//   } catch (error: any) {
//     console.error("Error during user fetch:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

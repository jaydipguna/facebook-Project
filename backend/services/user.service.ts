import FriendRequest from "../models/friendRequest.model";
import User from "../models/user.model";
import { Op } from "sequelize";
import { IUserData } from "../types/types";


const findUserByEmailOrUsername = async (
  emailOrUsername: string
): Promise<User | null> => {
  console.log("emailorUsername", emailOrUsername);

  return await User.findOne({
    where: {
      [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
    },
  });
};

const findUserById = async (id: number): Promise<User | null> => {
  return await User.findByPk(id);
};

const createUser = async (userData: IUserData): Promise<User> => {
  return await User.create(userData as any);
};

const createFriendRequest = async (
  senderId: number,
  receiverId: number
): Promise<FriendRequest> => {
    return await FriendRequest.create({
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
    });
};

const checkExistingRequest = async (
  senderId: number,
  receiverId: number
): Promise<FriendRequest | null> => {
  return await FriendRequest.findOne({
    where: {
      sender_id: senderId,
      receiver_id: receiverId,
    },
  });
};

export const getFriendRequestById = async (
  requestId: number
): Promise<FriendRequest | null> => {
  return await FriendRequest.findByPk(requestId);
};

export const updateFriendRequestStatus = async (
  request: FriendRequest,
  status: string
): Promise<FriendRequest> => {
  request.set("status", status);

  const updated = await request.save({ fields: ["status"] });

  return updated;
};
const getUserFriendsService = async (userId: number) => {
  const friendRequests = await FriendRequest.findAll({
    where: {
      status: "accepted",
      [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
    },
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["user_id", "username", "first_name", "last_name", "profile"],
      },
      {
        model: User,
        as: "receiver",
        attributes: ["user_id", "username", "first_name", "last_name", "profile"],
      },
    ],
  });

  const friends = friendRequests.map((req) => {
    if (req.sender_id === userId) {
      return req.receiver; 
    } else {
      return req.sender;
    }
  });

  return friends;
};

const updateUser = async (
  userId: number,
  updates: Partial<IUserData>
): Promise<User | null> => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  return await user.update(updates as any);
};

const verifyResetOtp = async (
  emailOrUsername: string,
  otp: string
): Promise<User | null> => {
  const user = await findUserByEmailOrUsername(emailOrUsername);
  if (!user) return null;

  const isOtpValid =
    user.reset_otp === otp && Date.now() < Number(user.reset_otp_expires);

  return isOtpValid ? user : null;
};

const findUserByUsername = async (username: string) => {
  return User.findOne({ where: { username } });
};

export const getFriendRequestBetweenUsers = async (userId: number, friendId: number) => {
  try {
    const friendRequest = await FriendRequest.findOne({
      where: {
        [Op.or]: [
          { sender_id: userId, receiver_id: friendId },
          { sender_id: friendId, receiver_id: userId },
        ],
        status: "accepted", 
      },
    });

    return friendRequest; 
  } catch (error: any) {
    throw new Error("Error checking friendship status: " + error.message);
  }
};

export const deleteFriendRequest = async (userId: number, friendId: number) => {
  try {
    const deletedRows = await FriendRequest.destroy({
      where: {
        [Op.or]: [
          { sender_id: userId, receiver_id: friendId },
          { sender_id: friendId, receiver_id: userId },
        ],
        status: "accepted", 
      },
    });

    return deletedRows;
  } catch (error: any) {
    throw new Error("Error deleting friendship: " + error.message);
  }
};
const getUserById = async (userId: string) => {
  try {
    const user = await User.findByPk(userId); // Fetch the user by ID from the database
    if (!user) {
      throw new Error("User not found");
    }
    return user; // Return the user object with all details (including username)
  } catch (error) {
    throw new Error("Error fetching user");
  }
};




export const getFriendsByUserId = async (userId: string) => {
  try {
    const friends = await FriendRequest.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId, status: 'accepted' },
          { receiver_id: userId, status: 'accepted' },
        ],
      },
      include: [
        {
          model: User,
          as: 'sender', // Alias used for sender
          attributes: ['user_id', 'username', 'first_name', 'last_name', 'profile'],
        },
        {
          model: User,
          as: 'receiver', // Alias used for receiver
          attributes: ['user_id', 'username', 'first_name', 'last_name', 'profile'],
        },
      ],
    });

    // Filter and return the friend profile based on the current user
    return friends.map((friend) => {
      const sender = friend.sender;
      const receiver = friend.receiver;
      return sender.user_id === userId ? receiver : sender;
    });
  } catch (error) {
    throw new Error('Error fetching friends');
  }
};

export default {
  findUserByEmailOrUsername,
  findUserById,
  createUser,
  createFriendRequest,
  checkExistingRequest,
  getFriendRequestById,
  updateFriendRequestStatus,
  getUserFriendsService,
  updateUser,
  verifyResetOtp,
  findUserByUsername,
  deleteFriendRequest,
  getFriendRequestBetweenUsers,
  getUserById,
  getFriendsByUserId
};

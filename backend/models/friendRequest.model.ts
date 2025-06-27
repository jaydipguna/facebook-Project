import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { IFriendRequest } from "../types/types.js";

export interface IFriendRequestCreationAttributes
  extends Optional<IFriendRequest, "friendrequest_id"> {}

class FriendRequest extends Model<
  IFriendRequest,
  IFriendRequestCreationAttributes
> {
  status: string;
}

FriendRequest.init(
  {
    friendrequest_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "FriendRequest",
    tableName: "friend_requests",
    timestamps: true,
    underscored: true,
  }
);

export default FriendRequest;

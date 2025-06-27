

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Post from "./post.model.js";
import User from "./user.model.js";
import { IComment } from "../types/types.js";


export interface ICommentCreationAttributes
  extends Optional<IComment, "comment_id" | "created_at" | "updated_at"> {}

class Comment
  extends Model<IComment, ICommentCreationAttributes>
  implements IComment
{
  comment_id!: number;
  content!: string;
  created_at!: Date;
  updated_at!: Date;
  post_id!: number;
  user_id!: number;
}

Comment.init(
  {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true, 
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true, 
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Post, 
        key: "post_id",
      },
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User, 
        key: "user_id",
      },
      allowNull: false,
    },
  },
  {
    sequelize, 
    modelName: "Comment",
    tableName: "comments",
    timestamps: true, 
    underscored: true, 
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Comment.belongsTo(Post, { foreignKey: "post_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

export default Comment;

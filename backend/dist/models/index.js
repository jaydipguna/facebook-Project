import { Sequelize } from "sequelize";
import sequelize from "../config/dbConfig";
import User from "./user.model";
import Post from "./post.model";
import PostImage from "./postImage.model";
import PostLike from "./postlike.model";
import FriendRequest from "./friendRequest.model";
import Comment from "./comment.model";
const db = {};
// Assign sequelize instance and models to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
db.Post = Post;
db.PostImage = PostImage;
db.PostLike = PostLike;
db.FriendRequest = FriendRequest;
db.Comment = Comment;
// Associations
db.User.hasMany(db.Post, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});
db.Post.belongsTo(db.User, {
    foreignKey: "user_id",
    as: "postOwner",
});
db.User.hasMany(db.FriendRequest, {
    foreignKey: "sender_id",
    onDelete: "CASCADE",
});
db.User.hasMany(db.FriendRequest, {
    foreignKey: "receiver_id",
    onDelete: "CASCADE",
});
db.Post.hasMany(db.PostImage, {
    foreignKey: "post_id",
    onDelete: "CASCADE",
});
db.PostImage.belongsTo(db.Post, {
    foreignKey: "post_id",
});
db.User.hasMany(db.PostLike, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});
db.PostLike.belongsTo(db.User, {
    foreignKey: "user_id",
    as: "liker",
});
db.Post.hasMany(db.PostLike, {
    foreignKey: "post_id",
    onDelete: "CASCADE",
});
db.PostLike.belongsTo(db.Post, {
    foreignKey: "post_id",
});
db.Comment.belongsTo(db.Post, {
    foreignKey: "post_id",
});
db.Comment.belongsTo(db.User, {
    foreignKey: "user_id",
});
db.User.hasMany(db.Comment, {
    foreignKey: "user_id",
});
db.Post.hasMany(db.Comment, { as: "comments", foreignKey: "post_id" });
db.Comment.belongsTo(db.User, { as: "commenter", foreignKey: "user_id" });
db.FriendRequest.belongsTo(db.User, { as: "sender", foreignKey: "sender_id" });
db.FriendRequest.belongsTo(db.User, {
    as: "receiver",
    foreignKey: "receiver_id",
});
export default db;

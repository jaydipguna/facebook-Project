// import { Sequelize } from "sequelize";
// import sequelize from "../config/dbConfig";
// import User from "./user.model";
// import Post from "./post.model";
// import PostImage from "./postImage.model";
// import PostLike from "./postlike.model";
// import FriendRequest from "./friendRequest.model";
// import Comment from "./comment.model";

// interface IDb {
//   sequelize: Sequelize;
//   Sequelize: typeof Sequelize;
//   User: typeof User;
//   Post: typeof Post;
//   PostImage: typeof PostImage;
//   PostLike: typeof PostLike;
//   FriendRequest: typeof FriendRequest;
//   Comment: typeof Comment;
// }

// const db: IDb = {} as IDb;

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// db.User = User;
// db.Post = Post;
// db.PostImage = PostImage;
// db.PostLike = PostLike;
// db.FriendRequest = FriendRequest;
// db.Comment = Comment;

// // ------------------ Associations ------------------

// // User - Post
// db.User.hasMany(db.Post, {
//   foreignKey: "user_id",
//   onDelete: "CASCADE",
// });
// db.Post.belongsTo(db.User, {
//   foreignKey: "user_id",
//   as: "postOwner",
// });

// // User - FriendRequest
// db.User.hasMany(db.FriendRequest, {
//   foreignKey: "sender_id",
//   onDelete: "CASCADE",
//   as: 'sentRequests' 
// });
// db.User.hasMany(db.FriendRequest, {
//   foreignKey: "receiver_id",
//   onDelete: "CASCADE",
//   as: 'receivedRequests'
// });
// db.FriendRequest.belongsTo(db.User, { as: "sender", foreignKey: "sender_id" });
// db.FriendRequest.belongsTo(db.User, {
//   as: "receiver",
//   foreignKey: "receiver_id",
// });

// // Post - PostImage
// db.Post.hasMany(db.PostImage, {
//   foreignKey: "post_id",
//   onDelete: "CASCADE",
//   as: "PostImages",
// });

// db.PostImage.belongsTo(db.Post, {
//   foreignKey: "post_id",
//   as: "Post",
// });

// // User - PostLike
// db.User.hasMany(db.PostLike, {
//   foreignKey: "user_id",
//   onDelete: "CASCADE",
// });
// db.PostLike.belongsTo(db.User, {
//   foreignKey: "user_id",
//   as: "liker",
// });
// db.Post.hasMany(db.PostLike, {
//   foreignKey: "post_id",
//   onDelete: "CASCADE",
// });
// db.PostLike.belongsTo(db.Post, {
//   foreignKey: "post_id",
// });

// // Post - Comment
// db.Post.hasMany(db.Comment, { as: "comments", foreignKey: "post_id" });
// db.Comment.belongsTo(db.Post, {
//   foreignKey: "post_id",
// });
// db.Comment.belongsTo(db.User, {
//   foreignKey: "user_id",
// });
// db.Comment.belongsTo(db.User, { as: "commenter", foreignKey: "user_id" });
// db.User.hasMany(db.Comment, {
//   foreignKey: "user_id",
// });

// export default db;


import { Sequelize } from "sequelize";
import sequelize from "../config/dbConfig";
import User from "./user.model";
import Post from "./post.model";
import PostImage from "./postImage.model";
import PostLike from "./postlike.model";
import FriendRequest from "./friendRequest.model";
import Comment from "./comment.model";

interface IDb {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  User: typeof User;
  Post: typeof Post;
  PostImage: typeof PostImage;
  PostLike: typeof PostLike;
  FriendRequest: typeof FriendRequest;
  Comment: typeof Comment;
}

const db: IDb = {} as IDb;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Post = Post;
db.PostImage = PostImage;
db.PostLike = PostLike;
db.FriendRequest = FriendRequest;
db.Comment = Comment;

// ------------------ Associations ------------------

// User - Post
db.User.hasMany(db.Post, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
db.Post.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "postOwner", 
});

// User - FriendRequest
db.User.hasMany(db.FriendRequest, {
  foreignKey: "sender_id",
  onDelete: "CASCADE",
  as: "sentRequests",
});
db.User.hasMany(db.FriendRequest, {
  foreignKey: "receiver_id",
  onDelete: "CASCADE",
  as: "receivedRequests",
});
db.FriendRequest.belongsTo(db.User, {
  as: "sender",
  foreignKey: "sender_id",
});
db.FriendRequest.belongsTo(db.User, {
  as: "receiver",
  foreignKey: "receiver_id",
});

// Post - PostImage
// db.Post.hasMany(db.PostImage, {
//   foreignKey: "post_id",
//   onDelete: "CASCADE",
//   as: "PostImages", 
// });
db.Post.hasMany(db.PostImage, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
  as: "PostImages", // Alias defined here
});
db.PostImage.belongsTo(db.Post, {
  foreignKey: "post_id",
  as: "Post", 
});

db.Post.hasMany(db.PostLike, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
  as: "PostLikes", 
});
db.PostLike.belongsTo(db.Post, {
  foreignKey: "post_id",
  as: "Post", // Optional
});
db.User.hasMany(db.PostLike, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
db.PostLike.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "liker",
});

// Post - Comment
db.Post.hasMany(db.Comment, {
  foreignKey: "post_id",
  as: "comments", 
});
db.Comment.belongsTo(db.Post, {
  foreignKey: "post_id",
});
db.Comment.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "commenter", 
});
db.User.hasMany(db.Comment, {
  foreignKey: "user_id",
});

export default db;

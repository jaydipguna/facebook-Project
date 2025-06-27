import sequelize from "../config/dbConfig"; // Adjust the import if necessary
import {
  deleteImageFromCloudinary,
  extractPublicId,
} from "../utils/cloudinary.utils";
import Post from "../models/post.model";
import PostImage from "../models/postImage.model";
import PostLike from "../models/postlike.model";
import User from "../models/user.model";
import Comment from "../models/comment.model";
import FriendRequest from "../models/friendRequest.model";
import { DATE, Op } from "sequelize";

// Post services
const createPostWithImage = async (
  userId: number,
  caption: string,
  files: Express.Multer.File[]
) => {
  console.log("userId====>", userId);
  console.log("caption===>", caption);
  console.log("files==>", files);

  try {
    const post = await Post.create({ user_id: userId, caption });
    console.log("Created post:", post.dataValues);

    const postId = post.get("post_id");

    if (files && files.length > 0) {
      const imageUrls = files.map((file) => file.path);
      const imagePromises = imageUrls.map(async (url) => {
        try {
          console.log(
            "Creating PostImage for post_id:",
            postId,
            "with image_url:",
            url
          );
          const createdImage = await PostImage.create({
            post_id: postId,
            image_url: url,
          });
          console.log(
            "PostImage created successfully:",
            createdImage.dataValues
          );
        } catch (error) {
          console.error("Error creating PostImage:", error);
        }
      });

      await Promise.all(imagePromises);
    }

    return post;
  } catch (err) {
    console.error("Post creation error:", err);
    throw err;
  }
};

// Update an existing post
export const updatePostService = async (
  postId: number,
  caption: string,
  files: Express.Multer.File[],
  userId: number
) => {
  console.log("Attempting to find post with ID:", postId);

  if (isNaN(postId)) {
    throw new Error("Invalid postId provided");
  }

  const post = await Post.findByPk(postId, {
    include: [{ model: PostImage, as: "PostImages" }],
    raw: false,
  });

  console.log("Post found:", post);
  console.log("Post.user_id:", post?.user_id);
  console.log("User ID:", userId);

  if (!post) {
    console.log(`No post found with ID: ${postId}`);
    throw new Error("Post not found");
  }

  if (post.user_id !== userId) {
    console.log("User is not authorized to update this post");
    throw new Error("You are not authorized to update this post");
  }

  if (caption) {
    post.caption = caption;
    await post.save();
  }

  if (files && files.length > 0) {
    for (const image of post.PostImages || []) {
      const publicId = extractPublicId(image.image_url);
      if (publicId) {
        console.log("Deleting image from Cloudinary:", publicId);
        await deleteImageFromCloudinary(publicId);
      }
    }

    console.log("Deleting old images from database...");
    await PostImage.destroy({ where: { post_id: post.post_id } });

    const newImageRecords = files.map((file) => ({
      post_id: post.post_id,
      image_url: file.path,
    }));

    console.log("Inserting new image records...");
    await PostImage.bulkCreate(newImageRecords);
  }

  const updatedPost = await Post.findByPk(postId, {
    include: [{ model: PostImage, as: "PostImages" }],
    raw: false,
  });

  return updatedPost;
};
const deletePostService = async (postId: number, userId: number) => {
  console.log("postId", postId);
  console.log("userId", userId);

  const post = await Post.findByPk(postId, {
    include: [{ model: PostImage, as: "PostImages" }],
  });

  if (!post) throw new Error("Post not found");
  
  // Type assertion to access properties
  const postData = post as any;
  if (postData.user_id !== userId)
    throw new Error("You are not authorized to delete this post");

  // Delete all related data first to avoid foreign key constraint violations
  
  // 1. Delete comments associated with this post
  await Comment.destroy({ where: { post_id: postData.post_id } });
  console.log("Comments deleted for post:", postData.post_id);

  // 2. Delete post likes associated with this post
  await PostLike.destroy({ where: { post_id: postData.post_id } });
  console.log("Post likes deleted for post:", postData.post_id);

  // 3. Delete post images from Cloudinary and database
  for (const image of postData.PostImages || []) {
    const publicId = extractPublicId(image.image_url);
    if (publicId) await deleteImageFromCloudinary(publicId);
  }
  await PostImage.destroy({ where: { post_id: postData.post_id } });
  console.log("Post images deleted for post:", postData.post_id);

  // 4. Finally delete the post itself
  await post.destroy();
  console.log("Post deleted successfully:", postData.post_id);

  return "Post and all associated data deleted successfully";
};

// Fetch posts by user ID
const getPostsByUserIdService = async (userId: number) => {
  try {
    const posts = await Post.findAll({
      where: { user_id: userId },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM post_likes AS pl
              WHERE pl.post_id = "Post"."post_id"
            )`),
            "totalLikes",
          ],
        ],
      },
      include: [
        {
          model: PostImage,
          as: "PostImages", // ✅ Matches alias in association
          attributes: ["image_url"],
        },
        {
          model: PostLike,
          as: "PostLikes", // ✅ USE THE ALIAS HERE!
          attributes: ["postlike_id", "user_id", "post_id", "created_at"],
          include: [
            {
              model: User,
              as: "liker",
              attributes: ["user_id", "username"],
            },
          ],
        },
        {
          model: User,
          as: "postOwner",
          attributes: [
            "user_id",
            "username",
            "email",
            "first_name",
            "last_name",
            "profile",
            "bio",
          ],
        },
        {
          model: Comment,
          as: "comments",
          attributes: [
            "comment_id",
            "post_id",
            "user_id",
            "content",
            "created_at",
          ],
          include: [
            {
              model: User,
              as: "commenter",
              attributes: ["user_id", "username"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      message: "Posts fetched successfully",
      data: posts,
    };
  } catch (error) {
    console.error("Service Error - getPostsByUserId:", error);
    throw new Error("Unable to fetch user posts");
  }
};

export const getPostByIdService = async (postId: number) => {
  return await Post.findOne({
    where: { post_id: postId },
    include: [
      {
        model: User,
        as: "postOwner",
        attributes: ["user_id", "username", "profile"],
      },
      {
        model: PostImage,
        as: "PostImages",
      },
      {
        model: PostLike,
        as: "PostLikes",
      },
      {
        model: Comment,
        as: "comments",
        include: [
          {
            model: User,
            as: "commenter",
            attributes: ["user_id", "username", "profile"],
          },
        ],
      },
    ],
  });
};

// Fetch accepted friend IDs
const getAcceptedFriendIds = async (userId: number) => {
  console.log("userId", userId);

  const friends = await FriendRequest.findAll({
    where: {
      status: "accepted",
      [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
    },
  });

  const friendIds = friends.map((friend) =>
    friend.sender_id === userId ? friend.receiver_id : friend.sender_id
  );

  return friendIds;
};

// Get friends' posts
const getFriendsPostsService = async (userId: number) => {
  const friendIds = await getAcceptedFriendIds(userId);
  console.log("friendIds", friendIds);

  const posts = await Post.findAll({
    where: {
      user_id: {
        [Op.in]: friendIds,
      },
    },
    include: [
      {
        model: PostImage,
        as: "PostImages",
        attributes: ["image_url"],
      },
      {
        model: PostLike,
        as: "PostLikes",
        attributes: ["postlike_id", "user_id", "post_id", "created_at"],
        include: [
          {
            model: User,
            as: "liker",
            attributes: ["user_id", "username"],
          },
        ],
      },
      {
        model: User,
        as: "postOwner",
        attributes: ["user_id", "username", "first_name", "last_name"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["comment_id", "post_id", "user_id", "content", "created_at"],
        include: [
          {
            model: User,
            as: "commenter",
            attributes: ["user_id", "username"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]], // ✅ Corrected here
  });
  

  return posts;
};

// Find a post like
const findPostLike = async (userId: number, postId: number) => {
  return await PostLike.findOne({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });
};

// Like a post
const likedPost = async (userId: number, postId: number) => {
  return await PostLike.create({
    user_id: userId,
    post_id: postId,
  });
};

// Unlike a post
const unlikedPost = async (likeInstance: PostLike) => {
  return await likeInstance.destroy();
};
// Comment a Post
const createNewComment = async ({
  userId,
  postId,
  content,
}: {
  userId: number;
  postId: number;
  content: string;
}) => {
  // Sequelize automatically handles `created_at` and `updated_at` due to `timestamps: true`
  const newComment = await Comment.create({
    user_id: userId,
    post_id: postId,
    content,
  });

  return newComment;
};

// Fetch all comments
const fetchAllComments = async () => {
  return await Comment.findAll();
};

// Fetch comments by post ID
const fetchCommentsByPostId = async (postId: number) => {
  console.log("postId", postId);

  return await Comment.findAll({
    where: { post_id: postId },
    include: [{ model: User, attributes: ["user_id", "username"] }],
    order: [["created_at", "DESC"]],
  });
};

// Fetch comments by user ID
const fetchCommentsByUserId = async (userId: number) => {
  return await Comment.findAll({ where: { user_id: userId } });
};

// Modify a comment
const modifyComment = async (commentId: number, content: string) => {
  const [updated] = await Comment.update(
    { content },
    { where: { comment_id: commentId } }
  );
  if (updated) {
    return await Comment.findByPk(commentId);
  }
  return null;
};

// Remove a comment
const removeComment = async (commentId: number) => {

  return  await Comment.destroy({ where: { comment_id: commentId } });
 
};

export const getPostsByUserId = async (userId: string) => {
  try {
    console.log("userId in get post service: ", userId);
    
    const posts = await Post.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],  
      include: [
        {
          model: User,
          as: 'postOwner',  
          attributes: ['user_id', 'username', 'profile'],  
        },
        {
          model: PostImage,
          as: 'PostImages',  
        },
        {
          model: PostLike,
          as: 'PostLikes',  // Alias for likes on the post
        },
        {
          model: Comment,
          as: 'comments',  // Alias for comments on the post
          include: [
            {
              model: User,
              as: 'commenter',  // User who made the comment
              attributes: ['user_id', 'username', 'profile'],  // Only fetching necessary user attributes
            },
          ],
        },
      ],
    });

    console.log("Fetched posts: ", posts);

    return posts;  // Returning the posts along with associated data like comments, likes, etc.
  } catch (error) {
    console.error("Error fetching posts: ", error);
    throw new Error('Error fetching posts: ' + error.message);  // If any error occurs, it will be logged and thrown
  }
};



export default {
  createPostWithImage,
  updatePostService,
  deletePostService,
  fetchAllComments,
  createNewComment,
  fetchCommentsByPostId,
  getPostsByUserIdService,
  fetchCommentsByUserId,
  modifyComment,
  removeComment,
  unlikedPost,
  getPostsByUserId,
  likedPost,
  findPostLike,
  getFriendsPostsService,
  getPostByIdService,
};

// const removeComment = async (commentId: string) => {
//   try {
//     const deletedComment = await Comment.destroy({
//       where: { comment_id: commentId }
//     });

//     if (deletedComment) {
//       const comment = await Comment.findOne({ where: { comment_id: commentId } });
//       if (comment) {
//         return { postId: comment.post_id, deleted: true };
//       }
//     }

//     return { deleted: false };
//   } catch (error) {
//     console.error("Error deleting comment:", error);
//     throw new Error("Unable to delete comment");
//   }
// };

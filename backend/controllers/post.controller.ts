import { Request, Response } from "express";
import Post from "../models/post.model";
import postServices from "../services/post.services";
import asyncHandler from "../utils/asyncHandler";
import User from "../models/user.model";
import Comment from "../models/comment.model";


export const getPostsByUserId = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user?.userId;
    console.log("userId============================================>",userId);
    

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - User ID missing" });
    }

    console.log("userId controller in", userId);

    try {
      const posts = await postServices.getPostsByUserIdService(userId);
      console.log("posts",posts);
      
      return res.status(200).json({
        message: "Posts fetched successfully",
        data: posts,
      });
    } catch (error: any) {
      console.error("Controller Error - getPostsByUserId:", error);
      return res.status(500).json({
        message: "Error fetching posts",
        error: error.message,
      });
    }
  }
);

export const getPostsByPostId = asyncHandler(
  async (req: any, res: Response) => {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    try {
      const post = await postServices.getPostByIdService(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({
        message: "Post fetched successfully",
        data: post,
      });
    } catch (error: any) {
      console.error("Error fetching post by ID:", error);
      return res.status(500).json({
        message: "Error fetching post",
        error: error.message,
      });
    }
  }
);

// Post API
export const createPost = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user.userId;
  console.log("userId",userId);
  
  try {
    const { caption } = req.body;
  console.log("userId",caption);

    const files = req.files as Express.Multer.File[]; 
    console.log("files",files );
    
    const post = await postServices.createPostWithImage(userId, caption, files);
    res.status(201).json({
      message: "Post created successfully",
      post,
      success:true
    });
  } catch (error: any) {
    console.error("Post creation error:", error);
    res.status(500).json({
      message: "Error creating post",
      error: error.message,
      success:false
    });
  }
});


export const updatePost = asyncHandler(async (req: any, res: Response) => {
  const { postId } = req.params;
  const { caption } = req.body;
  const files = req.files as Express.Multer.File[];
  const userId = req.user.userId;

  try {
    const updatedPost = await postServices.updatePostService(
      parseInt(postId, 10),
      caption,
      files,
      userId
    );

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error: any) {
    console.error("Error updating post:", error);
    res.status(500).json({
      message: "Error updating post",
      error: error.message,
    });
  }
});


export const deletePost = asyncHandler(async (req: any, res: Response) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  console.log("postId",postId);
  console.log("userId",userId);
  
  
  try {
    const message = await postServices.deletePostService(postId, userId);
    res.status(200).json({
      message,
    });
  } catch (error: any) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      message: "Error deleting post",
      error: error.message,
    });
  }
});

// Like and Unlike API

export const likePost = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user.userId;
  const postId = req.params.postId;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await postServices.findPostLike(userId, postId);

    if (existingLike) {
      const unlike = await postServices.unlikedPost(existingLike);
      return res.status(200).json({
        message: "Post unliked",
        unlike: {userId:userId} //  changes in when friend like 
      });
    }
    const like = await postServices.likedPost(userId, postId);
    return res.status(201).json({ message: "Post liked", like });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Error toggling like" });
  }
});

// Comment APIs
// Get by post ID

export const getCommentsByPost = asyncHandler(
  async (req: any, res: Response) => {
    const { id: postId } = req.params;

    try {
      const comments = await postServices.fetchCommentsByPostId(postId);
      console.log("comments",comments);
      
      if (comments.length === 0) {
        return res
          .status(404)
          .json({ message: "No comments found for this post" });
      }

      res.status(200).json(comments);
    } catch (error: any) {
      console.error("Error fetching comments for post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Get by user ID

export const getCommentsByUser = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user.userId;

    try {
      const comments = await postServices.fetchCommentsByUserId(userId);
      if (comments.length === 0) {
        return res
          .status(404)
          .json({ message: "No comments found for this user" });
      }

      res.status(200).json(comments);
    } catch (error: any) {
      console.error("Error fetching comments by user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);


// Update comment

export const createComment = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user.userId; 
    const { postId, content } = req.body;

    console.log("postId", postId);
    console.log("content", content);

    try {
      if (!userId || !postId || !content) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await User.findByPk(userId); 

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("user",user);
      
      const { username,profile } = user;

      const comment = await postServices.createNewComment({
        userId,
        postId,
        content,
       
      });

      res.status(201).json({
        message: "Comment created successfully",
        comment: {
          ...comment.toJSON(), 
          username, 
          profile
        },
      });
    } catch (error: any) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export const updateComment = asyncHandler(
  async (req: any, res: Response) => {
    const { commentId } = req.params;
    const { content } = req.body;
    console.log("commentId",commentId);
    console.log("content",content);

    

    try {
      const updatedComment = await postServices.modifyComment(
        commentId,
        content
      );

      if (updatedComment) {
        res.status(200).json(updatedComment);
      } else {
        res.status(404).json({ message: "Comment not found" });
      }
    } catch (error: any) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Delete comment

export const deleteComment = asyncHandler(
  async (req: any, res: Response) => {
    const { commentId } = req.params;

    try {
      const comment = await Comment.findByPk(commentId);
      console.log("comment==>", comment);
      
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      console.log("postId=======>", comment.dataValues.post_id);
      const postId = comment.dataValues.post_id;
      const commentId2 = comment.dataValues.comment_id;

      const deleted = await postServices.removeComment(commentId);
      
      if (deleted) {
        res.status(200).json({ message: "Comment deleted successfully", data: { commentId2, postId } });
      } else {
        res.status(404).json({ message: "Comment not found" });
      }
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Friend Posts API

export const getFriendsPostsController = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user.userId;
    console.log("userId in friend controller in",userId);
    

    try {
      const posts = await postServices.getFriendsPostsService(userId);
      res.status(200).json({
        message: "Friend posts fetched successfully",
        data: posts,
      });
    } catch (error: any) {
      console.error("Controller Error - getFriendsPosts:", error);
      res.status(500).json({
        message: "Error fetching friend posts",
        error: error.message,
      });
    }
  }
);

// Get all comments

export const getAllComments = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const comments = await postServices.fetchAllComments();
      res.status(200).json(comments);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

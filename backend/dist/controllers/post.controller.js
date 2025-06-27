import Post from "../models/post.model";
import postServices from "../services/post.services";
import asyncHandler from "../utils/asyncHandler";
// Post API
export const getPostsByUserId = asyncHandler(async (req, res) => {
    const userId = req.user.userId; // Assuming userId is stored in req.user after auth
    
    try {
        const posts = await postServices.getPostsByUserIdService(userId);
        res.status(200).json({
            message: "Posts fetched successfully",
            data: posts,
        });
    }
    catch (error) {
        console.error("Controller Error - getPostsByUserId:", error);
        res.status(500).json({
            message: "Error fetching posts",
            error: error.message,
        });
    }
});
export const createPost = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    try {
        const { caption } = req.body;
        const files = req.files; // Type for files array
        const post = await postServices.createPostWithImage(userId, caption, files);
        res.status(201).json({
            message: "Post created successfully",
            post,
        });
    }
    catch (error) {
        console.error("Post creation error:", error);
        res.status(500).json({
            message: "Error creating post",
            error: error.message,
        });
    }
});
export const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { caption } = req.body;
    const files = req.files;
    const userId = req.user.userId;
    try {
        const updatedPost = await postServices.updatePostService(postId, caption, files, userId);
        res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost,
        });
    }
    catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({
            message: "Error updating post",
            error: error.message,
        });
    }
});
export const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.userId;
    try {
        const message = await postServices.deletePostService(postId, userId);
        res.status(200).json({
            message,
        });
    }
    catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({
            message: "Error deleting post",
            error: error.message,
        });
    }
});
// Like and Unlike API
export const likePost = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const postId = req.params.postId;
    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const existingLike = await postServices.findPostLike(userId, postId);
        if (existingLike) {
            await postServices.unlikedPost(existingLike);
            return res.status(200).json({ message: "Post unliked" });
        }
        const like = await postServices.likedPost(userId, postId);
        return res.status(201).json({ message: "Post liked", like });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error toggling like" });
    }
});
// Comment APIs
// Get by post ID
export const getCommentsByPost = asyncHandler(async (req, res) => {
    const { id: postId } = req.params;
    try {
        const comments = await postServices.fetchCommentsByPostId(postId);
        if (comments.length === 0) {
            return res
                .status(404)
                .json({ message: "No comments found for this post" });
        }
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments for post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Get by user ID
export const getCommentsByUser = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    try {
        const comments = await postServices.fetchCommentsByUserId(userId);
        if (comments.length === 0) {
            return res
                .status(404)
                .json({ message: "No comments found for this user" });
        }
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments by user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export const createComment = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { postId, content } = req.body;
    try {
        if (!userId || !postId || !content) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const comment = await postServices.createNewComment({
            userId,
            postId,
            content,
        });
        res
            .status(201)
            .json({ message: "Comment created successfully", comment });
    }
    catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Update comment
export const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    try {
        const updatedComment = await postServices.modifyComment(commentId, content);
        if (updatedComment) {
            res.status(200).json(updatedComment);
        }
        else {
            res.status(404).json({ message: "Comment not found" });
        }
    }
    catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Delete comment
export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    try {
        const deleted = await postServices.removeComment(commentId);
        if (deleted) {
            res.status(200).json({ message: "Comment deleted successfully" });
        }
        else {
            res.status(404).json({ message: "Comment not found" });
        }
    }
    catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Friend Posts API
export const getFriendsPostsController = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    try {
        const posts = await postServices.getFriendsPostsService(userId);
        res.status(200).json({
            message: "Friend posts fetched successfully",
            data: posts,
        });
    }
    catch (error) {
        console.error("Controller Error - getFriendsPosts:", error);
        res.status(500).json({
            message: "Error fetching friend posts",
            error: error.message,
        });
    }
});
// Get all comments
export const getAllComments = asyncHandler(async (req, res) => {
    try {
        const comments = await postServices.fetchAllComments();
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

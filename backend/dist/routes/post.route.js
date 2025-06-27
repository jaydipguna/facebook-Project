import { Router } from "express";
import uploadImage from '../middleware/upload.js';
import UserAuthorization from '../middleware/auth.middleware.js';
import { createComment, createPost, deleteComment, deletePost, getCommentsByPost, getCommentsByUser, getFriendsPostsController, getPostsByUserId, likePost, updateComment, updatePost } from '../controllers/post.controller.js';
const postRouter = Router();
//  Post Routes
postRouter.get('/', UserAuthorization, getPostsByUserId);
postRouter.post('/', UserAuthorization, uploadImage({ folderName: 'post_images' }).array('images'), createPost);
postRouter.put('/:postId', UserAuthorization, uploadImage({ folderName: 'post_images' }).array('images'), 
// validate(postSchema),
updatePost);
postRouter.delete('/:postId', UserAuthorization, deletePost);
//  Like Routes
postRouter.post('/likes/:postId', UserAuthorization, likePost);
//  Comment Routes
postRouter.get('/comments/user', UserAuthorization, getCommentsByUser);
postRouter.get('/comments/:id', UserAuthorization, getCommentsByPost);
postRouter.post('/comments', 
//  validate(commentSchema), 
UserAuthorization, createComment);
postRouter.put('/comments/:commentId', UserAuthorization, updateComment);
postRouter.delete('/comments/:commentId', UserAuthorization, deleteComment);
//  Friend Posts
postRouter.get('/friends/posts', UserAuthorization, getFriendsPostsController);
export default postRouter;

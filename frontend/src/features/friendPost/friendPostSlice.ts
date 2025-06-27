import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FriendPost } from "../../types/types";



interface FriendPostsState {
  loading: boolean;
  error: string | null;
  posts: FriendPost[];
}

const initialState: FriendPostsState = {
  loading: false,
  error: null,
  posts: [],
};

const friendPostsSlice = createSlice({
  name: "friendPosts",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setFriendPosts(state, action: PayloadAction<FriendPost[]>) {
      console.log("action.payload", action.payload);

      state.posts = action.payload.data;
    },
    addFriendPost(state, action: PayloadAction<FriendPost>) {
      state.posts.unshift(action.payload);
    },
    updateFriendPostLikes(
      state,
      action: PayloadAction<{
        postId: string;
        likes: { user_id: number }[];
        userId: number;
      }>
    ) {
      const { postId, updatedLikes, userId } = action.payload;
      console.log("action.payload", action.payload);
      if (updatedLikes.like) {
        const post = state.posts.find((p) => p.post_id === postId);
        console.log("post", post);
        if (post) {
          post.PostLikes.push(updatedLikes.like);
        }
      } else {
        const post = state.posts.find((p) => p.post_id === postId);
        console.log("post", post);
        if (post) {
          post.PostLikes = post.PostLikes.filter(
            (like) => like.user_id !== userId
          );
        }
      }
    },

    addCommentFriendPost(
      state,
      action: PayloadAction<{
        postId: number;
        comment: {
          comment_id: string | number;
          user_id: string | number;
          content: string;
          createdAt: string;
          User?: { username: string };
        };
      }>
    ) {
      const { comment } = action.payload;
      console.log("postId", comment.post_id);
      console.log("comment", comment);

      const post = state.posts.find((p) => p.post_id === comment.post_id);
      console.log(post);

      if (post) {
        post.comments.push(comment);
      }
    },
    setCommentsFriendPost(
      state,
      action: PayloadAction<{
        postId: number;
        comments: {
          comment_id: number;
          user_id: number;
          content: string;
          created_at: string;
          User: { username: string };
        }[];
      }>
    ) {
      const {postId,response} = action.payload;
      console.log("action.payload",postId)
      console.log(" comments in redux-----------",response);
      const postIndex = state.posts.findIndex((post) => String(post.post_id) === String(postId));

      console.log("postIndex",postIndex);
      const formatted = response.map((c) => ({
        comment_id: c.comment_id,
        user_id: c.user_id,
        content: c.content,
        createdAt: c.created_at,
        User: c.User,
      }));
      console.log("formatted", formatted);
   
      
      if (postIndex !== -1) {
        state.posts[postIndex].comments = formatted;
      } else {
        console.log("Post not found in the state");
      }
    },

    editCommentFriendPost(
      state,
      action: PayloadAction<{
        postId: number;
        comment_id: number | string;
        content: string;
      }>
    ) {
      const { post_id, comment_id, content } = action.payload;
      console.log("postId, comment_id, content", post_id, comment_id, content);

      const update = (comments: FriendPost["comments"]) =>
        comments.map((c) =>
          String(c.comment_id) === String(comment_id) ? { ...c, content } : c
        );

      const post = state.posts.find((p) => p.post_id === post_id);
      if (post) post.comments = update(post.comments);
    },
    deleteCommentFriendPost(
      state,
      action: PayloadAction<{
        postId: number;
        comment_id: string | number;
      }>
    ) {
      const { postId, commentId2 } = action.payload;
      console.log("postId delete redux", postId);
      console.log("comment_id in delete redux", commentId2);

      const filter = (comments: FriendPost["comments"]) =>
        comments.filter((c) => String(c.comment_id) !== String(commentId2));

      const post = state.posts.find((p) => p.post_id === postId);
      if (post) post.comments = filter(post.comments);
    },
  },
});

export const {
  setLoading,
  setError,
  setFriendPosts,
  addFriendPost,
  updateFriendPostLikes,
  addCommentFriendPost,
  setCommentsFriendPost,
  editCommentFriendPost,
  deleteCommentFriendPost,
} = friendPostsSlice.actions;

export default friendPostsSlice.reducer;

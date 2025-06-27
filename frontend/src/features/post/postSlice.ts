import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../types/types";


interface PostState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload.data;
      state.loading = false;
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload);
      state.loading = false;
    },

    deletedPost(state, action: PayloadAction<string>) {
      const postId = action.payload;
      console.log("action.payload", postId);

      state.posts = state.posts.filter((post) => post.post_id !== postId);

      if (state.selectedPost?._id === postId) {
        state.selectedPost = null;
      }
    },
    setSelectedPost(state, action: PayloadAction<Post>) {
      state.selectedPost = action.payload.data;
      state.loading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearSelectedPost(state) {
      state.selectedPost = null;
    },
    updatePostCaptionAndImages(
      state,
      action: PayloadAction<{
        postId: string;
        newCaption: string;
        newImages: { image_url: string }[];
      }>
    ) {
      console.log("action.payload", action.payload);

      const { post_id, caption, PostImages } = action.payload;
      console.log(
        "post_id, caption, PostImages",
        post_id, caption, PostImages
      );

      // Find the post to update
      const post = state.posts.find((p) => p.post_id === post_id);

      if (post) {
        post.caption = caption;
        post.PostImages = PostImages; 
      }

      
    },

    updatePostLikes(
      state,
      action: PayloadAction<{
        postId: string;
        updatedLikes: {
          like?: { userId: string };
          unlike?: { userId: string };
        };
        userId: string;
      }>
    ) {
      const { postId, updatedLikes, userId } = action.payload;
      console.log("action.payload", action.payload);
      if (state.selectedPost && state.selectedPost.post_id === Number(postId)) {
        if (updatedLikes.like) {
          console.log("update");
          state.selectedPost.PostLikes.push(updatedLikes.like);
        } else {
          console.log("remove");
          state.selectedPost.PostLikes = state.selectedPost.PostLikes.filter(
            (like) => like.user_id !== userId
          );
        }
      }
    },

    addCommentRedux(
      state,
      action: PayloadAction<{
        postId: string;
        comment: {
          commentId: string;
          userId: string;
          content: string;
          User: { username: string };
          createdAt: string;
        };
      }>
    ) {
      const { postId, comment } = action.payload;
      console.log("action.payload", action.payload);

      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push(comment);
      }
      if (state.selectedPost?._id === postId) {
        if (!state.selectedPost?.comments) state.selectedPost.comments = [];
        state.selectedPost.comments.push(comment);
      }
    },
    setComments(
      state,
      action: PayloadAction<{
        postId: string;
        comments: {
          comment_id: number;
          content: string;
          created_at: string;
          user_id: number;
          User: { username: string };
        }[];
      }>
    ) {
      const { postId, comments } = action.payload;
      console.log("postId, comments", postId, comments);

      const formattedComments = comments.map((comment) => ({
        commentId: comment.comment_id.toString(),
        userId: comment.user_id.toString(),
        content: comment.content,
        createdAt: comment.created_at,
        username: comment.User?.username || "Unknown",
      }));

      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.comments = formattedComments;
      }

      if (state.selectedPost?._id === postId) {
        state.selectedPost.comments = formattedComments;
      }
    },
    editCommentRedux(
      state,
      action: PayloadAction<{
        postId: string;
        comment_id: number; // or string, depending on backend
        content: string;
      }>
    ) {
      const { postId, comment_id, content } = action.payload;

      const updateComments = (comments?: Post["comments"]) => {
        return comments?.map((comment) =>
          comment.comment_id === comment_id ? { ...comment, content } : comment
        );
      };

      const post = state.posts.find((p) => p._id === postId);
      if (post && post.comments) {
        post.comments = updateComments(post.comments);
      }

      if (state.selectedPost?._id === postId && state.selectedPost.comments) {
        state.selectedPost.comments = updateComments(
          state.selectedPost.comments
        );
      }
    },
    deleteComment(
      state,
      action: PayloadAction<{ postId: string; commentId2: string }>
    ) {
      const { postId, commentId2 } = action.payload;

      console.log("action.payload", action.payload);
      console.log("postId", postId);
      console.log("commentId2", commentId2);

      const post = state.posts.find((p) => p.post_id === postId);
      console.log("post", post);

      const filterComments = (comments?: Post["comments"]) => {
        return comments?.filter(
          (comment) => String(comment.comment_id) !== String(commentId2)
        );
      };

      if (post && post.comments) {
        post.comments = filterComments(post.comments);
        console.log("Filtered post comments", post.comments);
      }

      if (
        state.selectedPost &&
        state.selectedPost.post_id === postId &&
        state.selectedPost.comments
      ) {
        state.selectedPost.comments = filterComments(
          state.selectedPost.comments
        );
        console.log(
          "Filtered selectedPost comments",
          state.selectedPost.comments
        );
      }
    },
  },
});

export const {
  startLoading,
  setPosts,
  addPost,
  setSelectedPost,
  setError,
  clearSelectedPost,
  updatePostLikes,
  addCommentRedux,
  setComments,
  deleteComment,
  editCommentRedux,
  updatePostCaptionAndImages,
  deletedPost,
} = postSlice.actions;

export default postSlice.reducer;

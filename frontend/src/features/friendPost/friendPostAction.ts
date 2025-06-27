import api from "../../services/api";
import {
  addCommentFriendPost,
  deleteCommentFriendPost,
  editCommentFriendPost,
  setCommentsFriendPost,
  setError,
  setFriendPosts,
  setLoading,
  updateFriendPostLikes,
} from "./friendPostSlice";

export const fetchFriendPosts = () => async (dispatch: any) => {
  dispatch(setLoading());
  try {
    const response = await api.get("/post/friends/posts");
    console.log("response", response);
    dispatch(setError(null));
    dispatch(setFriendPosts(response));
  } catch (error) {
    dispatch(setError(error.message || "Failed to fetch posts"));
  }
};

export const toggleLikePost = (postId, userId) => async (dispatch) => {
  try {
    const response = await api.post(`/post/likes/${postId}`);

    const updatedLikes = response;

    dispatch(updateFriendPostLikes({ postId, updatedLikes, userId }));
  } catch (error) {
    console.error("Error toggling like", error);
    dispatch(setError(error.message || "Error toggling like"));
  }
};

export const addComment =
  (postId: number, content: string) => async (dispatch: any) => {
    try {
      console.log("postId", postId);
      console.log("content", content);

      const response = await api.post(`/post/comments`, {
        content: content,
        postId: postId,
      });

      console.log("response", response);
      dispatch(addCommentFriendPost(response));
    } catch (error) {
      dispatch(setError(error.message || "Error while adding comment"));
    }
  };

export const fetchPostComments = (postId: number) => async (dispatch: any) => {
  try {
    const response = await api.get(`/post/comments/${postId}`);
    console.log("response fetch comment", response);
    dispatch(setCommentsFriendPost({postId,response}));
  } catch (error) {
    dispatch(setError(error.message || "Error while show comment"));
  }
};

export const editedCommentFriendPost =
  (commentId: number, content) => async (dispatch: any) => {
    console.log("commentId in action",commentId);
    console.log("content in action",content);

    
    try {
      const response = await api.put(`/post/comments/${commentId}`, {
        content: content,
      });
      console.log("response", response);
      dispatch(editCommentFriendPost(response));
    } catch (error) {
      dispatch(setError(error.message || "Error while edit comment"));
    }
  };
export const deletedCommentFriendPost =
  (postId:number, commentId: number) => async (dispatch: any) => {
  
    console.log("postId",postId);
    console.log("commentId",commentId);

    
    try {
      const response = await api.delete(`/post/comments/${commentId}`);
      console.log("response", response);
      dispatch(deleteCommentFriendPost(response.data));
    } catch (error) {
      dispatch(setError(error.message || "Error while delete comment"));
    }
  };

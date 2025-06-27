import api from "../../services/api";
import {
  addCommentRedux,
  addPost,
  deleteComment,
  deletedPost,
  editCommentRedux,
  setComments,
  setError,
  setPosts,
  setSelectedPost,
  startLoading,
  updatePostCaptionAndImages,
  updatePostLikes,
} from "./postSlice";

interface FormData {
  caption: string;
  images: File[];
}

export const createPost = (formData: FormData) => async (dispatch: any) => {
  try {
    const response = await api.post("/post/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Post created successfully:", response);

    dispatch(addPost(response));
    return response;
  } catch (error) {
    console.error("Error creating post:", error);

    dispatch(setError(error));
  }
};

export const getAllPost = () => async (dispatch: any) => {
  dispatch(startLoading());
  try {
    const response = await api.get("/post/");
    console.log("Fetched posts:", response);
    dispatch(setPosts(response.data));
  } catch (error) {
    console.error("Error fetching posts:", error);
    dispatch(setError(error.message || "Failed to fetch posts"));
  }
};
export const getPostById = (postId: number) => async (dispatch: any) => {
  dispatch(startLoading());
  try {
    const response = await api.get(`/post/${postId}`);
    console.log("response", response);
    dispatch(setSelectedPost(response));
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    dispatch(setError(error.message || "Failed to fetch posts"));
  }
};

export const toggleLikePost = (postId, userId) => async (dispatch) => {
  console.log("postId", postId);
  console.log(" userId", userId);

  try {
    const response = await api.post(`/post/likes/${postId}`);

    const updatedLikes = response;

    dispatch(updatePostLikes({ postId, updatedLikes, userId }));
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
      dispatch(addCommentRedux(response));
    } catch (error) {
      dispatch(setError(error.message || "Error while adding comment"));
    }
  };

export const getAllCommentByPost =
  (postId: number) => async (dispatch: any) => {
    try {
      const response = await api.get(`/post/comments/${postId}`);
      console.log("response", response);
      dispatch(setComments(response));
    } catch (error) {
      dispatch(setError(error.message || "Error while show comment"));
    }
  };

export const editComment =
  (commentId: number, content) => async (dispatch: any) => {
    try {
      const response = await api.put(`/post/comments/${commentId}`, {
        content: content,
      });
      console.log("response", response);
      dispatch(editCommentRedux(response));
    } catch (error) {
      dispatch(setError(error.message || "Error while edit comment"));
    }
  };
export const deletedCommentinPost =
  (postId, commentId: number) => async (dispatch: any) => {
    console.log("commentId", commentId);

    try {
      const response = await api.delete(`/post/comments/${commentId}`);
      console.log("response", response);
      dispatch(deleteComment(response.data));
    } catch (error) {
      dispatch(setError(error.message || "Error while delete comment"));
    }
  };

  export const deletePost=(postId:number)=>async(dispatch:any)=>{
    console.log("postId",postId);
    try {
      const response=await api.delete(`/post/${postId}`)
      console.log("response delete post in",response);
      dispatch(deletedPost(postId))
    } catch (error) {
      console.log("error",error);
      
    }
    
  }
  export const updatedPost = (postId: string, formData: FormData) => async (dispatch: any) => {
    try {
      console.log("postId", postId);
      console.log("formData", formData);
  
      const response = await api.put(`/post/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
  
      console.log("API response", response);
     
      dispatch(updatePostCaptionAndImages(response.post))
    
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostById, updatedPost } from "../../features/post/PostAction";
import { useParams } from "react-router-dom";
import PostForm from "./PostForm";

const EditPost: React.FC = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    // Fetch the post to edit
    if (postId) {
      dispatch(getPostById(postId)).then((result) => {
        setPost(result);
      });
    }
  }, [dispatch, postId]);

  const handleEditPost = async (data: FormData) => {
    try {
      const result = await dispatch(updatedPost(postId!, data));
      console.log("Post updated:", result);
    } catch (error) {
      console.log("Error updating post:", error);
    }
  };

  return (
    post && (
      <PostForm
        onSubmit={handleEditPost}
        existingPost={post}
        isEdit={true}
      />
    )
  );
};

export default EditPost;

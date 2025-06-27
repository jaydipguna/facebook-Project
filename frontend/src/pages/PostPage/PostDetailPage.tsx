
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deletedCommentinPost,
  editComment,
  getAllCommentByPost,
  getPostById,
  toggleLikePost,
} from "../../features/post/PostAction";
import {
  ArrowBackIos,
  ArrowForwardIos,
  Favorite,
  Comment,
  MoreVert,
} from "@mui/icons-material";

function PostDetailPage() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { selectedPost: post, loading } = useSelector(
    (state: any) => state.posts
  );
  console.log("post",post)
  
  const currentUserId = useSelector((state: any) => state.auth?.user.user_id);
  console.log("currentUserId",currentUserId)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedCommentText, setEditedCommentText] = useState("");

  useEffect(() => {
    if (postId) dispatch(getPostById(postId));
  }, [dispatch, postId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        Post not found.
      </Typography>
    );
  }

  const images = post.PostImages || [];
  console.log("images",images);
  
  const commentsCount = post.comments?.length || 0;
  const likes = post.PostLikes || [];
  const hasLiked = post.PostLikes?.some((like: any) => like.user_id
  === currentUserId);

  console.log("hasLiked",hasLiked);
  
  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleLike = () => {
    if (postId) {
      dispatch(toggleLikePost(postId,currentUserId));
    }
  };

  const handleComment = () => {
    if (postId) {
      dispatch(getAllCommentByPost(postId));
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCommentText("");
  };

  const handleCommentSubmit = () => {
    if (commentText.trim() !== "") {
      dispatch(addComment(postId, commentText));
      setDialogOpen(false);
      setCommentText("");
    }
  };

  const handleMoreClick = (comment: any) => {
    setSelectedComment(comment);
    setActionDialogOpen(true);
  };

  const handleActionDialogClose = () => {
    setSelectedComment(null);
    setActionDialogOpen(false);
  };

  const handleEdit = () => {
    setEditedCommentText(selectedComment?.content || "");
    setActionDialogOpen(false);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditedCommentText("");
  };

  const handleEditSubmit = () => {
    if (editedCommentText.trim() !== "") {
      console.log("Edited Comment ID:", selectedComment?.comment_id);
      console.log("New Content:", editedCommentText);
      dispatch(editComment(selectedComment.comment_id, editedCommentText));
      setEditDialogOpen(false);
      setEditedCommentText("");
    }
  };

  const handleDelete = () => {
    console.log(" handle delete in ",postId);
    
    console.log("Delete clicked for comment:", selectedComment?.comment_id);
     dispatch(deletedCommentinPost(postId, selectedComment.comment_id))
    setActionDialogOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 450, margin: "0 auto", mt: 4 }}>
      <Card>
        {images.length === 1 && (
          <CardMedia
            component="img"
            height="400"
            image={images[0].image_url}
            alt="Post Image"
          />
        )}

        {images.length > 1 && (
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="400"
              image={images[currentImageIndex].image_url}
              alt={`Image ${currentImageIndex + 1}`}
            />
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                top: "50%",
                left: 10,
                transform: "translateY(-50%)",
                backgroundColor: "#fff",
              }}
            >
              <ArrowBackIos />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                backgroundColor: "#fff",
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          </Box>
        )}

        <CardContent>
          <Typography variant="h5" gutterBottom>
            Post by @{post.postOwner?.username || "Unknown"}
          </Typography>
          <Typography variant="body1">{post.caption}</Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              startIcon={<Favorite />}
              onClick={handleLike}
              variant="outlined"
              color={hasLiked ? "primary" : "error"}
            >
              {hasLiked ? "Unlike" : "Like"}({likes.length})
            </Button>
            <Button
              startIcon={<Comment />}
              onClick={handleComment}
              variant="outlined"
            >
              Comment ({commentsCount})
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Comment Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent dividers>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment: any) => (
              <Box
                key={comment.comment_id}
                sx={{ display: "flex", mb: 2, justifyContent: "space-between" }}
              >
                <Box sx={{ display: "flex" }}>
                  <img
                    src={
                      comment.commenter?.profile ||
                      comment.profile ||
                      "/default-avatar.png"
                    }
                    alt="Profile"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginRight: 12,
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle2">
                      {comment.commenter?.username ||
                        comment.username ||
                        "Unknown"}
                      :
                    </Typography>
                    <Typography variant="body2">{comment.content}</Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => handleMoreClick(comment)}>
                  <MoreVert />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>
          )}

          <TextField
            margin="dense"
            id="comment-text"
            label="Add a comment"
            type="text"
            fullWidth
            variant="outlined"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCommentSubmit}
            color="primary"
            disabled={commentText.trim() === ""}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog (Edit/Delete) */}
      <Dialog open={actionDialogOpen} onClose={handleActionDialogClose}>
        <DialogTitle>Comment Actions</DialogTitle>
        <DialogActions>
          <Button onClick={handleEdit} color="primary">
            Edit
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Comment Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Edit your comment"
            type="text"
            fullWidth
            variant="outlined"
            value={editedCommentText}
            onChange={(e) => setEditedCommentText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            disabled={editedCommentText.trim() === ""}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PostDetailPage;



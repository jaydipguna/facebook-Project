import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { MoreVert } from "@mui/icons-material";
import {
  addComment,
  fetchPostComments,
  editedCommentFriendPost,
  deletedCommentFriendPost,
} from "../../features/friendPost/friendPostAction";

const CommentDialog = ({ open, onClose, postId }) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState({});

  const comments = useSelector(
    (state) =>
      state.friendPosts.posts.find((post) => post.post_id === postId)
        ?.comments || []
  );

  const currentUserId = useSelector((state) => state.auth.user?.user_id);

  useEffect(() => {
    if (open && postId) {
      dispatch(fetchPostComments(postId)); 
    }

    if (!open) {
      setCommentText(""); 
      setEditingCommentId(null); 
      setMenuAnchor({}); 
    }
  }, [open, postId, dispatch]);

  const handleSubmit = () => {
    if (commentText.trim()) {
      if (editingCommentId) {
   
        dispatch(editedCommentFriendPost(editingCommentId, commentText));
      } else {
       
        dispatch(addComment(postId, commentText));
      }
     
      setCommentText("");
      setEditingCommentId(null);
    }
  };

  const handleEdit = (comment) => {
    setCommentText(comment.content); 
    setEditingCommentId(comment.comment_id); 
    setMenuAnchor({}); 
  };

  const handleDelete = (commentId) => {
    dispatch(deletedCommentFriendPost(postId, commentId)); 
    setMenuAnchor({});
  };

  const handleOpenMenu = (event, commentId) => {
    setMenuAnchor({ ...menuAnchor, [commentId]: event.currentTarget });
  };

  const handleCloseMenu = (commentId) => {
    setMenuAnchor({ ...menuAnchor, [commentId]: null });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Comments</DialogTitle>
      <DialogContent dividers>
        <List>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <React.Fragment key={comment.comment_id}>
                <ListItem
                  secondaryAction={
                    currentUserId === comment.user_id && (
                      <>
                        <IconButton
                          onClick={(e) => handleOpenMenu(e, comment.comment_id)}
                        >
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={menuAnchor[comment.comment_id]}
                          open={Boolean(menuAnchor[comment.comment_id])}
                          onClose={() => handleCloseMenu(comment.comment_id)}
                        >
                          <MenuItem onClick={() => handleEdit(comment)}>
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleDelete(comment.comment_id)}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </>
                    )
                  }
                >
                  <ListItemText
                    primary={
                      comment.User?.username ||
                      comment.commenter?.username ||
                      "Anonymous"
                    }
                    secondary={comment.content}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </List>

        <TextField
          fullWidth
          multiline
          minRows={3}
          variant="outlined"
          label="Your comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)} 
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setCommentText(""); 
            setEditingCommentId(null);
            onClose(); 
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!commentText.trim()}>
          {editingCommentId ? "Update" : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentDialog;

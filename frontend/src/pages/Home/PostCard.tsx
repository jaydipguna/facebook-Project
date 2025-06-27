import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  Favorite,
  Comment,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toggleLikePost } from "../../features/friendPost/friendPostAction";
import { formatDistanceToNowStrict } from "date-fns";
import CommentDialog from "../../components/common/CommentDialog";
import CommetDialogBox from "../../components/common/CommetDialogBox";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  console.log("post in post card", post);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isLikedByCurrentUser = post.PostLikes?.some(
    (like) => like.user_id === currentUser?.user_id
  );

  const handleLike = () => {
    dispatch(toggleLikePost(post.post_id, currentUser?.user_id));
  };

  const formatPostTime = (createdAt) =>
    createdAt
      ? formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true })
      : "Unknown time";

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.PostImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.PostImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      <Card sx={{ mb: 4 }}>
        {post.PostImages?.length > 0 && (
          <Box sx={{ position: "relative" }}>
            <Typography variant="h6">
              @{post.postOwner?.username || "Unknown"}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatPostTime(post.createdAt)}
            </Typography>
            <CardMedia
              component="img"
              height="400"
              image={post.PostImages[currentImageIndex]?.image_url}
              alt="Post"
              sx={{ objectFit: "contain" }}
            />
            {post.PostImages.length > 1 && (
              <>
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
              </>
            )}
          </Box>
        )}

        <CardContent>
          <Typography variant="body1">{post.caption}</Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              startIcon={<Favorite />}
              onClick={handleLike}
              variant="outlined"
              color={isLikedByCurrentUser ? "primary" : "error"}
            >
              {/* {isLikedByCurrentUser ? "Unlike" : "Like"} ( */}(
              {post.PostLikes?.length || 0})
            </Button>

            <Button
              startIcon={<Comment />}
              onClick={() => setDialogOpen(true)}
              variant="outlined"
            >
              ({post.comments?.length || 0})
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <CommetDialogBox
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        postId={post.post_id}
      />
    </>
  );
};

export default PostCard;

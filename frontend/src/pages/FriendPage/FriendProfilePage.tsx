import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProfileByFriend } from "../../features/friendProfile/friendProfileAction";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";

function FriendProfilePage() {
  const dispatch = useDispatch();
  const { friendId } = useParams();
  const { profile, friends, posts } = useSelector(
    (state: any) => state.friendProfile
  );
  const [activeTab, setActiveTab] = useState(0);
  const { users } = useSelector((state: any) => state.search);

  const friendRequestData = users.find(
    (user: any) => user.user_id === parseInt(friendId)
  );

  useEffect(() => {
    dispatch(getProfileByFriend(friendId));
  }, [dispatch, friendId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!profile) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      {/* Profile Header */}
      <Paper elevation={3}>
        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80"
            alt="cover"
            sx={{ width: "100%", height: 250, objectFit: "cover" }}
          />
          <Avatar
            src={profile.profile}
            alt={profile.username}
            sx={{
              width: 150,
              height: 150,
              border: "4px solid white",
              position: "absolute",
              bottom: -75,
              left: 40,
              zIndex: 10,
            }}
          />
        </Box>

        <Box sx={{ pt: 10, px: 3, pb: 3 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h5">{profile.username}</Typography>
              <Typography variant="body1" color="text.secondary">
                {profile.first_name} {profile.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.email}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {profile.bio}
              </Typography>
            </Grid>
            <Grid item>
              {friendRequestData ? (
                <>
                  {friendRequestData.friendshipStatus === "pending_sent" && (
                    <Button variant="outlined" color="warning">
                      Pending Request
                    </Button>
                  )}
                  {friendRequestData.friendshipStatus ===
                    "pending_received" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ mr: 2 }}
                      >
                        Accept
                      </Button>
                      <Button variant="outlined" color="error">
                        Decline
                      </Button>
                    </>
                  )}
                  {friendRequestData.friendshipStatus === "friends" && (
                    <Button variant="outlined" color="error">
                      Unfriend
                    </Button>
                  )}
                  {friendRequestData.friendshipStatus === "none" && (
                    <Button variant="contained" color="primary">
                      Add Friend
                    </Button>
                  )}
                </>
              ) : (
                <Button variant="contained" color="primary">
                  Add Friend
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper elevation={2} sx={{ mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Posts" />
          <Tab label="Friends" />
          <Tab label="Photos" />
        </Tabs>
        <Divider />

        {/* POSTS TAB */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {posts.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No posts available.
              </Typography>
            ) : (
              posts.map((post: any) => (
                <Paper key={post.post_id} sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6">{post.caption}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posted by {post.postOwner.username} on{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>

                  {/* Post Images in Grid */}
                  <Grid container spacing={2} mt={2}>
                    {post.PostImages.map((image: any, index: number) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <Box
                          component="img"
                          src={image.image_url}
                          alt={`Post image ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                            borderRadius: 2,
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  {/* Comments */}
                  <Box sx={{ mt: 2 }}>
                    {post.comments.length > 0 ? (
                      post.comments.map((comment: any) => (
                        <Typography
                          key={comment.comment_id}
                          variant="body2"
                          color="text.secondary"
                        >
                          <strong>{comment.commenter.username}: </strong>
                          {comment.content}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No comments yet.
                      </Typography>
                    )}
                  </Box>
                </Paper>
              ))
            )}
          </Box>
        )}

        {/* FRIENDS TAB */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {friends.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No friends available.
              </Typography>
            ) : (
              friends.map((friend: any) => (
                <Paper key={friend.user_id} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">{friend.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {friend.first_name} {friend.last_name}
                  </Typography>
                </Paper>
              ))
            )}
          </Box>
        )}

        {/* PHOTOS TAB */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Photos content will go here...
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default FriendProfilePage;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deletePost, getAllPost } from "../../features/post/PostAction";
import {
  getAllFriend,
  getUserInfo,
  unfriend,
  updateUserProfile,
} from "../../features/Profile/profileAction";

import {
  Grid,
  Box,
  Typography,
  Skeleton,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditProfileForm from "../../features/post/EditProfileForm";
import { useNavigate } from "react-router-dom";

function UserProfilePage() {
  const dispatch = useDispatch();
  const {
    posts,
    loading: postsLoading,
    error,
  } = useSelector((state: any) => state.posts);

  const {
    user,
    friends,
    friendsCount,
    loading: userLoading,
    error: userError,
  } = useSelector((state: any) => state.profile);

  const [showFriends, setShowFriends] = useState(false);
  const [expandedCaptions, setExpandedCaptions] = useState<{ [key: number]: boolean }>({});
  const [openEdit, setOpenEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPostId, setMenuPostId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllPost());
    dispatch(getUserInfo());
    dispatch(getAllFriend());
  }, [dispatch]);

  const toggleCaption = (index: number) => {
    setExpandedCaptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncate = (text: string, length = 50) =>
    text.length > length ? text.slice(0, length) + "..." : text;

  const handleEditSubmit = async (formData: FormData) => {
    await dispatch(updateUserProfile(formData));
    setOpenEdit(false);
  };

  const handleUnfriend = (friendId: number) => {
    dispatch(unfriend(friendId));
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, postId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPostId(null);
  };

  const handleEditPost = (postId: number) => {
    console.log("Edit post", postId);
    handleMenuClose();
  };

  const handleDeletePost = (postId: number) => {
    console.log("Delete post", postId);
    console.log("Delete post", postId);
        dispatch(deletePost(postId))
    handleMenuClose();
  };

  if (userLoading) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography align="center">Loading user profile...</Typography>
        <Skeleton variant="rectangular" width="100%" height={150} />
      </Box>
    );
  }


  return (
    <Box sx={{ padding: 4, maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        User Profile
      </Typography>

      {/* User Info Section */}
      <Grid
        container
        spacing={4}
        alignItems="center"
        sx={{
          mb: 5,
          backgroundColor: "#f9f9f9",
          padding: 2,
          borderRadius: 2,
          boxShadow: 1,
        }}


      >
        <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
          {user?.profile ? (
            <Avatar
              src={user.profile}
              alt="User Profile"
              sx={{ width: 150, height: 150, margin: "auto" }}
            />
          ) : (
            <Skeleton variant="circular" width={150} height={150} />
          )}
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h6">Username: {user?.username}</Typography>
          <Typography variant="body1" color="text.secondary">
            Email: {user?.email}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Bio: {user?.bio || "No bio available."}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="body2"
              sx={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setShowFriends((prev) => !prev)}
            >
              Friends: {friendsCount ?? friends?.length ?? 0}
            </Typography>

            {showFriends && friends?.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  padding: 1,
                  backgroundColor: "#fafafa",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {friends.map((friend: any) => (
                  <Box
                    key={friend.user_id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      borderBottom: "1px solid #eee",
                      pb: 1,
                    }}
                  >
                    <Avatar src={friend.profile} alt={friend.username} />
                    <Box>
                      <Typography variant="body2">
                        {friend.first_name} {friend.last_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{friend.username}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleUnfriend(friend.user_id)}
                      sx={{ ml: "auto" }}
                    >
                      Unfriend
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setOpenEdit(true)}
          >
            Edit Profile
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      {/* Post Grid */}
      {postsLoading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={250} />
              <Skeleton variant="text" />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : posts && posts.length > 0 ? (
        <Grid container spacing={3}>
          {posts.map((post: any, index: number) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ boxShadow: 2, position: "relative" }}>
                <IconButton
                  aria-label="more"
                  onClick={(e) => handleMenuClick(e, post.post_id)}
                  sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
                >
                  <MoreVertIcon />
                </IconButton>

                {post.PostImages?.[0] && (
                  <CardMedia
                    component="img"
                    image={post.PostImages[0].image_url}
                    alt="Post"
                    sx={{ height: 350, width: "100%", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => navigate(`/post/${post.post_id}`)}
                  />
                )}
                <CardContent onClick={() => navigate(`/post/${post.post_id}`)}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      cursor: post.caption.length > 50 ? "pointer" : "default",
                      textAlign: "center",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCaption(index);
                    }}
                  >
                    {expandedCaptions[index]
                      ? post.caption
                      : truncate(post.caption)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography align="center">No posts found.</Typography>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEditPost(menuPostId!)}>Edit</MenuItem>
        <MenuItem onClick={() => handleDeletePost(menuPostId!)}>Delete</MenuItem>
      </Menu>

      {openEdit && (
        <EditProfileForm
          onClose={() => setOpenEdit(false)}
          defaultValues={user}
          onSubmit={handleEditSubmit}
        />
      )}
    </Box>
  );
}

export default UserProfilePage;







// below in bug friend not show proper 
// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { deletePost, getAllPost } from "../../features/post/PostAction";
// import {
//   getAllFriend,
//   getUserInfo,
//   unfriend,
// } from "../../features/Profile/profileAction";
// import {
//   Grid,
//   Box,
//   Typography,
//   Skeleton,
//   Card,
//   CardContent,
//   CardMedia,
//   Avatar,
//   Divider,
//   Button,
//   IconButton,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useNavigate } from "react-router-dom";
// import CreatePost from "../PostPage/CreatePost";

// function truncate(text: string, maxLength: number = 50): string {
//   return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
// }

// function UserProfilePage() {
//   const dispatch = useDispatch();
//   const {
//     posts,
//     loading: postsLoading,
//     error,
//   } = useSelector((state: any) => state.posts);
//   const {
//     user,
//     friends,
//     friendsCount,
//     loading: userLoading,
//     error: userError,
//   } = useSelector((state: any) => state.profile);

//   const [showFriends, setShowFriends] = useState(false);
//   const [expandedCaptions, setExpandedCaptions] = useState<{
//     [key: number]: boolean;
//   }>({});
//   const [openEdit, setOpenEdit] = useState(false);
//   const [selectedPost, setSelectedPost] = useState<any>(null);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [menuPostId, setMenuPostId] = useState<number | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(getAllPost());
//     dispatch(getUserInfo());
//     dispatch(getAllFriend());
//   }, [dispatch]);

//   const toggleCaption = (index: number) => {
//     setExpandedCaptions((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const handleMenuClick = (event: React.MouseEvent<HTMLElement>, post: any) => {
//     setAnchorEl(event.currentTarget);
//     setMenuPostId(post.post_id);
//     setSelectedPost(post);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setMenuPostId(null);
//   };

//   const handleEditPost = () => {
//     setOpenEdit(true);
//     handleMenuClose();
//   };

//   const handleDeletePost = (postId: number) => {
//     console.log("Delete post", postId);
//     dispatch(deletePost(postId))
//     handleMenuClose();
//   };

//   const handleUnfriend = (friendId: number) => {
//     dispatch(unfriend(friendId));
//   };


//   return (
//     <Box sx={{ padding: 4, maxWidth: "1200px", margin: "0 auto" }}>
//       <Typography variant="h4" align="center" gutterBottom>
//         User Profile
//       </Typography>

//       {/* User Info */}
//       <Grid
//         container
//         spacing={4}
//         alignItems="center"
//         sx={{
//           mb: 5,
//           backgroundColor: "#f9f9f9",
//           padding: 2,
//           borderRadius: 2,
//           boxShadow: 1,
//         }}
//       >
//         <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
//           {user?.profile ? (
//             <Avatar
//               src={user.profile}
//               alt="User Profile"
//               sx={{ width: 150, height: 150, margin: "auto" }}
//             />
//           ) : (
//             <Skeleton variant="circular" width={150} height={150} />
//           )}
//         </Grid>
//         <Grid item xs={12} sm={8}>
//           <Typography variant="h6">
//             Username: {user?.username || "Loading..."}
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             Email: {user?.email || "Loading..."}
//           </Typography>
//           <Typography variant="body2" sx={{ mt: 1 }}>
//             Bio: {user?.bio || "No bio available."}
//           </Typography>
//           <Box sx={{ mt: 1 }}>
//             <Typography
//               variant="body2"
//               sx={{ cursor: "pointer", textDecoration: "underline" }}
//               onClick={() => setShowFriends((prev) => !prev)}
//             >
//               Friends: {friendsCount ?? friends?.length ?? 0}
//             </Typography>

//             {showFriends && friends?.length > 0 && (
//               <Box
//                 sx={{
//                   mt: 2,
//                   border: "1px solid #ccc",
//                   borderRadius: 1,
//                   padding: 1,
//                   backgroundColor: "#fafafa",
//                   maxHeight: 200,
//                   overflowY: "auto",
//                 }}
//               >
//                 {friends.map((friend: any) => (
//                   <Box
//                     key={friend.user_id}
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       mb: 1,
//                       borderBottom: "1px solid #eee",
//                       pb: 1,
//                     }}
//                   >
//                     <Avatar src={friend.profile} alt={friend.username} />
//                     <Box>
//                       <Typography variant="body2">
//                         {friend.first_name} {friend.last_name}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         @{friend.username}
//                       </Typography>
//                     </Box>
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       size="small"
//                       onClick={() => handleUnfriend(friend.user_id)}
//                       sx={{ ml: "auto" }}
//                     >
//                       Unfriend
//                     </Button>
//                   </Box>
//                 ))}
//               </Box>
//             )}
//           </Box>
//           <Button
//             variant="contained"
//             sx={{ mt: 2 }}
//             onClick={() => setOpenEdit(true)}
//           >
//             Edit Profile
//           </Button>
//         </Grid>
//       </Grid>

//       <Divider sx={{ mb: 4 }} />

//       {/* Posts */}
//       {postsLoading ? (
//         <Grid container spacing={3}>
//           {[...Array(6)].map((_, i) => (
//             <Grid item xs={12} sm={6} md={4} key={i}>
//               <Skeleton variant="rectangular" height={250} />
//               <Skeleton variant="text" />
//             </Grid>
//           ))}
//         </Grid>
//       ) : error ? (
//         <Typography color="error">Error: {error}</Typography>
//       ) : posts && posts.length > 0 ? (
//         <Grid container spacing={3}>
//           {posts.map((post: any, index: number) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card sx={{ boxShadow: 2, position: "relative" }}>
//                 <IconButton
//                   aria-label="more"
//                   onClick={(e) => handleMenuClick(e, post)}
//                   sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
//                 >
//                   <MoreVertIcon />
//                 </IconButton>
//                 {post.PostImages?.[0] && (
//                   <CardMedia
//                     component="img"
//                     image={post.PostImages[0].image_url}
//                     alt="Post"
//                     sx={{
//                       height: 350,
//                       width: "100%",
//                       objectFit: "cover",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => navigate(`/post/${post.post_id}`)}
//                   />
//                 )}
//                 <CardContent onClick={() => navigate(`/post/${post.post_id}`)}>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{
//                       cursor: post?.caption?.length > 50 ? "pointer" : "default",
//                       textAlign: "center",
//                     }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleCaption(index);
//                     }}
//                   >
//                     {expandedCaptions[index]
//                       ? post.caption
//                       : truncate(post.caption)}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <Typography align="center">No posts found.</Typography>
//       )}

//       {/* Post Options Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleEditPost}>Edit</MenuItem>
//         <MenuItem onClick={() => handleDeletePost(menuPostId!)}>
//           Delete
//         </MenuItem>
//       </Menu>

//       {/* Post Edit Dialog */}
//       {openEdit && (
//         <CreatePost onClose={() => setOpenEdit(false)} post={selectedPost} />
//       )}
//     </Box>
//   );
// }

// export default UserProfilePage;

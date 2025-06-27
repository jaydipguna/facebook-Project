import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import {
  TextField,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  acceptedFriendRequest,
  searchUser,
  sendFriendRequested,
  unfriendSendRequest,
} from "../../features/search/searchAction";
import { useEffect, useState } from "react";

const pages = ["Home", "Create-Post", "Friends"];
const settings = ["Profile", "Logout"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state: any) => state.search);
  console.log("users===============>", users);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutNavbar = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    navigate("/login");
  };

  const handleNavigation = (page: string) => {
    if (page === "Home") {
      navigate("/");
    } else if (page === "Create-Post") {
      navigate("/create-post");
    } else if (page === "Friends") {
      navigate("/friends");
    }
    handleCloseNavMenu();
  };

  const handleUserMenuNavigation = (setting: string) => {
    if (setting === "Profile") {
      navigate("/profile");
    } else if (setting === "Logout") {
      logoutNavbar();
    }
    handleCloseUserMenu();
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchUser(searchQuery));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(searchUser(searchQuery));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error]);
  const sendFriendReqest = (receiverId: number) => {
    console.log("receiverId send friend request in", receiverId);
    dispatch(sendFriendRequested(receiverId));
  };

  const acceptFriendRequest2 = (friendRequestId: number) => {
    dispatch(acceptedFriendRequest(friendRequestId)); // Dispatch async action
    console.log("accept friend request in", friendRequestId);
  };
  const sendUnfriendRequest = (friendId: number) => {
    dispatch(unfriendSendRequest(friendId));
    setSearchQuery("");
  };
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleNavigation(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              position: "relative",
            }}
          >
            <form onSubmit={handleSearchSubmit}>
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                label="Search Users"
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  marginRight: 2,
                }}
              />
            </form>

            {searchQuery && (
              <Box
                sx={{
                  position: "absolute",
                  top: 50,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  maxHeight: 300,
                  overflowY: "auto",
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                }}
              >
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height={200} />
                ) : users.length > 0 ? (
                  <List>
                    {users.map((user: any) => (
                      <ListItem
                        button
                        key={user.user_id}
                        onClick={() => {
                          navigate(`/friend-profile/${user.user_id}`); 
                          setSearchQuery(""); 
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                          borderBottom: "1px solid #eee",
                          alignItems: "center",
                        }}

                      >
                        {user.profile && (
                          <ListItemAvatar>
                            <Avatar src={user.profile} alt={user.username} />
                          </ListItemAvatar>
                        )}
                        <ListItemText
                          primary={
                            <Typography sx={{ color: "#000", fontWeight: 500 }}>
                              {user.username}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              sx={{ color: "#666", fontSize: "0.875rem" }}
                            >
                              {user.email}
                            </Typography>
                          }
                        />
                        {user.friendshipStatus === "pending_sent" && (
                          <Button
                            // onClick={() => cancelFriendRequest(user.requestId)}
                            variant="outlined"
                            color="warning"
                            sx={{ ml: 2 }}
                          >
                            already request sent 
                          </Button>
                        )}
                        {/* {user.friendshipStatus === "accepted" && (
                          <Button
                            // onClick={() => cancelFriendRequest(user.requestId)}
                            variant="outlined"
                            color="warning"
                            sx={{ ml: 2 }}
                          >
                            unfriend
                          </Button>
                        )} */}
                        {/* {user.friendshipStatus === "pending" && (
                          <Button
                            onClick={() => cancelFriendRequest(user.requestId)}
                            variant="outlined"
                            color="warning"
                            sx={{ ml: 2 }}
                          >
                            Cancel Request
                          </Button>
                        )} */}
                        {user.friendshipStatus === "pending_received" && (
                          <Button
                            onClick={() => acceptFriendRequest2(user.requestId)}
                            variant="outlined"
                            color="primary"
                            sx={{ ml: 2 }}
                          >
                            Accept Friend Request
                          </Button>
                        )}

                        {user.friendshipStatus === "friends" && (
                          <Button
                            onClick={() => sendUnfriendRequest(user.user_id)}
                            variant="contained"
                            color="secondary"
                            sx={{ ml: 2 }}
                          >
                            Unfriend
                          </Button>
                        )}

                        {user.friendshipStatus === "none" && (
                          <Button
                            onClick={() => sendFriendReqest(user.user_id)}
                            variant="contained"
                            color="primary"
                            sx={{ ml: 2 }}
                          >
                            Send Request
                          </Button>
                        )}
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ padding: 2, textAlign: "center" }}>
                    <Typography>No users found</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigation(page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {isAuthenticated && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleUserMenuNavigation(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </AppBar>
  );
}

export default Navbar;

// import * as React from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import Menu from "@mui/material/Menu";
// import MenuIcon from "@mui/icons-material/Menu";
// import Container from "@mui/material/Container";
// import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
// import Tooltip from "@mui/material/Tooltip";
// import MenuItem from "@mui/material/MenuItem";
// import AdbIcon from "@mui/icons-material/Adb";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../../features/auth/authSlice";
// import {
//   TextField,
//   Skeleton,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { searchUser } from "../../features/search/searchAction";
// import { useEffect, useState } from "react";
// import { acceptedFriendRequest, sendFriendRequested, unfriendSendRequest } from "../../features/friendRequest/friendRequestAction";

// const pages = ["Home", "Create-Post", "Friends"];
// const settings = ["Profile", "Logout"];

// function Navbar() {
//   const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
//   const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
//   const [searchQuery, setSearchQuery] = React.useState<string>("");
//   const [error, setError] = useState<string | null>(null);

//   const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { users, loading } = useSelector((state: any) => state.search);

//   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
//   const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
//   const handleCloseNavMenu = () => setAnchorElNav(null);
//   const handleCloseUserMenu = () => setAnchorElUser(null);

//   const logoutNavbar = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     dispatch(logout());
//     navigate("/login");
//   };

//   const handleNavigation = (page: string) => {
//     const routes: { [key: string]: string } = {
//       Home: "/",
//       "Create-Post": "/create-post",
//       Friends: "/friends"
//     };
//     navigate(routes[page] || "/");
//     handleCloseNavMenu();
//   };

//   const handleUserMenuNavigation = (setting: string) => {
//     if (setting === "Profile") navigate("/profile");
//     else if (setting === "Logout") logoutNavbar();
//     handleCloseUserMenu();
//   };

//   const handleSearchSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     if (searchQuery.trim()) {
//       dispatch(searchUser(searchQuery));
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchQuery.trim()) dispatch(searchUser(searchQuery));
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchQuery, dispatch]);

//   useEffect(() => {
//     if (error) {
//       setTimeout(() => setError(null), 3000);
//     }
//   }, [error]);

//   const sendFriendRequest = (receiverId: number) => {
//     dispatch(sendFriendRequested(receiverId));
//   };

//   const acceptFriendRequest = (friendRequestId: number) => {
//     dispatch(acceptedFriendRequest(friendRequestId));
//   };

//   const sendUnfriendRequest = (friendId: number) => {
//     dispatch(unfriendSendRequest(friendId));
//     setSearchQuery("");
//   };

//   return (
//     <AppBar position="static">
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>
//           {/* Logo */}
//           <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
//           <Typography
//             variant="h6"
//             noWrap
//             component="a"
//             href="#"
//             sx={{
//               mr: 2,
//               display: { xs: "none", md: "flex" },
//               fontFamily: "monospace",
//               fontWeight: 700,
//               letterSpacing: ".3rem",
//               color: "inherit",
//               textDecoration: "none",
//             }}
//           >
//             LOGO
//           </Typography>

//           <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
//             <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
//               <MenuIcon />
//             </IconButton>
//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorElNav}
//               open={Boolean(anchorElNav)}
//               onClose={handleCloseNavMenu}
//               sx={{ display: { xs: "block", md: "none" } }}
//             >
//               {pages.map((page) => (
//                 <MenuItem key={page} onClick={() => handleNavigation(page)}>
//                   <Typography textAlign="center">{page}</Typography>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>

//           <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, position: "relative" }}>
//             <form onSubmit={handleSearchSubmit}>
//               <TextField
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 label="Search Users"
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "white", borderRadius: 1, marginRight: 2 }}
//               />
//             </form>

//             {searchQuery && (
//               <Box sx={{ position: "absolute", top: 50, left: 0, right: 0, zIndex: 10, backgroundColor: "#fff", border: "1px solid #ccc", maxHeight: 300, overflowY: "auto", boxShadow: "0px 4px 20px rgba(0,0,0,0.1)" }}>
//                 {loading ? (
//                   <Skeleton variant="rectangular" width="100%" height={200} />
//                 ) : users.length > 0 ? (
//                   <List>
//                     {users.map((user: any) => (
//                       <ListItem
//                         button
//                         key={user._id}
//                         onClick={() => navigate(`/profile/${user._id}`)}
//                         sx={{ "&:hover": { backgroundColor: "#f5f5f5" }, borderBottom: "1px solid #eee", alignItems: "center" }}
//                       >
//                         {user.profile && (
//                           <ListItemAvatar>
//                             <Avatar src={user.profile} alt={user.username} />
//                           </ListItemAvatar>
//                         )}
//                         <ListItemText
//                           primary={<Typography sx={{ color: "#000", fontWeight: 500 }}>{user.username}</Typography>}
//                           secondary={<Typography sx={{ color: "#666", fontSize: "0.875rem" }}>{user.email}</Typography>}
//                         />
//                         <Button
//                           variant={user.friendRequestStatus === "sent:accepted" ? "contained" : "outlined"}
//                           color={user.friendRequestStatus === "sent:accepted" ? "primary" : "warning"}
//                           onClick={() => {
//                             if (user.friendRequestStatus === "sent:accepted") sendUnfriendRequest(user.user_id);
//                             else if (user.friendRequestStatus === "received:pending") acceptFriendRequest(user.friendRequestId);
//                             else sendFriendRequest(user.user_id);
//                           }}
//                           sx={{ ml: 2 }}
//                         >
//                           {user.friendRequestStatus === "sent:accepted" ? "Unfriend" : user.friendRequestStatus === "received:pending" ? "Accept" : "Send Request"}
//                         </Button>
//                       </ListItem>
//                     ))}
//                   </List>
//                 ) : (
//                   <Box sx={{ padding: 2, textAlign: "center" }}>
//                     <Typography>No users found</Typography>
//                   </Box>
//                 )}
//               </Box>
//             )}
//           </Box>

//           <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
//             {pages.map((page) => (
//               <Button key={page} onClick={() => handleNavigation(page)} sx={{ my: 2, color: "white", display: "block" }}>
//                 {page}
//               </Button>
//             ))}
//           </Box>

//           {isAuthenticated && (
//             <Box sx={{ flexGrow: 0 }}>
//               <Tooltip title="Open settings">
//                 <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                   <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
//                 </IconButton>
//               </Tooltip>
//               <Menu
//                 sx={{ mt: "45px" }}
//                 anchorEl={anchorElUser}
//                 open={Boolean(anchorElUser)}
//                 onClose={handleCloseUserMenu}
//               >
//                 {settings.map((setting) => (
//                   <MenuItem key={setting} onClick={() => handleUserMenuNavigation(setting)}>
//                     <Typography textAlign="center">{setting}</Typography>
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </Box>
//           )}
//         </Toolbar>
//       </Container>

//       {error && (
//         <Snackbar open={true} autoHideDuration={6000} onClose={() => setError(null)}>
//           <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
//             {error}
//           </Alert>
//         </Snackbar>
//       )}
//     </AppBar>
//   );
// }

// export default Navbar;

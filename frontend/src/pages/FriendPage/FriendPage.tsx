// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   acceptedFriendRequest,
//   getAllUser,
//   sendFriendRequestedToUser,
//   deleteFriendRequest,
// } from "../../features/friendRequest/friendRequestAction";
// import {
//   Avatar,
//   Box,
//   Button,
//   Typography,
//   Card,
//   CardContent,
// } from "@mui/material";

// function FriendPage() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getAllUser());
//   }, [dispatch]);

//   const { users } = useSelector((state: any) => state.friendRequest);

//   const sentFriendRequestToUser = (receiverId: number) => {
//     dispatch(sendFriendRequestedToUser(receiverId));
//   };

//   const handleAcceptRequest = (friendRequestId: number) => {
//     dispatch(acceptedFriendRequest(friendRequestId));
//   };

//   const handleDeleteRequest = (friendRequestId: number) => {
    
//     dispatch(deleteFriendRequest(friendRequestId));
//   };

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h4" component="h1" gutterBottom align="center">
//         Friends List
//       </Typography>

//       <Box>
//         {users?.map((user: any) => (
//           <Card
//             key={user.user_id}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 2,
//               mb: 2,
//               borderRadius: 2,
//               boxShadow: 2,
//               padding: 2,
//               backgroundColor: "#f9f9f9",
//               transition: "transform 0.2s",
//               "&:hover": { transform: "scale(1.05)" }, // Slight hover effect
//             }}
//           >
//             <Avatar
//               src={user.profile}
//               alt={user.username}
//               sx={{ width: 56, height: 56 }}
//             />

//             <Box sx={{ flex: 1 }}>
//               <Typography variant="h6">
//                 {user.first_name} {user.last_name}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 @{user.username}
//               </Typography>
//             </Box>

//             {/* Conditional Buttons */}
//             {user.friendshipStatus === "none" && (
//               <Button
//                 onClick={() => sentFriendRequestToUser(user.user_id)}
//                 variant="contained"
//                 color="primary"
//                 size="small"
//               >
//                 Add Friend
//               </Button>
//             )}

//             {user.friendshipStatus === "pending_sent" && (
//               <Button variant="contained" color="primary" size="small">
//                 Request Sent
//               </Button>
//             )}

//             {user.friendshipStatus === "pending" && (
//               <Button variant="contained" color="primary" size="small">
//                 Request Sent
//               </Button>
//             )}

//             {/* {user.friendshipStatus === "friends" && (
//               <Button 
//               variant="contained" color="secondary" size="small">
//                 Remove Friend
//               </Button>
//             )} */}

//             {user.friendshipStatus === "pending_received" && (
//               <Box sx={{ display: "flex", gap: 1 }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   size="small"
//                   onClick={() => handleAcceptRequest(user.requestId)}
//                 >
//                   Accept Request
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   size="small"
//                   onClick={() => handleDeleteRequest(user.requestId)}
//                 >
//                   Delete Request
//                 </Button>
//               </Box>
//             )}
//           </Card>
//         ))}
//       </Box>
//     </Box>
//   );
// }

// export default FriendPage;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptedFriendRequest,
  getAllUser,
  sendFriendRequestedToUser,
  deleteFriendRequest,
} from "../../features/friendRequest/friendRequestAction";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Card,
  Tabs,
  Tab,
} from "@mui/material";
import UserCard from "./UseCard";

function FriendPage() {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("friends"); 

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  const { users } = useSelector((state: any) => state.friendRequest);

  const sentFriendRequestToUser = (receiverId: number) => {
    dispatch(sendFriendRequestedToUser(receiverId));
  };

  const handleAcceptRequest = (friendRequestId: number) => {
    dispatch(acceptedFriendRequest(friendRequestId));
  };

  const handleDeleteRequest = (friendRequestId: number) => {
    dispatch(deleteFriendRequest(friendRequestId));
  };

  const filteredUsers = {
    friends: users?.filter((user: any) => user.friendshipStatus === "friends"),
    sent: users?.filter((user: any) => user.friendshipStatus === "pending_sent"),
    received: users?.filter((user: any) => user.friendshipStatus === "pending_received"),
    suggestions: users?.filter((user: any) => user.friendshipStatus === "none"),
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Friends Page
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        centered
        sx={{ marginBottom: 3 }}
      >
        <Tab label="Friends" value="friends" />
        <Tab label="Sent Requests" value="sent" />
        <Tab label="Received Requests" value="received" />
        <Tab label="Suggestions" value="suggestions" />
      </Tabs>

      <Box>
        {filteredUsers[selectedTab]?.length > 0 ? (
          filteredUsers[selectedTab].map((user: any) => (
            <UserCard
              key={user.user_id}
              user={user}
              sentFriendRequestToUser={sentFriendRequestToUser}
              handleAcceptRequest={handleAcceptRequest}
              handleDeleteRequest={handleDeleteRequest}
            />
          ))
        ) : (
          <Typography variant="body1" align="center" color="text.secondary">
            No users found in this category.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default FriendPage;




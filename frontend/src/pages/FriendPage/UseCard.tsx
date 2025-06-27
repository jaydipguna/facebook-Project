import React from "react";
import { Avatar, Box, Button, Typography, Card } from "@mui/material";

interface UserCardProps {
  user: any;
  sentFriendRequestToUser: (id: number) => void;
  handleAcceptRequest: (id: number) => void;
  handleDeleteRequest: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  sentFriendRequestToUser,
  handleAcceptRequest,
  handleDeleteRequest,
}) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2,
        borderRadius: 2,
        boxShadow: 2,
        padding: 2,
        backgroundColor: "#f9f9f9",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      <Avatar
        src={user.profile}
        alt={user.username}
        sx={{ width: 56, height: 56 }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          @{user.username}
        </Typography>
      </Box>

      {user.friendshipStatus === "none" && (
        <Button
          onClick={() => sentFriendRequestToUser(user.user_id)}
          variant="contained"
          color="primary"
          size="small"
        >
          Add Friend
        </Button>
      )}

      {user.friendshipStatus === "pending_sent" && (
        <Button variant="contained" color="info" size="small" disabled>
          Request Sent
        </Button>
      )}

      {user.friendshipStatus === "friends" && (
        <Button variant="contained" color="success" size="small" disabled>
          Friends
        </Button>
      )}

      {user.friendshipStatus === "pending_received" && (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleAcceptRequest(user.requestId)}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDeleteRequest(user.requestId)}
          >
            Delete
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default UserCard;

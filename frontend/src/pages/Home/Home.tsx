

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriendPosts } from "../../features/friendPost/friendPostAction";
import { Box, Typography } from "@mui/material";
import PostCard from "./PostCard";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, posts } = useSelector((state) => state.friendPosts);
  console.log(" posts", posts);
  

  useEffect(() => {
    dispatch(fetchFriendPosts());
  }, [dispatch]);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 450, margin: "0 auto", mt: 4 }}>
      {posts.map((post) => (
        <PostCard key={post.post_id} post={post} />
      ))}
    </Box>
  );
};

export default Home;

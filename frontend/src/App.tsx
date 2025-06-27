import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import React from "react";
import UserProfilePage from "./pages/UserPage/UserProfilePage";
import CreatePost from "./pages/PostPage/CreatePost";
import FriendPage from "./pages/FriendPage/FriendPage";
import PostDetailPage from "./pages/PostPage/PostDetailPage";
import ForgotPassword from "./pages/ForgotPassword";
import FriendProfilePage from "./pages/FriendPage/FriendProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
            <Route path="/friends" element={<FriendPage />} />
            <Route path="/friend-profile/:friendId" element={<FriendProfilePage />} />



          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          
          <Route path="*" element={"Page not found"} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

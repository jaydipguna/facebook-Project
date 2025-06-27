import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postReducer from "../features/post/postSlice";
import profileReducer from "../features/Profile/profileSlice";
import searchReducer from "../features/search/searchSlice";
import  friendRequestReducer from '../features/friendRequest/friendRequestsSlice'
import friendPostsReducer from '../features/friendPost/friendPostSlice'
import friendProfileReducer from '../features/friendProfile/friendProfileSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    profile: profileReducer,
    search: searchReducer,
    friendRequest: friendRequestReducer,
    friendPosts:friendPostsReducer,
    friendProfile: friendProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

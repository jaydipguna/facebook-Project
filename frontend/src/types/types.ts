export interface Post {
    _id: string;
    caption: string;
    imageUrl?: string;
    createdAt: string;
    user: {
      _id: string;
      username: string;
    };
  }
  
  export interface IUser {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    bio?: string;
    profile?: string; 
  }
  
  export interface IFriends{
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile?: string; 

  }
  export interface FriendPost {
    post_id: number;
    content: string;
    createdAt: string;
    user: {
      user_id: number;
      username: string;
      profile: string;
    };
    comments: {
      comment_id: number | string;
      user_id: number | string;
      content: string;
      createdAt: string;
      User?: { username: string };
    }[];
    likes: { user_id: number }[];
  }
  export interface IFriendProfileState {
    profile: IUser | null;
    loading: boolean;
    error: string | null;
    friends: IUser[];
    posts: IPost[];
  }
  export interface IFriendState {
    users: IUser[];
    loading: boolean;
    error: string | null;
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }
  export interface Post {
    _id: string;
    caption: string;
    imageUrl?: string;
    createdAt: string;
    user: {
      _id: string;
      username: string;
    };
    likes: { userId: string }[];
    comments?: {
      commentId: string;
      userId: string;
      content: string;
      username: string;
      createdAt: string;
    }[];
  }
  
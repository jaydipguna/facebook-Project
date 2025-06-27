export interface IUser {
    user_id: number;
    username: string;
    email: string;
    password: string; 
    first_name: string;
    last_name: string;
    profile: string;
    bio: string;
    reset_otp: string;
    reset_otp_expires: Date;
  }
  
  export interface IPost {
    post_id: number;
    user_id: number;
    caption: string;
    PostImages?: IPostImage[];
  }
  

export interface IComment {
    comment_id: number;  
    content: string; 
    created_at: Date;
    updated_at: Date;
    post_id: number;
    user_id: number;
  }
  
  export interface IFriendRequest {
    friendrequest_id: number;
    sender_id: number;
    receiver_id: number;
    status: 'pending' | 'accepted' | 'rejected';
  }
  
  export interface IPostImage {
    postImage_id: number;
    post_id: number;
    image_url: string;
  }
export interface IPostLike {
    postlike_id: number;
    user_id: number;
    post_id: number;
  }
  export class Post extends Model {
    public post_id!: number;
    public user_id!: number;
    public caption!: string;
  }
  export interface IUserData {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    profile: string;
    reset_otp: number;
    reset_otp_expires: number;
    password: string;
    biots?: number; 
  }
  
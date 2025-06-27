import api from "../../services/api";
import { login, signup } from "./authSlice";

interface SignupData {
  username: string;
  email: string;
  password: string;
}

export const signupUser = (userInfo: SignupData) => async (dispatch: any) => {
  console.log("Inside signupUser - userInfo:", userInfo);

  try {
    const response = await api.post("/auth/signup", userInfo);
    console.log("Signup API response:", response);

    if (response.token) {
      localStorage.setItem("token", response.token);
      dispatch(signup(response));
    }

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};
export const loginUser = (loginData: LoginData) => async (dispatch: any) => {
  console.log("Inside loginUser - loginData:", loginData);

  try {
    const response = await api.post("/auth/login", {
      emailorUsername: loginData.email,
      password: loginData.password,
    });

    if (response.token) {
      localStorage.setItem("token", response.token);
      dispatch(login(response.user));
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
export const  forgotPassword = (email: string) => async (dispatch: any) => {
  console.log("email", email);
  try {
    const response=await api.post("/auth/forgot-password",{
      email:email
    })
    console.log("response",response);
    
  } catch (error) {}
};

export const resetPassword=({ email, otp, newPassword })=>async(dispatch:any)=>{
  console.log(" email, otp, newPassword", email, otp, newPassword);
  try {
    const response=await api.post("/auth/reset-password",{
      email:email,
      otp:otp,
      newPassword:newPassword
    })
    console.log("response",response);
    
  } catch (error) {
    
  }
  
}
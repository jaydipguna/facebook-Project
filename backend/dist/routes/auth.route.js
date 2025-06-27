import { Router } from "express";
import { forgotPassword, login, resetPassword, signup, verifyOtp, } from "../controllers/auth.controller.js";
const authRouter = Router();
authRouter.post("/signup", 
//  validate(signupSchema),
signup);
authRouter.post("/login", 
// validate(loginSchema),
login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);
export default authRouter;

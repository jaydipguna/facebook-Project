import { Router } from "express";

import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  verifyOtp,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  signup
);

authRouter.post(
  "/login",
  login
);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/verify-otp", verifyOtp);

authRouter.post("/reset-password", resetPassword);

export default authRouter;

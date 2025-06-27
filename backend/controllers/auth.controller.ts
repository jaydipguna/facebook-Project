import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/passwordHelper";
import { generateToken } from "../utils/jwt.utils";
import userService from "../services/user.service";
import transporter from "../config/nodemailer.config";
import asyncHandler from "../utils/asyncHandler";

// Auth API
export const signup = asyncHandler(async (req: any, res: Response) => {
  const { username, email, password, first_name, last_name } = req.body;
  console.log("username", username, email, password);

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password fields are required",
      });
    }

    const existingUser = await userService.findUserByEmailOrUsername(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await userService.createUser({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
      profile: req.body.profile,
      reset_otp: 0,
      reset_otp_expires: 0,
    });

    const token = generateToken({ userId: user.user_id });

    return res.status(201).json({
      message: "User created successfully",
      user: { ...user.toJSON(), password: undefined },
      token,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { emailorUsername, password } = req.body;
  console.log("emailorUsername", emailorUsername);

  try {
    const user = await userService.findUserByEmailOrUsername(emailorUsername);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or username" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken({ userId: user.user_id });

    return res.status(200).json({
      message: "Login successful",
      user: { ...user.toJSON(), password: undefined },
      token,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Auth forgotPassword and resetPassword
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    console.log("email", email);

    try {
      const user = await userService.findUserByEmailOrUsername(email);
      if (!user) return res.status(404).json({ error: "User not found" });
      console.log("user", user);

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      console.log("otp", otp);

      await userService.updateUser(user.user_id, {
        reset_otp: otp,
        reset_otp_expires: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
      });

      await transporter.sendMail({
        from: `"Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset OTP",
        html: `
        <p>Hello ${user.username},</p>
        <p>Your password reset OTP is: <strong>${otp}</strong></p>
        <p>It will expire in 10 minutes.</p>
      `,
      });

      return res.status(200).json({ message: "OTP sent to email" });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await userService.verifyResetOtp(email, otp);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err: any) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    console.log("email, otp, newPassword",email, otp, newPassword);
    

    try {
      const user = await userService.verifyResetOtp(email, otp);
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      const hashedPassword = await hashPassword(newPassword);

      await userService.updateUser(user.user_id, {
        password: hashedPassword,
        reset_otp: 0, // Set reset_otp to null
        reset_otp_expires: 0, // Set reset_otp_expires to null as well
      });

      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error: any) {
      console.error("Reset password error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

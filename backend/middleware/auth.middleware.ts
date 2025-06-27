import { Request, Response, NextFunction } from "express";
import { verifyJwtToken } from "../utils/jwt.utils"; // Adjust import based on your setup
import asyncHandler from "../utils/asyncHandler";



export const UserAuthorization = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      console.log("Token:", token);

      const decoded = verifyJwtToken(token);
      console.log("Decoded:", decoded);

      req.user = decoded; 

      next(); 
    } catch (error) {
      // console.error("Auth error:", error.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  }
);

export default UserAuthorization;

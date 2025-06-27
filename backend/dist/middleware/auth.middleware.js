import { verifyJwtToken } from "../utils/jwt.utils"; // Adjust import based on your setup
import asyncHandler from '../utils/asyncHandler';
// interface DecodedToken {
//   user_id: number;
//   username: string;
//   email: string;
//   // Add other properties from the decoded token as necessary
// }
export const UserAuthorization = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        console.log("Token:", token);
        const decoded = verifyJwtToken(token);
        console.log("Decoded:", decoded);
        req.user = decoded; // Adding decoded user info to the request object
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        // console.error("Auth error:", error.message);
        return res.status(401).json({ message: "Invalid token" });
    }
});
export default UserAuthorization;

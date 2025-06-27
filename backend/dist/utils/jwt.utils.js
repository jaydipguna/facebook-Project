import jwt from "jsonwebtoken";
// Ensure JWT_SECRET is available in the environment
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}
// Generate JWT token
export const generateToken = (payload, expiresIn = "1d") => {
    // const options: SignOptions = { expiresIn  }; // Pass the string directly (e.g., "1d")
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }); // jwt.sign supports string directly
};
// Verify JWT token
export const verifyJwtToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        console.error("JWT verification failed:", error);
        return;
    }
};

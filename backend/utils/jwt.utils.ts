import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export interface JwtPayloadType extends JwtPayload {
  userId: number;  
}

export const generateToken = (payload: JwtPayloadType): string => {
  return jwt.sign(payload, JWT_SECRET,{ expiresIn: '1d' } ); 
};

export const verifyJwtToken = (token: string): JwtPayloadType  | undefined=> {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayloadType;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return;
  }
};

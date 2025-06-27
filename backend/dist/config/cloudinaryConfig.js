import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
// Load environment variables from the .env file
dotenv.config();
// Ensure the environment variables are properly typed
const cloudinaryEnvConfig = process.env;
// Configure Cloudinary
cloudinary.config({
    cloud_name: cloudinaryEnvConfig.CLOUDINARY_CLOUD_NAME,
    api_key: cloudinaryEnvConfig.CLOUDINARY_API_KEY,
    api_secret: cloudinaryEnvConfig.CLOUDINARY_API_SECRET,
});
export default cloudinary;

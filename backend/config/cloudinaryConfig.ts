import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

interface CloudinaryEnvConfig {
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

const cloudinaryEnvConfig: CloudinaryEnvConfig = process.env as unknown as CloudinaryEnvConfig;

cloudinary.config({
  cloud_name: cloudinaryEnvConfig.CLOUDINARY_CLOUD_NAME,
  api_key: cloudinaryEnvConfig.CLOUDINARY_API_KEY,
  api_secret: cloudinaryEnvConfig.CLOUDINARY_API_SECRET,
});

export default cloudinary;

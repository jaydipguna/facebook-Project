import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// Load environment variables from the .env file
dotenv.config();
// Ensure the environment variables are correctly typed
const emailEnvConfig = process.env;
// Create a nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailEnvConfig.EMAIL_USER,
        pass: emailEnvConfig.EMAIL_PASS,
    },
});
export default transporter;

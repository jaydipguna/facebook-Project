import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();

interface EmailEnvConfig {
  EMAIL_USER: string;
  EMAIL_PASS: string;
}

const emailEnvConfig: EmailEnvConfig = process.env as unknown as EmailEnvConfig;

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailEnvConfig.EMAIL_USER,
    pass: emailEnvConfig.EMAIL_PASS,
  },
});

export default transporter;

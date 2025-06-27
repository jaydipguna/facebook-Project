import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  DB_HOST: string;
}

const envConfig: EnvConfig = process.env as unknown as EnvConfig;

const sequelize = new Sequelize(envConfig.DB_NAME, envConfig.DB_USER, envConfig.DB_PASS, {
  host: envConfig.DB_HOST,
  dialect: 'postgres',
  logging: false,
});

export default sequelize;

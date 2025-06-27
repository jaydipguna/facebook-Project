import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
// Load environment variables from the .env file
dotenv.config();
const envConfig = process.env;
// Create Sequelize instance with environment variables
const sequelize = new Sequelize(envConfig.DB_NAME, envConfig.DB_USER, envConfig.DB_PASS, {
    host: envConfig.DB_HOST,
    dialect: 'postgres',
    logging: false,
});
export default sequelize;

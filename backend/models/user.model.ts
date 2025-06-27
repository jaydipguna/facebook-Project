// models/User.ts

import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import sequelize from '../config/dbConfig.js';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  static countDocuments(arg0: { $or: ({ username: { $regex: string; $options: string; }; } | { first_name: { $regex: string; $options: string; }; } | { last_name: { $regex: string; $options: string; }; } | { email: { $regex: string; $options: string; }; })[]; }) {
    throw new Error("Method not implemented.");
  }
  declare user_id: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare first_name: string;
  declare last_name: string;                                                                                                                                
  declare profile: string;
  declare bio: string;
  declare reset_otp: string | null;
  declare reset_otp_expires: Date | null;
}

// Define the model attributes directly inside init
User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    profile: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    reset_otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_otp_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export default User;

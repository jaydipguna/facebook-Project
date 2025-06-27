
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/dbConfig';

export class Post extends Model {}

Post.init(
  {
    post_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    caption: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true, 
  }
);
export default Post;

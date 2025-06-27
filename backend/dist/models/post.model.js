import { DataTypes, Model } from "sequelize";
import sequelize from "../config/dbConfig.js"; // Adjust path as needed
// Define the Post model class
class Post extends Model {
    post_id;
    user_id;
    caption;
    PostImages;
}
// Initialize the Post model
Post.init({
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    caption: {
        type: DataTypes.STRING,
        allowNull: true, // Assuming it's not required, change to false if needed
    },
}, {
    sequelize, // Sequelize instance
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` timestamps
    underscored: true, // Converts camelCase to snake_case in the database (e.g., `userId` => `user_id`)
});
export default Post;

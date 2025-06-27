import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbConfig.js'; // Adjust the path as needed
// Define the PostLike model class
class PostLike extends Model {
    postlike_id;
    user_id;
    post_id;
}
// Initialize the PostLike model
PostLike.init({
    postlike_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize, // Sequelize instance
    modelName: 'PostLike',
    tableName: 'post_likes',
    timestamps: true,
    underscored: true,
});
export default PostLike;

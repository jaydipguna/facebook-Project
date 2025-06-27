import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbConfig.js'; // Adjust path as needed
// Define the PostImage model class
class PostImage extends Model {
    postImage_id;
    post_id;
    image_url;
}
// Initialize the PostImage model
PostImage.init({
    postImage_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.TEXT, // Sequelize maps `TEXT` to `string` in JavaScript/TypeScript
        allowNull: false,
    },
}, {
    sequelize, // Sequelize instance
    modelName: 'PostImage',
    tableName: 'post_images',
    timestamps: true,
    underscored: true,
});
export default PostImage;

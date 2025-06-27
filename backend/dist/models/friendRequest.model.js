import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbConfig.js'; // Adjust the path as needed
// Define the FriendRequest model class
class FriendRequest extends Model {
    friendrequest_id;
    sender_id;
    receiver_id;
    status;
}
// Initialize the FriendRequest model
FriendRequest.init({
    friendrequest_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // Default value for new records
    },
}, {
    sequelize, // Sequelize instance
    modelName: 'FriendRequest',
    tableName: 'friend_requests',
    timestamps: true, // Adds createdAt and updatedAt fields
    underscored: true, // Converts camelCase to snake_case for column names in the DB
});
// Define the associations
export default FriendRequest;

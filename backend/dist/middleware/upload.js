import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig'; // Ensure correct import for your cloudinary config
// Define allowed file types
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
// File filter function with types
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // No error, allow the file
    }
    else {
        const error = new Error('Only .jpeg, .jpg, .png files are allowed');
        cb(null, false); // Pass the error to the callback correctly
    }
};
const uploadImage = ({ folderName, getPublicIdFn }) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => {
            const defaultPublicId = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
            return {
                folder: folderName,
                allowed_formats: ['jpg', 'jpeg', 'png'],
                public_id: getPublicIdFn ? getPublicIdFn(req, file) : defaultPublicId,
                overwrite: true,
            };
        },
    });
    return multer({ storage }); // assuming multer is imported
};
export default uploadImage;

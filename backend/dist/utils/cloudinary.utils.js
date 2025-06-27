import { v2 as cloudinary } from 'cloudinary';
export const extractPublicId = (imageUrl) => {
    try {
        const url = new URL(imageUrl);
        const path = url.pathname;
        const match = path.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
        if (!match || !match[1]) {
            console.error("Invalid Cloudinary URL format:", imageUrl);
            return null;
        }
        return match[1];
    }
    catch (err) {
        console.error("Error parsing Cloudinary URL:", imageUrl, err);
        return null;
    }
};
export const deleteImageFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted from Cloudinary:", publicId, "→", result);
        return result;
    }
    catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
        throw new Error("Error deleting image from Cloudinary");
    }
};

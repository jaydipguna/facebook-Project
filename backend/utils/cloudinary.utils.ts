import { v2 as cloudinary } from 'cloudinary';

/**
 * Extracts the public ID from a Cloudinary image URL.
 * Returns null if the URL is invalid or doesn't match the expected pattern.
 */
export const extractPublicId = (imageUrl: string | undefined | null): string | null => {
  if (!imageUrl) {
    console.error("Image URL is missing or undefined.");
    return null;
  }

  try {
    const url = new URL(imageUrl);
    const path = url.pathname;
    // Matches /upload/v123456789/myfolder/myimage.jpg
    const match = path.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);

    if (!match || !match[1]) {
      console.error("Invalid Cloudinary URL format:", imageUrl);
      return null;
    }

    return match[1]; // publicId (e.g., 'myfolder/myimage')
  } catch (err) {
    console.error("Error parsing Cloudinary URL:", imageUrl, err);
    return null;
  }
};


export const deleteImageFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from Cloudinary:", publicId, "→", result);
    return result;
  } catch (err) {
    console.error("Error deleting image from Cloudinary:", err);
    throw new Error("Error deleting image from Cloudinary");
  }
};

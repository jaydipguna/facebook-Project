import multer, { FileFilterCallback } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig'; // Ensure correct import for your cloudinary config
import { Request, Response, NextFunction } from 'express';

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const fileFilter: multer.Options['fileFilter'] = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Only .jpeg, .jpg, .png files are allowed');
    cb(null, false); 
  }
};

interface UploadImageOptions {
  folderName: string;
  getPublicIdFn?: (req: Request, file: Express.Multer.File) => string;
}

const uploadImage = ({ folderName, getPublicIdFn }: UploadImageOptions) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: Request, file: Express.Multer.File) => {
      const defaultPublicId = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;

      return {
        folder: folderName,
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: getPublicIdFn ? getPublicIdFn(req, file) : defaultPublicId,
        overwrite: true,
      };
    },
  });

  return multer({ storage,fileFilter:fileFilter }); 
};

export default uploadImage;
// import multer, { FileFilterCallback } from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from '../config/cloudinaryConfig'; // Ensure correct import for your cloudinary config
// import { Request, Response, NextFunction } from 'express';

// const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

// const fileFilter: multer.Options['fileFilter'] = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     const error = new Error('Only .jpeg, .jpg, .png files are allowed');
//     cb(error, false); 
//   }
// };

// interface UploadImageOptions {
//   folderName: string;
//   getPublicIdFn?: (req: Request, file: Express.Multer.File) => string;
// }

// const uploadImage = ({ folderName, getPublicIdFn }: UploadImageOptions) => {
//   const storage = new CloudinaryStorage({
//     cloudinary,
//     params: async (req: Request, file: Express.Multer.File) => {
//       const defaultPublicId = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;

//       return {
//         folder: folderName,
//         allowed_formats: ['jpg', 'jpeg', 'png'],
//         public_id: getPublicIdFn ? getPublicIdFn(req, file) : defaultPublicId,
//         overwrite: true,
//       };
//     },
//   });

//   return multer({ storage, fileFilter });
// };

// const uploadMultipleImages = (folderName: string, getPublicIdFn?: (req: Request, file: Express.Multer.File) => string) => {
//   const upload = uploadImage({ folderName, getPublicIdFn });

//   return upload.array('files', 10); /
// };

// export default uploadMultipleImages;


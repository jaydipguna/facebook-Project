// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { createPost } from "../../features/post/PostAction";
// import { useDispatch } from "react-redux";
// import { Snackbar } from "@mui/material";
// import { Alert } from "@mui/material";
// interface IFormInput {
//   caption: string;
// }

// const CreatePost: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<IFormInput>();

//   const [files, setFiles] = useState<File[]>([]);
//   const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//   const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
//   const [snackbarMessage, setSnackbarMessage] = useState<string>("");

//   const dispatch = useDispatch();
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = e.target.files;
//     if (selectedFiles) {
//       const fileArray = Array.from(selectedFiles);
//       setFiles(fileArray);

//       const previews = fileArray.map((file) => URL.createObjectURL(file));
//       setPreviewUrls(previews);
//     }
//   };

//   const onSubmit = async (data: IFormInput) => {
//     const formData = new FormData();
//     formData.append("caption", data.caption);
//     files.forEach((file) => {
//       formData.append("images", file);
//     });

//     console.log("FormData contents:");
//     for (const [key, value] of formData.entries()) {
//       console.log(`${key}:`, value);
//     }

//     try {
//       const result = await dispatch(createPost(formData));
//       console.log("result", result);
//       if (result.post) {
//         setSnackbarMessage("Post created successfully!");
//         setOpenSnackbar(true);
//       } else {
//         setSnackbarMessage(`Post not-created ${result.error}`);
//       }
//     } catch (error) {
//       console.log("Error:", error);

//       setSnackbarMessage("Error creating post.");
//       setOpenSnackbar(true);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h1 className="text-2xl font-semibold text-center mb-6">
//         Create a New Post
//       </h1>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="mb-4 mt-5">
//           <label
//             htmlFor="image"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Upload Images
//           </label>
//           <input
//             id="image"
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleFileChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {previewUrls.length > 0 && (
//           <div className="mb-4 overflow-x-auto whitespace-nowrap flex gap-4">
//             {previewUrls.map((url, index) => (
//               <img
//                 key={index}
//                 src={url}
//                 alt={`Preview ${index + 1}`}
//                 className="h-64 w-auto rounded-md border border-gray-300"
//               />
//             ))}
//           </div>
//         )}

//         {/* Caption */}
//         <div className="mb-4">
//           <label
//             htmlFor="caption"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Caption
//           </label>
//           <input
//             id="caption"
//             {...register("caption", { required: "Caption is required" })}
//             type="text"
//             placeholder="Enter your post caption"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.caption && (
//             <span className="text-sm text-red-500">
//               {errors.caption.message}
//             </span>
//           )}
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Create Post
//         </button>
//       </form>

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={
//             snackbarMessage === "Post created successfully!"
//               ? "success"
//               : "error"
//           }
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default CreatePost;
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createPost, updatedPost, 
  // updatePost
 } from "../../features/post/PostAction";
import { useDispatch } from "react-redux";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";

interface IFormInput {
  caption: string;
}

interface CreatePostProps {
  post?: any; // If editing, pass the post data to the component
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ post, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>();

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const dispatch = useDispatch();

  // Effect to pre-fill the form when editing a post
  useEffect(() => {
    if (post) {
      setValue("caption", post.caption);
      setPreviewUrls(post.PostImages?.map((img: any) => img.image_url) || []);
    }
  }, [post, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);

      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls(previews);
    }
  };

  const onSubmit = async (data: IFormInput) => {
    const formData = new FormData();
    formData.append("caption", data.caption);
    files.forEach((file) => {
      formData.append("images", file);
    });

    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      let result;
      if (post) {
        result = await dispatch(updatedPost(post.post_id, formData));
      } else {
        result = await dispatch(createPost(formData));
      }

      if (result?.post) {
        setSnackbarMessage(post ? "Post updated successfully!" : "Post created successfully!");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(`Error: ${result?.error || "Unknown error"}`);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.log("Error:", error);
      setSnackbarMessage("Error creating/updating post.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    onClose(); // Close the form once the snackbar disappears
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">
        {post ? "Edit Post" : "Create a New Post"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 mt-5">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Upload Images
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {previewUrls.length > 0 && (
          <div className="mb-4 overflow-x-auto whitespace-nowrap flex gap-4">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-64 w-auto rounded-md border border-gray-300"
              />
            ))}
          </div>
        )}

        {/* Caption */}
        <div className="mb-4">
          <label
            htmlFor="caption"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Caption
          </label>
          <input
            id="caption"
            {...register("caption", { required: "Caption is required" })}
            type="text"
            placeholder="Enter your post caption"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.caption && (
            <span className="text-sm text-red-500">
              {errors.caption.message}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {post ? "Save Changes" : "Create Post"}
        </button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarMessage.includes("success") ? "success" : "error"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreatePost;

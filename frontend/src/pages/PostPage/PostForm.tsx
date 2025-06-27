import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Snackbar, Alert, Button, Box, TextField } from "@mui/material";

interface IFormInput {
  caption: string;
}

interface PostFormProps {
  onSubmit: (data: FormData) => void;
  existingPost?: any;
  isEdit?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ onSubmit, existingPost, isEdit = false }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<IFormInput>();
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<any[]>([]);

  useEffect(() => {
    if (isEdit && existingPost) {
      setValue("caption", existingPost.caption);
      setOldImages(existingPost.PostImages || []);
      setPreviewUrls(existingPost.PostImages?.map((img: any) => img.image_url) || []);
    }
  }, [isEdit, existingPost, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);

      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...previews]);
    }
  };

  const handleRemoveOldImage = (imageId: number) => {
    setOldImages((prevImages) => prevImages.filter((img: any) => img.id !== imageId));
  };

  const onFormSubmit = (data: IFormInput) => {
    const formData = new FormData();
    formData.append("caption", data.caption);

    // Append new images
    files.forEach((file) => formData.append("images", file));

    // Append remaining old image IDs (after deletion)
    if (isEdit) {
      const oldImageIds = oldImages.map((img) => img.id);
      formData.append("oldImageIds", JSON.stringify(oldImageIds));
      formData.append("postId", existingPost.id); // Required to update post
    }

    onSubmit(formData);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <h1>{isEdit ? "Edit Post" : "Create Post"}</h1>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Display Old Images */}
        {isEdit && oldImages.length > 0 && (
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            {oldImages.map((image: any) => (
              <Box key={image.id} sx={{ position: "relative" }}>
                <img
                  src={image.image_url}
                  alt="Old"
                  className="h-32 w-auto rounded-md"
                />
                <Button
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    fontSize: "10px",
                  }}
                  onClick={() => handleRemoveOldImage(image.id)}
                >
                  ✕
                </Button>
              </Box>
            ))}
          </Box>
        )}

        {/* Upload New Images */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

        {/* Previews */}
        {previewUrls.length > 0 && (
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-32 w-auto rounded-md"
              />
            ))}
          </Box>
        )}

        {/* Caption */}
        <TextField
          label="Caption"
          variant="outlined"
          fullWidth
          {...register("caption", { required: "Caption is required" })}
        />
        {errors.caption && <p>{errors.caption.message}</p>}

        <Button type="submit">
          {isEdit ? "Save Changes" : "Create Post"}
        </Button>
      </form>

      {/* Snackbar for success message */}
      <Snackbar open={true} autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity="success">Post Updated Successfully!</Alert>
      </Snackbar>
    </Box>
  );
};

export default PostForm;

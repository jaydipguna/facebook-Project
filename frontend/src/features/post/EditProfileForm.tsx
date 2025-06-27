import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  onClose: () => void;
  defaultValues: any;
  onSubmit: (formData: FormData) => void;
};

const EditProfileForm: React.FC<Props> = ({
  onClose,
  defaultValues,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      username: defaultValues.username || "",
      first_name: defaultValues.first_name || "",
      last_name: defaultValues.last_name || "",
      bio: defaultValues.bio || "",
    },
  });

  const [previewImage, setPreviewImage] = useState<string>(
    defaultValues.profile || ""
  );

  const watchProfile = watch("profile");

  useEffect(() => {
    if (watchProfile && watchProfile.length > 0) {
      const file = watchProfile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [watchProfile]);

  const handleFormSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("bio", data.bio);
    formData.append("username", data.username);

    if (data.profile?.[0]) {
      formData.append("profile", data.profile[0]);
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              {...register("username", { required: true })}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              {...register("first_name", { required: true })}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              {...register("last_name", { required: true })}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              {...register("bio")}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Current Profile Image
            </label>
            {previewImage ? (
              <img
                src={previewImage}
                alt="Current Profile"
                className="w-24 h-24 object-cover rounded-full mt-2"
              />
            ) : (
              <p className="text-gray-500 mt-2">No image uploaded</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mt-2">
              Change Profile Image
            </label>
            <input
              type="file"
              {...register("profile")}
              className="mt-1 block w-full"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;

// --- uploadApi ---
// Connects to image upload endpoints with Cloudinary integration
import { baseApi } from "../baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Single Image Upload
    uploadSingleImage: builder.mutation({
      query: (formData) => ({
        url: "/upload/single",
        method: "POST",
        body: formData,
        // Don't set Content-Type header for FormData - browser will set it with boundary
      }),
    }),
    
    // Multiple Images Upload (max 10)
    uploadMultipleImages: builder.mutation({
      query: (formData) => ({
        url: "/upload/multiple",
        method: "POST",
        body: formData,
      }),
    }),
    
    // Delete Image by Public ID
    deleteImage: builder.mutation({
      query: (publicId) => ({
        url: `/upload/${publicId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useUploadSingleImageMutation,
  useUploadMultipleImagesMutation,
  useDeleteImageMutation,
} = uploadApi;

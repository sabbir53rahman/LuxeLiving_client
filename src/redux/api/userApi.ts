// --- userApi ---
import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateAgentProfile: builder.mutation({
      query: (data) => ({
        url: "/users/agent",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateBuyerProfile: builder.mutation({
      query: (data) => ({
        url: "/users/buyer",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateSellerProfile: builder.mutation({
      query: (data) => ({
        url: "/users/seller",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    // NEW: Get all users with search functionality (Admin only)
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/users",
        params: {
          ...params,
          // Support for search parameters
          searchTerm: params?.searchTerm,
          page: params?.page,
          limit: params?.limit,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        },
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAgentProfileMutation,
  useUpdateBuyerProfileMutation,
  useUpdateSellerProfileMutation,
  useGetAllUsersQuery,
} = userApi;

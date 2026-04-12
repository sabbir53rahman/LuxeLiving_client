// --- 9. adminApi ---
// Connects to src/app/module/admin/admin.route.ts
import { baseApi } from "../baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User Management
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/admins/users",
        params: {
          ...params,
          searchTerm: params?.searchTerm,
          page: params?.page,
          limit: params?.limit,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        },
      }),
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/admins/users/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    toggleUserStatus: builder.mutation({
      query: (userId) => ({
        url: `/admins/users/${userId}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/admins/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    
    // Admin Management
    getAllAdmins: builder.query({
      query: (params) => ({
        url: "/admins",
        params: {
          ...params,
          page: params?.page,
          limit: params?.limit,
        },
      }),
      providesTags: ["Admin"],
    }),
    getAdminDetails: builder.query({
      query: (id) => `/admins/${id}`,
      providesTags: (result, error, id) => [{ type: "Admin", id }],
    }),
    updateAdmin: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admins/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Admin", id }],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Admin", id }],
    }),
    
    // Payment Overview
    getPaymentsOverview: builder.query({
      query: (params) => ({
        url: "/admins/payments",
        params,
      }),
      providesTags: ["Payment"],
    }),
    
    // All Viewings Management
    getAllAdminViewings: builder.query({
      query: (params) => ({
        url: "/viewings",
        params,
      }),
      providesTags: ["Viewing"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
  useGetAllAdminsQuery,
  useGetAdminDetailsQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useGetPaymentsOverviewQuery,
  useGetAllAdminViewingsQuery,
} = adminApi;

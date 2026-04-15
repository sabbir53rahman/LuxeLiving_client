// --- sellerApi ---
// Connects to src/app/module/seller/seller.route.ts
import { baseApi } from "../baseApi";

export const sellerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Profile Management
    getMySellerProfile: builder.query({
      query: () => "/sellers/me",
      providesTags: ["Seller"],
    }),
    updateSellerProfile: builder.mutation({
      query: (data) => ({
        url: "/sellers/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Seller"],
    }),

    // Property Management
    createSellerProperty: builder.mutation({
      query: (data) => ({
        url: "/sellers/properties",
        method: "POST",
        body: data, // Removed the { propertyData: data } wrapper
      }),
      invalidatesTags: ["Property", "Seller"],
    }),
    getMySellerProperties: builder.query({
      query: (params) => ({
        url: "/sellers/properties",
        params: {
          ...params,
          searchTerm: params?.searchTerm,
          page: params?.page,
          limit: params?.limit,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        },
      }),
      providesTags: ["Property"],
    }),
    updateSellerProperty: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sellers/properties/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Property", id },
        "Seller",
      ],
    }),
    deleteSellerProperty: builder.mutation({
      query: (id) => ({
        url: `/sellers/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Property", id },
        "Seller",
      ],
    }),

    // Inquiry Management
    getPropertyInquiries: builder.query({
      query: ({ propertyId, params }) => ({
        url: `/sellers/properties/${propertyId}/inquiries`,
        params: {
          ...params,
          page: params?.page,
          limit: params?.limit,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        },
      }),
      providesTags: ["Viewing"],
    }),

    // Viewing Management
    getPropertyViewings: builder.query({
      query: ({ propertyId, params }) => ({
        url: `/sellers/properties/${propertyId}/viewings`,
        params: {
          ...params,
          page: params?.page,
          limit: params?.limit,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        },
      }),
      providesTags: ["Viewing"],
    }),
    updateSellerViewingStatus: builder.mutation({
      query: ({ viewingId, data }) => ({
        url: `/sellers/viewings/${viewingId}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { viewingId }) => [
        { type: "Viewing", id: viewingId },
      ],
    }),

    // Sales Tracking
    getSellerStats: builder.query({
      query: () => "/sellers/stats",
      providesTags: ["Seller"],
    }),
    getSalesHistory: builder.query({
      query: (params) => ({
        url: "/sellers/sales-history",
        params: {
          ...params,
          page: params?.page,
          limit: params?.limit,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        },
      }),
      providesTags: ["Property"],
    }),

    // Agent Collaboration
    requestAgentCollaboration: builder.mutation({
      query: (data) => ({
        url: "/sellers/agents/request",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Seller", "Property"],
    }),
    // Add this to your endpoints in sellerApi
    getSellerEarnings: builder.query({
      query: (params) => ({
        url: "/sellers/earnings",
        params: {
          ...params,
          startDate: params?.startDate,
          endDate: params?.endDate,
        },
      }),
      providesTags: ["Seller"],
    }),
    getAssignedAgents: builder.query({
      query: () => "/sellers/agents/assigned",
      providesTags: ["Agent", "Seller"],
    }),
    removeAgentFromProperty: builder.mutation({
      query: (propertyId) => ({
        url: `/sellers/properties/${propertyId}/agents`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, propertyId) => [
        { type: "Property", id: propertyId },
        "Seller",
      ],
    }),
  }),
});

export const {
  useGetMySellerProfileQuery,
  useUpdateSellerProfileMutation,
  useCreateSellerPropertyMutation,
  useGetMySellerPropertiesQuery,
  useUpdateSellerPropertyMutation,
  useDeleteSellerPropertyMutation,
  useGetPropertyInquiriesQuery,
  useGetPropertyViewingsQuery,
  useUpdateSellerViewingStatusMutation,
  useGetSellerStatsQuery,
  useGetSalesHistoryQuery,
  useGetSellerEarningsQuery,
  useRequestAgentCollaborationMutation,
  useGetAssignedAgentsQuery,
  useRemoveAgentFromPropertyMutation,
} = sellerApi;

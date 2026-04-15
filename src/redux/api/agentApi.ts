import { ApiResponse } from "@/types";
import { Agent } from "@/types/agent";
import { baseApi } from "../baseApi";

export const agentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query({
      query: (params) => ({
        url: "/agents",
        params,
      }),
      providesTags: ["Agent"],
    }),
    getMyAgentProfile: builder.query<ApiResponse<Agent>, void>({
      query: () => "/agents/me",
      providesTags: ["Agent"],
    }),
    getAgentDetails: builder.query({
      query: (id) => `/agents/${id}`,
      providesTags: (result, error, id) => [{ type: "Agent", id }],
    }),
    updateAgentProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/agents/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Agent", id }],
    }),
    deleteAgent: builder.mutation({
      query: (id) => ({
        url: `/agents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Agent", id }],
    }),
    getAssignedAgents: builder.query({
      query: () => "/sellers/agents/assigned",
      providesTags: ["SellerAgent"],
    }),
    removeAgentFromProperty: builder.mutation({
      query: (propertyId) => ({
        url: `/sellers/properties/${propertyId}/agents`,
        method: "DELETE",
      }),
      invalidatesTags: ["SellerAgent", "Property"],
    }),
    // Agent Reviews Endpoints
    getAgentReviews: builder.query({
      query: (agentId) => `/agents/${agentId}/reviews`,
      providesTags: (result, error, agentId) => [
        { type: "Review", id: agentId },
      ],
    }),
    createAgentReview: builder.mutation({
      query: ({ agentId, data }) => ({
        url: `/agents/${agentId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { agentId }) => [
        { type: "Review", id: agentId },
        "Agent",
      ],
    }),
    // Agent Viewings Endpoints
    getAgentViewings: builder.query({
      query: (params) => ({
        url: "/agents/viewings",
        params,
      }),
      providesTags: ["Viewing"],
    }),
    updateAgentViewingStatus: builder.mutation({
      query: ({ viewingId, status }) => ({
        url: `/agents/viewings/${viewingId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { viewingId }) => [
        { type: "Viewing", id: viewingId },
      ],
    }),
    getAssignedSellerProperties: builder.query({
      query: (params) => ({
        url: "/agents/assigned-properties",
        params: {
          ...params,
          page: params?.page,
          limit: params?.limit,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
          status: params?.status,
          searchTerm: params?.searchTerm,
        },
      }),
      providesTags: ["Property", "Agent"],
    }),
    requestAgent: builder.mutation({
      query: (agentId) => ({
        url: `/agents/${agentId}/request`,
        method: "POST",
      }),
      invalidatesTags: (result, error, agentId) => [
        { type: "Agent", id: agentId },
      ],
    }),
    // Add these to your endpoints
    getAgentEarnings: builder.query({
      query: (params) => ({
        url: "/agents/earnings",
        params,
      }),
      providesTags: ["Agent"],
    }),

    getAgentAnalytics: builder.query({
      query: (params) => ({
        url: "/agents/analytics",
        params,
      }),
      providesTags: ["Agent"],
    }),
    // Note: createAgent doesn't exist here, you use useRegisterAgentMutation in authApi!
    // Note: verifyAgent and Top Agents are not implemented on the server
  }),
});

export const {
  useGetAgentsQuery,
  useGetMyAgentProfileQuery,
  useGetAgentDetailsQuery,
  useUpdateAgentProfileMutation,
  useDeleteAgentMutation,
  useGetAssignedAgentsQuery,
  useRemoveAgentFromPropertyMutation,
  useGetAgentReviewsQuery,
  useCreateAgentReviewMutation,
  useGetAgentViewingsQuery,
  useUpdateAgentViewingStatusMutation,
  useGetAssignedSellerPropertiesQuery,
  useRequestAgentMutation,
  useGetAgentEarningsQuery,
  useGetAgentAnalyticsQuery,
} = agentApi;

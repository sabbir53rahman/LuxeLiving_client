// --- reviewApi ---
import { baseApi } from "../baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review", "Property"],
    }),
    getAgentReviews: builder.query({
      query: ({ agentId, ...params }) => ({
        url: `/agents/${agentId}/reviews`,
        params: {
          ...params,
          page: params?.page,
          limit: params?.limit,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
          rating: params?.rating,
        },
      }),
      providesTags: ["Review", "Agent"],
    }),
    getMyReviews: builder.query({
      query: (params) => ({
        url: "/reviews/me",
        params: {
          ...params,
          // Support for search in my reviews too
          searchTerm: params?.searchTerm,
          page: params?.page,
          limit: params?.limit,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        },
      }),
      providesTags: ["Review"],
    }),
    getAllReviews: builder.query({
      query: (params) => ({
        url: "/reviews",
        params: {
          ...params,
          page: params?.page,
          limit: params?.limit,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
          rating: params?.rating,
          searchTerm: params?.searchTerm,
        },
      }),
      providesTags: ["Review"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetAgentReviewsQuery,
  useGetMyReviewsQuery,
  useGetAllReviewsQuery,
} = reviewApi;

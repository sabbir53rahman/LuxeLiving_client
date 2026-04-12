// --- 4. viewingApi (originally bookingApi) ---
// Your backend refers to bookings as 'viewings' using the /viewings route.
import { baseApi } from "../baseApi";

export const viewingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createViewing: builder.mutation({
      query: (data) => ({
        url: "/viewings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Viewing"],
    }),
    getMyViewings: builder.query({
      query: (params) => ({
        url: "/viewings/me",
        params,
      }),
      providesTags: ["Viewing"],
    }),
    getAllViewings: builder.query({
      query: (params) => ({
        url: "/viewings",
        params,
      }),
      providesTags: ["Viewing"],
    }),
    getViewingById: builder.query({
      query: (id) => `/viewings/${id}`,
      providesTags: (result, error, id) => [{ type: "Viewing", id }],
    }),
    updateViewingStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/viewings/${id}`, // Uses standard patch matching your server routes
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Viewing", id }],
    }),
    cancelViewing: builder.mutation({
      query: (id) => ({
        url: `/viewings/cancel/${id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Viewing", id }],
    }),
    deleteViewing: builder.mutation({
      query: (id) => ({
        url: `/viewings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Viewing", id }],
    }),
  }),
});

export const {
  useCreateViewingMutation,
  useGetMyViewingsQuery,
  useGetAllViewingsQuery,
  useGetViewingByIdQuery,
  useUpdateViewingStatusMutation,
  useCancelViewingMutation,
  useDeleteViewingMutation,
} = viewingApi;

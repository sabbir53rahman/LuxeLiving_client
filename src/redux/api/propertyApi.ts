// --- propertyApi ---
import { baseApi } from "../baseApi";

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (params) => ({
        url: "/properties",
        params: {
          ...params,
          // Support for new filtering parameters
          minPrice: params?.minPrice,
          maxPrice: params?.maxPrice,
          location: params?.location,
          searchTerm: params?.searchTerm,
          // Existing parameters
          page: params?.page,
          limit: params?.limit,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
          type: params?.type,
          bedrooms: params?.bedrooms,
          bathrooms: params?.bathrooms,
          agentId: params?.agentId,
          status: params?.status,
        },
      }),
      providesTags: ["Property"],
    }),
    // --- Optimized propertyApi ---
    createProperty: builder.mutation({
      query: (data) => ({
        url: "/properties",
        method: "POST",
        body: data, // Standardized for both Agents and Sellers
      }),
      invalidatesTags: ["Property"],
    }),
    getMyProperties: builder.query({
      query: (params) => ({
        url: "/properties/me",
        params, // My latest backend update handles filtering here too!
      }),
      providesTags: ["Property"],
    }),
    getPropertyDetails: builder.query({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    updateProperty: builder.mutation({
      query: ({ id, data }) => ({
        url: `/properties/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Property", id }],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Property", id }],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetMyPropertiesQuery,
  useGetPropertyDetailsQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} = propertyApi;

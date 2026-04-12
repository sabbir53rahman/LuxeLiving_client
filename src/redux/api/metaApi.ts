// --- 7. metaApi (For your Dashboards!) ---
// Connects to src/app/module/meta/meta.route.ts
import { baseApi } from "../baseApi";

export const metaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewStats: builder.query({
      query: () => "/meta/overview",
      providesTags: ["Meta"],
    }),
    getDashboardStats: builder.query({
      query: () => "/meta/dashboard",
      providesTags: ["Meta"],
    }),
  }),
});

export const { useGetOverviewStatsQuery, useGetDashboardStatsQuery } = metaApi;

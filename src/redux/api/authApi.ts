// --- 1. authApi ---
// Notice the 3 distinct register mutations for your different user roles.
import { baseApi } from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    registerAgent: builder.mutation({
      query: (userData) => ({
        url: "/auth/register-agent",
        method: "POST",
        body: userData,
      }),
    }),
    registerBuyer: builder.mutation({
      query: (userData) => ({
        url: "/auth/register-buyer",
        method: "POST",
        body: userData,
      }),
    }),
    registerSeller: builder.mutation({
      query: (userData) => ({
        url: "/auth/register-seller",
        method: "POST",
        body: userData,
      }),
    }),
    validateUser: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
    }),
    validateAgent: builder.query({
      query: () => ({
        url: "/agents/me",
        method: "GET",
      }),
    }),
    validateSeller: builder.query({
      query: () => ({
        url: "/sellers/me",
        method: "GET",
      }),
    }),
    validateBuyer: builder.query({
      query: () => ({
        url: "/buyers/me",
        method: "GET",
      }),
    }),
    /*
     * NOTE: The following routes do not exist on the backend yet!
     * changePassword, forgotPassword, resetPassword, verifyEmail, refreshToken
     */
  }),
});

export const {
  useLoginMutation,
  useRegisterAgentMutation,
  useRegisterBuyerMutation,
  useRegisterSellerMutation,
  useValidateUserQuery,
  useValidateAgentQuery,
  useValidateSellerQuery,
  useValidateBuyerQuery,
} = authApi;

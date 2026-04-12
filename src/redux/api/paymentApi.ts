// --- 8. paymentApi ---
// Connects to src/app/module/payment/payment.route.ts
import { baseApi } from "../baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (bookingId: string) => ({
        url: "/payments/create-checkout-session",
        method: "POST",
        body: { bookingId },
      }),
    }),
    verifyPayment: builder.query({
      query: (sessionId: string) =>
        `/payments/verify-payment?sessionId=${sessionId}`,
    }),
    getMyPayments: builder.query({
      query: () => "/payments/me",
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useVerifyPaymentQuery,
  useGetMyPaymentsQuery,
} = paymentApi;

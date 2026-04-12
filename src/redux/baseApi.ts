import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { BASE_URL } from "@/constants";
import type { RootState } from "./store";
import { logout } from "./features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const data = result.error.data as { message?: string };
    const message = data?.message?.toLowerCase() || "";

    // If 401 or profile not found ERRORS occur, force logout
    if (
      status === 401 ||
      (status === 404 && message.includes("profile not found")) ||
      (status === 404 && message.includes("user not found"))
    ) {
      api.dispatch(logout());
      // Optional: Redirect could happen via a useEffect in DashboardLayout watching auth state
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Property",
    "Agent",
    "Review",
    "Viewing",
    "Search",
    "Favorite",
    "Category",
    "Meta",
    "Payment",
    "Admin",
    "Seller",
    "SellerAgent",
  ],
  endpoints: () => ({}),
});

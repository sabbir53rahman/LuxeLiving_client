"use client";

import { store } from "@/redux/store";
import { Provider } from "react-redux";
import AuthInitializer from "@/components/auth/AuthInitializer";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}

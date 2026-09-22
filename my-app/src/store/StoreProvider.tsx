"use client";

import { Provider } from "react-redux";
import { ApiLoader } from "@/components/ApiLoader";
import { store } from "./store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <ApiLoader />
    </Provider>
  );
}

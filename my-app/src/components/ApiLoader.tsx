"use client";

import { useAppSelector } from "@/store/store";

export function ApiLoader() {
  const active = useAppSelector((state) => {
    const queries = Object.values(state.tasksApi.queries);
    const mutations = Object.values(state.tasksApi.mutations);
    return (
      queries.some((entry) => entry?.status === "pending") ||
      mutations.some((entry) => entry?.status === "pending")
    );
  });

  if (!active) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25"
      role="status"
      aria-live="polite"
    >
      <div className="h-11 w-11 animate-spin rounded-full border-4 border-white border-t-[#4f67f6]" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

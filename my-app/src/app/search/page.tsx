"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import { SearchField } from "@/components/SearchField";
import { useAppDispatch } from "@/store/store";
import { useGetTasksQuery, useUpdateTaskMutation } from "@/store/tasksApi";
import { openEdit } from "@/store/uiSlice";

export default function SearchPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState("");
  const { data, isFetching } = useGetTasksQuery(keyword, { skip: keyword.trim() === "" });
  const [updateTask] = useUpdateTaskMutation();
  const tasks = keyword.trim() ? (data?.tasks ?? []) : [];

  return (
    <PhoneFrame>
      <div className="flex items-center gap-3 px-4 pb-2 pt-4">
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.push("/home")}
          className="text-xl text-[#222]"
        >
          ←
        </button>
        <div className="flex-1">
          <SearchField value={keyword} onChange={setKeyword} autoFocus placeholder="Search" />
        </div>
      </div>
      <div className="px-5">
        {!isFetching && keyword.trim() && tasks.length === 0 ? (
          <p className="py-6 text-sm text-[#888]">No matching tasks.</p>
        ) : null}
        {tasks.map((task) => {
          const done = task.status === "completed";
          return (
            <div key={task._id} className="flex items-center gap-3 border-b border-[#f2f2f2] py-4">
              <button
                type="button"
                aria-label={done ? "Mark in progress" : "Mark completed"}
                onClick={() =>
                  void updateTask({
                    id: task._id,
                    body: { status: done ? "in_progress" : "completed" },
                  })
                }
                className={`flex h-5 w-5 items-center justify-center rounded border ${
                  done ? "border-[#4f67f6] bg-[#4f67f6] text-white" : "border-[#cfcfcf]"
                }`}
              >
                {done ? "✓" : ""}
              </button>
              <button
                type="button"
                className="flex-1 truncate text-left text-sm"
                onClick={() => {
                  dispatch(openEdit(task._id));
                  router.push("/home");
                }}
              >
                {task.title}
              </button>
            </div>
          );
        })}
      </div>
    </PhoneFrame>
  );
}

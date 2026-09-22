"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import { SearchField } from "@/components/SearchField";
import { TaskRow } from "@/components/TaskRow";
import { useDebounce } from "@/common/useDebounce";
import { useDeleteTaskMutation, useGetTasksQuery, useUpdateTaskMutation } from "@/store/tasksApi";
import { ArrowLeft } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const { data, isFetching } = useGetTasksQuery(
    { search: debouncedKeyword },
    { skip: debouncedKeyword.trim() === "" },
  );
  const [updateTask] = useUpdateTaskMutation();
  const tasks = debouncedKeyword.trim() ? (data?.tasks ?? []) : [];

  return (
    <PhoneFrame>
      <button
        type="button"
        aria-label="Back"
        onClick={() => router.push("/home")}
        className="text-xl text-[#222] text-start p-4"
      >
        <ArrowLeft size={24} strokeWidth={1.6} />
      </button>
      <div className="flex items-center gap-3 px-4 pb-2 pt-4">
        <div className="flex-1">
          <SearchField value={keyword} onChange={setKeyword} autoFocus placeholder="Search" />
        </div>
      </div>
      <div className="px-5">
        {!isFetching && debouncedKeyword.trim() && tasks.length === 0 ? (
          <p className="py-6 text-sm text-[#888]">No matching tasks.</p>
        ) : null}
        {tasks.map((task) => (
          <TaskRow
            key={task._id}
            task={task}
            onToggle={() =>
              void updateTask({
                id: task._id,
                body: { status: task.status === "completed" ? "in_progress" : "completed" },
              })
            }
          />
        ))}
      </div>
    </PhoneFrame>
  );
}

"use client";

import Link from "next/link";
import { DateStrip } from "@/components/DateStrip";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ProgressBar } from "@/components/ProgressBar";
import { SearchField } from "@/components/SearchField";
import { StatCard } from "@/components/StatCard";
import { TaskRow } from "@/components/TaskRow";
import { TaskSheet } from "@/components/TaskSheet";
import { stripDays, weekBounds } from "@/lib/dates";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useDeleteTaskMutation, useGetTasksQuery, useUpdateTaskMutation } from "@/store/tasksApi";
import { openCreate, openEdit, setSelectedDate } from "@/store/uiSlice";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector((state) => state.ui.selectedDate);
  const { data } = useGetTasksQuery();
  const { data: dayData, isLoading, isError } = useGetTasksQuery({ date: selectedDate });
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const tasks = data?.tasks ?? [];
  const { start, end } = weekBounds(selectedDate);
  const weekTasks = tasks.filter((task) => {
    const time = new Date(task.dateTime).getTime();
    return time >= start.getTime() && time < end.getTime();
  });
  const completed = weekTasks.filter((task) => task.status === "completed").length;
  const pending = weekTasks.length - completed;
  const todayTasks = dayData?.tasks ?? [];
  const completedToday = todayTasks.filter((task) => task.status === "completed").length;
  const progress = todayTasks.length === 0 ? 0 : (completedToday / todayTasks.length) * 100;

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-5 pb-24 pt-6">
        <Link href="/search" className="block">
          <SearchField />
        </Link>
        <div className="mt-5">
          <DateStrip
            days={stripDays(selectedDate)}
            selectedKey={selectedDate}
            onSelect={(key) => dispatch(setSelectedDate(key))}
          />
        </div>
        <div className="mt-5 flex gap-3">
          <StatCard label="Task Complete" count={completed} tone="complete" />
          <StatCard label="Task Pending" count={pending} tone="pending" />
        </div>
        <h2 className="mt-6 text-base font-bold">Weekly Progress</h2>
        <div className="mt-3">
          <ProgressBar value={progress} />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-base font-bold">Tasks Today</h2>
          <span className="text-sm font-medium text-[#4f67f6]">View All</span>
        </div>
        <div className="mt-2">
          {isError ? <p className="py-6 text-sm text-[#ef5b6a]">Could not load tasks.</p> : null}
          {!isLoading && !isError && todayTasks.length === 0 ? (
            <p className="py-6 text-sm text-[#888]">No tasks for this day.</p>
          ) : null}
          {todayTasks.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              onToggle={() =>
                void updateTask({
                  id: task._id,
                  body: { status: task.status === "completed" ? "in_progress" : "completed" },
                })
              }
              onDelete={() => void deleteTask(task._id)}
              onEdit={() => dispatch(openEdit(task._id))}
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label="Add task"
        onClick={() => dispatch(openCreate())}
        className="absolute bottom-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[#4f67f6] text-3xl text-white shadow-lg"
      >
        +
      </button>
      <TaskSheet />
    </PhoneFrame>
  );
}

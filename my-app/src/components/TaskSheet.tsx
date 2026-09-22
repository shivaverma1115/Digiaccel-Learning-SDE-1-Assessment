"use client";

import { useState } from "react";
import { dateKeyFromIso, longDateLabel, timeValueFromIso, toIso } from "@/lib/dates";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { closeSheet } from "@/store/uiSlice";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
  type Priority,
} from "@/store/tasksApi";
import { PrimaryButton } from "./PrimaryButton";

export function TaskSheet() {
  const dispatch = useAppDispatch();
  const sheet = useAppSelector((state) => state.ui.sheet);
  const selectedDate = useAppSelector((state) => state.ui.selectedDate);
  const { data } = useGetTasksQuery();
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: updating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: deleting }] = useDeleteTaskMutation();

  if (sheet.mode === "closed") {
    return null;
  }

  const editId = sheet.mode === "edit" ? sheet.id : undefined;
  const editing = editId ? data?.tasks.find((task) => task._id === editId) : undefined;

  if (editId && !editing) {
    return (
      <div className="absolute inset-0 z-20 flex items-end bg-black/40">
        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e7e9ff] border-t-[#4f67f6]" />
          Loading task...
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-20 flex items-end bg-black/40">
      <TaskForm
        key={editId ?? "create"}
        selectedDate={selectedDate}
        editing={editing}
        saving={creating || updating || deleting}
        onClose={() => dispatch(closeSheet())}
        onCreate={async (body) => {
          await createTask(body).unwrap();
          dispatch(closeSheet());
        }}
        onUpdate={async (id, body) => {
          await updateTask({ id, body }).unwrap();
          dispatch(closeSheet());
        }}
        onDelete={async (id) => {
          await deleteTask(id).unwrap();
          dispatch(closeSheet());
        }}
      />
    </div>
  );
}

function TaskForm({
  selectedDate,
  editing,
  saving,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: {
  selectedDate: string;
  editing?: {
    _id: string;
    title: string;
    description: string;
    dateTime: string;
    endTime?: string | null;
    priority?: Priority;
  };
  saving: boolean;
  onClose: () => void;
  onCreate: (body: {
    title: string;
    description: string;
    dateTime: string;
    endTime?: string;
    priority?: Priority;
  }) => Promise<void>;
  onUpdate: (
    id: string,
    body: {
      title: string;
      description: string;
      dateTime: string;
      endTime?: string;
      priority?: Priority;
    },
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [date, setDate] = useState(editing ? dateKeyFromIso(editing.dateTime) : selectedDate);
  const [start, setStart] = useState(editing ? timeValueFromIso(editing.dateTime) : "");
  const [end, setEnd] = useState(editing?.endTime ? timeValueFromIso(editing.endTime) : "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [priority, setPriority] = useState<Priority | "">(editing?.priority ?? "");
  const [error, setError] = useState("");

  async function submit() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!date || !start) {
      setError("Date and start time are required");
      return;
    }

    const dateTime = toIso(date, start);
    const endTime = end ? toIso(date, end) : undefined;
    if (endTime && new Date(endTime) < new Date(dateTime)) {
      setError("End time must be after the start time");
      return;
    }

    const body = {
      title: title.trim(),
      description: description.trim(),
      dateTime,
      endTime,
      ...(priority ? { priority } : {}),
    };

    try {
      if (editing) {
        await onUpdate(editing._id, body);
      } else {
        await onCreate(body);
      }
    } catch {
      setError("Could not save the task");
    }
  }

  return (
    <form
      className="max-h-[92%] w-full overflow-y-auto rounded-t-3xl bg-white px-5 pb-6 pt-5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[22px] font-bold tracking-tight text-[#1c1c1c]">
          {editing ? "Edit Task" : "Add New Task"}
        </h2>
        <button type="button" aria-label="Close" onClick={onClose} className="text-2xl leading-none text-[#1c1c1c]">
          ×
        </button>
      </div>

      <label className="mb-4 block text-sm text-[#8d8d8d]">
        Task title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Doing Homework"
          className="mt-2 h-12 w-full rounded-lg border border-[#e6e6e6] px-3 text-base text-[#1c1c1c] outline-none"
        />
      </label>

      <p className="mb-2 text-sm text-[#8d8d8d]">Set Time</p>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <TimeField label="Start" value={start} onChange={setStart} />
        <TimeField label="Ends" value={end} onChange={setEnd} />
      </div>

      <p className="mb-2 text-sm text-[#8d8d8d]">Set Date</p>
      <label className="relative mb-4 flex h-12 items-center rounded-lg border border-[#e6e6e6] px-3">
        <span className="text-base text-[#1c1c1c]">{date ? longDateLabel(date) : "Select date"}</span>
        <CalendarIcon />
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>

      <label className="mb-5 block text-sm text-[#8d8d8d]">
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add Description"
          rows={4}
          className="mt-2 w-full resize-none rounded-lg border border-[#e6e6e6] px-3 py-3 text-base text-[#1c1c1c] outline-none placeholder:text-[#b5b5b5]"
        />
      </label>

      {error ? <p className="mb-3 text-sm text-[#ef5b6a]">{error}</p> : null}
      <PrimaryButton type="submit" disabled={saving}>
        {editing ? "Save" : "Create task"}
      </PrimaryButton>
      {editing ? (
        <button
          type="button"
          disabled={saving}
          onClick={() => void onDelete(editing._id)}
          className="mt-3 h-10 w-full text-sm text-[#ef5b6a]"
        >
          Delete
        </button>
      ) : null}
    </form>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative flex h-12 items-center gap-2 rounded-lg border border-[#e6e6e6] px-3 text-base text-[#8d8d8d]">
      <ClockIcon />
      <span className={value ? "text-[#1c1c1c]" : ""}>{value || label}</span>
      <input
        type="time"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="#1c1c1c" strokeWidth="1.6" />
      <path d="M12 8v4.5l3 2" stroke="#1c1c1c" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="ml-auto" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="#1c1c1c" strokeWidth="1.6" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="#1c1c1c" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

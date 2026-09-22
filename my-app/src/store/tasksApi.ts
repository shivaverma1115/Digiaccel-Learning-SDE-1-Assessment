import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "in_progress" | "completed";

export type Task = {
  _id: string;
  title: string;
  description: string;
  dateTime: string;
  endTime?: string | null;
  priority?: Priority;
  status: TaskStatus;
};

export type TaskBody = {
  title?: string;
  description?: string;
  dateTime?: string;
  endTime?: string;
  priority?: Priority;
  status?: TaskStatus;
};

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<{ tasks: Task[] }, string | void>({
      query: (search) => {
        const keyword = typeof search === "string" ? search.trim() : "";
        return keyword ? `/api/tasks?search=${encodeURIComponent(keyword)}` : "/api/tasks";
      },
      providesTags: ["Task"],
    }),
    createTask: builder.mutation<Task, TaskBody>({
      query: (body) => ({ url: "/api/tasks", method: "POST", body }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<Task, { id: string; body: TaskBody }>({
      query: ({ id, body }) => ({ url: `/api/tasks/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation<null, string>({
      query: (id) => ({
        url: `/api/tasks/${id}`,
        method: "DELETE",
        responseHandler: "text",
      }),
      transformResponse: () => null,
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;

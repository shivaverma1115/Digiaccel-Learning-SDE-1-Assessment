import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { parseKey } from "@/lib/dates";

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
    getTasks: builder.query<{ tasks: Task[] }, { search?: string; date?: string } | void>({
      query: (args) => {
        const params = new URLSearchParams();
        const search = args?.search?.trim();
        if (search) params.set("search", search);
        if (args?.date && /^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
          const start = parseKey(args.date);
          const end = new Date(start);
          end.setDate(start.getDate() + 1);
          params.set("date", args.date);
          params.set("from", start.toISOString());
          params.set("to", end.toISOString());
        }
        const query = params.toString();
        return query ? `/api/tasks?${query}` : "/api/tasks";
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

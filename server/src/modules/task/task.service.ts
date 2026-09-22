import { TaskModel } from "./task.model.js";

export type TaskInput = {
  title?: string;
  description?: string;
  dateTime?: Date;
  endTime?: Date;
  priority?: "low" | "medium" | "high";
  status?: "in_progress" | "completed";
};

type TaskFilter = {
  status?: TaskInput["status"];
  $or?: Array<{ title: RegExp } | { description: RegExp }>;
};

function startOfWeekUtc(date: Date): Date {
  const weekStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = weekStart.getUTCDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  weekStart.setUTCDate(weekStart.getUTCDate() - daysFromMonday);
  return weekStart;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function createTask(input: TaskInput) {
  return TaskModel.create(input);
}

export function listTasks(filter: TaskFilter) {
  return TaskModel.find(filter).sort({ dateTime: -1 });
}

export function getTaskById(id: string) {
  return TaskModel.findById(id);
}

export function updateTaskById(id: string, input: TaskInput) {
  return TaskModel.findByIdAndUpdate(id, input, { new: true, runValidators: true });
}

export function deleteTaskById(id: string) {
  return TaskModel.findByIdAndDelete(id);
}

export async function listTaskWeeks() {
  const tasks = await TaskModel.find().sort({ dateTime: 1 });
  const weeks = new Map<
    string,
    {
      weekStart: string;
      weekEnd: string;
      openCount: number;
      completedCount: number;
      tasks: typeof tasks;
    }
  >();

  for (const task of tasks) {
    const weekStartDate = startOfWeekUtc(task.dateTime);
    const weekStart = formatDate(weekStartDate);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 6);

    const week = weeks.get(weekStart) ?? {
      weekStart,
      weekEnd: formatDate(weekEndDate),
      openCount: 0,
      completedCount: 0,
      tasks: [],
    };

    if (task.status === "completed") {
      week.completedCount += 1;
    } else {
      week.openCount += 1;
    }

    week.tasks.push(task);
    weeks.set(weekStart, week);
  }

  return [...weeks.values()].sort((a, b) => b.weekStart.localeCompare(a.weekStart));
}

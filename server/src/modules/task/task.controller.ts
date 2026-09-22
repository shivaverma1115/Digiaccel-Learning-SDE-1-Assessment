import type { Request, Response } from "express";
import mongoose from "mongoose";
import {
  createTask as saveTask,
  deleteTaskById,
  getTaskById,
  listTasks as findTasks,
  listTaskWeeks,
  updateTaskById,
  type TaskInput,
} from "./task.service.js";

const priorities = ["low", "medium", "high"] as const;
const statuses = ["in_progress", "completed"] as const;

type Priority = (typeof priorities)[number];
type Status = (typeof statuses)[number];

function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && priorities.includes(value as Priority);
}

function isStatus(value: unknown): value is Status {
  return typeof value === "string" && statuses.includes(value as Status);
}

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== "string" && typeof value !== "number") {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readTaskInput(body: Request["body"], partial: boolean): TaskInput | string {
  const input: TaskInput = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      return "title is required";
    }
    input.title = body.title.trim();
  } else if (!partial) {
    return "title is required";
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      return "description must be a string";
    }
    input.description = body.description.trim();
  }

  if (body.dateTime !== undefined) {
    const dateTime = parseDate(body.dateTime);
    if (!dateTime) {
      return "dateTime must be a valid date";
    }
    input.dateTime = dateTime;
  } else if (!partial) {
    return "dateTime is required";
  }

  if (body.priority !== undefined) {
    if (!isPriority(body.priority)) {
      return "priority must be low, medium, or high";
    }
    input.priority = body.priority;
  }

  if (body.status !== undefined) {
    if (!isStatus(body.status)) {
      return "status must be in_progress or completed";
    }
    input.status = body.status;
  }

  if (partial && Object.keys(input).length === 0) {
    return "at least one field is required";
  }

  return input;
}

function requireId(req: Request, res: Response): string | undefined {
  const id = req.params.id;
  if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid task id" });
    return undefined;
  }
  return id;
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const input = readTaskInput(req.body, false);
  if (typeof input === "string") {
    res.status(400).json({ message: input });
    return;
  }

  const task = await saveTask(input);
  res.status(201).json(task);
}

export async function listTasks(req: Request, res: Response): Promise<void> {
  const filter: {
    status?: Status;
    $or?: Array<{ title: RegExp } | { description: RegExp }>;
  } = {};
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: pattern }, { description: pattern }];
  }

  if (req.query.status !== undefined) {
    if (!isStatus(req.query.status)) {
      res.status(400).json({ message: "status must be in_progress or completed" });
      return;
    }
    filter.status = req.query.status;
  }

  const tasks = await findTasks(filter);
  res.json({ tasks });
}

export async function listWeeks(_req: Request, res: Response): Promise<void> {
  const weeks = await listTaskWeeks();
  res.json({ weeks });
}

export async function getTask(req: Request, res: Response): Promise<void> {
  const id = requireId(req, res);
  if (!id) {
    return;
  }

  const task = await getTaskById(id);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.json(task);
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const id = requireId(req, res);
  if (!id) {
    return;
  }

  const input = readTaskInput(req.body, true);
  if (typeof input === "string") {
    res.status(400).json({ message: input });
    return;
  }

  const task = await updateTaskById(id, input);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.json(task);
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const id = requireId(req, res);
  if (!id) {
    return;
  }

  const task = await deleteTaskById(id);
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(204).send();
}

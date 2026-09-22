import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  listWeeks,
  updateTask,
} from "./task.controller.js";

export const taskRouter = Router();

taskRouter.post("/", createTask);
taskRouter.get("/weeks", listWeeks);
taskRouter.get("/", listTasks);
taskRouter.get("/:id", getTask);
taskRouter.patch("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

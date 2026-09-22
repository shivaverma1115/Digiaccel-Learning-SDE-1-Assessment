import path from "node:path";
import cors from "cors";
import express from "express";
import { taskRouter } from "./modules/task/task.routes.js";

export const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api/tasks", taskRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Base API endpoint" });
});

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    dateTime: { type: Date, required: true },
    priority: { type: String, enum: ["low", "medium", "high"] },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
  },
  { timestamps: true },
);

export const TaskModel = mongoose.model("Task", taskSchema);

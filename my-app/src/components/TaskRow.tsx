import { Check, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/store/tasksApi";

export function TaskRow({
  task,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task;
  onToggle: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  const done = task.status === "completed";

  return (
    <div className="flex items-center gap-3 border-b border-[#f3f3f3] py-4">
      <button
        type="button"
        aria-label={done ? "Mark in progress" : "Mark completed"}
        onClick={onToggle}
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center border ${done ? "border-[#5b6cf6]" : "border-[#d7d7d7] bg-white"
          }`}
      >
        {done ? <Check size={14} strokeWidth={2} className="text-[#5b6cf6]" aria-hidden /> : null}
      </button>
      <button
        type="button"
        onClick={onEdit}
        className={`flex-1 truncate text-left text-[15px] ${done ? "text-[#9a9a9a] line-through" : "text-[#1c1c1c]"
          }`}
      >
        {task.title}
      </button>
      <div className="flex items-center gap-3 text-[#d0d0d0]">
        {onDelete ? (
          <button
            type="button"
            aria-label="Delete task"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this task?")) onDelete();
            }}
          >
            <Trash2 size={25} strokeWidth={1.6} />
          </button>
        ) : null}
        {onEdit ? (
          <button
            type="button"
            aria-label="Edit task"
            onClick={() => {
              if (window.confirm("Are you sure you want to edit this task?")) onEdit();
            }}
          >
            <Pencil size={22} strokeWidth={1.6} />
          </button>
        ) : null}
      </div>
    </div>
  );
}


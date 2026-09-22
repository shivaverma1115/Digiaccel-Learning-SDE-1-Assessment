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
    <div className="flex items-center gap-3 border-b border-[#f2f2f2] py-3">
      <button
        type="button"
        aria-label={done ? "Mark in progress" : "Mark completed"}
        onClick={onToggle}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
          done ? "border-[#4f67f6] bg-[#4f67f6] text-white" : "border-[#cfcfcf] bg-white"
        }`}
      >
        {done ? "✓" : ""}
      </button>
      <button type="button" onClick={onEdit} className="flex-1 truncate text-left text-sm">
        {task.title}
      </button>
      {onDelete ? (
        <button type="button" aria-label="Delete task" onClick={onDelete} className="text-[#b0b0b0]">
          <TrashIcon />
        </button>
      ) : null}
      {onEdit ? (
        <button type="button" aria-label="Edit task" onClick={onEdit} className="text-[#b0b0b0]">
          <PencilIcon />
        </button>
      ) : null}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V5h6v2M8 7l1 13h6l1-13" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

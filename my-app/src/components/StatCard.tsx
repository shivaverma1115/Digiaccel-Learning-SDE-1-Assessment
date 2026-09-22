export function StatCard({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "complete" | "pending";
}) {
  const complete = tone === "complete";

  return (
    <div className={`flex-1 rounded-sm px-4 py-4 ${complete ? "bg-[#eef1ff]" : "bg-[#ffecee]"}`}>
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center">
          {complete ? <CheckIcon /> : <CloseIcon />}
        </span>
        <span className="text-sm font-medium text-[#1c1c1c]">
          {label}
          <div className="mt-4 flex items-end gap-2 pl-0.5">
            <span className="text-2xl font-bold leading-none tracking-tight text-[#1c1c1c]">
              {String(count).padStart(2, "0")}
            </span>
            <span className="mb-1 text-xs text-[#b0b0b0]">This Week</span>
          </div>
        </span>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#D9E3FF" />
      <rect x="7" y="7" width="18" height="18" rx="4" stroke="#2F3CC9" strokeWidth="1.8" />
      <path d="M11.2 16.2 14.2 19.2 21 12.2" stroke="#2F3CC9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#F8D0D4" />
      <rect x="7" y="7" width="18" height="18" rx="4" stroke="#C23B45" strokeWidth="1.8" />
      <path d="M12.2 12.2 19.8 19.8M19.8 12.2 12.2 19.8" stroke="#C23B45" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

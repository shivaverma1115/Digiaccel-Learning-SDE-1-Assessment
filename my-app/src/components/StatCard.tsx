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
    <div className={`flex-1 rounded-2xl p-4 ${complete ? "bg-[#eef1ff]" : "bg-[#ffecee]"}`}>
      <div className="flex items-center gap-2 text-sm text-[#4a4a4a]">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md text-xs ${
            complete ? "bg-[#d9e0ff] text-[#4f67f6]" : "bg-[#ffd5da] text-[#ef5b6a]"
          }`}
        >
          {complete ? "✓" : "✕"}
        </span>
        {label}
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{String(count).padStart(2, "0")}</p>
      <p className="text-xs text-[#9a9a9a]">This Week</p>
    </div>
  );
}

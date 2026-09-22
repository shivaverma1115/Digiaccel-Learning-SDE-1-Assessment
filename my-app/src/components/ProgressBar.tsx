export function ProgressBar({ value }: { value: number }) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-[#e7e9ff]">
      <div className="h-full rounded-full bg-[#2f3cc9]" style={{ width: `${width}%` }} />
    </div>
  );
}

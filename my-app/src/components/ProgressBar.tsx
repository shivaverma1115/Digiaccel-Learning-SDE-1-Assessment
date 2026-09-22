export function ProgressBar({ value }: { value: number }) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div className="h-8 overflow-hidden rounded-sm bg-[#e7e9ff]">
      <div className="h-full bg-[#2f3cc9]" style={{ width: `${width}%` }} />
    </div>
  );
}

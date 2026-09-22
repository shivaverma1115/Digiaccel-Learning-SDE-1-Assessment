import { todayKey, weekdayLabel } from "@/lib/dates";

export function DateStrip({
  days,
  selectedKey,
  onSelect,
}: {
  days: Date[];
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-8 gap-1">
      {days.map((day) => {
        const key = todayKey(day);
        const selected = key === selectedKey;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`flex flex-col items-center rounded-lg py-2 text-[11px] ${
              selected ? "bg-[#4f67f6] text-white" : "text-[#9a9a9a]"
            }`}
          >
            <span>{weekdayLabel(day)}</span>
            <span className={`mt-1 text-sm font-semibold ${selected ? "text-white" : "text-[#222]"}`}>
              {String(day.getDate()).padStart(2, "0")}
            </span>
            <span
              className={`mt-1 h-1 w-1 rounded-full ${selected ? "bg-white" : "bg-transparent"}`}
            />
          </button>
        );
      })}
    </div>
  );
}

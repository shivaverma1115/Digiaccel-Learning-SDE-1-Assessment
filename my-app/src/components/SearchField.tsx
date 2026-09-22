export function SearchField({
  value,
  placeholder = "Search for a task",
  onChange,
  autoFocus = false,
}: {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
}) {
  const readOnly = !onChange;

  return (
    <label className="flex h-11 items-center gap-2 rounded-sm border border-[#ececec] bg-white px-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {readOnly ? <span className="flex-1 text-sm text-[#b0b0b0]">{placeholder}</span> : null}
      {onChange ? (
        <input
          value={value ?? ""}
          autoFocus={autoFocus}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-[#b0b0b0]"
        />
      ) : null}
      <SearchIcon />
    </label>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#9a9a9a" strokeWidth="2" />
      <path d="M16.5 16.5L21 21" stroke="#9a9a9a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

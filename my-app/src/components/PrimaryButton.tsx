export function PrimaryButton({
  children,
  type = "button",
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center rounded-lg bg-[#4f67f6] text-sm font-semibold text-white disabled:opacity-60"
    >
      {children}
    </button>
  );
}

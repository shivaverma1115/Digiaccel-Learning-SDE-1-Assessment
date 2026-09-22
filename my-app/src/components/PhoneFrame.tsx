export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-[#e7e7e7]">
      <div className="relative flex min-h-dvh w-full max-w-[400px] flex-col bg-white text-[#1c1c1c]">
        {children}
      </div>
    </div>
  );
}

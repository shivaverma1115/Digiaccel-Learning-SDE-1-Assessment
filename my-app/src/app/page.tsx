import Link from "next/link";
import { PhoneFrame } from "@/components/PhoneFrame";

export default function OnboardingPage() {
  return (
    <PhoneFrame>
      <div className="relative h-[58%] min-h-[420px] overflow-hidden bg-[#4f67f6]">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[16px] border-[#6d82f8]" />
        <Zigzag className="absolute left-6 top-28 text-[#7d90f8]" />
        <Zigzag className="absolute bottom-16 right-6 text-[#7d90f8]" />
      </div>
      <div className="flex flex-1 flex-col px-6 pb-8 pt-8">
        <h1 className="text-[28px] font-bold leading-tight">Manage What To Do</h1>
        <p className="mt-2 text-sm leading-6 text-[#8d8d8d]">
          The best way to manage what you have to do, don&apos;t forget your plans
        </p>
        <Link
          href="/home"
          className="mt-auto flex h-12 items-center justify-center rounded-lg bg-[#4f67f6] text-sm font-semibold text-white"
        >
          Get Started
        </Link>
      </div>
    </PhoneFrame>
  );
}

function Zigzag({ className }: { className?: string }) {
  return (
    <svg className={className} width="92" height="48" viewBox="0 0 92 48" fill="none" aria-hidden="true">
      <path
        d="M2 34l14-16 14 16 14-16 14 16 14-16 14 16"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

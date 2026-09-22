import Image from "next/image";
import Link from "next/link";
import { PhoneFrame } from "@/components/PhoneFrame";

export default function OnboardingPage() {
  return (
    <PhoneFrame>
      <div className="flex h-dvh flex-col">
        <div className="relative min-h-0 w-full flex-[2.5] overflow-hidden bg-[#4566EC]">
          <Image
            src="/images/landing-page-image.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col px-6 pb-8 pt-8">
          <h1 className="text-[28px] font-bold leading-tight text-[#1c1c1c]">Manage What To Do</h1>
          <p className="mt-2 max-w-[280px] text-sm leading-6 text-[#8d8d8d]">
            The best way to manage what you have to do, don&apos;t forget your plans
          </p>
          <Link
            href="/home"
            className="mt-auto flex h-12 items-center justify-center rounded-lg bg-[#4f6ef7] text-sm font-semibold text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </PhoneFrame>
  );
}

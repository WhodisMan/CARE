"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all"
      onClick={() => router.push("/dashboard")}
      aria-label="Back to Dashboard"
    >
      <ArrowLeft className="w-5 h-5" />
      Back to Dashboard
    </button>
  );
} 
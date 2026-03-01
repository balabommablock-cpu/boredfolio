"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Boredfolio error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-ugly-300 mb-4">500</p>
        <h1 className="font-serif text-2xl text-ink-900 mb-2">Something broke.</h1>
        <p className="text-sm text-ink-500 mb-6 leading-relaxed">
          Our servers crashed. Unlike your Regular plan fees, this will actually get fixed.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-md bg-sage-500 text-white text-sm font-medium hover:bg-sage-600 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-md bg-cream-200 text-ink-700 text-sm font-medium hover:bg-cream-300 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

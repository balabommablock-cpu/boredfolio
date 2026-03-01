"use client";

import { useEffect } from "react";

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
        <p className="font-mono text-5xl font-bold text-ugly-300 mb-4">Oops</p>
        <h1 className="font-serif text-2xl text-ink-900 mb-2">Something went wrong.</h1>
        <p className="text-sm text-ink-500 mb-6 leading-relaxed">
          Even boring platforms have bad days. Our team has been notified.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-md bg-sage-500 text-white text-sm font-medium hover:bg-sage-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

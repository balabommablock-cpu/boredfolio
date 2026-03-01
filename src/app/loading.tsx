"use client";

import { useState, useEffect } from "react";

const LOADING_MESSAGES = [
  "Calculating how much your fund manager skimmed...",
  "Fetching returns your advisor won't show you...",
  "Doing the math your fund house hopes you never do...",
  "Pulling data from the footnotes nobody reads...",
  "Loading faster than your fund's returns. Which isn't saying much.",
  "Counting the zeros your advisor didn't mention...",
  "Downloading your financial trauma...",
];

export default function Loading() {
  const [message, setMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    const idx = Math.floor(Math.random() * LOADING_MESSAGES.length);
    setMessage(LOADING_MESSAGES[idx]);
  }, []);

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-1 mb-3">
          <div className="w-2 h-2 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-sm text-ink-400">{message}</p>
      </div>
    </div>
  );
}

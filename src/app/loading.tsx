export default function Loading() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-1 mb-3">
          <div className="w-2 h-2 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-sm text-ink-400">Loading the boring truth...</p>
      </div>
    </div>
  );
}

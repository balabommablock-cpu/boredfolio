import Link from "next/link";

export const metadata = { title: "Page Not Found | Boredfolio" };

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold text-sage-300 mb-4">404</p>
        <h1 className="font-serif text-2xl text-ink-900 mb-2">This page doesn't exist.</h1>
        <p className="text-sm text-ink-500 mb-6 leading-relaxed">
          Unlike your uncle's stock tips, we'll be honest — there's nothing here.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="px-4 py-2 rounded-md bg-sage-500 text-white text-sm font-medium hover:bg-sage-600 transition-colors">
            Go Home
          </Link>
          <Link href="/explore" className="px-4 py-2 rounded-md bg-cream-200 text-ink-700 text-sm font-medium hover:bg-cream-300 transition-colors">
            Explore Funds
          </Link>
        </div>
      </div>
    </div>
  );
}

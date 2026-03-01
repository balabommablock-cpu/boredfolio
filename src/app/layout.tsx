import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://boredfolio.com"),
  title: { template: "%s | Boredfolio", default: "Boredfolio — India's Most Honest Mutual Fund Platform" },
  description: "We strip funds naked so you can invest with your eyes open. No commissions. No BS. Just data and uncomfortable honesty.",
  keywords: ["mutual funds", "India", "comparison", "honest", "direct plan", "SIP", "returns"],
  openGraph: {
    title: "Boredfolio", description: "Mutual fund analysis with uncomfortable honesty.",
    siteName: "Boredfolio", locale: "en_IN", type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans text-ink-900 bg-cream-100 antialiased">{children}</body>
    </html>
  );
}

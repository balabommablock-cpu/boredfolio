import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6B8F71",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://boredfolio.com"),
  title: { template: "%s | Boredfolio", default: "Boredfolio — India's Most Honest Mutual Fund Platform" },
  description: "Your mutual fund charges fees you can't see, buys stocks you can't name, and calls it 'wealth creation.' We just tell you the truth. No commissions. No BS.",
  keywords: [
    "mutual funds India", "mutual fund analysis", "mutual fund comparison",
    "honest fund review", "direct plan vs regular plan", "SIP calculator India",
    "expense ratio calculator", "mutual fund holdings", "PPFAS review",
    "Quant mutual fund", "best mutual funds India", "Boredfolio",
    "mutual fund fees", "mutual fund expense ratio", "NAV tracker",
  ],
  openGraph: {
    title: "Boredfolio — Your mutual fund has a secret.",
    description: "India's most honest mutual fund platform. We tell you what your fund actually holds, what it costs, and whether the manager is earning their fee.",
    siteName: "Boredfolio", locale: "en_IN", type: "website", url: "/",
  },
  twitter: {
    card: "summary_large_image", site: "@boredfolio", creator: "@boredfolio",
    title: "Your mutual fund has a secret.",
    description: "Boredfolio tells you what your fund actually holds, what it costs, and whether the manager is earning their fee. No commissions. No BS.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://boredfolio.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

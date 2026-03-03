import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6B8F71",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://boredfolio.com"),
  title: { template: "%s | Boredfolio", default: "Boredfolio — India's Most Honest Mutual Fund Platform" },
  description: "We strip funds naked so you can invest with your eyes open. No commissions. No BS. Just data and uncomfortable honesty.",
  keywords: [
    "mutual funds", "India", "mutual fund comparison", "honest fund analysis",
    "direct plan", "SIP calculator", "expense ratio", "Boredfolio",
  ],
  openGraph: {
    title: "Boredfolio", description: "Mutual fund analysis with uncomfortable honesty.",
    siteName: "Boredfolio", locale: "en_IN", type: "website", url: "/",
  },
  twitter: {
    card: "summary_large_image", site: "@boredfolio", creator: "@boredfolio",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}

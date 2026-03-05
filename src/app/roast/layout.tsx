import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roast Your Mutual Fund — AI-Powered Fund Roast",
  description:
    "Enter any mutual fund. Our AI will roast it with real data. NAV, returns, expense ratios — nothing is safe. Share the roast on WhatsApp.",
  openGraph: {
    title: "Roast Your Mutual Fund | Boredfolio",
    description: "Our AI roasts your mutual fund with real data. No feelings were considered.",
    url: "https://boredfolio.com/roast",
  },
};

export default function RoastLayout({ children }: { children: React.ReactNode }) {
  return children;
}

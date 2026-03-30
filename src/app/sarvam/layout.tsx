import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hindi Audio Roasts — Sarvam TTS | Boredfolio",
  description:
    "Your mutual fund roast, now in Hindi audio. Download and forward on WhatsApp. Powered by Sarvam AI.",
  openGraph: {
    title: "Hindi Audio Roasts | Boredfolio",
    description: "Fund roasts in Hindi. Download. Forward on WhatsApp. Watch uncle-ji forward it to 47 groups.",
    url: "https://boredfolio.com/sarvam",
  },
};

export default function SarvamLayout({ children }: { children: React.ReactNode }) {
  return children;
}

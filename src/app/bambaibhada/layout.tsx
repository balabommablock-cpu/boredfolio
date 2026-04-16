import type { Metadata } from "next";

const SITE = "https://boredfolio.com";

export const metadata: Metadata = {
  title: "Bambai Bhada — India's rent map, without the BS",
  description:
    "Drop a pin. Write a message. Leave your Instagram. Done. No login, no phone numbers, no pay-to-contact paywall. Mumbai asks 'will they let me live here?'. Bangalore asks 'is there water?'. Gurgaon asks 'will the city work?'. Bambai Bhada answers all three.",
  keywords: [
    "Bambai Bhada",
    "India rent map",
    "Mumbai rent",
    "Bangalore rent",
    "Gurgaon rent",
    "flatmate finder India",
    "no broker rentals",
    "bachelor friendly flats",
    "non-veg allowed society",
    "Bangalore water crisis",
    "Gurgaon power outage",
    "Flat and Flatmates alternative",
    "99acres alternative",
  ],
  openGraph: {
    title: "Bambai Bhada — India's rent map, without the BS",
    description:
      "Mumbai, Bangalore, Gurgaon. Drop a pin, write a message, leave your Instagram. No login, no paywall.",
    url: `${SITE}/bambaibhada`,
    siteName: "Bambai Bhada",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bambai Bhada — India's rent map, without the BS",
    description:
      "Will they let me live here? Is there water? Will the city work? Bambai Bhada answers all three.",
  },
  alternates: {
    canonical: `${SITE}/bambaibhada`,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Bambai Bhada",
    "theme-color": "#0B0F14",
  },
};

export default function BambaiBhadaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

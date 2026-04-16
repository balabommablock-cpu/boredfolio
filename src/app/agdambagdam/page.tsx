import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agdam Bagdam — Free Open-Source A/B Testing Platform",
  description:
    "The A/B testing platform with better statistics than tools charging $500K/year. Bayesian + Frequentist stats, feature flags, CUPED, sequential testing, SRM detection. Free forever. MIT Licensed.",
  // Override the root layout's mutual-fund keywords for this route.
  keywords: [
    "A/B testing",
    "open source A/B testing",
    "feature flags",
    "Bayesian A/B testing",
    "frequentist A/B testing",
    "SRM detection",
    "sequential testing",
    "CUPED",
    "multi-armed bandits",
    "self-hosted experimentation",
    "Optimizely alternative",
    "LaunchDarkly alternative",
    "VWO alternative",
    "GrowthBook alternative",
  ],
  // Override the root layout's canonical (which points to boredfolio.com).
  alternates: {
    canonical: "https://boredfolio.com/agdambagdam",
  },
  openGraph: {
    title: "Agdam Bagdam — Test Everything. Pay Nothing.",
    description:
      "Free, open-source A/B testing with better statistics than Optimizely, VWO, and LaunchDarkly. Self-host it. Own your data. Forever.",
    siteName: "Agdam Bagdam",
    type: "website",
    url: "https://boredfolio.com/agdambagdam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agdam Bagdam — Test Everything. Pay Nothing.",
    description:
      "Free, open-source A/B testing that makes $500K/year tools obsolete. Bayesian + Frequentist stats, feature flags, sequential testing, SRM detection.",
  },
  robots: { index: true, follow: true },
};

export default function AgdamBagdamPage() {
  return (
    <iframe
      src="https://abacus-eight-kappa.vercel.app"
      style={{
        width: "100vw",
        height: "100vh",
        border: "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      title="Agdam Bagdam — A/B Testing Platform"
      // Restrict the iframed SPA to what it actually needs. If a future feature
      // requires postMessage back to this parent, handle it via addEventListener
      // and strictly check event.origin === "https://abacus-eight-kappa.vercel.app".
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="strict-origin-when-cross-origin"
      loading="eager"
      allow="clipboard-write"
    />
  );
}

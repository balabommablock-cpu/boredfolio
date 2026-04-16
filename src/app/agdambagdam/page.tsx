import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agdam Bagdam — Free Open-Source A/B Testing Platform",
  description: "The A/B testing platform with better statistics than tools charging $500K/year. Bayesian + Frequentist stats, feature flags, CUPED, sequential testing, SRM detection. Free forever. MIT Licensed.",
  openGraph: {
    title: "Agdam Bagdam — Test Everything. Pay Nothing.",
    description: "Free, open-source A/B testing with better statistics than Optimizely, VWO, and LaunchDarkly. Self-host it. Own your data. Forever.",
    siteName: "Agdam Bagdam",
    type: "website",
    url: "https://boredfolio.com/agdambagdam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agdam Bagdam — Test Everything. Pay Nothing.",
    description: "Free, open-source A/B testing that makes $500K/year tools obsolete. Bayesian + Frequentist stats, feature flags, sequential testing, SRM detection.",
  },
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
    />
  );
}

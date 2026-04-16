import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agdam Bagdam — API Documentation",
  description:
    "Complete API documentation for Agdam Bagdam. Create experiments, assign variants, track events, analyze results.",
  keywords: [
    "A/B testing API",
    "feature flag API",
    "experiment API docs",
    "Agdam Bagdam docs",
    "SRM detection API",
    "Bayesian A/B API",
  ],
  alternates: {
    canonical: "https://boredfolio.com/agdambagdam/docs",
  },
  openGraph: {
    title: "Agdam Bagdam — API Documentation",
    description:
      "REST API reference and SDK snippets for Agdam Bagdam. Experiments, variants, events, flags, results.",
    url: "https://boredfolio.com/agdambagdam/docs",
    siteName: "Agdam Bagdam",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agdam Bagdam — API Documentation",
    description:
      "REST API reference and SDK snippets for Agdam Bagdam. Experiments, variants, events, flags, results.",
  },
  robots: { index: true, follow: true },
};

export default function DocsPage() {
  return (
    <iframe
      src="https://abacus-eight-kappa.vercel.app/docs"
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
      title="Agdam Bagdam — API Documentation"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="strict-origin-when-cross-origin"
      loading="eager"
      allow="clipboard-write"
    />
  );
}

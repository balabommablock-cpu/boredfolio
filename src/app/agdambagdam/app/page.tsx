import type { Metadata } from "next";

/**
 * The authenticated Agdam Bagdam dashboard.
 *
 * We embed the React SPA hosted at abacus-eight-kappa.vercel.app via an
 * iframe. The marketing landing page at `/agdambagdam` links here via the
 * "Open dashboard" CTA. Keeping the SPA origin separate gives it its own
 * CSP, cookies, and security surface without polluting the marketing page.
 *
 * When the backend moves to a custom API proxy (see next.config.js rewrites
 * for `/agdambagdam/api/*`), this iframe src will point at a same-origin
 * `/agdambagdam/app-spa/` path and the sandbox attribute can tighten.
 */

export const metadata: Metadata = {
  title: "Dashboard — Agdam Bagdam",
  description:
    "Agdam Bagdam dashboard. Create experiments, track events, and analyze results with Bayesian + Frequentist statistics.",
  alternates: {
    canonical: "https://boredfolio.com/agdambagdam/app",
  },
  robots: { index: false, follow: false },
};

export default function AgdamBagdamAppPage() {
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
      title="Agdam Bagdam — Dashboard"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="strict-origin-when-cross-origin"
      loading="eager"
      allow="clipboard-write"
    />
  );
}

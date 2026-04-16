import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agdam Bagdam — API Documentation",
  description: "Complete API documentation for Agdam Bagdam. Create experiments, assign variants, track events, analyze results.",
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
    />
  );
}

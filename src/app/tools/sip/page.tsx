import { Metadata } from "next";
import SIPToolsPage from "@/views/SIPToolsPage";
import { calculatorJsonLd, JsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The Money Math — SIP & Investment Calculators",
  description: "How much will your boring SIP actually make? SIP calculator, step-up SIP, lumpsum vs SIP, and SWP planner.",
};

export default function SIPPage() {
  return (
    <>
      <JsonLd data={calculatorJsonLd()} />
      <SIPToolsPage />
    </>
  );
}

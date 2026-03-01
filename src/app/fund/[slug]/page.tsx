import { Metadata } from "next";
import SchemeDetailPage from "@/views/SchemeDetailPage";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} — Returns, Risk, Holdings`,
    description: `Comprehensive analysis of ${name} with NAV chart, rolling returns, drawdown, expense ratio breakdown, and honest Boredfolio verdict.`,
    openGraph: { title: name, description: `Is ${name} worth your SIP? We break down the numbers.` },
  };
}

export default SchemeDetailPage;

import { Metadata } from "next";
import SchemeDetailPage from "@/views/SchemeDetailPage";
import { smartSlugToName } from "@/lib/slug";
import { SCHEME_CODES } from "@/lib/data";
import { schemeJsonLd, JsonLd } from "@/lib/seo";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = smartSlugToName(params.slug);
  return {
    title: `${name} — Returns, Risk, Holdings`,
    description: `Full analysis of ${name} with NAV chart, rolling returns, drawdown, expense ratio breakdown, and honest Boredfolio verdict.`,
    openGraph: { title: name, description: `Is ${name} worth your SIP? We break down the numbers.` },
  };
}

export function generateStaticParams() {
  return Object.keys(SCHEME_CODES).map((slug) => ({ slug }));
}

export default function FundPage({ params }: Props) {
  const name = smartSlugToName(params.slug);
  return (
    <>
      <JsonLd
        data={schemeJsonLd({
          name,
          amcName: name.split(" ")[0],
          category: "Mutual Fund",
          nav: 0,
          navDate: new Date().toISOString().split("T")[0],
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://boredfolio.com"}/fund/${params.slug}`,
        })}
      />
      <SchemeDetailPage />
    </>
  );
}

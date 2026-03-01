import { Metadata } from "next";
import { ArticlePage } from "@/views/BlogPage";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title,
    description: `Read "${title}" on the Boredfolio Blog — unfiltered mutual fund analysis.`,
    openGraph: { type: "article" },
  };
}

export default ArticlePage;

import { Metadata } from "next";
import { ArticlePage } from "@/views/BlogPage";
import { smartSlugToName } from "@/lib/slug";
import { articleJsonLd, JsonLd } from "@/lib/seo";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = smartSlugToName(params.slug);
  return {
    title,
    description: `Read "${title}" on the Boredfolio Blog — unfiltered mutual fund analysis.`,
    openGraph: {
      type: "article",
      publishedTime: new Date().toISOString(),
    },
  };
}

export default function BlogArticlePage({ params }: Props) {
  const title = smartSlugToName(params.slug);
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title,
          excerpt: `Read "${title}" on the Boredfolio Blog — unfiltered mutual fund analysis.`,
          publishDate: new Date().toISOString(),
          author: "Boredfolio",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://boredfolio.com"}/blog/${params.slug}`,
        })}
      />
      <ArticlePage />
    </>
  );
}

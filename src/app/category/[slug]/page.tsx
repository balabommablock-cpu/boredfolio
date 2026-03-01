import { Metadata } from "next";
import CategoryPage from "@/views/CategoryPage";
import { smartSlugToName } from "@/lib/slug";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = smartSlugToName(params.slug);
  return {
    title: `${name} Mutual Funds — Best Funds, Returns, Comparison`,
    description: `Complete guide to ${name} mutual funds in India. Top performers, return distribution, leaderboards, and educational content.`,
  };
}

export default CategoryPage;

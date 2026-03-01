import { Metadata } from "next";
import CategoryPage from "@/views/CategoryPage";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} Mutual Funds — Best Funds, Returns, Comparison`,
    description: `Complete guide to ${name} mutual funds in India. Top performers, return distribution, leaderboards, and educational content.`,
  };
}

export default CategoryPage;

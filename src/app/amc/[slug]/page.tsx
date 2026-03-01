import { Metadata } from "next";
import AMCPage from "@/views/AMCPage";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} — Fund Lineup, Managers, Report Card`,
    description: `Everything about ${name}: fund lineup, fund manager profiles, expense ratio analysis, and Boredfolio report card.`,
  };
}

export default AMCPage;

import { Metadata } from "next";
import AMCPage from "@/views/AMCPage";
import { smartSlugToName } from "@/lib/slug";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = smartSlugToName(params.slug);
  return {
    title: `${name} — Fund Lineup, Managers, Report Card`,
    description: `Everything about ${name}: fund lineup, fund manager profiles, expense ratio analysis, and Boredfolio report card.`,
  };
}

export default AMCPage;

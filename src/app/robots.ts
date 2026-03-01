import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/compare"], // compare is session-based, no SEO value
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://boredfolio.com"}/sitemap.xml`,
  };
}

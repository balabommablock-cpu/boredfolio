/*
 * STRUCTURED DATA (JSON-LD)
 * ─────────────────────────
 * Generates JSON-LD for rich Google search results.
 * Used in scheme detail, blog articles, and tool pages.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://boredfolio.com";

export function schemeJsonLd(scheme: {
  name: string;
  amcName: string;
  category: string;
  nav: number;
  navDate: string;
  description?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: scheme.name,
    provider: {
      "@type": "FinancialService",
      name: scheme.amcName,
    },
    category: `Mutual Fund - ${scheme.category}`,
    description: scheme.description || `${scheme.name} by ${scheme.amcName}. Category: ${scheme.category}. Current NAV: ₹${scheme.nav}`,
    url: scheme.url,
    offers: {
      "@type": "Offer",
      price: scheme.nav,
      priceCurrency: "INR",
      priceValidUntil: scheme.navDate,
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  excerpt: string;
  publishDate: string;
  author: string;
  url: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishDate,
    author: {
      "@type": "Organization",
      name: article.author || "Boredfolio",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Boredfolio",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    ...(article.imageUrl && { image: article.imageUrl }),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function calculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Boredfolio SIP Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };
}

/* ── Helper to render JSON-LD script tag ── */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

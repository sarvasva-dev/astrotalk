import type { Counsellor, AstrologyArticle } from "../types";

/**
 * Updates document title, meta descriptions, and OpenGraph tags dynamically
 */
export function updateSEO(options: {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string[];
  ogImage?: string;
  type?: "website" | "article" | "profile";
}) {
  if (typeof document === "undefined") return;

  // Title
  document.title = options.title.includes("Astroguru")
    ? options.title
    : `${options.title} — Astroguru`;

  // Standard Meta Description
  setMetaTag("description", options.description);

  if (options.keywords && options.keywords.length > 0) {
    setMetaTag("keywords", options.keywords.join(", "));
  }

  // Open Graph
  setMetaProperty("og:title", document.title);
  setMetaProperty("og:description", options.description);
  setMetaProperty("og:type", options.type || "website");

  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://astroguru.com";
  const canonicalUrl = options.canonicalPath ? `${appUrl}${options.canonicalPath}` : window.location.href;

  setMetaProperty("og:url", canonicalUrl);
  setMetaProperty("og:image", options.ogImage || `${appUrl}/og-astroguru.png`);
  setMetaProperty("og:site_name", "Astroguru");

  // Twitter Cards
  setMetaTag("twitter:card", "summary_large_image");
  setMetaTag("twitter:title", document.title);
  setMetaTag("twitter:description", options.description);

  // Canonical link tag
  let linkCanonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!linkCanonical) {
    linkCanonical = document.createElement("link");
    linkCanonical.rel = "canonical";
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.href = canonicalUrl;
}

function setMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setMetaProperty(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/**
 * Injects or updates a Schema.org JSON-LD structured script in the document head
 */
export function injectJsonLd(schemaId: string, schemaData: object) {
  if (typeof document === "undefined") return;

  let script = document.getElementById(schemaId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = schemaId;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaData);
}

/**
 * Injects Organization & WebSite Schema
 */
export function injectOrganizationAndWebsiteSchema() {
  injectJsonLd("schema-organization", {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Astroguru",
    alternateName: "Astroguru Vedic Astrology Services",
    url: typeof window !== "undefined" ? window.location.origin : "https://astroguru.com",
    logo: "https://astroguru.com/logo.png",
    sameAs: [
      "https://www.facebook.com/astroguru",
      "https://www.instagram.com/astroguru",
      "https://twitter.com/astroguru",
      "https://www.youtube.com/c/astroguru"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-80-6900-8800",
      contactType: "Customer Support",
      availableLanguage: ["Hindi", "English", "Tamil", "Telugu", "Marathi", "Bengali"]
    }
  });

  injectJsonLd("schema-website", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Astroguru",
    url: typeof window !== "undefined" ? window.location.origin : "https://astroguru.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${typeof window !== "undefined" ? window.location.origin : "https://astroguru.com"}/consult?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  });
}

/**
 * Injects Astrologer Profile Person & AggregateRating schema
 */
export function injectAstrologerProfileSchema(counsellor: Counsellor) {
  injectJsonLd(`schema-astrologer-${counsellor.slug}`, {
    "@context": "https://schema.org",
    "@type": "Person",
    name: counsellor.name,
    jobTitle: "Vedic Astrologer & Spiritual Counsellor",
    description: counsellor.bio,
    image: counsellor.portrait,
    knowsAbout: counsellor.specialties,
    knowsLanguage: counsellor.languages,
    workLocation: {
      "@type": "Place",
      name: counsellor.hometown,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: counsellor.rating.toString(),
      bestRating: "5",
      ratingCount: counsellor.ordersCount.toString(),
      reviewCount: Math.round(counsellor.ordersCount * 0.42).toString(),
    },
    offers: {
      "@type": "Offer",
      price: counsellor.pricePerMin.toString(),
      priceCurrency: "INR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: counsellor.pricePerMin.toString(),
        priceCurrency: "INR",
        unitText: "per minute",
      },
      availability: "https://schema.org/InStock",
    },
  });
}

/**
 * Injects FAQPage schema for rich snippet results
 */
export function injectFaqSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return;

  injectJsonLd("schema-faq", {
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
  });
}

/**
 * Injects Article schema for SEO content hub
 */
export function injectArticleSchema(article: AstrologyArticle) {
  injectJsonLd(`schema-article-${article.slug}`, {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedDate,
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "Astroguru",
      logo: {
        "@type": "ImageObject",
        url: "https://astroguru.com/logo.png",
      },
    },
    keywords: article.tags.join(", "),
  });
}

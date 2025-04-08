import { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  ogImage,
  canonical,
  noIndex = false,
}: SEOProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: canonical,
    },
    robots: noIndex ? "noindex, nofollow" : "index, follow",
  };
}
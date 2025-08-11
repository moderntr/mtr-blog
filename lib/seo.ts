import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

export function generateSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  tags
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogs.moderntrademarket.com/';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/banner.png`;

  const metadata: Metadata = {
    title: title ? `${title} | E-Commerce Blog` : 'E-Commerce Blog | Share Insights and Boost Sales',
    description: description || 'Discover the latest trends, tips, and insights about our products and industry through our regularly updated blog.',
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      siteName: 'E-Commerce Blog',
      title: title || 'E-Commerce Blog | Share Insights and Boost Sales',
      description: description || 'Discover the latest trends, tips, and insights about our products and industry through our regularly updated blog.',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || 'E-Commerce Blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || 'E-Commerce Blog | Share Insights and Boost Sales',
      description: description || 'Discover the latest trends, tips, and insights about our products and industry through our regularly updated blog.',
      creator: '@ecommerceblog',
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  };

  // Add article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: authors?.map(author => `${baseUrl}/authors/${author}`),
      tags,
    };
  }

  return metadata;
}

export function generateStructuredData(data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime,
    author: {
      '@type': 'Person',
      name: data.author?.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'E-Commerce Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
  };
}
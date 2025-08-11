import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogs.moderntrademarket.com/';
  
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /writer/
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /profile

# Allow important pages
Allow: /
Allow: /blog/
Allow: /categories/
Allow: /about
Allow: /contact
Allow: /latest`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
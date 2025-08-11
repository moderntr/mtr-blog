
import { generateSEO } from "@/lib/seo";
import { Metadata } from "next";
import PostDetail from "./PostDetailClient";

// https://blogs.moderntrademarket.com/
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${params.slug}`);
    if (!response.ok) throw new Error('Post not found');
    
    const { data: post } = await response.json();
    
    return generateSEO({
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      image: post.featuredImage,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author?.name],
      tags: post.tags,
    });
  } catch (error) {
    return generateSEO({});
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  return <PostDetail slug={params.slug} />;
}

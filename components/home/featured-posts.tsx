"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { postsAPI } from "@/lib/api";
import { toast } from "sonner";

interface Post {
  _id: string;
  slug?: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category?: { name: string };
  readingTime?: string;
  createdAt: string;
  author?: {
    name?: string;
    avatar?: string;
  };
  views?: number;
  commentsCount?: number;
  likesCount?: number;
}

export default function FeaturedPosts() {
  const [loading, setLoading] = useState(true);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getFeaturedPosts();
        const posts = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        setFeaturedPosts(posts);
        console.log("Featured posts fetched:", posts);
      } catch (error) {
        console.error("Failed to fetch featured posts:", error);
        toast.error("Failed to load featured posts");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative h-48">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center pt-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-3 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!Array.isArray(featuredPosts) || featuredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured posts available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredPosts.map((post) => (
        <Link
          href={`/blog/${post.slug || post._id}`}
          key={post._id}
          className="group"
        >
          <Card
            className={cn(
              "overflow-hidden h-full transition-all duration-300 hover:shadow-lg",
              "hover:translate-y-[-4px]"
            )}
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.featuredImage || "/placeholder-post.jpg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              {post.category?.name && (
                <Badge className="absolute top-3 left-3 z-10">
                  {post.category.name}
                </Badge>
              )}
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {post.excerpt || post.content.substring(0, 100) + "..."}
              </p>

              <div className="flex items-center mb-4 text-sm text-muted-foreground">
                <span>{post.readingTime || "5"} min read</span>
                <span className="mx-2">•</span>
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={post.author?.avatar || "/default-avatar.jpg"}
                    alt={post.author?.name || "Author"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="ml-2 text-sm font-medium">
                    {post.author?.name || "Unknown Author"}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-muted-foreground">
                  <span className="flex items-center text-xs">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    {post.views || 0}
                  </span>
                  <span className="flex items-center text-xs">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    {post.commentsCount || 0}
                  </span>
                  <span className="flex items-center text-xs">
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                    {post.likesCount || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

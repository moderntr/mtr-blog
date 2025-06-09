"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { postsAPI } from "@/lib/api";

export default function LatestPosts() {
  const [loading, setLoading] = useState(true);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestPosts() {
      setLoading(true);
      try {
        const response = await postsAPI.getPosts({
          sort: "-createdAt",     // matches backend logic
          page: 1,
          limit: 400,               // just the latest 4
          status: "published"     // optional, defaults in backend
        });

        if (response.data.success) {
          setLatestPosts(response.data.data); // using `data.data`
        } else {
          setError("Failed to load posts.");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    }

    fetchLatestPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative h-40">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center pt-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="ml-2 space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-14" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 mx-14">
      {latestPosts.map((post) => (
        <Link 
          key={post._id || post.id} 
          href={`/blog/${post.slug || post._id}`} 
          className="group"
        >
          <Card className={cn(
            "overflow-hidden h-full transition-all duration-300 hover:shadow-md",
            "hover:translate-y-[-4px]"
          )}>
            <div className="relative h-40 overflow-hidden">
              <Image
                src={post.featuredImage || "/placeholder.png"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {post.categories?.[0]?.name && (
                <Badge className="absolute top-3 left-3 z-10">
                  {post.categories[0].name}
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                <span>{post.readTime || ""}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={post.author?.avatar || "/default-avatar.png"}
                    alt={post.author?.name || "Author"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="ml-2 text-xs font-medium truncate max-w-[80px]">
                    {post.author?.name || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {post.comments?.length ?? 0}
                  </span>
                  <span className="flex items-center text-xs">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {post.likes?.length ?? 0}
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

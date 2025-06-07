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

// Temporary mock data until API is connected
const MOCK_LATEST_POSTS = [
  {
    id: "4",
    title: "Creating an Effective E-Commerce Content Strategy",
    excerpt: "Learn how to develop content that drives traffic, engages customers, and boosts conversions for your online store.",
    featuredImage: "https://images.pexels.com/photos/1496192/pexels-photo-1496192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    category: "Marketing",
    author: {
      name: "David Williams",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg"
    },
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    readTime: "7 min read",
    views: 856,
    comments: 14,
    likes: 67
  },
  {
    id: "5",
    title: "Mobile Optimization Tips for Higher E-Commerce Conversion Rates",
    excerpt: "Discover strategies to improve your mobile shopping experience and increase conversion rates on smartphones and tablets.",
    featuredImage: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    category: "Design",
    author: {
      name: "Jennifer Lee",
      avatar: "https://randomuser.me/api/portraits/women/23.jpg"
    },
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    readTime: "9 min read",
    views: 1243,
    comments: 19,
    likes: 88
  },
  {
    id: "6",
    title: "How to Effectively Use Social Proof in Your E-Commerce Store",
    excerpt: "Learn how to leverage customer reviews, testimonials, and social validation to build trust and increase sales.",
    featuredImage: "https://images.pexels.com/photos/6224/hands-people-woman-working.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    category: "Marketing",
    author: {
      name: "Robert Turner",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    readTime: "6 min read",
    views: 932,
    comments: 11,
    likes: 53
  },
  {
    id: "7",
    title: "Building an E-Commerce Brand That Stands Out from Competition",
    excerpt: "Strategies for creating a distinctive brand identity that resonates with your target audience and differentiates you in the market.",
    featuredImage: "https://images.pexels.com/photos/3977908/pexels-photo-3977908.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    category: "Business",
    author: {
      name: "Sophia Garcia",
      avatar: "https://randomuser.me/api/portraits/women/57.jpg"
    },
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    readTime: "8 min read",
    views: 1023,
    comments: 16,
    likes: 71
  }
];

export default function LatestPosts() {
  const [loading, setLoading] = useState(true);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLatestPosts(MOCK_LATEST_POSTS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {latestPosts.map((post) => (
        <Link 
          href={`/blog/${post.id}`} 
          key={post.id}
          className="group"
        >
          <Card className={cn(
            "overflow-hidden h-full transition-all duration-300 hover:shadow-md",
            "hover:translate-y-[-4px]"
          )}>
            <div className="relative h-40 overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <Badge className="absolute top-3 left-3 z-10">
                {post.category}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>{formatDistanceToNow(post.date, { addSuffix: true })}</span>
                <span>{post.readTime}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="ml-2 text-xs font-medium truncate max-w-[80px]">
                    {post.author.name}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {post.comments}
                  </span>
                  <span className="flex items-center text-xs">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {post.likes}
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
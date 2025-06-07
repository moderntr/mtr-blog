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
const MOCK_FEATURED_POSTS = [
  {
    id: "1",
    title: "7 E-Commerce Trends That Will Define 2025",
    excerpt: "Discover the emerging technologies and strategies that will shape the e-commerce landscape in the coming year.",
    featuredImage: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    category: "Trends",
    author: {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    readTime: "6 min read",
    views: 1243,
    comments: 18,
    likes: 94
  },
  {
    id: "2",
    title: "How AI is Revolutionizing Customer Service in E-Commerce",
    excerpt: "Explore how artificial intelligence is transforming customer support and driving satisfaction in online retail.",
    featuredImage: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    category: "Technology",
    author: {
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    readTime: "8 min read",
    views: 2105,
    comments: 31,
    likes: 127
  },
  {
    id: "3",
    title: "The Psychology of Color in E-Commerce Design",
    excerpt: "Learn how color choices influence customer behavior and how to leverage color psychology to increase conversions.",
    featuredImage: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    category: "Design",
    author: {
      name: "Emma Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    readTime: "5 min read",
    views: 1876,
    comments: 24,
    likes: 112
  }
];

export default function FeaturedPosts() {
  const [loading, setLoading] = useState(true);
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setFeaturedPosts(MOCK_FEATURED_POSTS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredPosts.map((post, index) => (
        <Link 
          href={`/blog/${post.id}`} 
          key={post.id}
          className="group"
        >
          <Card className={cn(
            "overflow-hidden h-full transition-all duration-300 hover:shadow-lg",
            "hover:translate-y-[-4px]"
          )}>
            <div className="relative h-48 overflow-hidden">
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
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center mb-4 text-sm text-muted-foreground">
                <span>{post.readTime}</span>
                <span className="mx-2">•</span>
                <span>{formatDistanceToNow(post.date, { addSuffix: true })}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="ml-2 text-sm font-medium">{post.author.name}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="flex items-center text-xs">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    {post.views}
                  </span>
                  <span className="flex items-center text-xs">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    {post.comments}
                  </span>
                  <span className="flex items-center text-xs">
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" />
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
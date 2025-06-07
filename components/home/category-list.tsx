"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Temporary mock data until API is connected
const MOCK_CATEGORIES = [
  {
    id: "marketing",
    name: "Marketing",
    description: "Strategies to promote your products and reach your target audience",
    image: "https://images.pexels.com/photos/1447418/pexels-photo-1447418.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    count: 42
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    description: "Best practices for running successful online stores",
    image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    count: 38
  },
  {
    id: "technology",
    name: "Technology",
    description: "Latest tech innovations transforming the e-commerce landscape",
    image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    count: 31
  },
  {
    id: "business",
    name: "Business",
    description: "Insights on business models, operations, and growth strategies",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    count: 27
  },
  {
    id: "design",
    name: "Design",
    description: "UX/UI design principles to create engaging shopping experiences",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    count: 19
  },
  {
    id: "customer-experience",
    name: "Customer Experience",
    description: "Enhancing customer satisfaction and building loyalty",
    image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    count: 24
  }
];

export default function CategoryList() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setCategories(MOCK_CATEGORIES);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative h-40">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link 
          href={`/categories/${category.id}`} 
          key={category.id}
          className="group"
        >
          <Card className={cn(
            "overflow-hidden h-full transition-all duration-300 hover:shadow-lg",
            "hover:translate-y-[-4px]"
          )}>
            <div className="relative h-40 overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-semibold text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-white/80">
                  {category.count} articles
                </p>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-muted-foreground line-clamp-2">
                {category.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
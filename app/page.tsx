import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FeaturedPosts from "@/components/home/featured-posts";
import CategoryList from "@/components/home/category-list";
import LatestPosts from "@/components/home/latest-posts";
import NewsletterSection from "@/components/home/newsletter-section";

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 z-10" />

        {/* Full Cover Image */}
        <Image
          src="/banner.png" // Make sure this is the correct path in `public/`
          alt="Blog hero image"
          fill
          priority
          className="object-cover"
        />

        {/* Content */}
        <div className="container mx-auto px-4 md:px-6 relative z-20 h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
              Insights That Drive E-Commerce Success
            </h1>
            <p className="text-base md:text-lg mb-6 text-muted-foreground animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Expert advice, industry trends, and success stories to help your
              online business thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-200">
              <Button size="lg" asChild>
                <Link href="/latest">Read Latest Articles</Link>
              </Button>
              {/* <Button size="lg" variant="outline" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-5 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
            Featured Articles
          </h2>
          <FeaturedPosts />
        </div>
      </section>

      {/* Categories */}
      {/* <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
            Explore By Category
          </h2>
          <CategoryList />
        </div>
      </section> */}

      {/* Latest Posts */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Latest Articles
            </h2>
            <Button variant="outline" asChild>
              <Link href="/latest">View All</Link>
            </Button>
          </div>
          <LatestPosts />
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}

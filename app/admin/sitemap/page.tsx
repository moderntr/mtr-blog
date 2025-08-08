"use client";

import { useState } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { ExternalLink, RefreshCw, Download, Globe } from "lucide-react";
import { toast } from "sonner";

export default function SitemapPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({
    totalUrls: 0,
    posts: 0,
    categories: 0,
    staticPages: 0
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/');
      } else {
        setIsAuthorized(true);
        loadSitemapInfo();
      }
    }
  }, [user, loading, router]);

  const loadSitemapInfo = async () => {
    try {
      const baseUrl = window.location.origin;
      setSitemapUrl(`${baseUrl}/sitemap.xml`);
      
      // Get stats from your APIs
      const [postsRes, categoriesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?status=published&limit=1`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      ]);

      const postsData = await postsRes.json();
      const categoriesData = await categoriesRes.json();

      const staticPages = 4; // home, about, contact, latest
      const posts = postsData.pagination?.total || 0;
      const categories = categoriesData.data?.length || 0;

      setStats({
        totalUrls: staticPages + posts + categories,
        posts,
        categories,
        staticPages
      });

      setLastGenerated(new Date());
    } catch (error) {
      console.error('Error loading sitemap info:', error);
      toast.error('Failed to load sitemap information');
    }
  };

  const generateSitemap = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/sitemap.xml');
      if (response.ok) {
        toast.success('Sitemap generated successfully!');
        setLastGenerated(new Date());
        loadSitemapInfo();
      } else {
        throw new Error('Failed to generate sitemap');
      }
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast.error('Failed to generate sitemap');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSitemap = () => {
    window.open(sitemapUrl, '_blank');
  };

  const submitToSearchEngines = () => {
    const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    window.open(googleUrl, '_blank');
    setTimeout(() => {
      window.open(bingUrl, '_blank');
    }, 1000);
    
    toast.success('Sitemap submitted to search engines!');
  };

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sitemap Management</h1>
          <p className="text-muted-foreground">
            Manage your website's sitemap for better SEO
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Total URLs</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.totalUrls}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Blog Posts</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.posts}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Categories</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.categories}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground">Static Pages</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.staticPages}</h3>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Information</CardTitle>
              <CardDescription>
                Current sitemap details and generation status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Sitemap URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={sitemapUrl} readOnly />
                  <Button variant="outline" size="icon" onClick={downloadSitemap}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Last Generated</Label>
                <div className="mt-1">
                  {lastGenerated ? (
                    <Badge variant="outline">
                      {lastGenerated.toLocaleString()}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Never</Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={generateSitemap} disabled={isGenerating}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Generating...' : 'Regenerate Sitemap'}
                </Button>
                <Button variant="outline" onClick={downloadSitemap}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search Engine Submission</CardTitle>
              <CardDescription>
                Submit your sitemap to search engines for better indexing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Submit your sitemap to Google and Bing to help search engines discover and index your content.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Google Search Console</li>
                  <li>• Bing Webmaster Tools</li>
                </ul>
              </div>

              <Button onClick={submitToSearchEngines} className="w-full">
                <Globe className="mr-2 h-4 w-4" />
                Submit to Search Engines
              </Button>

              <div className="text-xs text-muted-foreground">
                <p>Note: You'll need to verify your website ownership in Google Search Console and Bing Webmaster Tools first.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>SEO Best Practices</CardTitle>
            <CardDescription>
              Tips to improve your website's search engine optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Sitemap Benefits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Helps search engines discover your content</li>
                  <li>• Improves indexing of new and updated pages</li>
                  <li>• Provides metadata about your pages</li>
                  <li>• Supports better crawling efficiency</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Update sitemap when adding new content</li>
                  <li>• Submit to Google Search Console</li>
                  <li>• Monitor crawl errors regularly</li>
                  <li>• Keep URLs under 2,048 characters</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
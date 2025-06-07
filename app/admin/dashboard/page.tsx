"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Cell
} from "recharts";
import { 
  Users, FileText, MessageSquare, Tag, BarChart2, PlusCircle,
  Eye, ThumbsUp, BookOpen
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

// Temporary mock data
const viewsData = [
  { name: "Jan", views: 4000 },
  { name: "Feb", views: 3000 },
  { name: "Mar", views: 5000 },
  { name: "Apr", views: 4500 },
  { name: "May", views: 6000 },
  { name: "Jun", views: 5500 },
  { name: "Jul", views: 7000 },
];

const engagementData = [
  { name: "Jan", comments: 240, likes: 400 },
  { name: "Feb", comments: 300, likes: 450 },
  { name: "Mar", comments: 280, likes: 410 },
  { name: "Apr", comments: 320, likes: 480 },
  { name: "May", comments: 305, likes: 460 },
  { name: "Jun", comments: 340, likes: 490 },
  { name: "Jul", comments: 380, likes: 520 },
];

const categoryData = [
  { name: "Marketing", value: 400, color: "hsl(var(--chart-1))" },
  { name: "E-Commerce", value: 300, color: "hsl(var(--chart-2))" },
  { name: "Technology", value: 300, color: "hsl(var(--chart-3))" },
  { name: "Business", value: 200, color: "hsl(var(--chart-4))" },
  { name: "Design", value: 100, color: "hsl(var(--chart-5))" },
];

const recentPosts = [
  {
    id: "1",
    title: "7 E-Commerce Trends That Will Define 2025",
    author: "Sarah Johnson",
    date: "2 days ago",
    views: 1243,
    comments: 18,
    status: "published"
  },
  {
    id: "2",
    title: "How AI is Revolutionizing Customer Service in E-Commerce",
    author: "Michael Chen",
    date: "5 days ago",
    views: 2105,
    comments: 31,
    status: "published"
  },
  {
    id: "3",
    title: "The Psychology of Color in E-Commerce Design",
    author: "Emma Rodriguez",
    date: "7 days ago",
    views: 1876,
    comments: 24,
    status: "published"
  },
  {
    id: "4",
    title: "Creating an Effective E-Commerce Content Strategy",
    author: "David Williams",
    date: "1 day ago",
    views: 856,
    comments: 14,
    status: "draft"
  }
];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Posts</p>
                <h3 className="text-3xl font-bold mt-2">142</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+12%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Comments</p>
                <h3 className="text-3xl font-bold mt-2">842</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+18%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Active Users</p>
                <h3 className="text-3xl font-bold mt-2">2,487</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+7%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Categories</p>
                <h3 className="text-3xl font-bold mt-2">18</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Tag className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-muted">+0</span> from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics">
        <TabsList className="mb-6">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Views</CardTitle>
                <CardDescription>View trends over the last 7 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Comments and likes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="comments" fill="hsl(var(--chart-2))" />
                    <Bar dataKey="likes" fill="hsl(var(--chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content by Category</CardTitle>
              <CardDescription>Distribution of content across categories</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full max-w-md">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>
                Recently published and draft posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1 mb-3 md:mb-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium line-clamp-1">{post.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          post.status === 'published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        by {post.author} • {post.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {post.views}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        {post.comments}
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/posts/${post.id}`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/admin/posts">View All Posts</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
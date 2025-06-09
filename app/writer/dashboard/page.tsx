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
  Users, FileText, MessageSquare as MsgIcon, Tag, PlusCircle,
  Eye, BookOpen
} from "lucide-react";
import { MessageSquare } from "lucide-react";

import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { postsAPI, commentsAPI, usersAPI, categoriesAPI } from "@/lib/api";
import { toast } from "sonner";

// Static charts data (you can replace with real analytics later)
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

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Real data states
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/');
      } else {
        setIsAuthorized(true);
        loadDashboardData();
      }
    }
  }, [user, loading, router]);

  const loadDashboardData = async () => {
    try {
      // Fetch counts from APIs (assuming your API returns paginated data with total counts)
      const postsResp = await postsAPI.getPosts({ limit: 1 });
      setTotalPosts(postsResp.data.total || postsResp.data.data.length);

      const commentsResp = await commentsAPI.getComments({ limit: 1 });
      setTotalComments(commentsResp.data.total || commentsResp.data.data.length);

      const usersResp = await usersAPI.getUsers({ limit: 1 });
      setTotalUsers(usersResp.data.total || usersResp.data.data.length);

      const categoriesResp = await categoriesAPI.getCategories();
      setTotalCategories(categoriesResp.data.length);

      // Fetch recent 5 posts sorted by creation date descending
      const recentPostsResp = await postsAPI.getPosts({ limit: 5, sort: "-createdAt" });
      setRecentPosts(recentPostsResp.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    }
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
      <div className="flex items-center justify-between mb-6 ">
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
                <h3 className="text-3xl font-bold mt-2">{totalPosts}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
            {/* You can customize the percentage from last month if you get that data */}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Comments</p>
                <h3 className="text-3xl font-bold mt-2">{totalComments}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Active Users</p>
                <h3 className="text-3xl font-bold mt-2">{totalUsers}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Categories</p>
                <h3 className="text-3xl font-bold mt-2">{totalCategories}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Tag className="h-6 w-6 text-primary" />
              </div>
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
          </div>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Latest posts created on your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.length === 0 && <p>No recent posts found.</p>}
              {recentPosts.map((post) => (
                <div
                  key={post.id || post._id}
                  className="flex justify-between items-center border-b border-gray-200 py-2"
                >
                  <div>
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" /> <span>{post.views || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MsgIcon className="h-4 w-4" /> <span>{post.commentsCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" /> <span>{post.readingTime || "—"} min read</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

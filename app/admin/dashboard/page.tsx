// app/admin/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, Line, BarChart, Bar, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip 
} from "recharts";
import { 
  FileText, MessageSquare, Users, Tags, PlusCircle 
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { postsAPI, usersAPI, commentsAPI, categoriesAPI } from "@/lib/api";

// Mock data for charts
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

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    posts: 0,
    comments: 0,
    users: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          postsRes, 
          commentsRes, 
          usersRes, 
          categoriesRes
        ] = await Promise.all([
          postsAPI.getPosts({ limit: 1 }),
          commentsAPI.getComments({ limit: 1 }),
          usersAPI.getUsers({ limit: 1 }),
          categoriesAPI.getCategories(),
        ]);

        setStats({
          posts: postsRes.data.pagination.total,
          comments: commentsRes.data.pagination.total,
          users: usersRes.data.pagination.total,
          categories: categoriesRes.data.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {user?.role === 'admin' || user?.role === 'writer' ? (
          <Button asChild>
            <Link href="/admin/posts/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Posts" 
          value={stats.posts} 
          icon={FileText} 
          change="+12% from last month" 
        />
        <StatCard 
          title="Total Comments" 
          value={stats.comments} 
          icon={MessageSquare} 
          change="+18% from last month" 
        />
        <StatCard 
          title="Active Users" 
          value={stats.users} 
          icon={Users} 
          change="+7% from last month" 
        />
        <StatCard 
          title="Categories" 
          value={stats.categories} 
          icon={Tags} 
          change="+0 from last month" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="comments" fill="#82ca9d" />
                <Bar dataKey="likes" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  change,
}: {
  title: string;
  value: number;
  icon: any;
  change: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{change}</p>
      </CardContent>
    </Card>
  );
}
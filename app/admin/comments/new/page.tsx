"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { commentsAPI, postsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { toast } from "sonner";

export default function NewCommentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  // Form state
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [postId, setPostId] = useState("");
  const [status, setStatus] = useState("pending");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!["admin", "writer"].includes(user.role)) {
        router.push("/");
      } else {
        setIsAuthorized(true);
        loadPosts();
      }
    }
  }, [user, loading, router]);

  const loadPosts = async () => {
    try {
      const response = await postsAPI.getPosts({ limit: 100, sort: "-createdAt" });
      setPosts(response.data.data);
    } catch {
      toast.error("Failed to load posts");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Comment content is required");
      return;
    }

    if (!postId) {
      toast.error("Please select a post");
      return;
    }

    setLoadingSubmit(true);

    try {
      await commentsAPI.createComment({
        content,
        authorName: authorName || undefined,
        authorEmail: authorEmail || undefined,
        postId,
        status,
      });
      toast.success("Comment created successfully");
      router.push("/admin/comments");
    } catch {
      toast.error("Failed to create comment");
    } finally {
      setLoadingSubmit(false);
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
      <Card>
        <CardHeader>
          <CardTitle>New Comment</CardTitle>
          <CardDescription>Create a new comment manually</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            <div>
              <label htmlFor="content" className="block mb-1 font-medium">
                Content <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
                placeholder="Write the comment content here"
              />
            </div>

            <div>
              <label htmlFor="authorName" className="block mb-1 font-medium">
                Author Name (optional)
              </label>
              <Input
                id="authorName"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author's name"
              />
            </div>

            <div>
              <label htmlFor="authorEmail" className="block mb-1 font-medium">
                Author Email (optional)
              </label>
              <Input
                id="authorEmail"
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="Author's email"
              />
            </div>

            <div>
              <label htmlFor="postId" className="block mb-1 font-medium">
                Select Post <span className="text-destructive">*</span>
              </label>
              <Select value={postId} onValueChange={setPostId}>
                <SelectTrigger id="postId" aria-label="Select post">
                  <SelectValue placeholder="Select a post" />
                </SelectTrigger>
                <SelectContent>
                  {posts.map((post) => (
                    <SelectItem key={post._id} value={post._id}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="status" className="block mb-1 font-medium">
                Status <span className="text-destructive">*</span>
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" aria-label="Select status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? "Creating..." : "Create Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

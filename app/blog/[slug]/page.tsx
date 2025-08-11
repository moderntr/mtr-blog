"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  ThumbsUp,
  BookOpen,
  Clock,
  User,
  ChevronLeft,
  Edit,
  Trash,
} from "lucide-react";
import { postsAPI, commentsAPI } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { generateSEO, generateStructuredData } from "@/lib/seo";
import { Metadata } from "next";

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${params.slug}`);
    if (!response.ok) throw new Error('Post not found');
    
    const { data: post } = await response.json();
    
    return generateSEO({
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      image: post.featuredImage,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author?.name],
      tags: post.tags,
    });
  } catch (error) {
    return generateSEO({});
  }
}
export default function PostDetailPage() {
  const { slug } = useParams();
  // Define User type with _id property
  type UserWithId = {
    _id: string;
    name?: string;
    avatar?: string;
    // add other properties as needed
  };

  // Use the correct type for user
  const { user } = useAuth() as { user: UserWithId | null };
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        console.log("Fetching post with slug:", slug);

        const response = await postsAPI.getPost(slug as string);
        console.log("Raw API response:", response);

        const postData = response?.data?.data;
        if (!postData) {
          console.warn("Post data not found in response:", response);
          toast.error("Post data not found");
          return;
        }

        console.log("Parsed post data:", postData);

        setPost(postData);
        setIsLiked(postData.isLiked || false);
        setLikesCount(postData.likesCount || 0);
        setViewsCount(postData.views || 0);

        // Fetch comments for this post
        const commentsRes = await commentsAPI.getPostComments(postData._id);
        console.log("Fetched comments:", commentsRes.data);
        // Ensure comments have user populated
        setComments(commentsRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    } else {
      console.warn("Slug is undefined");
    }
  }, [slug]);

  const handleLike = async () => {
    if (!user) {
      toast.info("Please login to like this post");
      return;
    }

    if (!post?._id) {
      console.warn("Post ID not available for like toggle");
      return;
    }

    try {
      const res = await postsAPI.toggleLikePost(post._id);

      if (res?.data?.success) {
        const { action, data } = res.data;

        setIsLiked(action === "liked");
        setLikesCount(data.likesCount ?? 0);

        toast.success(
          action === "liked" ? "You liked this post" : "You unliked this post"
        );
      } else {
        toast.error("Unexpected response from server");
        console.error("Unexpected like toggle response:", res);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("Failed to update like");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) return toast.info("Please login to comment");

    if (!post?._id) {
      console.warn("Post ID not available for comment submission");
      return;
    }

    try {
      const res = await commentsAPI.createComment({
        post: post._id,
        content: commentText,
      });

      console.log("Comment submitted:", res.data);

      // Add new comment to the list
      setComments([res.data.data, ...comments]);

      setCommentText("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment");
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId: string) => {
    if (!user) {
      toast.info("Please login to delete comments");
      return;
    }

    try {
      await commentsAPI.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  // Handle toggling like on a comment
  const handleToggleCommentLike = async (commentId: string) => {
    if (!user) {
      toast.info("Please login to like comments");
      return;
    }
    try {
      const res = await commentsAPI.likeComment(commentId);
      if (res?.data?.success) {
        // Update comment like data in local state
        setComments((prev) =>
          prev.map((c) => {
            if (c._id === commentId) {
              // Toggle like/unlike locally
              const userLiked = c.likes?.includes(user._id);
              let newLikes = c.likes || [];
              if (userLiked) {
                newLikes = newLikes.filter((id: string) => id !== user._id);
              } else {
                newLikes = [...newLikes, user._id];
              }
              return {
                ...c,
                likes: newLikes,
              };
            }
            return c;
          })
        );
      } else {
        toast.error("Failed to toggle comment like");
      }
    } catch (error) {
      console.error("Failed to toggle comment like:", error);
      toast.error("Failed to update comment like");
    }
  };

  // Handle editing comment (start)
  const startEditingComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentContent);
  };

  // Handle editing comment (cancel)
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  // Handle editing comment (submit)
  const submitEditedComment = async (commentId: string) => {
    if (!editingCommentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      // Assume you have an API method to update comments, if not, skip or implement accordingly
      // For now, we simulate updating comment content locally

      // TODO: Replace with API call when available:
      // await commentsAPI.updateComment(commentId, { content: editingCommentText });

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, content: editingCommentText } : c
        )
      );

      setEditingCommentId(null);
      setEditingCommentText("");
      toast.success("Comment updated");
    } catch (error) {
      console.error("Failed to update comment:", error);
      toast.error("Failed to update comment");
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-24 mb-6" />
        <Skeleton className="h-10 w-full mb-4" />
        <div className="flex space-x-4 mb-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-32" />
          ))}
        </div>
        <Skeleton className="aspect-video w-full mb-8" />
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full mb-2" />
        ))}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link href="/blog">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const category = post.categories?.[0]?.name;
  const author = post.author?.name || "Unknown Author";
  const createdDate =
    post.createdAt && !isNaN(new Date(post.createdAt).getTime())
      ? format(new Date(post.createdAt), "MMMM d, yyyy")
      : "Unknown date";

  return (
    <>
      {post && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData({
              title: post.title,
              description: post.excerpt,
              image: post.featuredImage,
              publishedTime: post.createdAt,
              modifiedTime: post.updatedAt,
              author: post.author,
            })),
          }}
        />
      )}
    <div className="max-w-4xl mx-auto px-4 py-8 mt-20">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      <article className="mb-12">
        <header className="mb-8">
          {category && <Badge className="mb-4">{category}</Badge>}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{createdDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{post.readTime || "5"} min read</span>
            </div>
          </div>

          {post.featuredImage && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-8">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-8 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {likesCount} {likesCount === 1 ? "Like" : "Likes"}
              </Button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{viewsCount} views</span>
            </div>
          </div>
        </footer>
      </article>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">
          Comments ({comments.length})
        </h2>

        <form onSubmit={handleCommentSubmit} className="mb-8">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            className="mb-4"
            rows={3}
          />
          <Button type="submit">Post Comment</Button>
        </form>

        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-muted-foreground">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => {
              const userLiked = comment.likes?.includes(user?._id);
              const isCommentAuthor = user?._id === comment.author?._id || user?._id === comment.user?._id;

              const createdAtFormatted =
                comment.createdAt &&
                !isNaN(new Date(comment.createdAt).getTime())
                  ? format(new Date(comment.createdAt), "MMM d, yyyy")
                  : "Unknown date";

              return (
                <div key={comment._id} className="border-b pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={comment.user?.avatar} />
                      <AvatarFallback>
                        {comment.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">
                          {comment.user?.name || "Anonymous"}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {createdAtFormatted}
                        </span>
                      </div>

                      {editingCommentId === comment._id ? (
                        <div>
                          <Textarea
                            rows={3}
                            value={editingCommentText}
                            onChange={(e) =>
                              setEditingCommentText(e.target.value)
                            }
                            className="mb-2"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditing}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => submitEditedComment(comment._id)}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          {comment.content}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2">
                        <Button
                          variant={userLiked ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleCommentLike(comment._id)}
                        >
                          <ThumbsUp className="mr-1 h-4 w-4" />
                          {comment.likes?.length || 0}
                        </Button>

                        {user && isCommentAuthor && editingCommentId !== comment._id && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  startEditingComment(
                                    comment._id,
                                    comment.content
                                  )
                                }
                              >
                                <Edit className="mr-1 h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                <Trash className="mr-1 h-4 w-4" />
                                Delete
                              </Button>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
    </>
  );
}

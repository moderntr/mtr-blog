'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { categoriesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ImageUpload } from "@/components/image-upload";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// ✅ Make the page dynamic to avoid static export errors
export const dynamic = "force-dynamic";

// ✅ Schema
const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  parent: z.string().optional(),
  order: z.number().default(0),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(true);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      featured: false,
      parent: "none",
      order: 0,
    },
  });

  // ✅ Auth + Load data
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/");
      } else {
        setIsAuthorized(true);
        loadParentCategories();
        loadCategory();
      }
    }
  }, [user, loading, router, id]);

  const loadParentCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      const filtered = response.data.data.filter((cat: any) => cat._id !== id);
      setParentCategories(filtered);
    } catch (error) {
      toast.error("Failed to load parent categories");
    }
  };

  const loadCategory = async () => {
    setLoadingCategory(true);
    try {
      const response = await categoriesAPI.getCategory(id as string);
      const category = response.data.data;

      form.reset({
        name: category.name,
        description: category.description,
        image: category.image,
        featured: category.featured,
        parent: category.parent?._id || "none",
        order: category.order || 0,
      });
    } catch (error) {
      toast.error("Failed to load category");
      router.push("/admin/categories");
    } finally {
      setLoadingCategory(false);
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    setSubmitting(true);
    try {
      const cleanedData = {
        ...data,
        parent: data.parent === "none" ? undefined : data.parent,
      };

      await categoriesAPI.updateCategory(id as string, cleanedData);
      toast.success("Category updated successfully!");
      router.push("/admin/categories");
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update category";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !isAuthorized || loadingCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/categories">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
              <p className="text-muted-foreground">Update the category details</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Category Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Details</CardTitle>
                  <CardDescription>Update the details for this category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="Enter description..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <ImageUpload onUpload={field.onChange} defaultImage={field.value} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div>
                          <FormLabel>Featured Category</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Mark this category as featured.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Category</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {parentCategories.map((cat) => (
                              <SelectItem key={cat._id} value={cat._id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <Button type="submit" className="w-full" disabled={submitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {submitting ? "Updating..." : "Update Category"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}

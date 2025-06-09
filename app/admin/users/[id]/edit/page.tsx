"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { usersAPI } from "@/lib/api";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default function EditUserPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user && userId) {
      fetchUser();
    }
  }, [user, loading, userId]);

  const fetchUser = async () => {
    try {
      const res = await usersAPI.getUser(userId);
      const userData = res.data.data;
      setForm({
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "user",
      });
    } catch (error) {
      toast.error("Failed to fetch user");
      router.push("/admin/users");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: { name: string; email: string; role?: string } = {
        name: form.name,
        email: form.email,
      };

      if (user?.role === "admin") {
        payload.role = form.role;
      }

      await usersAPI.updateUser(userId, payload);
      toast.success("User updated successfully");
      router.push("/admin/users");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Update failed";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Edit User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          {user?.role === "admin" && (
            <div>
              <label className="block mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="user">User</option>
                <option value="writer">Writer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Update User"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}

// app/admin/users/page.tsx
"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usersAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersAPI.getUsers();
        setUsers(response.data.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        {user?.role === 'admin' && (
          <Button asChild>
            <Link href="/admin/users/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  );
}
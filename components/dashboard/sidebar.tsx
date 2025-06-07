// components/dashboard/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, FileText, MessageSquare, 
  Users, Tags, Settings, PenSquare 
} from "lucide-react";

export default function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname();

  const adminNavItems = [
    {
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      allowedRoles: ["admin", "writer"],
    },
    {
      href: "/admin/posts",
      icon: FileText,
      label: "Posts",
      allowedRoles: ["admin", "writer"],
    },
    {
      href: "/admin/comments",
      icon: MessageSquare,
      label: "Comments",
      allowedRoles: ["admin"],
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Users",
      allowedRoles: ["admin"],
    },
    {
      href: "/admin/categories",
      icon: Tags,
      label: "Categories",
      allowedRoles: ["admin"],
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
      allowedRoles: ["admin"],
    },
  ];

  const filteredNavItems = adminNavItems.filter(item => 
    item.allowedRoles.includes(role || "user")
  );

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-background">
      <div className="flex h-16 items-center px-4 border-b">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Logged in as: <span className="font-medium">{role}</span>
        </div>
      </div>
    </div>
  );
}

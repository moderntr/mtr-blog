"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, Users, Tag, MessageSquare, Globe,
  Settings, LogOut, ChevronRight, ChevronLeft, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Posts",
      href: "/admin/posts",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "Comments",
      href: "/admin/comments",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Sitemap",
      href: "/admin/sitemap",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}
      
      {/* Mobile sidebar toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed left-4 top-[72px] z-50 md:hidden"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-16 bottom-0 left-0 z-40 border-r bg-card transition-all duration-300",
          collapsed ? "w-[70px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="mr-3 flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              {!collapsed && <ThemeToggle />}
              <Button
                variant="ghost"
                size="icon"
                className={cn("flex-shrink-0", collapsed && "mx-auto")}
                onClick={logout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={toggleSidebar}
                title={collapsed ? "Expand" : "Collapse"}
              >
                {collapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 px-4 py-8",
          collapsed ? "md:ml-[70px]" : "md:ml-64"
        )}
      >
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  );
}
// components/auth/with-permission.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";

export default function WithPermission({
  children,
  roles,
  fallback = null,
}: {
  children: ReactNode;
  roles: string[];
  fallback?: ReactNode;
}) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return fallback;
  }

  return <>{children}</>;
}
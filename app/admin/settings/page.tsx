// app/admin/settings/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import WithPermission from "@/components/auth/with-permission";
import { SettingsForm } from "./settings-form";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
      </div>

      <WithPermission roles={['admin']}>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>
      </WithPermission>

      {user?.role === 'writer' && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            You don't have permission to access these settings
          </p>
        </div>
      )}
    </div>
  );
}
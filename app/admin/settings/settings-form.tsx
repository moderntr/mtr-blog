// app/admin/settings/settings-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const settingsFormSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteUrl: z.string().url("Invalid URL"),
  maintenanceMode: z.boolean().default(false),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      siteName: "My Blog",
      siteUrl: "https://example.com",
      maintenanceMode: false,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      // TODO: Add API call to save settings
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="siteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Blog" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="siteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Settings</Button>
      </form>
    </Form>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form validation schema
const organizerFormSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    role: z.enum(["ORGANIZER", "ADMIN"]), // Add role selection
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type OrganizerFormValues = z.infer<typeof organizerFormSchema>;

export default function AddOrganizerPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form
  const form = useForm<OrganizerFormValues>({
    resolver: zodResolver(organizerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "ORGANIZER", // Default to ORGANIZER
    },
  });

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "ADMIN" && parsedUser.role !== "SUPERADMIN") {
      router.push("/login");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const onSubmit = async (data: OrganizerFormValues) => {
    try {
      setLoading(true);

      // Submit form data
      const response = await fetch("/api/organizers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          role: data.role, // Send the selected role
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }

      // Redirect to organizers page on success
      router.push("/admin/organizers");
    } catch (error) {
      console.error("Error creating user:", error);
      // Show error notification
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  // Only allow SUPERADMIN to create ADMIN accounts
  const canCreateAdmin = user.role === "SUPERADMIN";

  return (
    <DashboardLayout
      userRole={user.role as "ADMIN" | "SUPERADMIN"}
      userName={user.email.split("@")[0]}
    >
      <div className="space-y-6 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Add New Account</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>New Account</CardTitle>
                <CardDescription>
                  Create a new organizer or admin account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="user@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role selection - only shown for SUPERADMIN */}
                {canCreateAdmin && (
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ORGANIZER">Organizer</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/organizers")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}

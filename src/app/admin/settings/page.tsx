"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);

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

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout
      userRole={user.role as "ADMIN" | "SUPERADMIN"}
      userName={user.email.split("@")[0]}
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Admin Settings</h2>
        <p>Settings page content coming soon...</p>
      </div>
    </DashboardLayout>
  );
}

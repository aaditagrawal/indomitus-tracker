"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
  }, [router]);

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout
      userRole={user.role as "ADMIN" | "SUPERADMIN" | "ORGANIZER"}
      userName={user.email.split("@")[0]}
    >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        {/* Settings content will go here */}
        <p>Settings page content coming soon...</p>
      </div>
    </DashboardLayout>
  );
}

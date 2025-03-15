"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardStats } from "@/components/dashboard-stats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    // Check if user is logged in and is organizer
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "ORGANIZER") {
      router.push("/login");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout userRole="ORGANIZER" userName={user.email.split("@")[0]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Organizer Dashboard
          </h2>
          <Button onClick={() => router.push("/organizer/teams/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Team
          </Button>
        </div>

        <DashboardStats />

        {/* Teams assigned to this organizer could go here */}
      </div>
    </DashboardLayout>
  );
}

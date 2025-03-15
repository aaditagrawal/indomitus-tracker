"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Plus, Trash } from "lucide-react";

interface Organizer {
  id: number;
  email: string;
  role: string;
  teamsCount: number;
}

export default function OrganizersPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Fetch organizers
    fetchOrganizers();
  }, [router]);

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/organizers");
      if (!response.ok) throw new Error("Failed to fetch organizers");
      const data = await response.json();
      setOrganizers(data);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrganizer = async (organizerId: number) => {
    if (!confirm("Are you sure you want to delete this organizer?")) return;

    try {
      const response = await fetch(`/api/organizers/${organizerId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete organizer");

      // Refresh organizers list
      fetchOrganizers();
    } catch (error) {
      console.error("Error deleting organizer:", error);
    }
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout
      userRole={user.role as "ADMIN" | "SUPERADMIN"}
      userName={user.email.split("@")[0]}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Organizers</h2>
          <Button onClick={() => router.push("/admin/organizers/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Organizer
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Teams Assigned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Loading organizers...
                  </TableCell>
                </TableRow>
              ) : organizers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No organizers found. Add your first organizer.
                  </TableCell>
                </TableRow>
              ) : (
                organizers.map((organizer) => (
                  <TableRow key={organizer.id}>
                    <TableCell>{organizer.email}</TableCell>
                    <TableCell>
                      {/* Display different badges based on role */}
                      {organizer.role === "SUPERADMIN" ? (
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          SUPERADMIN
                        </span>
                      ) : organizer.role === "ADMIN" ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          ORGANIZER
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{organizer.teamsCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOrganizer(organizer.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}

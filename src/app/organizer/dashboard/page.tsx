"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardStats } from "@/components/dashboard-stats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { Eye } from "lucide-react";

interface Team {
  team_id: number;
  team_name: string;
  room_name: string;
  participant_count: number;
}

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    userId: number;
    email: string;
    role: string;
  } | null>(null);
  const [assignedTeams, setAssignedTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

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

    // Fetch assigned teams
    const fetchAssignedTeams = async () => {
      if (!parsedUser || !parsedUser.id) return; // Ensure parsedUser and parsedUser.id are available
      setLoadingTeams(true);
      try {
        const response = await fetch(`/api/teams?organizerId=${parsedUser.id}`); // Use organizerId filter
        if (!response.ok) {
          throw new Error("Failed to fetch assigned teams");
        }
        const data = await response.json();
        setAssignedTeams(data);
      } catch (error) {
        console.error("Error fetching assigned teams:", error);
        // Handle error as needed
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchAssignedTeams();
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
        <div>
          <Card>
            <CardHeader>
              <CardTitle>ASSIGNED TEAMS</CardTitle>
              <CardDescription>
                Teams you are assigned to manage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingTeams ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          Loading teams...
                        </TableCell>
                      </TableRow>
                    ) : assignedTeams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6">
                          No teams assigned to you yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignedTeams.map((team) => (
                        <TableRow key={team.team_id}>
                          <TableCell className="font-medium">
                            {team.team_name}
                          </TableCell>
                          <TableCell>{team.room_name}</TableCell>
                          <TableCell>{team.participant_count}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/organizer/teams/${team.team_id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

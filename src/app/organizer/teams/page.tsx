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
import { Plus, Eye, Trash } from "lucide-react";

interface Team {
  team_id: number;
  team_name: string;
  room_id: number;
  room_name: string;
  team_leader_id: number | null;
  participant_count: number;
}

export default function OrganizerTeamsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Fetch teams
    fetchTeams();
  }, [router]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/teams");
      if (!response.ok) throw new Error("Failed to fetch teams");
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete team");

      // Refresh teams list
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout userRole="ORGANIZER" userName={user.email.split("@")[0]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Teams</h2>
          <Button onClick={() => router.push("/organizer/teams/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Team
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team ID</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Team Leader</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Loading teams...
                  </TableCell>
                </TableRow>
              ) : teams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No teams found. Add your first team.
                  </TableCell>
                </TableRow>
              ) : (
                teams.map((team) => (
                  <TableRow key={team.team_id}>
                    <TableCell>{team.team_id}</TableCell>
                    <TableCell className="font-medium">
                      {team.team_name}
                    </TableCell>
                    <TableCell>{team.room_name}</TableCell>
                    <TableCell>{team.participant_count}</TableCell>
                    <TableCell>
                      {team.team_leader_id ? "Assigned" : "Not assigned"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/organizer/teams/${team.team_id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTeam(team.team_id)}
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

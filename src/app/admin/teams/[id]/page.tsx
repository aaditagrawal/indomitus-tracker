"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

interface Participant {
  participant_id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  college: string | null;
  is_leader: boolean;
}

interface TeamDetails {
  team_id: number;
  team_name: string;
  room_id: number;
  room_name: string;
  team_leader_id: number | null;
  participants: Participant[];
}

export default function AdminTeamDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;

  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Define the fetchTeamDetails function wrapped in useCallback
  const fetchTeamDetails = useCallback(async () => {
    if (!teamId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) throw new Error("Failed to fetch team details");
      const data = await response.json();
      setTeam(data);
    } catch (error) {
      console.error("Error fetching team details:", error);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  // Remove the ESLint disable comment and include all dependencies.
  useEffect(() => {
    if (!teamId) return;

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

    // Fetch team details
    fetchTeamDetails();
  }, [router, teamId, fetchTeamDetails]);

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout
      userRole={user.role as "ADMIN" | "SUPERADMIN"}
      userName={user.email.split("@")[0]}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/teams")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {loading ? "Loading Team..." : `Team: ${team?.team_name}`}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading team details...</div>
        ) : team ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
                <CardDescription>Basic details about the team</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Team ID
                    </dt>
                    <dd className="text-lg">{team.team_id}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Team Name
                    </dt>
                    <dd className="text-lg">{team.team_name}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Room
                    </dt>
                    <dd className="text-lg">{team.room_name}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">
                      College
                    </dt>
                    <dd className="text-lg">
                      {team.participants.length > 0
                        ? team.participants[0].college
                        : "N/A"}
                    </dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Participants
                    </dt>
                    <dd className="text-lg">{team.participants.length}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
                <CardDescription>Team members information</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.participants.map((participant) => (
                      <TableRow key={participant.participant_id}>
                        <TableCell className="font-medium">
                          {participant.name}
                        </TableCell>
                        <TableCell>
                          {participant.is_leader ? (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                              Team Leader
                            </span>
                          ) : (
                            "Member"
                          )}
                        </TableCell>
                        <TableCell>
                          {participant.email || participant.phone_number || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">Team not found.</div>
        )}
      </div>
    </DashboardLayout>
  );
}

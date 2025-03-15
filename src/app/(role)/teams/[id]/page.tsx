"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Edit, ArrowLeft } from "lucide-react";

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

export default function TeamDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Fetch team details
    fetchTeamDetails();
  }, [router, params.id]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teams/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch team details");
      const data = await response.json();
      setTeam(data);
    } catch (error) {
      console.error("Error fetching team details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";
  const basePath = isAdmin ? "/admin" : "/organizer";

  return (
    <DashboardLayout
      userRole={user.role as "ADMIN" | "SUPERADMIN" | "ORGANIZER"}
      userName={user.email.split("@")[0]}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`${basePath}/teams`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {loading ? "Loading Team..." : `Team: ${team?.team_name}`}
          </h2>
          {!loading && team && (
            <Button
              variant="outline"
              onClick={() => router.push(`${basePath}/teams/${params.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Team
            </Button>
          )}
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

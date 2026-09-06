"use client";

import { styles } from "@/styles/site.stylex";
import { styleClass } from "@/styles/classes";

import { useEffect, useState } from "react";
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

const fetchTeamDetails = async (teamId: string) => {
  try {
    const response = await fetch(`/api/teams/${teamId}`);
    if (!response.ok) throw new Error("Failed to fetch team details");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching team details:", error);
    return null;
  }
};

export default function OrganizerTeamDetailsPage() {
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

    // Fetch team details
    const getTeamDetails = async () => {
      setLoading(true);
      const data = await fetchTeamDetails(teamId);
      if (data) setTeam(data);
      setLoading(false);
    };

    getTeamDetails();
  }, [router, teamId]);

  if (!user) {
    return (
      <div className={styleClass("appAdminDashboardPageStyle1")}>
        Loading...
      </div>
    );
  }

  return (
    <DashboardLayout userRole="ORGANIZER" userName={user.email.split("@")[0]}>
      <div className={styleClass("appAdminDashboardPageStyle2")}>
        <div className={styleClass("appAdminTeamsIdPageStyle3")}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/organizer/teams")}
          >
            <ArrowLeft className={styleClass("appAdminDashboardPageStyle17")} />
          </Button>
          <h2 className={styleClass("appAdminDashboardPageStyle4")}>
            {loading ? "Loading Team..." : `Team: ${team?.team_name}`}
          </h2>
        </div>

        {loading ? (
          <div className={styleClass("appAdminParticipantsPageStyle9")}>
            Loading team details...
          </div>
        ) : team ? (
          <div className={styleClass("appAdminTeamsIdPageStyle7")}>
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
                <CardDescription>Basic details about the team</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className={styleClass("appAdminOrganizersAddPageStyle6")}>
                  <div className={styleClass("appAdminTeamsIdPageStyle9")}>
                    <dt className={styleClass("appAdminTeamsIdPageStyle10")}>
                      Team ID
                    </dt>
                    <dd className={styleClass("appAdminTeamsIdPageStyle11")}>
                      {team.team_id}
                    </dd>
                  </div>
                  <div className={styleClass("appAdminTeamsIdPageStyle9")}>
                    <dt className={styleClass("appAdminTeamsIdPageStyle10")}>
                      Team Name
                    </dt>
                    <dd className={styleClass("appAdminTeamsIdPageStyle11")}>
                      {team.team_name}
                    </dd>
                  </div>
                  <div className={styleClass("appAdminTeamsIdPageStyle9")}>
                    <dt className={styleClass("appAdminTeamsIdPageStyle10")}>
                      Room
                    </dt>
                    <dd className={styleClass("appAdminTeamsIdPageStyle11")}>
                      {team.room_name}
                    </dd>
                  </div>
                  <div className={styleClass("appAdminTeamsIdPageStyle9")}>
                    <dt className={styleClass("appAdminTeamsIdPageStyle10")}>
                      Participants
                    </dt>
                    <dd className={styleClass("appAdminTeamsIdPageStyle11")}>
                      {team.participants.length}
                    </dd>
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
                        <TableCell
                          xstyle={styles.appAdminDashboardPageStyle12}
                          className="sx-appAdminDashboardPageStyle12"
                        >
                          {participant.name}
                        </TableCell>
                        <TableCell>
                          {participant.is_leader ? (
                            <span
                              className={styleClass(
                                "appAdminParticipantsPageStyle1",
                              )}
                            >
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
          <div className={styleClass("appAdminParticipantsPageStyle9")}>
            Team not found.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

"use client";

import { styles } from "@/styles/site.stylex";
import { styleClass } from "@/styles/classes";

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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  assignedOrganizers: Organizer[];
}

interface Organizer {
  id: number;
  email: string;
  role?: string;
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
  const [allOrganizers, setAllOrganizers] = useState<Organizer[]>([]);
  const [assignedOrganizers, setAssignedOrganizers] = useState<Organizer[]>([]);
  const [availableOrganizers, setAvailableOrganizers] = useState<Organizer[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch team details from the API
  const fetchTeamDetails = useCallback(async () => {
    if (!teamId) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) throw new Error("Failed to fetch team details");
      const data: TeamDetails = await response.json();
      setTeam(data);
      setAssignedOrganizers(data.assignedOrganizers || []);
    } catch (error) {
      console.error("Error fetching team details:", error);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  // Fetch all organizers and filter for ORGANIZER role
  const fetchAllOrganizers = useCallback(async () => {
    try {
      const response = await fetch("/api/organizers");
      if (!response.ok) throw new Error("Failed to fetch organizers");
      const data: Organizer[] = await response.json();
      const organizerList = data.filter(
        (org: Organizer) => org.role === "ORGANIZER",
      );
      setAllOrganizers(organizerList);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    }
  }, []);

  // Automatically update available organizers when assignedOrganizers or allOrganizers changes.
  useEffect(() => {
    if (allOrganizers.length) {
      const assignedIds = assignedOrganizers.map((org) => org.id);
      const available = allOrganizers.filter(
        (organizer) => !assignedIds.includes(organizer.id),
      );
      setAvailableOrganizers(available);
    }
  }, [assignedOrganizers, allOrganizers]);

  useEffect(() => {
    if (!teamId) return;
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
    Promise.all([fetchAllOrganizers(), fetchTeamDetails()]);
  }, [router, teamId, fetchTeamDetails, fetchAllOrganizers]);

  const assignOrganizer = (organizer: Organizer) => {
    setAssignedOrganizers((prev) => [...prev, organizer]);
  };

  const unassignOrganizer = (organizer: Organizer) => {
    setAssignedOrganizers((prev) =>
      prev.filter((org) => org.id !== organizer.id),
    );
  };

  const updateTeamOrganizers = async () => {
    if (!teamId) return;
    try {
      setLoading(true);
      const organizerIdsToAssign = assignedOrganizers.map((org) => org.id);
      const response = await fetch(`/api/teams/${teamId}/organizers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizerIds: organizerIdsToAssign }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update team organizers");
      }
      // Refetch team details to ensure consistency
      fetchTeamDetails();
    } catch (error) {
      console.error("Error updating team organizers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAvailableOrganizers = availableOrganizers.filter((organizer) =>
    organizer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!user) {
    return (
      <div className={styleClass("appAdminDashboardPageStyle1")}>
        Loading...
      </div>
    );
  }

  return (
    <DashboardLayout
      userRole={user.role as "ADMIN" | "SUPERADMIN"}
      userName={user.email.split("@")[0]}
    >
      <div className={styleClass("appAdminDashboardPageStyle2")}>
        <div className={styleClass("appAdminTeamsIdPageStyle3")}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/teams")}
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
                      College
                    </dt>
                    <dd className={styleClass("appAdminTeamsIdPageStyle11")}>
                      {team.participants.length > 0
                        ? team.participants[0].college
                        : "N/A"}
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
                <CardTitle>Manage Organizers</CardTitle>
                <CardDescription>
                  Assign organizers to manage this team.
                </CardDescription>
              </CardHeader>
              <CardContent
                xstyle={styles.appAdminOrganizersAddPageStyle6}
                className="sx-appAdminOrganizersAddPageStyle6"
              >
                <div className={styleClass("appAdminTeamsIdPageStyle25")}>
                  <Label htmlFor="organizer-search">Search Organizers</Label>
                  <Input
                    type="text"
                    id="organizer-search"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className={styleClass("appAdminTeamsIdPageStyle26")}>
                  {/* Available Organizers List */}
                  <div className={styleClass("appAdminTeamsIdPageStyle25")}>
                    <CardTitle>Available Organizers</CardTitle>
                    <CardDescription>
                      Organizers you can assign to the team.
                    </CardDescription>
                    <ScrollArea
                      xstyle={styles.appAdminTeamsIdPageStyle28}
                      className="sx-appAdminTeamsIdPageStyle28"
                    >
                      <div className={styleClass("appAdminTeamsIdPageStyle29")}>
                        {filteredAvailableOrganizers.length > 0 ? (
                          filteredAvailableOrganizers.map((organizer) => (
                            <Button
                              key={organizer.id}
                              variant="ghost"
                              xstyle={styles.appAdminTeamsIdPageStyle30}
                              className="sx-appAdminTeamsIdPageStyle30"
                              onClick={() => assignOrganizer(organizer)}
                            >
                              {organizer.email}
                            </Button>
                          ))
                        ) : (
                          <div
                            className={styleClass("appAdminTeamsIdPageStyle31")}
                          >
                            No organizers available.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Assigned Organizers List */}
                  <div className={styleClass("appAdminTeamsIdPageStyle25")}>
                    <CardTitle>Assigned Organizers</CardTitle>
                    <CardDescription>
                      Organizers currently assigned to this team.
                    </CardDescription>
                    <ScrollArea
                      xstyle={styles.appAdminTeamsIdPageStyle28}
                      className="sx-appAdminTeamsIdPageStyle28"
                    >
                      <div className={styleClass("appAdminTeamsIdPageStyle29")}>
                        {assignedOrganizers.length > 0 ? (
                          assignedOrganizers.map((organizer) => (
                            <Button
                              key={organizer.id}
                              variant="ghost"
                              xstyle={styles.appAdminTeamsIdPageStyle30}
                              className="sx-appAdminTeamsIdPageStyle30"
                              onClick={() => unassignOrganizer(organizer)}
                            >
                              {organizer.email}
                            </Button>
                          ))
                        ) : (
                          <div
                            className={styleClass("appAdminTeamsIdPageStyle31")}
                          >
                            No organizers assigned.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                <Button onClick={updateTeamOrganizers} disabled={loading}>
                  {loading ? "Updating..." : "Update Organizers"}
                </Button>
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

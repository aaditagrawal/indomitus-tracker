"use client";

import { styles } from "@/styles/site.stylex";
import { styleClass } from "@/styles/classes";

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

interface TeamWithOrganizers {
  team_id: number;
  team_name: string;
  room_name: string;
  assignedOrganizers: { id: number; email: string }[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);
  const [teamsWithOrganizers, setTeamsWithOrganizers] = useState<
    TeamWithOrganizers[]
  >([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

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

    // Fetch teams with assigned organizers for the mapping section
    const fetchTeamsWithOrganizers = async () => {
      setLoadingTeams(true);
      try {
        const response = await fetch("/api/teams"); // Fetch all teams
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const teamsData = await response.json();

        // For each team, fetch assigned organizers
        const teamsWithOrgData = await Promise.all(
          teamsData.map(async (team: { team_id: number }) => {
            const organizersResponse = await fetch(
              `/api/teams/${team.team_id}`,
            ); // Fetch team details to get organizers
            if (!organizersResponse.ok) {
              console.error(
                `Failed to fetch organizers for team ${team.team_id}`,
              );
              return { ...team, assignedOrganizers: [] }; // Return empty organizers in case of error
            }
            const teamDetails = await organizersResponse.json();
            return {
              team_id: team.team_id,
              team_name: teamDetails.team_name,
              room_name: teamDetails.room_name,
              assignedOrganizers: teamDetails.assignedOrganizers || [],
            };
          }),
        );
        setTeamsWithOrganizers(teamsWithOrgData);
      } catch (error) {
        console.error("Error fetching teams with organizers:", error);
        // Handle error (e.g., display error message)
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeamsWithOrganizers();
  }, [router]);

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
        <div className={styleClass("appAdminDashboardPageStyle3")}>
          <h2 className={styleClass("appAdminDashboardPageStyle4")}>
            Admin Dashboard
          </h2>
          <div className={styleClass("appAdminDashboardPageStyle5")}>
            <Button onClick={() => router.push("/admin/teams/add")}>
              <Plus className={styleClass("appAdminDashboardPageStyle6")} />
              Add Team
            </Button>
            <Button onClick={() => router.push("/admin/organizers/add")}>
              <Plus className={styleClass("appAdminDashboardPageStyle6")} />
              Add Organizer
            </Button>
          </div>
        </div>
        <DashboardStats />
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Team Organizer Mapping</CardTitle>
              <CardDescription>
                View teams and their assigned organizers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styleClass("appAdminDashboardPageStyle8")}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Assigned Organizers</TableHead>
                      <TableHead
                        xstyle={styles.appAdminDashboardPageStyle9}
                        className="sx-appAdminDashboardPageStyle9 ui-text-defined"
                      >
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingTeams ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          xstyle={styles.appAdminDashboardPageStyle10}
                          className="sx-appAdminDashboardPageStyle10 ui-text-defined"
                        >
                          Loading team organizer mapping...
                        </TableCell>
                      </TableRow>
                    ) : teamsWithOrganizers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          xstyle={styles.appAdminDashboardPageStyle10}
                          className="sx-appAdminDashboardPageStyle10 ui-text-defined"
                        >
                          No teams available. Add your first team.
                        </TableCell>
                      </TableRow>
                    ) : (
                      teamsWithOrganizers.map((team) => (
                        <TableRow key={team.team_id}>
                          <TableCell
                            xstyle={styles.appAdminDashboardPageStyle12}
                            className="sx-appAdminDashboardPageStyle12"
                          >
                            {team.team_name}
                          </TableCell>
                          <TableCell>{team.room_name}</TableCell>
                          <TableCell>
                            {team.assignedOrganizers.length > 0 ? (
                              <ul
                                className={styleClass(
                                  "appAdminDashboardPageStyle13",
                                )}
                              >
                                {team.assignedOrganizers.map((org) => (
                                  <li key={org.id}>{org.email}</li>
                                ))}
                              </ul>
                            ) : (
                              <span
                                className={styleClass(
                                  "appAdminDashboardPageStyle14",
                                )}
                              >
                                No organizers assigned
                              </span>
                            )}
                          </TableCell>
                          <TableCell
                            xstyle={styles.appAdminDashboardPageStyle9}
                            className="sx-appAdminDashboardPageStyle9 ui-text-defined"
                          >
                            <div
                              className={styleClass(
                                "appAdminDashboardPageStyle16",
                              )}
                            >
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/admin/teams/${team.team_id}`}>
                                  <Eye
                                    className={styleClass(
                                      "appAdminDashboardPageStyle17",
                                    )}
                                  />
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
        {/* Recent activity could go here - if needed */}
      </div>
    </DashboardLayout>
  );
}

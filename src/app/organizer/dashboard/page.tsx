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

interface Team {
  team_id: number;
  team_name: string;
  room_name: string;
  participant_count: number;
}

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);
  const [assignedTeams, setAssignedTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  // **Authentication/Authorization Check - Separate useEffect**
  useEffect(() => {
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
  }, [router]); // Dependency array is now [router] - for auth check

  // **Data Fetching - Separate useEffect with empty dependency array**
  useEffect(() => {
    // Fetch assigned teams
    const fetchAssignedTeams = async () => {
      if (!user || !user.id) return; // Ensure user is available (set by auth useEffect)
      setLoadingTeams(true);
      try {
        const response = await fetch(`/api/teams?organizerId=${user.id}`); // Use organizerId filter
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
  }, [user]); // Dependency array is now [] - for data fetching

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
        <div className={styleClass("appAdminDashboardPageStyle3")}>
          <h2 className={styleClass("appAdminDashboardPageStyle4")}>
            Organizer Dashboard
          </h2>
          <Button onClick={() => router.push("/organizer/teams/add")}>
            <Plus className={styleClass("appAdminDashboardPageStyle6")} />
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
              <div className={styleClass("appAdminDashboardPageStyle8")}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Participants</TableHead>
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
                          Loading teams...
                        </TableCell>
                      </TableRow>
                    ) : assignedTeams.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          xstyle={styles.appAdminDashboardPageStyle10}
                          className="sx-appAdminDashboardPageStyle10 ui-text-defined"
                        >
                          No teams assigned to you yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignedTeams.map((team) => (
                        <TableRow key={team.team_id}>
                          <TableCell
                            xstyle={styles.appAdminDashboardPageStyle12}
                            className="sx-appAdminDashboardPageStyle12"
                          >
                            {team.team_name}
                          </TableCell>
                          <TableCell>{team.room_name}</TableCell>
                          <TableCell>{team.participant_count}</TableCell>
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
                                <Link href={`/organizer/teams/${team.team_id}`}>
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
      </div>
    </DashboardLayout>
  );
}

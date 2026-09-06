"use client";

import { styles } from "@/styles/site.stylex";
import { styleClass } from "@/styles/classes";

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
            Organizers
          </h2>
          <Button onClick={() => router.push("/admin/organizers/add")}>
            <Plus className={styleClass("appAdminDashboardPageStyle6")} />
            Add Organizer
          </Button>
        </div>

        <div className={styleClass("appAdminDashboardPageStyle8")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Teams Assigned</TableHead>
                <TableHead
                  xstyle={styles.appAdminDashboardPageStyle9}
                  className="sx-appAdminDashboardPageStyle9 ui-text-defined"
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    xstyle={styles.appAdminDashboardPageStyle10}
                    className="sx-appAdminDashboardPageStyle10 ui-text-defined"
                  >
                    Loading organizers...
                  </TableCell>
                </TableRow>
              ) : organizers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    xstyle={styles.appAdminDashboardPageStyle10}
                    className="sx-appAdminDashboardPageStyle10 ui-text-defined"
                  >
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
                        <span
                          className={styleClass(
                            "appAdminOrganizersPageStyle10",
                          )}
                        >
                          SUPERADMIN
                        </span>
                      ) : organizer.role === "ADMIN" ? (
                        <span
                          className={styleClass(
                            "appAdminOrganizersPageStyle11",
                          )}
                        >
                          ADMIN
                        </span>
                      ) : (
                        <span
                          className={styleClass(
                            "appAdminOrganizersPageStyle12",
                          )}
                        >
                          ORGANIZER
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{organizer.teamsCount}</TableCell>
                    <TableCell
                      xstyle={styles.appAdminDashboardPageStyle9}
                      className="sx-appAdminDashboardPageStyle9 ui-text-defined"
                    >
                      <div
                        className={styleClass("appAdminDashboardPageStyle16")}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOrganizer(organizer.id)}
                        >
                          <Trash
                            className={styleClass(
                              "appAdminDashboardPageStyle17",
                            )}
                          />
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

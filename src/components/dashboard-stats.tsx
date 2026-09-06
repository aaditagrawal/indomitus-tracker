"use client";

import { styles } from "@/styles/site.stylex";
import { styleClass } from "@/styles/classes";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck } from "lucide-react";

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalParticipants: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();

        setStats({
          totalTeams: data.totalTeams,
          totalParticipants: data.totalParticipants,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styleClass("componentsDashboardStatsStyle1")}>
      <Card>
        <CardHeader
          xstyle={styles.componentsDashboardStatsStyle2}
          className="sx-componentsDashboardStatsStyle2"
        >
          <CardTitle
            xstyle={styles.componentsDashboardStatsStyle3}
            className="sx-componentsDashboardStatsStyle3 ui-text-defined"
          >
            Total Teams
          </CardTitle>
          <Users className={styleClass("componentsDashboardStatsStyle4")} />
        </CardHeader>
        <CardContent>
          <div className={styleClass("componentsDashboardStatsStyle5")}>
            {stats.loading ? "Loading..." : stats.totalTeams}
          </div>
          <p className={styleClass("componentsDashboardStatsStyle6")}>
            Registered teams in the system
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          xstyle={styles.componentsDashboardStatsStyle2}
          className="sx-componentsDashboardStatsStyle2"
        >
          <CardTitle
            xstyle={styles.componentsDashboardStatsStyle3}
            className="sx-componentsDashboardStatsStyle3 ui-text-defined"
          >
            Total Participants
          </CardTitle>
          <UserCheck className={styleClass("componentsDashboardStatsStyle4")} />
        </CardHeader>
        <CardContent>
          <div className={styleClass("componentsDashboardStatsStyle5")}>
            {stats.loading ? "Loading..." : stats.totalParticipants}
          </div>
          <p className={styleClass("componentsDashboardStatsStyle6")}>
            Registered participants across all teams
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

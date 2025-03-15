"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

// Define the participant data type
interface Participant {
  participant_id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  college: string | null;
  gender: string | null;
  discord_id: string | null;
  is_leader: boolean;
  team_id: number;
  team_name: string;
  room_id: number;
  room_name: string;
}

export default function OrganizerParticipantsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Define table columns (same as admin)
  const columns: ColumnDef<Participant>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "is_leader",
      header: "Role",
      cell: ({ row }) => (
        <div>
          {row.original.is_leader ? (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              Team Leader
            </span>
          ) : (
            "Member"
          )}
        </div>
      ),
    },
    {
      accessorKey: "team_name",
      header: "Team",
    },
    {
      accessorKey: "room_name",
      header: "Room",
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => row.original.gender || "-",
    },
    {
      accessorKey: "discord_id",
      header: "Discord ID",
      cell: ({ row }) => row.original.discord_id || "-",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email || "-",
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
      cell: ({ row }) => row.original.phone_number || "-",
    },
    {
      accessorKey: "college",
      header: "College",
      cell: ({ row }) => row.original.college || "-",
    },
  ];

  // Use useCallback to memoize the function
  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `/api/participants?query=${encodeURIComponent(searchQuery)}`
        : "/api/participants";

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch participants");
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]); // Add searchQuery as a dependency

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

    // Fetch participants
    fetchParticipants();
  }, [router, fetchParticipants]); // Now fetchParticipants is in the dependency array

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout userRole="ORGANIZER" userName={user.email.split("@")[0]}>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Participants</h2>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, phone, team name, discord ID, etc..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading participants...</div>
        ) : (
          <DataTable columns={columns} data={participants} />
        )}
      </div>
    </DashboardLayout>
  );
}

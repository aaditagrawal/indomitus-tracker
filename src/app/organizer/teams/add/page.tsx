"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface Room {
  room_id: number;
  room_name: string;
}

// Form validation schema
const teamFormSchema = z.object({
  teamName: z.string().min(3, "Team name must be at least 3 characters"),
  roomId: z.string().min(1, "Please select a room"),
  college: z.string().min(1, "College name is required"),
  teamLeaderIndex: z.number().min(0).max(2),
  members: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().min(10, "Valid phone number is required"),
      }),
    )
    .length(3, "A team must have exactly 3 members"),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

export default function OrganizerAddTeamPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    email: string;
    role: string;
  } | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize form
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      teamName: "",
      roomId: "",
      college: "",
      teamLeaderIndex: 0,
      members: [
        { name: "", email: "", phone: "" },
        { name: "", email: "", phone: "" },
        { name: "", email: "", phone: "" },
      ],
    },
  });

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

    // Fetch rooms
    fetchRooms();
  }, [router]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/rooms");
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TeamFormValues) => {
    try {
      setLoading(true);

      // Transform data for API
      const apiData = {
        teamName: data.teamName,
        roomId: data.roomId,
        participants: data.members.map((member, index) => ({
          name: member.name,
          email: member.email,
          phone: member.phone,
          college: data.college,
          isLeader: index === data.teamLeaderIndex,
        })),
      };

      // Submit form data
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create team");
      }

      // Redirect to teams page on success
      router.push("/organizer/teams");
    } catch (error) {
      console.error("Error creating team:", error);
      // Show error notification
    } finally {
      setLoading(false);
    }
  };

  const setTeamLeader = (index: number) => {
    form.setValue("teamLeaderIndex", index);
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <DashboardLayout userRole="ORGANIZER" userName={user.email.split("@")[0]}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Add New Team</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
                <CardDescription>
                  Enter the basic information about the team.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter team name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rooms.map((room) => (
                            <SelectItem
                              key={room.room_id}
                              value={room.room_id.toString()}
                            >
                              {room.room_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter college name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Add the three team members and designate a team leader.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="mb-8 p-4 border rounded-lg relative"
                  >
                    <div className="grid gap-4 mb-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Member {index + 1}</h3>
                        <Button
                          type="button"
                          variant={
                            form.getValues().teamLeaderIndex === index
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setTeamLeader(index)}
                        >
                          {form.getValues().teamLeaderIndex === index
                            ? "✓ Team Leader"
                            : "Set as Team Leader"}
                        </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name={`members.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`members.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Enter email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`members.${index}.phone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter phone number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/organizer/teams")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Team"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}

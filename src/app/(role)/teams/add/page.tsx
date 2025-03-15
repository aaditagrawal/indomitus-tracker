"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { X, Plus } from "lucide-react";
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
  participants: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional().or(z.literal("")),
        college: z.string().optional().or(z.literal("")),
        isLeader: z.boolean().optional(),
      }),
    )
    .min(1, "At least one participant is required"),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

export default function AddTeamPage() {
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
      participants: [
        { name: "", email: "", phone: "", college: "", isLeader: false },
      ],
    },
  });

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
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

      // Check if a team leader is selected
      const hasLeader = data.participants.some((p) => p.isLeader);
      if (!hasLeader) {
        // Set the first participant as leader if none selected
        data.participants[0].isLeader = true;
      }

      // Submit form data
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create team");
      }

      // Redirect to teams page on success
      const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
      router.push(isAdmin ? "/admin/teams" : "/organizer/teams");
    } catch (error) {
      console.error("Error creating team:", error);
      // Show error notification
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = () => {
    const currentParticipants = form.getValues().participants;
    form.setValue("participants", [
      ...currentParticipants,
      { name: "", email: "", phone: "", college: "", isLeader: false },
    ]);
  };

  const removeParticipant = (index: number) => {
    const currentParticipants = form.getValues().participants;
    if (currentParticipants.length <= 1) return; // Keep at least one participant

    form.setValue(
      "participants",
      currentParticipants.filter((_, i) => i !== index),
    );
  };

  const setTeamLeader = (index: number) => {
    const currentParticipants = form.getValues().participants;
    const updatedParticipants = currentParticipants.map((p, i) => ({
      ...p,
      isLeader: i === index,
    }));

    form.setValue("participants", updatedParticipants);
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";

  return (
    <DashboardLayout
      userRole={user.role as "ADMIN" | "SUPERADMIN" | "ORGANIZER"}
      userName={user.email.split("@")[0]}
    >
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
                <CardDescription>
                  Add team members and designate a team leader.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {form.getValues().participants.map((_, index) => (
                  <div
                    key={index}
                    className="mb-8 p-4 border rounded-lg relative"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeParticipant(index)}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <div className="grid gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name={`participants.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
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
                          name={`participants.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email (optional)</FormLabel>
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
                          name={`participants.${index}.phone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (optional)</FormLabel>
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

                      <FormField
                        control={form.control}
                        name={`participants.${index}.college`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>College (optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter college name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      variant={
                        form.getValues().participants[index].isLeader
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setTeamLeader(index)}
                    >
                      {form.getValues().participants[index].isLeader
                        ? "✓ Team Leader"
                        : "Set as Team Leader"}
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addParticipant}
                  className="w-full mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Participant
                </Button>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const isAdmin =
                      user?.role === "ADMIN" || user?.role === "SUPERADMIN";
                    router.push(isAdmin ? "/admin/teams" : "/organizer/teams");
                  }}
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

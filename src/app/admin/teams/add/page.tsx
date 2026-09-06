"use client";

import { styles } from "@/styles/site.stylex";
import { styleClass } from "@/styles/classes";

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
  teamLeaderIndex: z.number().min(0),
  members: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().min(10, "Valid phone number is required"),
        gender: z.string().optional(),
        // Allow any characters in Discord ID, including special characters
        discordId: z.string().optional(),
      }),
    )
    .min(1, "A team must have at least 1 member")
    .max(3, "A team cannot have more than 3 members"),
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
  const [memberCount, setMemberCount] = useState(3); // Default to 3 members

  // Add these functions to handle adding/removing members in both files
  const addMember = () => {
    if (memberCount < 3) {
      setMemberCount(memberCount + 1);
      const currentMembers = form.getValues().members;
      form.setValue("members", [
        ...currentMembers,
        { name: "", email: "", phone: "", gender: "", discordId: "" },
      ]);
    }
  };

  const removeMember = (indexToRemove: number) => {
    if (memberCount > 1) {
      setMemberCount(memberCount - 1);
      const currentMembers = form.getValues().members;

      // Adjust teamLeaderIndex if needed
      const currentLeaderIndex = form.getValues().teamLeaderIndex;
      if (currentLeaderIndex === indexToRemove) {
        // If we're removing the leader, set the first remaining member as leader
        form.setValue("teamLeaderIndex", 0);
      } else if (currentLeaderIndex > indexToRemove) {
        // If we're removing someone before the leader, decrement the leader index
        form.setValue("teamLeaderIndex", currentLeaderIndex - 1);
      }

      // Remove the member
      form.setValue(
        "members",
        currentMembers.filter((_, idx) => idx !== indexToRemove),
      );
    }
  };

  // Initialize form with teamLeaderIndex = 0 by default
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      teamName: "",
      roomId: "",
      college: "",
      teamLeaderIndex: 0,
      members: [
        { name: "", email: "", phone: "", gender: "", discordId: "" },
        { name: "", email: "", phone: "", gender: "", discordId: "" },
        { name: "", email: "", phone: "", gender: "", discordId: "" },
      ],
    },
  });

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
          gender: member.gender || null, // Include gender
          discordId: member.discordId || null, // Include Discord ID
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
      router.push("/admin/teams");
    } catch (error) {
      console.error("Error creating team:", error);
      // Show error notification
    } finally {
      setLoading(false);
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
      <div className={styleClass("appAdminTeamsAddPageStyle2")}>
        <div className={styleClass("appAdminDashboardPageStyle3")}>
          <h2 className={styleClass("appAdminDashboardPageStyle4")}>
            Add New Team
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={styleClass("appAdminOrganizersAddPageStyle5")}
          >
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
                <CardDescription>
                  Enter the basic information about the team.
                </CardDescription>
              </CardHeader>
              <CardContent
                xstyle={styles.appAdminOrganizersAddPageStyle6}
                className="sx-appAdminOrganizersAddPageStyle6"
              >
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
                  Add between 1-3 team members. The first member is the team
                  leader.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {form.getValues().members.map((_, index) => (
                  <div
                    key={index}
                    className={styleClass("appAdminTeamsAddPageStyle7")}
                  >
                    <div className={styleClass("appAdminTeamsAddPageStyle8")}>
                      <div
                        className={styleClass("appAdminDashboardPageStyle3")}
                      >
                        <h3
                          className={styleClass("appAdminDashboardPageStyle12")}
                        >
                          {index === 0 ? "Team Leader" : `Member ${index + 1}`}
                        </h3>
                        <div
                          className={styleClass("appAdminDashboardPageStyle5")}
                        >
                          {index === 0 && (
                            <Button type="button" variant="default" disabled>
                              ✓ Team Leader
                            </Button>
                          )}

                          {/* Only show remove button if we have more than 1 member */}
                          {form.getValues().members.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => removeMember(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
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

                      <div
                        className={styleClass("appAdminTeamsAddPageStyle12")}
                      >
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

                        {/* New Gender Field */}
                        <FormField
                          control={form.control}
                          name={`members.${index}.gender`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                  <SelectItem value="prefer_not_to_say">
                                    Prefer not to say
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* New Discord ID Field */}
                        <FormField
                          control={form.control}
                          name={`members.${index}.discordId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discord ID</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Discord ID"
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

                {/* Add button for new members if less than 3 */}
                {form.getValues().members.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addMember}
                    xstyle={styles.appAdminTeamsAddPageStyle13}
                    className="sx-appAdminTeamsAddPageStyle13"
                  >
                    Add Team Member
                  </Button>
                )}
              </CardContent>
              <CardFooter
                xstyle={styles.appAdminDashboardPageStyle16}
                className="sx-appAdminDashboardPageStyle16"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/teams")}
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

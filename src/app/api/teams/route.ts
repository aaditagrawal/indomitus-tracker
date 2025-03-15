import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { teams, rooms, participants } from "@/db/schema";
import { eq, count } from "drizzle-orm"; // Import count instead of sql

interface TeamParticipant {
  name: string;
  email: string | null;
  phone: string | null;
  college: string | null;
  gender: string | null;
  discordId: string | null;
  isLeader: boolean;
}

interface CreateTeamData {
  teamName: string;
  roomId: string;
  participants: TeamParticipant[];
}

export async function GET() {
  try {
    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    // Join with rooms to get room_name
    const teamsData = await db
      .select({
        team_id: teams.team_id,
        team_name: teams.team_name,
        room_id: teams.room_id,
        room_name: rooms.room_name,
        team_leader_id: teams.team_leader_id,
      })
      .from(teams)
      .leftJoin(rooms, eq(teams.room_id, rooms.room_id));

    // Get participant count for each team
    const teamsWithParticipantCount = await Promise.all(
      teamsData.map(async (team) => {
        const participantCount = await db
          .select({ count: count() }) // Use count() function instead of sql``
          .from(participants)
          .where(eq(participants.team_id, team.team_id));

        return {
          ...team,
          participant_count: participantCount[0].count,
        };
      }),
    );

    await client.close();

    return NextResponse.json(teamsWithParticipantCount);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Use the interface for proper typing
    const data: CreateTeamData = await request.json();
    const { teamName, roomId, participants: teamParticipants } = data;

    if (
      !teamName ||
      !roomId ||
      !teamParticipants ||
      teamParticipants.length < 1 ||
      teamParticipants.length > 3
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required data or invalid number of participants (1-3 allowed)",
        },
        { status: 400 },
      );
    }

    // Find team leader
    const leaderIndex = teamParticipants.findIndex(
      (p: TeamParticipant) => p.isLeader,
    );

    if (leaderIndex === -1) {
      return NextResponse.json(
        { error: "A team leader must be designated" },
        { status: 400 },
      );
    }

    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    // Start a transaction
    const result = await db.transaction(async (tx) => {
      // Create the team first
      const teamResult = await tx
        .insert(teams)
        .values({
          team_name: teamName,
          room_id: parseInt(roomId),
          // Set team_leader_id to null initially, will update after creating participants
          team_leader_id: null,
        })
        .returning();

      const teamId = teamResult[0].team_id;

      // Create all participants
      const participantPromises = teamParticipants.map(
        async (p: TeamParticipant) => {
          return await tx
            .insert(participants)
            .values({
              name: p.name,
              email: p.email || null,
              phone_number: p.phone || null,
              college: p.college || null,
              gender: p.gender || null, // Add gender
              discord_id: p.discordId || null, // Add discordId
              team_id: teamId,
            })
            .returning();
        },
      );

      const createdParticipants = await Promise.all(participantPromises);

      // Update team with leader ID
      const leaderId = createdParticipants[leaderIndex][0].participant_id;
      await tx
        .update(teams)
        .set({ team_leader_id: leaderId })
        .where(eq(teams.team_id, teamId));

      return {
        teamId,
        message: "Team created successfully",
      };
    });

    await client.close();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 },
    );
  }
}
